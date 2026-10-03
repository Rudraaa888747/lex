"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/helpers"
import { LayoutDashboard, Users, BarChart3, Activity, CreditCard, ChevronRight, Shield } from "lucide-react"

const adminSidebar = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Activity, label: "AI Monitoring", href: "/admin/ai-monitoring" },
  { icon: CreditCard, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: Shield, label: "Security", href: "/admin/security" },
]

import AdminLoading from "./loading"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Strict check: only users with the ADMIN role are allowed in the admin panel
  const isAuthorized = status === "authenticated" && session?.user?.role === "ADMIN"
  const isUnauthorized = status === "unauthenticated" || (status === "authenticated" && !isAuthorized)

  // Client-side redirect (redirect() from next/navigation is server-only and unsupported in a Client Component)
  useEffect(() => {
    if (pathname === "/admin/login") return
    if (isUnauthorized) {
      router.replace("/admin/login")
    }
  }, [pathname, isUnauthorized, router])

  // If we are already on the admin login page, just render it without the sidebar
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  // Prevent the admin shell from flashing while an unauthorized redirect is in flight
  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-background">
        <AdminLoading />
      </div>
    )
  }

  const isLoading = status === "loading"

  return (
    <div className="min-h-screen bg-background">
      <div className="flex max-w-[1400px] mx-auto">
        <aside
          className="hidden lg:flex flex-col w-[260px] h-[calc(100vh-6rem)] sticky top-24 ml-6 rounded-2xl p-4 overflow-y-auto z-10 my-6"
          style={{
            background: "rgba(245, 241, 232, 0.90)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRight: "1px solid rgba(0, 0, 0, 0.07)",
            border: "1px solid rgba(0, 0, 0, 0.07)",
          }}
        >
          <div className="flex items-center gap-2 px-3 py-2 mb-4">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-[#FAF8F3]">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-foreground">Admin Panel</span>
          </div>
          <nav aria-label="Admin sections" className="space-y-1 flex-1">
            {adminSidebar.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group",
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
                  <item.icon className={cn("w-4 h-4 transition-colors duration-200", isActive ? "text-foreground" : "group-hover:text-foreground")} aria-hidden="true" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-foreground" aria-hidden="true" />}
                </Link>
              )
            })}
          </nav>
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors">
            ← Back to Dashboard
          </Link>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile admin nav — the sidebar is lg-only; without this there
              is no way to switch admin sections on small screens. */}
          <nav aria-label="Admin sections" className="lg:hidden px-4 pt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {adminSidebar.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-foreground text-card"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
            {isLoading ? <AdminLoading /> : children}
          </div>
        </div>
      </div>
    </div>
  )
}
