import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const target = await prisma.session.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!target || target.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    await prisma.session.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[sessions DELETE one]", err)
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 })
  }
}
