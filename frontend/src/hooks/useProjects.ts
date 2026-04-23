import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const LS_REFRESH = 'cms_refresh_token'

/** Attempt to silently refresh access token; returns new token or null */
async function silentRefresh(): Promise<string | null> {
  const stored = localStorage.getItem(LS_REFRESH)
  if (!stored) return null
  try {
    const res  = await fetch(`${API}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: stored }) })
    const json = await res.json()
    if (!res.ok || !json.success) { localStorage.removeItem(LS_REFRESH); return null }
    localStorage.setItem(LS_REFRESH, json.data.refreshToken)
    return json.data.accessToken as string
  } catch { return null }
}

// Strip null and empty strings → undefined so they're omitted from JSON (avoids Elysia validation error)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitize(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === '') result[k] = undefined
    else result[k] = v
  }
  return result
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  thumbnailUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  techStack: string[] | null
  isFeatured: boolean
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FetchParams {
  page?: number
  limit?: number
  featured?: boolean
  tech?: string
  search?: string
  sort?: 'newest' | 'oldest'
}

export function useProjects(params: FetchParams = {}) {
  const [data, setData]     = useState<Project[]>([])
  const [meta, setMeta]     = useState<ProjectMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const q = new URLSearchParams()
      if (params.page)     q.set('page',     String(params.page))
      if (params.limit)    q.set('limit',    String(params.limit))
      if (params.featured) q.set('featured', 'true')
      if (params.tech)     q.set('tech',     params.tech)
      if (params.search)   q.set('search',   params.search)
      if (params.sort)     q.set('sort',     params.sort)

      const res = await fetch(`${API}/api/projects?${q}`)
      const json = await res.json()

      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil data')
      setData(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [params.page, params.limit, params.featured, params.tech, params.search, params.sort]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch_() }, [fetch_])

  return { data, meta, loading, error, refetch: fetch_ }
}

// ── CMS API helpers (auth required) ──────────────────────────────────────────
export function useCmsProjects(token: string | null) {
  const [data, setData]       = useState<Project[]>([])
  const [meta, setMeta]       = useState<ProjectMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchAll = useCallback(async (search = '') => {
    if (!token) return
    // Don't wipe existing data — only show loader on first fetch
    setError(null)
    setLoading(prev => prev) // keep true only on initial load; we set it below conditionally
    const isFirstLoad = !data.length
    if (isFirstLoad) setLoading(true)
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : ''
      const res  = await fetch(`${API}/api/cms/projects${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil data')
      setData(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAll() }, [fetchAll])

  const createProject = async (body: Partial<Project>) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify(sanitize(body)),
    })
    let res  = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await silentRefresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal membuat project')
    return json.data as Project
  }

  const updateProject = async (id: string, body: Partial<Project>) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify(sanitize(body)),
    })
    let res  = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await silentRefresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengupdate project')
    return json.data as Project
  }

  const deleteProject = async (id: string) => {
    const res  = await fetch(`${API}/api/cms/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menghapus project')
    return json.data
  }

  const togglePublish = async (id: string) => {
    const res  = await fetch(`${API}/api/cms/projects/${id}/publish`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal toggle publish')
    return json.data as Project
  }

  return { data, meta, loading, error, fetchAll, createProject, updateProject, deleteProject, togglePublish }
}
