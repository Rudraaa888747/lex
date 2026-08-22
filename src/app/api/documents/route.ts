import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

const PAGE_SIZE = 12

function encodeCursor(doc: { createdAt: Date; id: string }) {
  return Buffer.from(JSON.stringify({ createdAt: doc.createdAt.toISOString(), id: doc.id })).toString("base64")
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
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || String(PAGE_SIZE), 10) || PAGE_SIZE, 50)
    const cursor = decodeCursor(url.searchParams.get("cursor"))

    const where = cursor
      ? {
          userId: session.user.id,
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { createdAt: { equals: cursor.createdAt }, id: { lt: cursor.id } },
          ],
        }
      : { userId: session.user.id }

    const [documents, totalAnalyses] = await prisma.$transaction([
      prisma.document.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        select: {
          id: true,
          title: true,
          type: true,
          fileType: true,
          fileSize: true,
          status: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.analysis.count({
        where: { userId: session.user.id },
      }),
    ])

    const hasMore = documents.length > limit
    const pageDocs = hasMore ? documents.slice(0, limit) : documents
    const nextCursor = hasMore ? encodeCursor(pageDocs[pageDocs.length - 1]) : null

    return Response.json({
      documents: pageDocs,
      nextCursor,
      hasMore,
      totalAnalyses,
      recentActivity: pageDocs.slice(0, 10),
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
