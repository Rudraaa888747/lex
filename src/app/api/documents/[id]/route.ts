import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { removeStoredDocuments } from "@/lib/supabase-admin"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const document = await prisma.document.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!document) {
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    const analysis = document.status === "COMPLETED"
      ? await prisma.analysis.findFirst({
          where: { documentId: id },
          orderBy: { createdAt: "desc" },
        })
      : null

    return Response.json({ document, analysis })
  } catch (error) {
    console.error("Document fetch error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const document = await prisma.document.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true, filePath: true },
    })

    if (!document) {
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    if (document.filePath) {
      await removeStoredDocuments([document.filePath])
    }

    await prisma.document.delete({
      where: { id: document.id },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Document delete error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
