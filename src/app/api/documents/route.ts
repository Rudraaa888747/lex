import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [documents, totalAnalyses] = await prisma.$transaction([
      prisma.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          title: true,
          type: true,
          fileType: true,
          fileSize: true,
          status: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          // content excluded — too large for list view
        },
      }),
      prisma.analysis.count({
        where: { userId: session.user.id },
      }),
    ])

    return Response.json({
      documents,
      total: documents.length,
      totalAnalyses,
      recentActivity: documents.slice(0, 10),
    })
  } catch (error) {
    console.error("Documents fetch error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
