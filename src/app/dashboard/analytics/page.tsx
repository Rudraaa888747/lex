"use client"

import { useEffect, useState } from "react"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Shield } from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts"

type AnalyticsResponse = {
  totals: {
    documents: number
    analyses: number
    avgScore: number
    avgFileSizeMb: number
  }
  riskDistribution: Array<{ name: string; value: number }>
  riskDistributionNote?: string
  monthlyActivity: Array<{ name: string; uploads: number }>
  analysisTrends: Array<{ name: string; analyses: number }>
  userInsights: {
    plan: string
    readyDocuments: number
    completedDocuments: number
  }
}

const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"]

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ElementType
}) {
  return (
    <div className="glass-default rounded-3xl p-5 sm:p-6 border border-white/5">
      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const response = await fetch("/api/dashboard/analytics")
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error(typeof payload?.error === "string" ? payload.error : "Failed to load analytics")
      }
      setData(payload)
    } catch (err) {
      setData(null)
      setLoadError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  if (loading) {
    return <div className="h-80 rounded-3xl bg-white/5 animate-pulse" role="status" aria-label="Loading analytics" />
  }

  if (!data) {
    return (
      <div className="glass-default rounded-3xl p-10 text-center border border-white/5">
        <h1 className="text-2xl font-bold text-foreground">Analytics unavailable</h1>
        <p className="text-muted-foreground mt-2">{loadError || "We could not load your analytics right now."}</p>
        <button
          onClick={() => void load()}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-border px-6 h-11 font-medium hover:bg-[rgba(0,0,0,0.04)] transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title">Analytics Dashboard</h1>
        <p className="text-subtitle mt-2">A live view of document activity, risk exposure, and analysis volume.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Documents" value={data.totals.documents} icon={BarChart3} />
        <StatCard label="Analyses" value={data.totals.analyses} icon={TrendingUp} />
        <StatCard label="Avg Contract Score (6 mo)" value={`${Number(data.totals.avgScore).toFixed(1)} / 10`} icon={Shield} />
        <StatCard label="Avg File Size (MB)" value={Number(data.totals.avgFileSizeMb).toFixed(2)} icon={PieChartIcon} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-default rounded-3xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Upload Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyActivity}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#9aa0a6" />
                <YAxis stroke="#9aa0a6" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="uploads" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-default rounded-3xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h2>
          {data.riskDistributionNote && (
            <p className="text-xs text-muted-foreground mb-3">{data.riskDistributionNote}</p>
          )}
          <div className="h-72" role="img" aria-label={`Risk distribution: ${data.riskDistribution.map((d) => `${d.name} ${d.value}`).join(", ")}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.riskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {data.riskDistribution.map((entry, pieIndex) => (
                    <Cell key={entry.name} fill={PIE_COLORS[pieIndex % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {data.riskDistribution.map((entry, i) => (
              <li key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  aria-hidden="true"
                />
                {entry.name}: <strong className="text-foreground">{entry.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-default rounded-3xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Analysis Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.analysisTrends}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#9aa0a6" />
                <YAxis stroke="#9aa0a6" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="analyses" stroke="#34d399" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-default rounded-3xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Insights</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span>Current plan</span>
              <span className="font-semibold text-foreground">{data.userInsights.plan}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span>Ready for analysis</span>
              <span className="font-semibold text-foreground">{data.userInsights.readyDocuments}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span>Completed documents</span>
              <span className="font-semibold text-foreground">{data.userInsights.completedDocuments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
