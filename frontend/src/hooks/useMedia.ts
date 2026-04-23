import { useState, useEffect, useCallback } from "react"

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export interface MediaItem {
  id:           string
  filename:     string
  originalName: string | null
  mimeType:     string | null
  sizeBytes:    number | null
  url:          string
  altText:      string | null
  uploadedAt:   string | null
}

export interface MediaMeta {
  page: number; limit: number; total: number; totalPages: number
}

// ── Public hook ───────────────────────────────────────────────────────────────
export function usePublicMedia(limit = 20) {
  const [data, setData]       = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/api/media?limit=${limit}`)
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data ?? []); else setError(j.message) })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [limit])

  return { data, loading, error }
}

// ── CMS hook ──────────────────────────────────────────────────────────────────
export function useCmsMedia(token: string | null) {
  const [data, setData]       = useState<MediaItem[]>([])
  const [meta, setMeta]       = useState<MediaMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchMedia = useCallback(async (page = 1) => {
    if (!token) return
    setError(null)
    try {
      const res  = await fetch(`${API}/api/cms/media?page=${page}&limit=24`, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? "Gagal fetch media")
      setData(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch (e) { setError((e as Error).message) }
    finally     { setLoading(false) }
  }, [token])

  useEffect(() => { fetchMedia(1) }, [fetchMedia])

  const uploadFile = async (file: File): Promise<MediaItem> => {
    const form = new FormData()
    form.append("file", file)
    const res  = await fetch(`${API}/api/cms/media/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? "Upload gagal")
    return json.data as MediaItem
  }

  const deleteMedia = async (id: string) => {
    const res  = await fetch(`${API}/api/cms/media/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? "Hapus gagal")
    return json.data
  }

  const updateAlt = async (id: string, altText: string) => {
    const res  = await fetch(`${API}/api/cms/media/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ altText }) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? "Update gagal")
    return json.data as MediaItem
  }

  return { data, meta, loading, error, fetchMedia, uploadFile, deleteMedia, updateAlt }
}
