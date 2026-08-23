import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth({
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
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
