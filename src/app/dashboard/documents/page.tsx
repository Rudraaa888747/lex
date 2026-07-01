import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { DocumentListClient } from "./DocumentListClient"

export default async function DocumentsListPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      fileSize: true,
      status: true,
      createdAt: true,
    },
  })

  // Format the document data for the client component
  const formattedDocuments = documents.map(doc => ({
    ...doc,
    createdAt: doc.createdAt.toISOString(),
  }))

  return <DocumentListClient initialDocuments={formattedDocuments} />
}
