"use client"

import Image from "next/image"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useCallback, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

import { Scale, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Plus, ShieldCheck } from "lucide-react"

export function SiteHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/reset-password"

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), [])
  const toggleDropdown = useCallback(() => setDropdownOpen((v) => !v), [])
  const closeDropdown = useCallback(() => setDropdownOpen(false), [])

  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [dropdownOpen])

  const renderProfileDropdown = () => (
    <>
      {session?.user && (
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border hover:bg-[rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-[#FAF8F3] text-xs font-bold">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:inline">{session.user.name || session.user.email}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="glass-floating absolute right-0 top-full mt-2 w-56 rounded-2xl z-[260] p-2" role="menu">
                <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                  {session.user?.role === "ADMIN" ? "Admin" : "User"}
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                  onClick={closeDropdown}
                  role="menuitem"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                  onClick={closeDropdown}
                  role="menuitem"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    onClick={closeDropdown}
                    role="menuitem"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <hr className="my-1 border-border" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
            </div>
          )}
        </div>
      )}
    </>
  )

  return (
    <>
      <header className="g-nav fixed top-0 left-0 right-0 z-[200]">
        {isDashboard ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
                <div className="relative h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center shrink-0">
                  <Image src="/logo.jpg" alt="Lex Logo" width={36} height={36} priority className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="font-bold text-[1.25rem] tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>Lex</span>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/dashboard/upload">
                  <Button variant="gradient" size="sm" className="hidden sm:inline-flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    New Analysis
                  </Button>
                </Link>
                <Link href="/dashboard/upload" className="sm:hidden">
                  <Button variant="gradient" size="icon" className="w-9 h-9 rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
                {renderProfileDropdown()}
              </div>
            </div>
          </div>
        ) : (
          <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center shrink-0">
                  <Image src="/logo.jpg" alt="Lex Logo" width={36} height={36} priority className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="font-bold text-[1.25rem] tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>Lex</span>
              </Link>

              {!isAuth && (
                <div className="hidden md:flex items-center gap-8">
                  <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                  <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </div>
              )}

              <div className="hidden md:flex items-center gap-3">

                {session?.user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-border hover:bg-[rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-[#FAF8F3] text-xs font-bold">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium text-foreground">{session.user.name || session.user.email}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="glass-floating absolute right-0 top-full mt-2 w-56 rounded-2xl z-[260] p-2" role="menu">
                          <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                            {session.user?.role === "ADMIN" ? "Admin" : "User"}
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                            onClick={closeDropdown}
                            role="menuitem"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                            onClick={closeDropdown}
                            role="menuitem"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                              onClick={closeDropdown}
                              role="menuitem"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <hr className="my-1 border-border" />
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                            role="menuitem"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                    )}
                  </div>
                ) : (
                  !isAuth && (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="gradient" size="sm">Get Started</Button>
                      </Link>
                    </>
                  )
                )}
              </div>

              <button
                onClick={toggleMobile}
                className="md:hidden p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer text-foreground"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {mobileOpen && (
              <div className="md:hidden border-t border-border py-4 space-y-3 glass-floating absolute top-full left-0 right-0 mt-0 rounded-b-2xl px-4 pb-6">
                <Link href="/features" className="block px-3 py-2 text-sm rounded-xl text-foreground hover:bg-[rgba(0,0,0,0.04)]" onClick={closeMobile}>
                  Features
                </Link>
                <Link href="/pricing" className="block px-3 py-2 text-sm rounded-xl text-foreground hover:bg-[rgba(0,0,0,0.04)]" onClick={closeMobile}>
                  Pricing
                </Link>
                <Link href="/faq" className="block px-3 py-2 text-sm rounded-xl text-foreground hover:bg-[rgba(0,0,0,0.04)]" onClick={closeMobile}>
                  FAQ
                </Link>
                {session?.user ? (
                  <>
                    <hr className="border-border" />
                    <Link href="/dashboard" className="block px-3 py-2 text-sm rounded-xl text-foreground hover:bg-[rgba(0,0,0,0.04)]" onClick={closeMobile}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-3 py-2 text-sm rounded-xl text-danger hover:bg-danger/5 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link href="/login" className="flex-1" onClick={closeMobile}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" className="flex-1" onClick={closeMobile}>
                      <Button variant="gradient" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
                <div className="flex justify-center pt-4">

                </div>
              </div>
            )}
          </nav>
        )}
      </header>
      <BottomNav />
    </>
  )
}
