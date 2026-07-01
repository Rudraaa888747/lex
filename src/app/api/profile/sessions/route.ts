import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"

function parseDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown"
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/\d+/)
  const osMatch = userAgent.match(/\(([^)]+)\)/)
  const os = osMatch ? osMatch[1].split(";")[0] : ""
  return [browser?.[1], os].filter(Boolean).join(" · ") || "Unknown"
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbSessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { lastActive: "desc" },
    })

    const currentToken = session.sessionToken

    const formatted = dbSessions.map((s) => ({
      id: s.id,
      device: parseDevice(s.userAgent),
      userAgent: s.userAgent,
      ip: s.ip,
      createdAt: s.createdAt,
      expiresAt: s.expires,
      lastActive: s.lastActive || s.createdAt,
      isCurrent: s.sessionToken === currentToken,
    }))

    return NextResponse.json({ sessions: formatted })
  } catch (err) {
    console.error("[sessions GET]", err)
    return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentToken = session.sessionToken

    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        NOT: currentToken ? { sessionToken: currentToken } : undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[sessions DELETE all]", err)
    return NextResponse.json({ error: "Failed to revoke sessions" }, { status: 500 })
  }
}
