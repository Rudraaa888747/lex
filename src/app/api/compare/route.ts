import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { compareDocuments } from "@/services/ai.service"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentIds } = await request.json()

    if (!documentIds || documentIds.length < 2) {
      return Response.json({ error: "At least 2 document IDs required" }, { status: 400 })
    }

    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds }, userId: session.user.id },
    })

    if (documents.length < 2) {
      return Response.json({ error: "Documents not found" }, { status: 404 })
    }

    const docs = documents.map((d) => ({ title: d.title, content: d.content || "" }))
    const result = await compareDocuments(docs)

    await prisma.comparison.create({
      data: {
        userId: session.user.id,
        documentIds: documentIds.join(","),
        result: JSON.stringify(result),
        status: "COMPLETED",
      },
    })

    return Response.json({ result, success: true })
  } catch (error) {
    console.error("Compare error:", error)
    return Response.json({ error: "Comparison failed" }, { status: 500 })
  }
}
