"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Users, CheckCircle, XCircle, Edit3 } from "lucide-react"
import { showToast } from "@/components/premium-toast"

interface Subscription {
  id: string
  name: string
  email: string
  plan: string
  status: string
  billingCycle: string
}

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true)
  const [subs, setSubs] = useState<Subscription[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users")
        if (res.ok) {
          const data = await res.json()
          setSubs(data.users?.map((u: any) => ({
            id: u.id,
            name: u.name || "Unknown",
            email: u.email,
            plan: u.plan || "FREE",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
          })) || [])
        }
      } catch {
        showToast("Failed to load subscriptions", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const plans = [
    { name: "Free", users: subs.filter((s) => s.plan === "FREE").length, color: "text-muted-foreground" },
    { name: "Pro", users: subs.filter((s) => s.plan === "PRO").length, color: "text-indigo-600" },
    { name: "Business", users: subs.filter((s) => s.plan === "BUSINESS").length, color: "text-emerald-600" },
    { name: "Enterprise", users: subs.filter((s) => s.plan === "ENTERPRISE").length, color: "text-amber-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Subscriptions</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage plans and subscriptions</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className="g-default bg-card border border-border shadow-[var(--shadow-sm)] rounded-2xl p-6 text-center">
            <p className={`text-3xl font-bold ${plan.color}`} style={{ fontFamily: "var(--font-display)" }}>{plan.users}</p>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1">{plan.name} Plan</p>
          </div>
        ))}
      </div>

      <div className="g-default bg-card border border-border shadow-[var(--shadow-sm)] rounded-2xl p-6">
        <h2 className="font-bold text-foreground mb-4 text-lg" style={{ fontFamily: "var(--font-display)" }}>Active Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-[rgba(0,0,0,0.02)]">
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Billing</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map((i) => (
                  <tr key={i}><td colSpan={5} className="p-4"><div className="h-10 rounded bg-[rgba(0,0,0,0.04)] shimmer" /></td></tr>
                ))
              ) : subs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">No subscriptions found</td></tr>
              ) : (
                subs.slice(0, 10).map((sub: any) => (
                  <tr key={sub.id} className="border-b border-border hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{sub.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={sub.plan === "FREE" ? "secondary" : "default"} size="sm">{sub.plan}</Badge>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">{sub.billingCycle}</td>
                    <td className="p-4">
                      <Badge variant={sub.status === "ACTIVE" ? "success" : "danger"} size="sm">{sub.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-[rgba(0,0,0,0.04)]">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
