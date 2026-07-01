"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { History, FileText, ChevronRight, MessageSquare, Clock } from "lucide-react"
import { formatDate } from "@/lib/helpers"

interface ActivityItem {
  id: string
  title?: string
  action?: string
  type?: string
  status?: string
  createdAt: string
}

const FILTERS = ["ALL", "UPLOAD", "ANALYSIS", "CHAT"] as const

export function HistoryClient({ initialActivities }: { initialActivities: ActivityItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const filtered = filter === "ALL" ? initialActivities : initialActivities

  return (
    <div className="max-w-4xl mx-auto space-y-6 overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Activity History</h1>
        <p className="text-muted-foreground mt-1">Your document uploads, analyses, and chat sessions</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
             className={`px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filter === f ? "bg-foreground text-card shadow-sm" : "g-default hover:bg-[rgba(0,0,0,0.04)]"
            }`}
          >
            {f === "ALL" ? "All Activity" : f === "ANALYSIS" ? "Analysis" : f.charAt(0) + f.slice(1).toLowerCase() + "s"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="g-default rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>No activity yet</h3>
          <p className="text-sm text-muted-foreground">Your recent actions will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const itemId = item.id || i
            const isChat = item.type === "CHAT"
            return (
              <Link
                key={itemId}
                href={item.id ? `/dashboard/documents/${item.id}` : "#"}
                className="flex items-center gap-4 p-4 rounded-2xl g-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isChat ? "bg-[rgba(217,119,6,0.1)]" : "bg-[rgba(0,0,0,0.04)]"}`}>
                  {isChat ? <MessageSquare className="w-5 h-5 text-[#d97706]" /> : <FileText className="w-5 h-5 text-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{item.title || item.action || "Document uploaded"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <Badge variant={item.status === "COMPLETED" ? "success" : "secondary"} size="sm">
                  {item.status === "COMPLETED" ? "Completed" : "Pending"}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
