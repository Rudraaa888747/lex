import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { chatWithDocument } from "@/services/ai.service"
import { chatLimiter } from "@/lib/rate-limit"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, documentId } = await request.json()

    const { success, reset } = await chatLimiter.limit(session.user.id)
    if (!success) {
      return Response.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
      )
    }

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 5000) {
      return Response.json({ error: "Message too long. Maximum 5000 characters." }, { status: 400 })
    }

    let context = ""
    let docLanguage = "EN"
    if (documentId) {
      if (typeof documentId !== "string") {
        return Response.json({ error: "Invalid documentId" }, { status: 400 })
      }
      // A8: explicit 404 when a selected doc is missing/empty instead of
      // silently answering as "General Chat" — avoids confusion and
      // confirms the doc belongs to this user.
      const document = await prisma.document.findFirst({
        where: { id: documentId, userId: session.user.id },
      })
      if (!document) {
        return Response.json({ error: "Document not found" }, { status: 404 })
      }
      if (!document.content) {
        return Response.json(
          { error: "Document text is not ready yet. Please wait for processing to finish." },
          { status: 409 }
        )
      }
      context = document.content
      docLanguage = document.language || "EN"
    }

    const response = await chatWithDocument(message, context, docLanguage)

    return Response.json({ response, success: true })
  } catch (error) {
    return apiError(error, "Chat failed", 500)
  }
}
