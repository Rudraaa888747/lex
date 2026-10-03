import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, CreditCard, TrendingUp, AlertTriangle, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { formatDate } from "@/lib/helpers"

export const dynamic = "force-dynamic"

function pctChange(current: number, previous: number): { label: string; up: boolean | null } {
  if (previous === 0) {
    return current > 0 ? { label: "new", up: true } : { label: "—", up: null }
  }
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return { label: "0%", up: null }
  return { label: `${pct > 0 ? "+" : ""}${pct}%`, up: pct > 0 }
}

function timeAgo(date: Date): string {
  const mins = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

export default async function AdminDashboard() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin/login")

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const startedAt = Date.now()
  const [
    totalUsers,
    nonSuspendedUsers,
    totalDocuments,
    totalAnalyses,
    failedAnalyses,
    fileSizeAgg,
    usersLast30,
    usersPrev30,
    docsLast30,
    docsPrev30,
    analysesLast30,
    analysesPrev30,
    pendingClaims,
    recentDocuments,
    recentUsers,
    recentClaims,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { suspended: false } }),
    prisma.document.count(),
    prisma.analysis.count(),
    prisma.analysis.count({ where: { status: "FAILED" } }),
    prisma.document.aggregate({ _sum: { fileSize: true } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.document.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.document.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.analysis.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.analysis.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.auditLog.count({ where: { action: "payment.claim" } }),
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, email: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { action: "payment.claim" },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, createdAt: true, details: true },
    }),
  ])
  const dbLatencyMs = Date.now() - startedAt

  const storageGb = Math.round(((fileSizeAgg._sum.fileSize ?? 0) / 1024 ** 3) * 10) / 10
  const errorRate = totalAnalyses === 0 ? 0 : Math.round((failedAnalyses / totalAnalyses) * 1000) / 10

  const usersDelta = pctChange(usersLast30, usersPrev30)
  const docsDelta = pctChange(docsLast30, docsPrev30)
  const analysesDelta = pctChange(analysesLast30, analysesPrev30)

  const statCards = [
    { icon: Users, label: "Total Users", value: totalUsers, change: usersDelta, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-500/10" },
    { icon: Activity, label: "Non-suspended Users", value: nonSuspendedUsers, change: usersDelta, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/10" },
    { icon: FileText, label: "Documents", value: totalDocuments, change: docsDelta, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", shadow: "shadow-violet-500/10" },
    { icon: TrendingUp, label: "Analyses", value: totalAnalyses, change: analysesDelta, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", shadow: "shadow-amber-500/10" },
    { icon: CreditCard, label: "Payment Claims", value: pendingClaims, change: { label: "manual review", up: null } as const, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/10" },
    { icon: AlertTriangle, label: "Analysis Failure Rate", value: `${errorRate}%`, change: { label: `${failedAnalyses} failed`, up: null } as const, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", shadow: "shadow-rose-500/10" },
  ]

  const activityRows: Array<{ text: string; when: string }> = [
    ...recentDocuments.map((d) => ({ text: `Document uploaded: ${d.title}`, when: timeAgo(d.createdAt) })),
    ...recentUsers.map((u) => ({ text: `New user registered: ${u.email}`, when: timeAgo(u.createdAt) })),
    ...recentClaims.map((c) => ({ text: "Payment claim submitted", when: timeAgo(c.createdAt) })),
  ].slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">Platform overview and system analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {statCards.map((stat, idx) => (
          <div
            key={stat.label}
            className={`
              glass-default rounded-2xl p-4 sm:p-5
              border ${stat.border} shadow-lg ${stat.shadow}
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            `}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 sm:mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-none mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">{stat.label}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.change.up === null ? "text-muted-foreground" : stat.change.up ? "text-emerald-400" : "text-rose-400"}`}>
              {stat.change.up === null ? <Minus className="w-3.5 h-3.5" aria-hidden="true" /> : stat.change.up ? <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />}
              {stat.change.label}
              {stat.change.up !== null && <span className="text-muted-foreground">vs prior 30d</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityRows.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
            {activityRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                <span className="text-sm font-medium text-foreground truncate">{row.text}</span>
                <span className="text-xs text-muted-foreground shrink-0">{row.when}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Full audit trail: Admin → Security → Audit Log ({formatDate(now.toISOString())} snapshot).
          </p>
        </div>

        <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Health</h2>
          <div className="space-y-3">
            {[
              { label: "Database", value: `Connected (${dbLatencyMs}ms query)`, status: "Good" as const },
              { label: "Storage Usage", value: `${storageGb}GB of uploaded documents`, status: "Good" as const },
              { label: "Analysis Failures", value: `${failedAnalyses} of ${totalAnalyses} analyses failed`, status: errorRate > 10 ? "Attention" as const : "Good" as const },
              { label: "AI Service", value: "Not monitored — failures surface as FAILED analyses above", status: "Unknown" as const },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                </div>
                <Badge variant={item.status === "Good" ? "success" : item.status === "Attention" ? "warning" : "secondary"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
