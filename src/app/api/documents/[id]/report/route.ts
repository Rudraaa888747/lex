import { apiError } from "@/lib/api-error"
import { auth } from "@/lib/auth-config"
import { buildAnalysisReportPdf } from "@/lib/report"
import { isPremiumPlan } from "@/lib/subscription"
import { prisma } from "@/lib/database"

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isPremiumPlan(session.user.plan)) {
      return Response.json(
        { error: "Report Download is available for Premium members only." },
        { status: 403 },
      )
    }

    const { id } = await params
    const document = await prisma.document.findFirst({
      where: { id, userId: session.user.id },
      include: { analyses: { take: 1, orderBy: { createdAt: "desc" } } },
    })

    if (!document) {
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    const analysis = document.analyses[0]
    if (!analysis) {
      return Response.json({ error: "Analysis is not ready yet" }, { status: 409 })
    }

    const redFlags = parseJson<Array<{ title?: string; explanation?: string }>>(analysis.topRedFlags, [])
      .map((flag) => [flag.title, flag.explanation].filter(Boolean).join(": "))

    const pdfBytes = await buildAnalysisReportPdf({
      documentTitle: document.title,
      createdAt: analysis.createdAt.toISOString(),
      summary: analysis.summary,
      plainLanguage: analysis.plainLanguage,
      redFlags,
    })

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.title.replace(/[^a-zA-Z0-9-_]/g, "_")}-report.pdf"`,
      },
    })
  } catch (error) {
    return apiError(error, "Failed to generate report", 500)
  }
}
