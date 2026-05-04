import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitize(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    result[k] = v === '' ? null : v
  }
  return result
}

export interface Post {
  id:          string
  title:       string
  slug:        string
  excerpt:     string | null
  content:     string | null
  coverUrl:    string | null
  tags:        string[] | null
  isPublished: boolean
  publishedAt: string | null
  createdAt:   string
  updatedAt:   string
}

export interface PostMeta {
  page:       number
  limit:      number
  total:      number
  totalPages: number
}

// â”€â”€ Public hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function usePosts(params: {
  page?: number; limit?: number; search?: string; tag?: string; tags?: string; sort?: string
} = {}) {
  const [data, setData]       = useState<Post[]>([])
  const [meta, setMeta]       = useState<PostMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const q = new URLSearchParams()
      if (params.page)   q.set('page',   String(params.page))
      if (params.limit)  q.set('limit',  String(params.limit))
      if (params.search) q.set('search', params.search)
      if (params.tag)    q.set('tag',    params.tag)
      if (params.tags)   q.set('tags',   params.tags)
      if (params.sort)   q.set('sort',   params.sort)
      const res  = await fetch(`${API}/api/posts?${q}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil posts')
      setData(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch (e) { setError((e as Error).message) }
    finally     { setLoading(false) }
  }, [params.page, params.limit, params.search, params.tag, params.tags, params.sort]) // eslint-disable-line

  useEffect(() => { fetch_() }, [fetch_])
  return { data, meta, loading, error, refetch: fetch_ }
}

export function useTags() {
  const [tags, setTags]       = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${API}/api/posts/tags`)
      .then(r => r.json())
      .then(j => setTags(j.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  return { tags, loading }
}

// â”€â”€ CMS hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useCmsPosts() {
  const { accessToken: token, refresh } = useAuth()
  const [data, setData]       = useState<Post[]>([])
  const [meta, setMeta]       = useState<PostMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const isFirstLoad           = useRef(true)

  const fetchAll = useCallback(async (search = '') => {
    if (!token) return
    setError(null)
    if (isFirstLoad.current) setLoading(true)
    
    const doFetch = async (tok: string) => {
      const q   = search ? `?search=${encodeURIComponent(search)}` : ''
      return fetch(`${API}/api/cms/posts${q}`, {
        headers: { Authorization: `Bearer ${tok}` },
      })
    }

    try {
      let res = await doFetch(token)
      if (res.status === 401) {
        const newTok = await refresh()
        if (newTok) res = await doFetch(newTok)
      }
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil posts')
      setData(json.data ?? [])
      setMeta(json.meta ?? null)
      isFirstLoad.current = false
    } catch (e) { 
      setError((e as Error).message) 
    } finally { 
      setLoading(false) 
    }
  }, [token, refresh]) // eslint-disable-line

  useEffect(() => { fetchAll() }, [fetchAll])

  const createPost = async (body: Partial<Post>) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body:    JSON.stringify(sanitize(body as Record<string, unknown>)),
    })
    let res = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await refresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal membuat post')
    return json.data as Post
  }

  const updatePost = async (id: string, body: Partial<Post>) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body:    JSON.stringify(sanitize(body as Record<string, unknown>)),
    })
    let res = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await refresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengupdate post')
    return json.data as Post
  }

  const deletePost = async (id: string) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/posts/${id}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${tok}` },
    })
    let res = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await refresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal menghapus post')
    return json.data
  }

  const togglePublish = async (id: string) => {
    const doRequest = async (tok: string) => fetch(`${API}/api/cms/posts/${id}/publish`, {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${tok}` },
    })
    let res = await doRequest(token!)
    if (res.status === 401) {
      const newTok = await refresh()
      if (newTok) res = await doRequest(newTok)
    }
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal toggle publish')
    return json.data as Post
  }

  return { data, meta, loading, error, fetchAll, createPost, updatePost, deletePost, togglePublish }
}
