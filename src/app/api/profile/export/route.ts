import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { profileMutationLimiter } from "@/lib/rate-limit"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success, reset } = await profileMutationLimiter.limit(session.user.id)
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
      )
    }

    const userId = session.user.id

    const [user, documents, analyses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          createdAt: true,
        },
      }),
      prisma.document.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          fileType: true,
          fileSize: true,
          status: true,
          language: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.analysis.findMany({
        where: { userId },
        select: {
          id: true,
          documentId: true,
          summary: true,
          plainLanguage: true,
          topRedFlags: true,
          importantClauses: true,
          contractScore: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user,
      documents,
      analyses,
      totalDocuments: documents.length,
      totalAnalyses: analyses.length,
    })
  } catch (err) {
    console.error("[profile/export]", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
