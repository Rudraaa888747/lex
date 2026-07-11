import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { extractDocumentTextFromBuffer } from "@/lib/document-processing"
import { PRIVATE_DOCUMENT_BUCKET, removeStoredDocuments, supabaseAdmin } from "@/lib/supabase-admin"
import { PLAN_LIMITS } from "@/lib/subscription"
import { documentUploadLimiter } from "@/lib/rate-limit"
import { apiError } from "@/lib/api-error"

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg"])

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success, limit: rateLimit, remaining, reset } = await documentUploadLimiter.limit(session.user.id)
    if (!success) {
      return Response.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
      )
    }

    const formData = await request.formData()

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const userPlan = session.user.plan || "FREE"
    const limit = PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.FREE

    const currentMonthCount = await prisma.document.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } }
    })

    if (currentMonthCount >= limit) {
      return Response.json({ error: `You've reached your monthly document limit for the ${userPlan} plan. Upgrade to upload more.` }, { status: 403 })
    }

    const file = formData.get("file") as File
    const language = formData.get("language") as string

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (!language || !["EN", "HI", "GU"].includes(language)) {
      return Response.json({ error: "A valid language (EN, HI, GU) must be selected" }, { status: 400 })
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || ""
    const validMimes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/png", "image/jpeg"]
    const validExts = ["pdf", "docx", "txt", "png", "jpg", "jpeg"]

    if (!validExts.includes(ext) || !validMimes.includes(file.type)) {
      return Response.json({ error: "Invalid file type. Supported: PDF, DOCX, TXT, PNG, JPG" }, { status: 400 })
    }

    if (file.size > 30 * 1024 * 1024) {
      return Response.json({ error: "File exceeds 30MB limit to ensure stable processing" }, { status: 400 })
    }

    const sanitizeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")
    const objectPath = `${session.user.id}/documents/${Date.now()}-${sanitizeFilename}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const initialStatus = IMAGE_EXTENSIONS.has(ext) ? "OCR_PROCESSING" : "PROCESSING"

    const fileTypeMap: Record<string, string> = {
      pdf: "PDF",
      docx: "DOCX",
      txt: "TXT",
      png: "PNG",
      jpg: "JPEG",
      jpeg: "JPEG",
    }

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        title: file.name,
        fileType: fileTypeMap[ext] || "PDF",
        fileSize: file.size,
        filePath: objectPath,
        language: language,
        status: initialStatus,
      },
    })

    try {
      const { text: extractedText, isOcrFallback } = await extractDocumentTextFromBuffer({
        buffer: fileBuffer,
        fileExtension: ext,
        language,
      })

      if (!extractedText) {
        throw new Error("No readable text could be extracted from the uploaded document")
      }

      const { validateContent } = await import("@/services/ai.service")
      const isValid = validateContent(extractedText)

      if (!isValid) {
        throw new Error("Document contains no readable text. We tried extracting text and running OCR, but the quality is too poor. Please provide a clearer document.")
      }

      const { error: uploadError } = await supabaseAdmin.storage
        .from(PRIVATE_DOCUMENT_BUCKET)
        .upload(objectPath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      await prisma.document.update({
        where: { id: document.id },
        data: {
          content: extractedText,
          status: "READY_FOR_ANALYSIS",
        },
      })
    } catch (error) {
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "FAILED" },
      })

      try {
        await removeStoredDocuments([objectPath])
      } catch (cleanupError) {
        console.error("Storage cleanup error after failed processing:", cleanupError)
      }

      throw error
    }

    // Re-fetch document to return the updated content
    const updatedDocument = await prisma.document.findUnique({ where: { id: document.id } })

    return Response.json({ document: updatedDocument, success: true }, { status: 201 })
  } catch (error) {
    return apiError(error, "Upload failed", 500)
  }
}
