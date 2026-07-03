import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { analyzeDocument, validateContent } from "@/services/ai.service"
import { buildContractScoreCard } from "@/lib/analysis-contract"

export const maxDuration = 60

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let sessionUserId: string | null = null

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    sessionUserId = session.user.id

    const { id } = await params

    const document = await prisma.document.findFirst({
      where: { id, userId: session.user.id },
      include: { analyses: { take: 1 } }
    })

    if (!document) {
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    if (document.status === "PROCESSING" || document.status === "OCR_PROCESSING") {
      return Response.json({ error: "Document is still processing. Please wait." }, { status: 409 })
    }

    if (document.status === "ANALYZING") {
      return Response.json({ error: "Document is currently being analyzed." }, { status: 409 })
    }

    if (document.analyses && document.analyses.length > 0) {
      return Response.json({ analysis: document.analyses[0], success: true, existing: true })
    }

    const content = document.content || ""

    if (!validateContent(content)) {
      console.warn(`[Analyze] REJECTED doc=${id} contentLen=${content.length} valid=false`)
      return Response.json({
        error: "Document contains no readable text. Please upload a PDF, DOCX, or TXT file with selectable text content."
      }, { status: 400 })
    }

    const claim = await prisma.document.updateMany({
      where: {
        id,
        userId: session.user.id,
        status: { in: ["READY_FOR_ANALYSIS", "READY_FOR_ANALYSIS_LOW_CONFIDENCE"] },
      },
      data: { status: "ANALYZING" },
    })

    if (claim.count !== 1) {
      const current = await prisma.document.findFirst({
        where: { id, userId: session.user.id },
        include: { analyses: { take: 1 } },
      })

      if (current?.analyses?.[0]) {
        return Response.json({ analysis: current.analyses[0], success: true, existing: true })
      }

      if (current?.status === "ANALYZING") {
        return Response.json({ success: true, status: "ANALYZING", message: "Analysis already in progress." })
      }

      return Response.json({ error: "Document is not ready for analysis." }, { status: 409 })
    }

    // FIRE AND FORGET THE ANALYSIS
    const runAnalysis = async () => {
      try {
        const analysisData = await analyzeDocument(content, document.title, document.language)

        await prisma.$transaction(async (tx) => {
          const existing = await tx.analysis.findUnique({
            where: { documentId: id },
          })

          if (existing) {
            await tx.document.updateMany({
              where: { id, userId: sessionUserId! },
              data: { status: "COMPLETED" },
            })
            return existing
          }

          const created = await tx.analysis.create({
            data: {
              documentId: id,
              userId: sessionUserId!,
              summary: analysisData.executiveSummary || "",
              plainLanguage: analysisData.plainLanguage || "",
              keyClauses: JSON.stringify(analysisData.importantClauses || []),
              rightsObligations: JSON.stringify(analysisData.rightsObligations || {}),
              importantDates: JSON.stringify(analysisData.importantDates || []),
              financialTerms: JSON.stringify(analysisData.financialAnalysis || {}),
              riskAssessment: JSON.stringify(analysisData.topRedFlags || []),
              topRedFlags: JSON.stringify(analysisData.topRedFlags || []),
              importantClauses: JSON.stringify(analysisData.importantClauses || []),
              beforeYouSign: JSON.stringify(analysisData.beforeYouSign || {}),
              legalInsights: JSON.stringify(analysisData.legalInsights || {}),
              contractScore: JSON.stringify(buildContractScoreCard(analysisData.contractScore)),
              conflictOfInterest: JSON.stringify(analysisData.conflictOfInterest || {}),
              favorableClauses: JSON.stringify(analysisData.favorableClauses || []),
              jurisdictionInsights: JSON.stringify(analysisData.jurisdictionInsights || {}),
              language: document.language || "EN",
              status: "COMPLETED",
              tokensUsed: 1500,
            },
          })

          await tx.document.updateMany({
            where: { id, userId: sessionUserId!, status: "ANALYZING" },
            data: { status: "COMPLETED" },
          })

          return created
        })
      } catch (error) {
        console.error("[Analyze Background Error]:", error)
        await prisma.document.updateMany({
          where: {
            id,
            userId: sessionUserId!,
            status: "ANALYZING",
            analyses: { none: {} },
          },
          data: { status: "FAILED" }
        }).catch(() => {})
      }
    };

    // Start background task without awaiting it
    runAnalysis();

    return Response.json({ success: true, status: "ANALYZING", message: "Analysis started in the background." })
  } catch (error) {
    const { id } = await params
    await prisma.document.updateMany({
      where: {
        id,
        userId: sessionUserId || undefined,
        status: "ANALYZING",
        analyses: { none: {} },
      },
      data: { status: "READY_FOR_ANALYSIS" }
    }).catch(() => {})

    const message = error instanceof Error ? error.message : "Analysis failed"
    console.error("Analysis error:", message)
    return Response.json({ error: message }, { status: 500 })
  }
}
