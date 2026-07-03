import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { CompareClient } from "./CompareClient"

export default async function ComparePage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
    },
  })

  return <CompareClient initialDocuments={documents} />
}
