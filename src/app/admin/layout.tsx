"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/helpers"
import { LayoutDashboard, Users, BarChart3, Activity, CreditCard, Settings, Scale, ChevronRight, Shield, AlertTriangle } from "lucide-react"

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
  const pathname = usePathname()

  // Avoid redirecting while loading, but redirect if strictly unauthenticated or unauthorized
  if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "ADMIN")) {
    redirect("/dashboard")
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
          <nav className="space-y-1 flex-1">
            {adminSidebar.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                  <item.icon className={cn("w-4 h-4 transition-colors duration-200", isActive ? "text-foreground" : "group-hover:text-foreground")} />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-foreground" />}
                </Link>
              )
            })}
          </nav>
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors">
            ← Back to Dashboard
          </Link>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
            {isLoading ? <AdminLoading /> : children}
          </div>
        </div>
      </div>
    </div>
  )
}
