import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { ChatClient } from "./ChatClient"

export default async function ChatPage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
    },
  })

  return <ChatClient initialDocuments={documents} />
}
