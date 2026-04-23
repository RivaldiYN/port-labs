import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface Profile {
  id:          string
  name:        string
  tagline:     string | null
  bio:         string | null
  avatarUrl:   string | null
  resumeUrl:   string | null
  email:       string | null
  githubUrl:   string | null
  linkedinUrl: string | null
  location:    string | null
  updatedAt:   string | null
}

// ── Public hook — read-only ───────────────────────────────────────────────────
export function useProfile() {
  const [data, setData]       = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/api/profile`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil profil')
      setData(json.data ?? null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  return { data, loading, error, refetch: fetch_ }
}

// ── CMS hook — read + update + avatar upload ──────────────────────────────────
export function useCmsProfile(token: string | null) {
  const [data, setData]       = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API}/api/profile`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengambil profil')
      setData(json.data ?? null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const updateProfile = async (body: Partial<Omit<Profile, 'id' | 'updatedAt'>>) => {
    const res  = await fetch(`${API}/api/cms/profile`, {
      method:  'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal mengupdate profil')
    setData(json.data)
    return json.data as Profile
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('avatar', file)
    const res  = await fetch(`${API}/api/cms/profile/avatar`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Gagal upload avatar')
    await fetchProfile()
    return json.data.avatarUrl as string
  }

  return { data, loading, error, fetchProfile, updateProfile, uploadAvatar }
}
