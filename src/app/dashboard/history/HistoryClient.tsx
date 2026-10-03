"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { History, FileText, ChevronRight, Clock } from "lucide-react"
import { formatDate } from "@/lib/helpers"

interface ActivityItem {
  id: string
  title?: string
  action?: string
  type?: string
  status?: string
  createdAt: string
}

function statusBadge(status?: string) {
  if (status === "COMPLETED") return { variant: "success" as const, label: "Completed" }
  if (status === "FAILED") return { variant: "danger" as const, label: "Failed" }
  if (status === "ANALYZING" || status === "PROCESSING" || status === "OCR_PROCESSING")
    return { variant: "warning" as const, label: "Processing" }
  return { variant: "secondary" as const, label: "Pending" }
}

export function HistoryClient({ initialActivities }: { initialActivities: ActivityItem[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Activity History</h1>
        <p className="text-muted-foreground mt-1">Your recent document uploads — showing last {initialActivities.length}.</p>
      </div>

      {initialActivities.length === 0 ? (
        <div className="g-default rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>No activity yet</h3>
          <p className="text-sm text-muted-foreground">Your recent actions will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {initialActivities.map((item, i) => {
            const itemId = item.id || i
            const badge = statusBadge(item.status)
            return (
              <Link
                key={itemId}
                href={item.id ? `/dashboard/documents/${item.id}` : "/dashboard/documents"}
                className="flex items-center gap-4 p-4 rounded-2xl g-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(0,0,0,0.04)]">
                  <FileText className="w-5 h-5 text-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{item.title || item.action || "Document uploaded"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <Badge variant={badge.variant} size="sm">
                  {badge.label}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
