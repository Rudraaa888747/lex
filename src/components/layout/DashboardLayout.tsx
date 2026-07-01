"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/helpers"
import { LayoutDashboard, FileText, Upload, GitCompare, History, User, MessageSquare, Settings, ChevronRight, Sparkles } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Upload Document", href: "/dashboard/upload" },
  { icon: FileText, label: "My Documents", href: "/dashboard/documents" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
  { icon: GitCompare, label: "Compare", href: "/dashboard/compare" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-transparent pt-20 lg:pt-24">
      <div className="flex max-w-[1400px] mx-auto">
        <aside
          className="hidden lg:flex flex-col w-[260px] h-[calc(100vh-6rem)] sticky top-24 ml-6 rounded-2xl p-4 overflow-y-auto z-10 my-6"
          style={{
            background: "var(--color-secondary)",
            border: "1px solid var(--color-border)",
            willChange: "transform"
          }}
        >
          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-[rgba(0,0,0,0.04)]"
                  )}
                  style={isActive ? {
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  } : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-foreground rounded-r-full" />
                  )}
                  <item.icon className={cn("w-4 h-4 transition-colors duration-200", isActive ? "text-foreground" : "group-hover:text-foreground")} />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-foreground" />}
                </Link>
              )
            })}
          </nav>
          <div className="pt-4 border-t border-border mt-4">
            <div className="rounded-xl bg-card border border-border p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.02)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs font-bold text-foreground mb-1 relative z-10">Free Plan</p>
              <p className="text-[11px] text-muted-foreground mb-3 relative z-10">3 of 3 documents used</p>
              <Link href="/pricing" className="relative z-10">
                <button className="w-full text-xs font-bold text-[#FAF8F3] bg-primary-btn hover:bg-primary-btn-hover rounded-lg py-2 px-3 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-[var(--shadow-sm)] border border-[rgba(0,0,0,0.10)]">
                  Upgrade <Sparkles className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8 pt-8 sm:pt-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
