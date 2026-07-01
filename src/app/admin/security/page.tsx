"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Lock, Key, Eye, Server, CheckCircle } from "lucide-react"

export default function AdminSecurityPage() {
  const securityItems = [
    { icon: Lock, label: "Encryption", value: "AES-256", status: "Active" },
    { icon: Key, label: "API Keys", value: "Rate Limited", status: "Active" },
    { icon: Eye, label: "Audit Logging", value: "Enabled", status: "Active" },
    { icon: Server, label: "Firewall", value: "WAF Enabled", status: "Active" },
    { icon: Shield, label: "CSRF Protection", value: "Enabled", status: "Active" },
    { icon: AlertTriangle, label: "Rate Limiting", value: "100 req/min", status: "Active" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Security</h1>
        <p className="text-[#9aa0a6] mt-1">Security settings and status</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityItems.map((item) => (
          <div key={item.label} className="g-default rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-[#9aa0a6]">{item.value}</p>
              </div>
            </div>
            <Badge variant="success" size="sm">{item.status}</Badge>
          </div>
        ))}
      </div>

      <div className="g-default rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Recent Security Events</h2>
        <div className="space-y-3">
          {[
            { event: "Failed login attempt", user: "admin@example.com", time: "2 hours ago", severity: "Low" },
            { event: "API key rotation", user: "system", time: "1 day ago", severity: "Info" },
            { event: "New admin login", user: "admin@example.com", time: "2 days ago", severity: "Info" },
          ].map((evt, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-4 h-4 ${evt.severity === "Low" ? "text-warning" : "text-[#9aa0a6]"}`} />
                <div>
                  <p className="font-medium">{evt.event}</p>
                  <p className="text-xs text-[#9aa0a6]">{evt.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#9aa0a6]">
                <span>{evt.time}</span>
                <Badge variant={evt.severity === "Low" ? "warning" : "secondary"} size="sm">{evt.severity}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
