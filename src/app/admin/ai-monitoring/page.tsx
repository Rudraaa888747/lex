"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

export default function AdminAIMonitoringPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">AI Monitoring</h1>
        <p className="text-[#9aa0a6] mt-1">Track AI service performance and usage</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: "12,847", change: "+8.2%", icon: Activity },
          { label: "Token Consumption", value: "2.4M", change: "+12.1%", icon: Loader2 },
          { label: "Avg Cost/Request", value: "$0.0042", change: "-3.1%", icon: AlertTriangle },
          { label: "Success Rate", value: "99.8%", change: "+0.2%", icon: CheckCircle },
        ].map((item) => (
          <div key={item.label} className="stats-card">
            <div className="w-9 h-9 rounded-xl bg-[#b4c5ff]/10 flex items-center justify-center mb-3">
              <item.icon className="w-4 h-4 text-[#b4c5ff]" />
            </div>
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-xs text-[#9aa0a6]">{item.label}</p>
            <p className="text-xs text-success mt-1">{item.change}</p>
          </div>
        ))}
      </div>

      <div className="g-default rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Recent AI Requests</h2>
        <div className="space-y-3">
          {loading ? (
            [1,2,3,4,5].map((i) => <div key={i} className="h-10 rounded-xl bg-white/5 shimmer" />)
          ) : (
            [
              { type: "Analysis", document: "Contract_2024.pdf", tokens: 2450, status: "Success", time: "2 min ago" },
              { type: "Chat", document: "NDA_Agreement.docx", tokens: 890, status: "Success", time: "5 min ago" },
              { type: "Analysis", document: "Employment_Contract.pdf", tokens: 3200, status: "Success", time: "12 min ago" },
              { type: "Compare", document: "2 documents", tokens: 4100, status: "Success", time: "18 min ago" },
              { type: "Analysis", document: "Lease_Agreement.pdf", tokens: 1800, status: "Failed", time: "25 min ago" },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant={req.type === "Chat" ? "warning" : "default"} size="sm">{req.type}</Badge>
                  <span className="font-medium">{req.document}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#9aa0a6]">
                  <span>{req.tokens} tokens</span>
                  <Badge variant={req.status === "Success" ? "success" : "danger"} size="sm">{req.status}</Badge>
                  <span>{req.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
