import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type DefaultSession, type Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./database"
import { touchCurrentSession } from "./session-metadata"
import { getRequestMetadata } from "./request-metadata"
import { loginLimiter } from "./rate-limit"

declare module "next-auth" {
  interface Session {
    sessionToken?: string
    user: {
      id: string
      role: string
      plan: string
      suspended: boolean
      createdAt: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
    plan?: string
    suspended?: boolean
  }
}

const nextAuth = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const rawEmail = credentials.email as string
        const password = credentials.password as string

        // H5: cap password length before bcrypt to prevent CPU DoS
        // (register already caps at 128 — login must match)
        if (typeof password !== "string" || password.length > 128 || password.length < 1) return null

        // H6: normalize email the same way register does (trim + lowercase)
        const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : ""
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return null

        // H1: brute-force protection on the credentials path.
        // Key on server-observed IP + normalized email so one IP can't
        // stuff many accounts and one account can't be hammered from many IPs
        // without tripping the per-IP bucket.
        try {
          const meta = await getRequestMetadata()
          const ip = meta.ip && meta.ip !== "Unknown" ? meta.ip : "unknown-ip"
          const { success } = await loginLimiter.limit(`${ip}:${email}`)
          if (!success) {
            // Throwing surfaces a readable error in signIn("credentials").error
            // instead of the generic "invalid credentials" null path.
            throw new Error("Too many login attempts. Please try again in a few minutes.")
          }
        } catch (err) {
          // Preserve the rate-limit throw; ignore metadata failures (fail open
          // for IP resolution, the bcrypt check below still applies).
          if (err instanceof Error && err.message.startsWith("Too many login attempts")) throw err
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            plan: true,
            suspended: true,
            image: true,
            createdAt: true,
          },
        })
        if (!user || !user.password || user.suspended) return null

        const isValid = await compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          suspended: user.suspended,
          image: user.image,
          createdAt: user.createdAt,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { suspended: true },
      })

      return !dbUser?.suspended
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        const authUser = user as any
        token.id = authUser.id
        token.role = authUser.role || "USER"
        token.plan = authUser.plan || "FREE"
        token.suspended = Boolean(authUser.suspended)
        token.createdAt = authUser.createdAt?.toISOString() || new Date().toISOString()
        
        // Initial sign in: generate token and DB session
        if (account?.provider === "credentials") {
          const sessionToken = crypto.randomUUID()
          token.sessionToken = sessionToken
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          
          // M5: headers() is not guaranteed inside jwt() (edge/build paths).
          // Never let metadata collection fail the sign-in.
          let reqMeta = { ip: "Unknown", userAgent: "Unknown" }
          try {
            reqMeta = await getRequestMetadata()
          } catch {
            // keep Unknown fallbacks
          }
          
          await prisma.session.create({
            data: {
              sessionToken,
              userId: authUser.id,
              expires,
              userAgent: reqMeta.userAgent,
              ip: reqMeta.ip,
            }
          })
        }
      }
      if (trigger === "update" && session && typeof session === "object") {
        if (typeof session.name === "string") token.name = session.name
        if (typeof session.email === "string") token.email = session.email
        if (typeof session.image === "string") token.picture = session.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        if (token.sessionToken) {
          // C1+C2: enforce server-side revocation AND expiry, and re-validate
          // the user on every session read so suspend/role changes take
          // effect immediately instead of lingering in the 30-day JWT.
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: token.sessionToken as string },
            select: {
              id: true,
              expires: true,
              userId: true,
              user: { select: { suspended: true, role: true, plan: true } },
            },
          })
          if (!dbSession) return {} as Session // Revoked
          if (dbSession.expires <= new Date()) {
            // Opportunistic cleanup of the expired row
            await prisma.session.deleteMany({
              where: { sessionToken: token.sessionToken as string },
            })
            return {} as Session // Expired
          }
          if (dbSession.user?.suspended) {
            await prisma.session.deleteMany({
              where: { sessionToken: token.sessionToken as string },
            })
            return {} as Session // Suspended
          }
          session.sessionToken = token.sessionToken as string

          // Prefer fresh DB role/plan over the stale JWT claim (fixes M3
          // where a demoted admin kept passing edge checks on JWT alone).
          const sessionUser = session.user as any
          sessionUser.id = token.id
          sessionUser.role = dbSession.user?.role ?? token.role
          sessionUser.plan = dbSession.user?.plan ?? token.plan
          sessionUser.suspended = Boolean(dbSession.user?.suspended)
          sessionUser.createdAt = token.createdAt

          if (token.name) sessionUser.name = token.name
          if (token.email) sessionUser.email = token.email
          if (token.picture) sessionUser.image = token.picture
          return session
        }

        const sessionUser = session.user as any

        sessionUser.id = token.id
        sessionUser.role = token.role
        sessionUser.plan = token.plan
        sessionUser.suspended = token.suspended
        sessionUser.createdAt = token.createdAt

        if (token.name) sessionUser.name = token.name
        if (token.email) sessionUser.email = token.email
        if (token.picture) sessionUser.image = token.picture
      }
      return session
    },
  },
  events: {
    // C2: normal sign-outs must delete the hand-rolled Session row,
    // otherwise the table fills with orphans and "revocation" never happens.
    // Auth.js v5 passes { session, token } for JWT-strategy signOut.
    async signOut(message) {
      try {
        const token = (message as any)?.token as { sessionToken?: unknown } | undefined
        const session = (message as any)?.session as { sessionToken?: unknown } | undefined
        const sessionToken = token?.sessionToken ?? session?.sessionToken
        if (typeof sessionToken === "string" && sessionToken.length > 0) {
          await prisma.session.deleteMany({ where: { sessionToken } })
        }
      } catch {
        // Cleanup is best-effort — never fail sign-out because of it
      }
    },
  },
})

export const { handlers, signIn, signOut } = nextAuth

// Shared middleware/proxy wrapper — same NextAuth instance, so JWT
// verification can never drift from the app config (fixes M2).
export const authMiddleware = nextAuth.auth

export async function auth(): Promise<Session | null> {
  const session = await nextAuth.auth()
  
  if (!session || Object.keys(session).length === 0) return null

  if (session?.user?.suspended) {
    if (session.sessionToken) {
      await prisma.session.deleteMany({
        where: {
          sessionToken: session.sessionToken,
          userId: session.user.id,
        },
      })
    }
    return null
  }

  if (session?.user?.id && session?.sessionToken) {
    // P1 perf: activity tracking is best-effort — never block the response
    // on a DB write. With 400ms+ DB latency this await cost every API call
    // and page load a full extra round trip. Errors are swallowed inside
    // the throttled writer (it no-ops within the 5-min window).
    void touchCurrentSession(session.user.id, session.sessionToken).catch(() => {})
  }

  return session
}
