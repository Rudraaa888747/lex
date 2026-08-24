import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { COST_PER_1K_TOKENS } from "@/lib/ai-pricing"

// Analysis window for all metrics below: last 30 days.
const WINDOW_DAYS = 30

function sinceDate() {
  const d = new Date()
  d.setDate(d.getDate() - WINDOW_DAYS)
  return d
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.floor(day / 30)
  return `${mo}mo ago`
}

function pctChange(cur: number, prev: number): number | null {
  if (prev === 0 && cur === 0) return null
  if (prev === 0) return 100
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

async function windowMetrics(start: Date, end: Date) {
  const [agg, completed, failed, chatCount, compareCount] = await Promise.all([
    prisma.analysis.aggregate({
      _sum: { tokensUsed: true },
      _count: { _all: true },
      where: { createdAt: { gte: start, lt: end } },
    }),
    prisma.analysis.count({ where: { createdAt: { gte: start, lt: end }, status: "COMPLETED" } }),
    prisma.analysis.count({ where: { createdAt: { gte: start, lt: end }, status: "FAILED" } }),
    prisma.chatSession.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.comparison.count({ where: { createdAt: { gte: start, lt: end } } }),
  ])

  const analysisCount = agg._count._all
  const totalRequests = analysisCount + chatCount + compareCount
  const tokenConsumption = agg._sum.tokensUsed ?? 0
  const resolved = completed + failed
  const successRate = resolved > 0 ? Math.round((completed / resolved) * 1000) / 10 : 100
  const totalCost = (tokenConsumption / 1000) * COST_PER_1K_TOKENS
  const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0

  return { totalRequests, tokenConsumption, successRate, avgCostPerRequest }
}

function buildDailyRequests(
  analysisDates: { createdAt: Date }[],
  chatDates: { createdAt: Date }[],
  compareDates: { createdAt: Date }[]
) {
  const map = new Map<string, number>()
  for (const d of [...analysisDates, ...chatDates, ...compareDates]) {
    const key = d.createdAt.toISOString().slice(0, 10)
    map.set(key, (map.get(key) || 0) + 1)
  }

  const days: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    days.push({ date: label, count: map.get(key) || 0 })
  }
  return days
}

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const since = sinceDate()
    const prevUntil = since
    const prevSince = new Date(since)
    prevSince.setDate(prevSince.getDate() - WINDOW_DAYS)

    const [
      cur,
      prev,
      analysisDates,
      chatDates,
      compareDates,
      analysisRecent,
      chatRecent,
      compareRecent,
    ] = await Promise.all([
      windowMetrics(since, new Date()),
      windowMetrics(prevSince, prevUntil),
      prisma.analysis.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.chatSession.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.comparison.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.analysis.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          tokensUsed: true,
          status: true,
          createdAt: true,
          document: { select: { title: true } },
        },
      }),
      prisma.chatSession.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.comparison.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, documentIds: true, status: true, createdAt: true },
      }),
    ])

    const trends = {
      requests: pctChange(cur.totalRequests, prev.totalRequests),
      tokens: pctChange(cur.tokenConsumption, prev.tokenConsumption),
      avgCost: pctChange(cur.avgCostPerRequest, prev.avgCostPerRequest),
      successRate: pctChange(cur.successRate, prev.successRate),
    }

    const dailyRequests = buildDailyRequests(analysisDates, chatDates, compareDates)

    const recentRequests = [
      ...analysisRecent.map((a) => ({
        type: "Analysis" as const,
        subject: a.document?.title || "Untitled document",
        tokens: a.tokensUsed,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      })),
      ...chatRecent.map((c) => ({
        type: "Chat" as const,
        subject: c.title || "Chat session",
        tokens: 0,
        status: "COMPLETED",
        createdAt: c.createdAt.toISOString(),
      })),
      ...compareRecent.map((c) => ({
        type: "Compare" as const,
        subject: `${c.documentIds ? c.documentIds.split(",").length : 0} documents`,
        tokens: 0,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((r) => ({ ...r, time: relativeTime(r.createdAt) }))

    return Response.json(
      {
        totalRequests: cur.totalRequests,
        tokenConsumption: cur.tokenConsumption,
        avgCostPerRequest: cur.avgCostPerRequest,
        successRate: cur.successRate,
        windowDays: WINDOW_DAYS,
        trends,
        dailyRequests,
        recentRequests,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
