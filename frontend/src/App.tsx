import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/auth/RequireAuth'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import PostDetailPage from './pages/PostDetailPage'
import CmsLoginPage from './pages/cms/CmsLoginPage'
import CmsDashboardPage from './pages/cms/CmsDashboardPage'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/news/:slug" element={<PostDetailPage />} />

          {/* CMS — Public (unauthenticated only) */}
          <Route path="/cms/login" element={<CmsLoginPage />} />

          {/* CMS — Protected */}
          <Route
            path="/cms"
            element={
              <RequireAuth>
                <CmsDashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/cms/*"
            element={
              <RequireAuth>
                <CmsDashboardPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
