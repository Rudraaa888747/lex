import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { compareDocuments } from "@/services/ai.service"
import { compareLimiter } from "@/lib/rate-limit"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentIds } = await request.json()

    const { success, reset } = await compareLimiter.limit(session.user.id)
    if (!success) {
      return Response.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
      )
    }

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length < 2) {
      return Response.json({ error: "At least 2 document IDs required" }, { status: 400 })
    }

    // A7: cap fan-out and reject malformed/empty inputs before spending AI tokens
    if (documentIds.length > 5) {
      return Response.json({ error: "Maximum 5 documents can be compared at once" }, { status: 400 })
    }
    if (!documentIds.every((id): id is string => typeof id === "string" && id.length > 0)) {
      return Response.json({ error: "Invalid document IDs" }, { status: 400 })
    }

    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds }, userId: session.user.id },
    })

    if (documents.length < 2) {
      return Response.json({ error: "Documents not found" }, { status: 404 })
    }

    const emptyDocs = documents.filter((d) => !d.content || !d.content.trim())
    if (emptyDocs.length > 0) {
      return Response.json(
        { error: "One or more documents have no readable text yet. Wait for processing to finish and retry." },
        { status: 409 }
      )
    }

    const docs = documents.map((d: { title: string; content: string | null }) => ({ title: d.title, content: d.content || "" }))
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
    return apiError(error, "Comparison failed", 500)
  }
}
