"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { showToast } from "@/components/premium-toast"

interface Subscription {
  id: string
  userId: string
  name: string
  email: string
  plan: string
  userPlan: string
  status: string
  billingCycle: string
}

const PLANS = ["FREE", "PROFESSIONAL", "BUSINESS", "ENTERPRISE"] as const

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true)
  const [subs, setSubs] = useState<Subscription[]>([])
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({})
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async (loadCursor: string | null) => {
    if (loadCursor) setLoadingMore(true)
    else {
      setLoading(true)
      setError(null)
    }
    try {
      const res = await fetch(
        loadCursor ? `/api/admin/subscriptions?cursor=${encodeURIComponent(loadCursor)}` : "/api/admin/subscriptions"
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to load subscriptions")
      const fetched: Subscription[] = data.subscriptions || []
      setSubs((prev) => (loadCursor ? [...prev, ...fetched] : fetched))
      setPlanCounts(data.planCounts || {})
      setCursor(data.nextCursor ?? null)
      setHasMore(Boolean(data.hasMore))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load subscriptions"
      if (!loadCursor) setError(msg)
      else showToast(msg, "error")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load(null)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [load])

  const updatePlan = async (sub: Subscription, plan: string) => {
    setUpdating(sub.userId)
    try {
      // Plan lives on both User and Subscription rows; the users PATCH is
      // the whitelisted path (validates + audit-logs). Subscription rows
      // follow on next sync.
      const res = await fetch(`/api/admin/users/${sub.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Failed to update plan")
      showToast("Plan updated successfully", "success")
      setSubs((prev) => prev.map((s) => (s.userId === sub.userId ? { ...s, plan, userPlan: plan } : s)))
      setPlanCounts((prev) => {
        const next = { ...prev }
        if (next[sub.plan] != null) next[sub.plan] = Math.max(0, next[sub.plan] - 1)
        next[plan] = (next[plan] || 0) + 1
        return next
      })
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update plan", "error")
    } finally {
      setUpdating(null)
    }
  }

  const cards = [
    { name: "Free", key: "FREE", color: "text-muted-foreground" },
    { name: "Professional", key: "PROFESSIONAL", color: "text-indigo-600" },
    { name: "Business", key: "BUSINESS", color: "text-emerald-600" },
    { name: "Enterprise", key: "ENTERPRISE", color: "text-amber-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Subscriptions</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage plans and subscriptions</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {cards.map((plan) => (
          <div key={plan.name} className="g-default bg-card border border-border shadow-[var(--shadow-sm)] rounded-2xl p-6 text-center">
            <p className={`text-3xl font-bold ${plan.color}`} style={{ fontFamily: "var(--font-display)" }}>{planCounts[plan.key] || 0}</p>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1">{plan.name} Plan</p>
          </div>
        ))}
      </div>

      <div className="g-default bg-card border border-border shadow-[var(--shadow-sm)] rounded-2xl p-6">
        <h2 className="font-bold text-foreground mb-4 text-lg" style={{ fontFamily: "var(--font-display)" }}>Active Subscriptions</h2>
        {error ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load(null)}>
              Retry
            </Button>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-[rgba(0,0,0,0.02)]">
                <th scope="col" className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th scope="col" className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan</th>
                <th scope="col" className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Billing</th>
                <th scope="col" className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map((i) => (
                  <tr key={i}><td colSpan={4} className="p-4"><div className="h-10 rounded bg-[rgba(0,0,0,0.04)] shimmer" /></td></tr>
                ))
              ) : subs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">No subscriptions found</td></tr>
              ) : (
                subs.map((sub: Subscription) => (
                  <tr key={sub.id} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{sub.email}</p>
                      {sub.plan !== sub.userPlan && (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                          Plan drift: billing {sub.plan}, account {sub.userPlan}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <label htmlFor={`plan-${sub.userId}`} className="sr-only">Plan for {sub.email}</label>
                      <select
                        id={`plan-${sub.userId}`}
                        value={sub.userPlan}
                        onChange={(e) => void updatePlan(sub, e.target.value)}
                        disabled={updating === sub.userId}
                        className="bg-card border border-border rounded-lg px-2 py-1 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        {PLANS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">{sub.billingCycle}</td>
                    <td className="p-4">
                      <Badge variant={sub.status === "ACTIVE" ? "success" : "danger"} size="sm">{sub.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
        {hasMore && !error && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" size="sm" onClick={() => void load(cursor)} disabled={loadingMore}>
              {loadingMore && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
