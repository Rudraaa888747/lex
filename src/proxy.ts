import { NextResponse } from "next/server"
import { authMiddleware } from "@/lib/auth-config"

// M1: Next.js 16 renamed the `middleware` convention to `proxy`.
// M2: reuse the single shared `auth` instance from auth-config instead of a
// second divergent NextAuth({ providers: [] }) — one source of truth for
// JWT verification and session shaping.
export default authMiddleware((req) => {
  const { nextUrl } = req
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoginRoute) {
    // Edge check on JWT role; fresh suspend/role is re-enforced server-side
    // in auth-config session() + admin layout/pages, so a stale JWT alone
    // cannot retain access after suspend/demote.
    const role = (req.auth?.user as { role?: string } | undefined)?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
