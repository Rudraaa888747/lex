"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Activity, Loader2, AlertTriangle, CheckCircle, Inbox, AlertCircle, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface RecentRequest {
  type: "Analysis" | "Chat" | "Compare"
  subject: string
  tokens: number
  status: string
  time: string
}

interface Trend {
  requests: number | null
  tokens: number | null
  avgCost: number | null
  successRate: number | null
}

interface AIMonitoringData {
  totalRequests: number
  tokenConsumption: number
  avgCostPerRequest: number
  successRate: number
  windowDays: number
  trends: Trend
  dailyRequests: { date: string; count: number }[]
  recentRequests: RecentRequest[]
}

const SPARSE_THRESHOLD = 20

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

function statusVariant(status: string): "success" | "danger" | "warning" | "secondary" {
  if (status === "COMPLETED" || status === "Success") return "success"
  if (status === "FAILED") return "danger"
  if (status === "ANALYZING" || status === "PENDING") return "warning"
  return "secondary"
}

function TrendRow({ value }: { value: number | null }) {
  if (value === null) return null
  const up = value >= 0
  return (
    <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${up ? "text-emerald-400" : "text-rose-400"}`}>
      {up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
      {Math.abs(value)}%
    </div>
  )
}

export default function AdminAIMonitoringPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AIMonitoringData | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/ai-monitoring")
      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized — admin access required.")
        } else {
          setError("Failed to load AI monitoring data.")
        }
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError("Failed to load AI monitoring data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const statCards: {
    label: string
    value: string
    caption: string
    icon: React.ElementType
    color: string
    bg: string
    border: string
    shadow: string
    trend: number | null
  }[] = data
    ? [
        {
          label: "Total Requests",
          value: `${data.totalRequests}`,
          caption: `Last ${data.windowDays} days`,
          icon: Activity,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          shadow: "shadow-blue-500/10",
          trend: data.trends.requests,
        },
        {
          label: "Token Consumption",
          value: formatTokens(data.tokenConsumption),
          caption: `Last ${data.windowDays} days`,
          icon: Loader2,
          color: "text-violet-400",
          bg: "bg-violet-500/10",
          border: "border-violet-500/20",
          shadow: "shadow-violet-500/10",
          trend: data.trends.tokens,
        },
        {
          label: "Avg Cost/Request",
          value: `$${data.avgCostPerRequest.toFixed(5)}`,
          caption: `Last ${data.windowDays} days`,
          icon: AlertTriangle,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          shadow: "shadow-emerald-500/10",
          trend: data.trends.avgCost,
        },
        {
          label: "Success Rate",
          value: `${data.successRate}%`,
          caption: `Last ${data.windowDays} days`,
          icon: CheckCircle,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          shadow: "shadow-amber-500/10",
          trend: data.trends.successRate,
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">AI Monitoring</h1>
        <p className="text-muted-foreground mt-1">Track AI service performance and usage</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-default rounded-2xl p-4 sm:p-5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-muted mb-4 shimmer" />
                <div className="h-6 w-20 rounded bg-muted shimmer mb-2" />
                <div className="h-3 w-24 rounded bg-muted shimmer" />
              </div>
            ))
          : statCards.map((item, idx) => (
              <div
                key={item.label}
                className={`
                  glass-default rounded-2xl p-4 sm:p-5
                  border ${item.border} shadow-lg ${item.shadow}
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-none mb-1">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">{item.label}</p>
                <TrendRow value={item.trend} />
                <p className="text-xs text-muted-foreground/70 mt-2">{item.caption}</p>
              </div>
            ))}
      </div>

      <div className="glass-default rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Daily Request Volume</h2>
        <div className="h-72">
          {loading ? (
            <div className="h-full w-full rounded-xl bg-muted shimmer" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyRequests ?? []}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#6B6860" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B6860" allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="glass-default rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold text-foreground mb-4">Recent AI Requests</h2>

        {!loading && data && data.totalRequests < SPARSE_THRESHOLD && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing all activity — usage will grow as more documents are processed.
          </p>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <AlertCircle className="w-8 h-8 text-danger" />
            <p className="text-muted-foreground font-medium">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-muted shimmer" />
            ))}
          </div>
        ) : data && data.recentRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Inbox className="w-8 h-8 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">No AI requests in the last {data.windowDays} days</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data?.recentRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant={req.type === "Chat" ? "warning" : "default"} size="sm">{req.type}</Badge>
                  <span className="text-sm font-bold text-foreground">{req.subject}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span>{req.tokens} tokens</span>
                  <Badge variant={statusVariant(req.status)} size="sm">{req.status}</Badge>
                  <span>{req.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
