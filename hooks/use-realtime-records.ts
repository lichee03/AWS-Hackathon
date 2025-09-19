"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import type { BrandData } from "@/lib/auth"

export function useRealtimeRecords(limit = 10, refreshInterval = 60000) {
  // 1 minute
  const { user } = useAuth()
  const [records, setRecords] = useState<BrandData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) throw new Error("No auth token")

      const response = await fetch(`/api/realtime/records?brand=${user.brand}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }

      const data = await response.json()
      setRecords(data.records)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [user, limit])

  useEffect(() => {
    fetchRecords()

    // Set up polling for real-time updates
    const interval = setInterval(fetchRecords, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchRecords, refreshInterval])

  return { records, isLoading, error, refetch: fetchRecords }
}
