import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

const PAGE_SIZE = 50

function encodeCursor(user: { createdAt: Date; id: string }) {
  return Buffer.from(JSON.stringify({ createdAt: user.createdAt.toISOString(), id: user.id })).toString("base64")
}

function decodeCursor(cursor: string | null) {
  if (!cursor) return null
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString())
    if (parsed && typeof parsed.id === "string" && typeof parsed.createdAt === "string") {
      return { createdAt: new Date(parsed.createdAt), id: parsed.id }
    }
  } catch {
    return null
  }
  return null
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || String(PAGE_SIZE), 10) || PAGE_SIZE, 100)
    const cursor = decodeCursor(url.searchParams.get("cursor"))

    const where = cursor
      ? {
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { createdAt: { equals: cursor.createdAt }, id: { lt: cursor.id } },
          ],
        }
      : {}

    const users = await prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        suspended: true,
        createdAt: true,
        emailVerified: true,
        image: true,
      },
    })

    const hasMore = users.length > limit
    const pageUsers = hasMore ? users.slice(0, limit) : users
    const nextCursor = hasMore ? encodeCursor(pageUsers[pageUsers.length - 1]) : null

    return Response.json({
      users: pageUsers.map((user) => ({
        ...user,
        emailVerified: Boolean(user.emailVerified),
        createdAt: user.createdAt.toISOString(),
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
