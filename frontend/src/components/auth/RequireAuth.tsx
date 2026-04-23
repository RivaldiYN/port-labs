import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isRefreshing } = useAuth()
  const location = useLocation()

  // Stay on page while auth state is being resolved (initial load OR token refresh)
  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#1db954] border-t-transparent animate-spin" />
          <p className="font-label text-xs uppercase tracking-widest text-[#e5e2e1]/40">
            {isRefreshing ? 'Memperbarui sesi...' : 'Memverifikasi sesi...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/cms/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
