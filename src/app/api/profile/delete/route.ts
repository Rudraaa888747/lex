import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"
import { removeStoredDocuments } from "@/lib/supabase-admin"

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const documents = await prisma.document.findMany({
      where: { userId },
      select: { filePath: true },
    })

    const storedPaths = documents
      .map((document) => document.filePath)
      .filter((value): value is string => Boolean(value))

    if (storedPaths.length > 0) {
      await removeStoredDocuments(storedPaths)
    }

    await prisma.$transaction([
      prisma.analysis.deleteMany({ where: { userId } }),
      prisma.chatSession.deleteMany({ where: { userId } }),
      prisma.document.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[profile/delete]", err)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
