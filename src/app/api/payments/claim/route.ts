import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { getRequestMetadata } from "@/lib/request-metadata"

export const maxDuration = 30

const ALLOWED_PLANS = ["PROFESSIONAL", "BUSINESS", "ENTERPRISE"] as const

// Records a UPI payment claim for manual admin verification.
// No money moves here — the row lands in AuditLog so admins can verify
// the UTR and upgrade the plan. Never trust the client amount blindly:
// it is stored as-claimed for the admin to cross-check.
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Request body is required" }, { status: 400 })
    }

    const { planName, amount, utr } = body as {
      planName?: unknown
      amount?: unknown
      utr?: unknown
    }

    if (typeof planName !== "string" || !(ALLOWED_PLANS as readonly string[]).includes(planName)) {
      return Response.json(
        { error: `Invalid plan. Allowed: ${ALLOWED_PLANS.join(", ")}` },
        { status: 400 }
      )
    }
    if (typeof utr !== "string" || !/^\d{12}$/.test(utr.trim())) {
      return Response.json(
        { error: "Enter the 12-digit UPI Transaction ID / UTR number." },
        { status: 400 }
      )
    }
    if (typeof amount !== "string" || amount.trim().length === 0 || amount.trim().length > 32) {
      return Response.json({ error: "Invalid amount." }, { status: 400 })
    }

    // One pending claim per user+UTR — resubmits return the existing claim.
    const normalizedUtr = utr.trim()
    const details = JSON.stringify({
      planName,
      amountClaimed: amount.trim(),
      utr: normalizedUtr,
      status: "PENDING_VERIFICATION",
      email: session.user.email ?? null,
    })
    const existing = await prisma.auditLog.findFirst({
      where: {
        userId: session.user.id,
        action: "payment.claim",
        details,
      },
      select: { id: true, createdAt: true },
    })
    if (existing) {
      return Response.json({ success: true, claimId: existing.id, duplicate: true })
    }

    let ip = "Unknown"
    try {
      ip = (await getRequestMetadata()).ip
    } catch {
      // best-effort
    }

    const claim = await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "payment.claim",
        details,
        ip,
      },
    })

    return Response.json({ success: true, claimId: claim.id }, { status: 201 })
  } catch (error) {
    return apiError(error, "Failed to submit payment claim", 500)
  }
}
