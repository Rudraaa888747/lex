"use client"

import { useState, useEffect, useCallback } from "react"
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalDocuments: number
  totalAnalyses: number
  failedAnalyses: number
  errorRate: number
  paymentClaims: number
  storageUsedGb: number
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to load analytics")
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [load])

  if (loading) {
    return (
      <div className="space-y-8" role="status" aria-label="Loading analytics">
        <div>
          <div className="h-8 w-48 rounded bg-muted shimmer" />
          <div className="h-4 w-64 rounded bg-muted shimmer mt-2" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2].map((i) => <div key={i} className="h-64 rounded-2xl g-default shimmer" />)}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Platform analytics and trends</p>
        </div>
        <div className="g-default rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">{error || "Analytics unavailable."}</p>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const conversion = stats.totalUsers === 0 ? 0 : Math.round((stats.totalAnalyses / Math.max(1, stats.totalDocuments)) * 100)
  const cards = [
    { label: "Users", value: stats.totalUsers, sub: `${stats.activeUsers} non-suspended`, icon: Users },
    { label: "Documents", value: stats.totalDocuments, sub: `${stats.storageUsedGb} GB stored`, icon: FileText },
    { label: "Analyses", value: stats.totalAnalyses, sub: `${stats.failedAnalyses} failed (${stats.errorRate}%)`, icon: TrendingUp },
    { label: "Payment Claims", value: stats.paymentClaims, sub: "Awaiting manual review", icon: BarChart3 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform analytics and trends · live from the database</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => (
          <div key={item.label} className="g-default rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold tabular-nums">{item.value.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="g-default rounded-2xl p-6">
        <h2 className="font-semibold mb-2">Analysis Conversion</h2>
        <p className="text-sm text-muted-foreground">
          {conversion}% of uploaded documents have a completed or attempted analysis.
        </p>
        <div className="w-full bg-muted rounded-full h-2.5 mt-4 overflow-hidden" role="progressbar" aria-valuenow={Math.min(conversion, 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Analysis conversion">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(conversion, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}
