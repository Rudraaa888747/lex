import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (email !== session.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim(), email: email.trim() },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error("[profile/update]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
