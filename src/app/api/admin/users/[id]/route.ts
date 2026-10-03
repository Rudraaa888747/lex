import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { getRequestMetadata } from "@/lib/request-metadata"

const ALLOWED_ROLES = ["USER", "ADMIN"] as const
const ALLOWED_PLANS = ["FREE", "PROFESSIONAL", "BUSINESS", "ENTERPRISE"] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Request body is required" }, { status: 400 })
    }
    const { suspended, plan, role } = body as {
      suspended?: unknown
      plan?: unknown
      role?: unknown
    }

    const updateData: Record<string, string | boolean> = {}
    if (typeof suspended === "boolean") updateData.suspended = suspended
    if (typeof plan === "string") {
      if (!(ALLOWED_PLANS as readonly string[]).includes(plan)) {
        return Response.json(
          { error: `Invalid plan. Allowed: ${ALLOWED_PLANS.join(", ")}` },
          { status: 400 }
        )
      }
      updateData.plan = plan
    }
    if (typeof role === "string") {
      if (!(ALLOWED_ROLES as readonly string[]).includes(role)) {
        return Response.json(
          { error: `Invalid role. Allowed: ${ALLOWED_ROLES.join(", ")}` },
          { status: 400 }
        )
      }
      updateData.role = role
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Forbid self-demote / self-suspend (prevents admin lockout)
    const isSelf = id === session.user?.id
    if (isSelf && (updateData.suspended === true || (typeof updateData.role === "string" && updateData.role !== "ADMIN"))) {
      return Response.json(
        { error: "You cannot suspend or demote your own admin account" },
        { status: 400 }
      )
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, suspended: true },
    })
    if (!target) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Protect the last active admin: never leave zero active admins
    const demotingAdmin =
      target.role === "ADMIN" &&
      (updateData.suspended === true ||
        (typeof updateData.role === "string" && updateData.role !== "ADMIN"))
    if (demotingAdmin) {
      const otherActiveAdmins = await prisma.user.count({
        where: { role: "ADMIN", suspended: false, id: { not: id } },
      })
      if (otherActiveAdmins === 0) {
        return Response.json(
          { error: "Cannot suspend or demote the last active admin" },
          { status: 400 }
        )
      }
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    // Keep the billing row in sync when the plan changes — User.plan gates
    // features while Subscription.plan is the billing record. Without this
    // the two drift apart (the subscriptions page flags the drift).
    if (typeof updateData.plan === "string") {
      await prisma.subscription.upsert({
        where: { userId: id },
        update: { plan: updateData.plan },
        create: { userId: id, plan: updateData.plan, status: "ACTIVE" },
      })
    }

    // C1: suspend / demote must revoke sessions immediately —
    // otherwise the JWT (30d) keeps working until expiry.
    const shouldRevoke =
      updateData.suspended === true ||
      (typeof updateData.role === "string" && updateData.role !== "ADMIN")
    if (shouldRevoke) {
      await prisma.session.deleteMany({ where: { userId: id } })
    }

    // Audit trail (best-effort — never fail the admin action because of it)
    try {
      const meta = await getRequestMetadata().catch(() => ({ ip: "Unknown", userAgent: "Unknown" }))
      await prisma.auditLog.create({
        data: {
          userId: session.user?.id ?? null,
          action: `admin.user.update:${id}`,
          details: JSON.stringify(updateData),
          ip: meta.ip,
        },
      })
    } catch {
      // ignore audit failures
    }

    return Response.json({ success: true })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
