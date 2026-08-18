import NextAuth from "next-auth"
import { NextResponse } from "next/server"

// Minimal edge-compatible auth config
const { auth } = NextAuth({
  providers: [],
})

export default auth((req) => {
  const { nextUrl } = req
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoginRoute) {
    // Check if the user is authenticated and has the ADMIN role
    // Type casting because we didn't define types in this minimal config
    const role = (req.auth?.user as any)?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
