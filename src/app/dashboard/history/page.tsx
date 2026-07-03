import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { HistoryClient } from "./HistoryClient"

export default async function HistoryPage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      createdAt: true,
    },
  })

  const activities = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    action: "Document uploaded",
    type: doc.type,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }))

  return <HistoryClient initialActivities={activities} />
}
