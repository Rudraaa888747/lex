import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [totalUsers, documents, analyses, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.analysis.count(),
      prisma.user.count({ where: { role: "USER" } }),
    ])

    return Response.json({
      totalUsers,
      activeUsers,
      totalDocuments: documents,
      totalAnalyses: analyses,
      revenue: analyses * 0.01,
      aiUsage: analyses,
      storageUsed: Math.round((documents * 0.5) * 10) / 10,
      errorRate: 0.5,
    }, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
      }
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
