import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { ProfileClient } from "./ProfileClient"

function parseDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown"
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/\d+/)
  const osMatch = userAgent.match(/\(([^)]+)\)/)
  const os = osMatch ? osMatch[1].split(";")[0] : ""
  return [browser?.[1], os].filter(Boolean).join(" · ") || "Unknown"
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const dbSessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { lastActive: "desc" },
  })

  const currentToken = session.sessionToken

  const initialSessions = dbSessions.map((s) => ({
    id: s.id,
    device: parseDevice(s.userAgent),
    userAgent: s.userAgent,
    ip: s.ip,
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expires.toISOString(),
    lastActive: s.lastActive ? s.lastActive.toISOString() : s.createdAt.toISOString(),
    isCurrent: s.sessionToken === currentToken,
  }))

  return <ProfileClient initialSessions={initialSessions} />
}
