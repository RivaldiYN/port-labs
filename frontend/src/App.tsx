import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import PostDetailPage from './pages/PostDetailPage'
import CmsDashboardPage from './pages/cms/CmsDashboardPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/news/:slug" element={<PostDetailPage />} />
        <Route path="/cms" element={<CmsDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
