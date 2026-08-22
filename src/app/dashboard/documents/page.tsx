import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { DocumentListClient } from "./DocumentListClient"

const PAGE_SIZE = 12

function encodeCursor(doc: { createdAt: Date; id: string }) {
  return Buffer.from(JSON.stringify({ createdAt: doc.createdAt.toISOString(), id: doc.id })).toString("base64")
}

export default async function DocumentsListPage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE + 1,
    select: {
      id: true,
      title: true,
      type: true,
      fileSize: true,
      status: true,
      createdAt: true,
    },
  })

  const hasMore = documents.length > PAGE_SIZE
  const pageDocs = hasMore ? documents.slice(0, PAGE_SIZE) : documents
  const nextCursor = hasMore ? encodeCursor(pageDocs[pageDocs.length - 1]) : null

  // Format the document data for the client component
  const formattedDocuments = pageDocs.map((doc: { id: string; title: string; type: string; fileSize: number | null; status: string; createdAt: Date; }) => ({
    ...doc,
    fileSize: doc.fileSize || 0,
    createdAt: doc.createdAt.toISOString(),
  }))

  return <DocumentListClient initialDocuments={formattedDocuments} initialCursor={nextCursor} hasMoreInitial={hasMore} />
}
