import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { chatWithDocument } from "@/services/ai.service"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, documentId } = await request.json()

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
    console.error("Chat error:", error)
    return Response.json({ error: "Chat failed" }, { status: 500 })
  }
}
