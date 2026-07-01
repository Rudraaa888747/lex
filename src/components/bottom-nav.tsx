"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useCallback } from "react"
import { cn } from "@/lib/helpers"
import { LayoutDashboard, FileText, Upload, MessageSquare, GitCompare, MoreHorizontal, History, User, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const primaryItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: Upload, label: "Upload", href: "/dashboard/upload" },
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
  { icon: GitCompare, label: "Compare", href: "/dashboard/compare" },
]

const secondaryItems = [
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const closeMore = useCallback(() => setMoreOpen(false), [])
  const toggleMore = useCallback(() => setMoreOpen((v) => !v), [])

  if (!pathname.startsWith("/dashboard")) return null

  return (
    <>
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-[210]" onClick={closeMore} aria-hidden="true" />
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[220] w-[280px] glass-floating rounded-2xl p-2">
            <div className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              More
            </div>
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMore}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[rgba(0,0,0,0.06)] text-foreground font-semibold"
                      : "text-foreground hover:bg-[rgba(0,0,0,0.04)]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <hr className="my-1 border-border" />
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); closeMore() }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}

      <nav className="g-nav fixed bottom-0 left-0 right-0 z-[200] lg:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-1 py-1">
          {primaryItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl text-[10px] font-medium transition-all duration-200 min-w-0 flex-1",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                    isActive ? "bg-[rgba(0,0,0,0.06)]" : ""
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-foreground" : "")} />
                </div>
                <span className="truncate max-w-[56px] text-center leading-none">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={toggleMore}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl text-[10px] font-medium transition-all duration-200 min-w-0 flex-1",
              moreOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="More options"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </div>
            <span className="truncate max-w-[56px] text-center leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
