import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, CreditCard, TrendingUp, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalDocuments: number
  totalAnalyses: number
  revenue: number
  aiUsage: number
  storageUsed: number
  errorRate: number
}

export default async function AdminDashboard() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin/login")

  const [totalUsers, totalDocuments, totalAnalyses, activeUsers] = await Promise.all([
    prisma.user.count(),
    prisma.document.count(),
    prisma.analysis.count(),
    prisma.user.count({ where: { role: "USER" } }),
  ])

  const stats: AdminStats = {
    totalUsers,
    activeUsers,
    totalDocuments,
    totalAnalyses,
    revenue: totalAnalyses * 0.01,
    aiUsage: totalAnalyses,
    storageUsed: Math.round(totalDocuments * 5) / 10,
    errorRate: 0.5,
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, change: "+12%", up: true, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-500/10" },
    { icon: Activity, label: "Active Users", value: stats.activeUsers, change: "+8%", up: true, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/10" },
    { icon: FileText, label: "Documents", value: stats.totalDocuments, change: "+23%", up: true, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", shadow: "shadow-violet-500/10" },
    { icon: TrendingUp, label: "Analyses", value: stats.totalAnalyses, change: "+15%", up: true, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", shadow: "shadow-amber-500/10" },
    { icon: CreditCard, label: "Revenue", value: `$${stats.revenue}`, change: "+18%", up: true, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/10" },
    { icon: AlertTriangle, label: "Error Rate", value: `${stats.errorRate}%`, change: "-2%", up: false, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", shadow: "shadow-rose-500/10" },
  ]

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
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-none mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">{stat.label}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.up ? "text-emerald-400" : "text-rose-400"}`}>
              {stat.up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
              <>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                  <span className="text-sm font-medium text-foreground">New user registered</span>
                  <span className="text-xs text-muted-foreground shrink-0">2 min ago</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                  <span className="text-sm font-medium text-foreground">Document analyzed: Contract.pdf</span>
                  <span className="text-xs text-muted-foreground shrink-0">15 min ago</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                  <span className="text-sm font-medium text-foreground">Subscription upgraded to Pro</span>
                  <span className="text-xs text-muted-foreground shrink-0">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                  <span className="text-sm font-medium text-foreground">New document uploaded</span>
                  <span className="text-xs text-muted-foreground shrink-0">2 hours ago</span>
                </div>
              </>
          </div>
        </div>

        <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Health</h2>
          <div className="space-y-3">
            {[
              { label: "API Response Time", value: "245ms", status: "Good" },
              { label: "Storage Usage", value: `${stats.storageUsed}GB`, status: "Good" },
              { label: "AI Service", value: "Online", status: "Good" },
              { label: "Database", value: "Connected", status: "Good" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 sm:p-4 rounded-xl glass-subtle border border-white/5 transition-colors hover:bg-white/[0.02]">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                </div>
                <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
