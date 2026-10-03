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

    const rows = await prisma.subscription.findMany({
      where: cursor ? { userId: { gt: cursor } } : {},
      orderBy: [{ userId: "asc" }],
      take: limit + 1,
      include: {
        user: { select: { id: true, name: true, email: true, plan: true } },
      },
    })

    const hasMore = rows.length > limit
    const page = hasMore ? rows.slice(0, limit) : rows

    const planCounts = await prisma.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
    })

    return Response.json({
      subscriptions: page.map((s) => ({
        id: s.id,
        userId: s.userId,
        name: s.user.name || "Unknown",
        email: s.user.email,
        // Source of truth for billing is the Subscription row; fall back
        // to the User plan when rows disagree so the admin sees the drift.
        plan: s.plan,
        userPlan: s.user.plan,
        status: s.status,
        billingCycle: s.billingCycle,
        currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
        updatedAt: s.updatedAt.toISOString(),
      })),
      planCounts: Object.fromEntries(planCounts.map((c) => [c.plan, c._count.plan])),
      nextCursor: hasMore ? page[page.length - 1].userId : null,
      hasMore,
    })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
