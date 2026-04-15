import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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
    setLoading(true)
    setError(null)
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
  }, [token])

  useEffect(() => { fetchAll() }, [fetchAll])

  const createProject = async (body: Partial<Project>) => {
    const res  = await fetch(`${API}/api/cms/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal membuat project')
    return json.data as Project
  }

  const updateProject = async (id: string, body: Partial<Project>) => {
    const res  = await fetch(`${API}/api/cms/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
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
