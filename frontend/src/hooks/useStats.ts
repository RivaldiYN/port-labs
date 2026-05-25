import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface PortfolioStats {
  /** Total count of all published projects */
  totalProjects: number
  /** Years since the earliest experience start date */
  yearsExperience: number
}

/**
 * Fetches dynamically computed portfolio stats from the backend.
 * - totalProjects  → COUNT(*) of published projects
 * - yearsExperience → floor((now - earliest_experience_start_date) / 365.25)
 */
export function useStats() {
  const [data, setData] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`${API}/api/stats`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json.data ?? null)
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
