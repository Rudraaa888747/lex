"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Lock, Key, Eye, Server, Loader2 } from "lucide-react"
import { showToast } from "@/components/premium-toast"
import { formatDate } from "@/lib/helpers"

interface AuditRow {
  id: string
  userId: string | null
  action: string
  details: string | null
  ip: string | null
  createdAt: string
}

const FILTERS = ["ALL", "payment.claim", "admin.user.update"] as const

export default function AdminSecurityPage() {
  const securityItems = [
    { icon: Lock, label: "Encryption", value: "AES-256 at rest, TLS in transit", status: "Configured" },
    { icon: Key, label: "API Keys", value: "Per-route rate limits", status: "Configured" },
    { icon: Eye, label: "Audit Logging", value: "Written on admin + payment actions", status: "Configured" },
    { icon: Server, label: "Firewall", value: "Platform-provided (Vercel)", status: "Platform" },
    { icon: Shield, label: "CSRF Protection", value: "SameSite cookies + origin check", status: "Configured" },
    { icon: AlertTriangle, label: "Rate Limiting", value: "In-memory dev / Upstash prod", status: "Partial" },
  ]

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL")
  const [logs, setLogs] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (action: string, loadCursor: string | null) => {
    if (loadCursor) setLoadingMore(true)
    else {
      setLoading(true)
      setError(null)
    }
    try {
      const params = new URLSearchParams()
      if (action !== "ALL") params.set("action", action)
      if (loadCursor) params.set("cursor", loadCursor)
      const res = await fetch(`/api/admin/audit-log?${params.toString()}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to load audit log")
      const fetched: AuditRow[] = data.logs || []
      setLogs((prev) => (loadCursor ? [...prev, ...fetched] : fetched))
      setCursor(data.nextCursor ?? null)
      setHasMore(Boolean(data.hasMore))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load audit log"
      if (!loadCursor) setError(msg)
      else showToast(msg, "error")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load(filter, null)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [filter, load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Security</h1>
        <p className="text-muted-foreground mt-1">Security posture and audit trail</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityItems.map((item) => (
          <div key={item.label} className="g-default rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
            <Badge variant={item.status === "Partial" || item.status === "Platform" ? "warning" : "success"} size="sm">{item.status}</Badge>
          </div>
        ))}
      </div>

      <div className="g-default rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold">Audit Log</h2>
          <div className="flex gap-2" role="group" aria-label="Filter audit log">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f)
                  setCursor(null)
                }}
                aria-pressed={filter === f}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === f ? "bg-foreground text-card" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "ALL" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2" role="status" aria-label="Loading audit log">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load(filter, null)}>
              Retry
            </Button>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No audit entries yet. Admin actions and payment claims appear here.
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((row) => (
              <div key={row.id} className="p-3 rounded-xl bg-muted text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono font-medium truncate">{row.action}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{formatDate(row.createdAt)}</span>
                </div>
                {row.details && (
                  <p className="text-xs text-muted-foreground mt-1 break-all font-mono">{row.details}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {row.userId ? `user ${row.userId}` : "system"}{row.ip ? ` · ${row.ip}` : ""}
                </p>
              </div>
            ))}
            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => void load(filter, cursor)} disabled={loadingMore}>
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
