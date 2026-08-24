"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Activity, FileText } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform analytics and trends</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="g-default rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Document Upload Trends
          </h2>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            <p>Analytics charts will display here with real data once connected to a metrics service.</p>
          </div>
        </div>
        <div className="g-default rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Analysis Trends
          </h2>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            <p>Analytics charts will display here with real data once connected to a metrics service.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Most Common Documents", value: "Employment Contracts", change: "34%", icon: FileText },
          { label: "Peak Usage Time", value: "10:00 - 14:00", change: "EST", icon: TrendingUp },
          { label: "Avg. Analysis Time", value: "2.4s", change: "-12%", icon: Activity },
        ].map((item) => (
          <div key={item.label} className="g-default rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
            <p className="text-xs text-success">{item.change}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
