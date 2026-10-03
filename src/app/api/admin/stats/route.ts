import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [totalUsers, totalDocuments, totalAnalyses, nonSuspendedUsers, failedAnalyses, fileSizeAgg, pendingClaims] =
      await Promise.all([
        prisma.user.count(),
        prisma.document.count(),
        prisma.analysis.count(),
        prisma.user.count({ where: { suspended: false } }),
        prisma.analysis.count({ where: { status: "FAILED" } }),
        prisma.document.aggregate({ _sum: { fileSize: true } }),
        prisma.auditLog.count({ where: { action: "payment.claim" } }),
      ])

    return Response.json({
      totalUsers,
      activeUsers: nonSuspendedUsers,
      totalDocuments,
      totalAnalyses,
      failedAnalyses,
      errorRate: totalAnalyses === 0 ? 0 : Math.round((failedAnalyses / totalAnalyses) * 1000) / 10,
      paymentClaims: pendingClaims,
      aiUsage: totalAnalyses,
      storageUsedGb: Math.round(((fileSizeAgg._sum.fileSize ?? 0) / 1024 ** 3) * 10) / 10,
    }, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
      }
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
