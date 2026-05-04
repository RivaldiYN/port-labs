import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface Admin { id: string; username: string; email: string }
interface AuthState {
  admin: Admin | null
  accessToken: string | null
  isLoading: boolean
  isRefreshing: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ ok: boolean; message: string }>
  logout: () => Promise<void>
  refresh: () => Promise<string | null>
}

const AuthCtx = createContext<AuthState | null>(null)

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const LS_REFRESH = 'cms_refresh_token'
const LS_ADMIN = 'cms_admin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  //  ”€ ”€ Refresh  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  const refresh = useCallback(async (): Promise<string | null> => {
    const stored = localStorage.getItem(LS_REFRESH)
    if (!stored) return null

    setIsRefreshing(true)
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        localStorage.removeItem(LS_REFRESH)
        setAdmin(null)
        setAccessToken(null)
        return null
      }
      setAccessToken(json.data.accessToken)
      localStorage.setItem(LS_REFRESH, json.data.refreshToken)
      return json.data.accessToken
    } catch {
      return null
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  //  ”€ ”€ Restore session on mount  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  useEffect(() => {
    const stored = localStorage.getItem(LS_ADMIN)
    if (stored) {
      try { setAdmin(JSON.parse(stored)) } catch { /* ignore */ }
    }
    refresh().finally(() => setIsLoading(false))
  }, [refresh])

  //  ”€ ”€ Auto-refresh every 13 minutes  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  useEffect(() => {
    if (!accessToken) return
    const id = setInterval(() => { refresh() }, 13 * 60 * 1000)
    return () => clearInterval(id)
  }, [accessToken, refresh])

  //  ”€ ”€ Login  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        return { ok: false, message: json.message ?? 'Login gagal' }
      }
      const { accessToken: at, refreshToken: rt, admin: a } = json.data
      setAccessToken(at)
      setAdmin(a)
      localStorage.setItem(LS_REFRESH, rt)
      localStorage.setItem(LS_ADMIN, JSON.stringify(a))
      return { ok: true, message: 'Login berhasil' }
    } catch {
      return { ok: false, message: 'Tidak dapat terhubung ke server' }
    }
  }

  //  ”€ ”€ Logout  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  const logout = async () => {
    const rt = localStorage.getItem(LS_REFRESH)
    if (rt) {
      try {
        await fetch(`${API}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rt }),
        })
      } catch { /* ignore */ }
    }
    localStorage.removeItem(LS_REFRESH)
    localStorage.removeItem(LS_ADMIN)
    setAdmin(null)
    setAccessToken(null)
  }

  return (
    <AuthCtx.Provider value={{
      admin, accessToken, isLoading, isRefreshing,
      isAuthenticated: !!admin && !!accessToken,
      login, logout, refresh,
    }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
