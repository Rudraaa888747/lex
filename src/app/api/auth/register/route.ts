import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/database"
import { registerLimiter } from "@/lib/rate-limit"
import { getRequestMetadata } from "@/lib/request-metadata"

export async function POST(request: NextRequest) {
  try {
    const { ip } = await getRequestMetadata()
    const { success, limit, remaining, reset } = await registerLimiter.limit(ip)

    if (!success) {
      return Response.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
      )
    }

    const { name, email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }

    const sanitizedName = name ? String(name).trim().substring(0, 100).replace(/<[^>]*>/g, "") : null
    const sanitizedEmail = email.trim().toLowerCase()

    if (!sanitizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    if (password.length > 128) {
      return Response.json({ error: "Password too long" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
      },
    })

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        status: "ACTIVE",
      },
    })

    return Response.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    return apiError(error, "Internal server error", 500)
  }
}
