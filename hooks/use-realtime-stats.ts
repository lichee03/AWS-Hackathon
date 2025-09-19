"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"

interface RealtimeStats {
  totalDetections: number
  avgConfidence: number
  recentActivity: number
  topMaterials: Array<{ material: string; count: number }>
  timestamp: string
  brand: string
}

export function useRealtimeStats(refreshInterval = 30000) {
  // 30 seconds
  const { user } = useAuth()
  const [stats, setStats] = useState<RealtimeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) throw new Error("No auth token")

      const response = await fetch(`/api/realtime/stats?brand=${user.brand}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStats()

    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchStats, refreshInterval])

  return { stats, isLoading, error, refetch: fetchStats }
}
