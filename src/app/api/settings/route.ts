import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    })

    const defaults = {
      language: "EN",
      analysisReminders: false,
      productUpdates: true,
      dataCollection: false,
    }

    let prefs = defaults
    if (user?.preferences) {
      try {
        prefs = { ...defaults, ...(typeof user.preferences === "string" ? JSON.parse(user.preferences) : user.preferences) }
      } catch {
        prefs = defaults
      }
    }

    return NextResponse.json({ settings: prefs })
  } catch (err) {
    console.error("[settings GET]", err)
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const validLanguages = ["EN", "HI", "GU"]
    if (body.language && !validLanguages.includes(body.language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 })
    }

    const sanitized = {
      language: validLanguages.includes(body.language) ? body.language : "EN",
      analysisReminders: Boolean(body.analysisReminders),
      productUpdates: Boolean(body.productUpdates),
      dataCollection: Boolean(body.dataCollection),
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { preferences: JSON.stringify(sanitized) },
    })

    return NextResponse.json({ settings: sanitized, success: true })
  } catch (err) {
    console.error("[settings PATCH]", err)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
