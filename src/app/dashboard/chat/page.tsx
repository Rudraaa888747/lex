import { Suspense } from "react"
import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { ChatClient } from "./ChatClient"
import { Loader2 } from "lucide-react"

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

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20" role="status" aria-label="Loading chat">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      }
    >
      <ChatClient initialDocuments={documents} />
    </Suspense>
  )
}
