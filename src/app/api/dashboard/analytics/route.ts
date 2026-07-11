import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

function monthKey(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Perform database-level aggregations for totals
    const [
      docAgg, 
      analysisCount, 
      readyDocs, 
      completedDocs,
      recentDocuments,
      recentAnalyses
    ] = await prisma.$transaction([
      prisma.document.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { fileSize: true },
      }),
      prisma.analysis.count({ where: { userId } }),
      prisma.document.count({ where: { userId, status: "READY_FOR_ANALYSIS" } }),
      prisma.document.count({ where: { userId, status: "COMPLETED" } }),
      // Only fetch lightweight data for the last 6 months for graphs
      prisma.document.findMany({
        where: { userId, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.analysis.findMany({
        where: { userId, createdAt: { gte: sixMonthsAgo } },
        select: { contractScore: true, riskAssessment: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      })
    ])

    const totalDocuments = docAgg._count.id || 0;
    const totalFileSize = docAgg._sum.fileSize || 0;

    const monthlyMap = new Map<string, number>()
    const trendMap = new Map<string, number>()
    const now = new Date()

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      monthlyMap.set(monthKey(date), 0)
      trendMap.set(monthKey(date), 0)
    }

    for (const document of recentDocuments) {
      const key = monthKey(document.createdAt)
      if (monthlyMap.has(key)) monthlyMap.set(key, monthlyMap.get(key)! + 1)
    }

    let highRisk = 0
    let mediumRisk = 0
    let lowRisk = 0
    let totalScore = 0
    let scoredAnalyses = 0

    for (const analysis of recentAnalyses) {
      const key = monthKey(analysis.createdAt)
      if (trendMap.has(key)) trendMap.set(key, trendMap.get(key)! + 1)

      const redFlags = parseJson<Array<{ severityScore?: number }>>(analysis.riskAssessment, [])
      for (const flag of redFlags) {
        const severity = flag.severityScore || 0
        if (severity >= 8) highRisk += 1
        else if (severity >= 5) mediumRisk += 1
        else lowRisk += 1
      }

      const scoreCard = parseJson<{ score?: number; breakdown?: { overallScore?: number } }>(analysis.contractScore, {})
      const score = scoreCard.score ?? scoreCard.breakdown?.overallScore
      if (typeof score === "number") {
        totalScore += score
        scoredAnalyses += 1
      }
    }

    return Response.json({
      totals: {
        documents: totalDocuments,
        analyses: analysisCount,
        avgScore: scoredAnalyses ? Number((totalScore / scoredAnalyses).toFixed(1)) : 0,
        avgFileSizeMb: totalDocuments
          ? Number((totalFileSize / totalDocuments / 1024 / 1024).toFixed(2))
          : 0,
      },
      riskDistribution: [
        { name: "High", value: highRisk },
        { name: "Medium", value: mediumRisk },
        { name: "Low", value: lowRisk },
      ],
      monthlyActivity: Array.from(monthlyMap, ([name, uploads]) => ({ name, uploads })),
      analysisTrends: Array.from(trendMap, ([name, analysesCount]) => ({ name, analyses: analysesCount })),
      userInsights: {
        plan: session.user.plan,
        readyDocuments: readyDocs,
        completedDocuments: completedDocs,
      },
    })
  } catch (error) {
    return apiError(error, "Failed to load analytics", 500)
  }
}
