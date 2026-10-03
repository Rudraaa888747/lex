import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

const PAGE_SIZE = 50

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || String(PAGE_SIZE), 10) || PAGE_SIZE,
      100
    )
    const cursor = url.searchParams.get("cursor")
    const action = url.searchParams.get("action")

    const where: { id?: { lt: string }; action?: string } = {}
    if (cursor) where.id = { lt: cursor }
    if (action) where.action = action

    const rows = await prisma.auditLog.findMany({
      where,
      orderBy: [{ id: "desc" }],
      take: limit + 1,
      select: {
        id: true,
        userId: true,
        action: true,
        details: true,
        ip: true,
        createdAt: true,
      },
    })

    const hasMore = rows.length > limit
    const page = hasMore ? rows.slice(0, limit) : rows

    return Response.json({
      logs: page.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? page[page.length - 1].id : null,
      hasMore,
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
