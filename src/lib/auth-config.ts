import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type DefaultSession, type Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./database"
import { touchCurrentSession } from "./session-metadata"
import { getRequestMetadata } from "./request-metadata"

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

        const email = credentials.email as string
        const password = credentials.password as string

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
          
          const reqMeta = await getRequestMetadata()
          
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
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: token.sessionToken as string },
            select: { id: true }
          })
          if (!dbSession) return {} as Session // Revoked
          session.sessionToken = token.sessionToken as string
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
})

export const { handlers, signIn, signOut } = nextAuth

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
    await touchCurrentSession(session.user.id, session.sessionToken)
  }

  return session
}
