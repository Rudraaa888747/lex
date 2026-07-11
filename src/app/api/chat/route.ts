import { apiError } from "@/lib/api-error"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { chatWithDocument } from "@/services/ai.service"
import { chatLimiter } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, documentId } = await request.json()

    const { success, limit, remaining, reset } = await chatLimiter.limit(session.user.id)
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
      const document = await prisma.document.findFirst({
        where: { id: documentId, userId: session.user.id },
      })
      if (document?.content) {
        context = document.content
        docLanguage = document.language || "EN"
      }
    }

    const response = await chatWithDocument(message, context, docLanguage)

    return Response.json({ response, success: true })
  } catch (error) {
    return apiError(error, "Chat failed", 500)
  }
}
