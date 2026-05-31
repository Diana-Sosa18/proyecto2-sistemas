import { useState, useEffect } from 'react'

/**
 * Hook para fetch con estados de carga y error + AbortController.
 * @param {string} url - URL a fetchear
 * @returns {{ data: *, loading: boolean, error: string|null }} 
 */
export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Cleanup — cancela el fetch si el componente se desmonta
    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}