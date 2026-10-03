import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { CompareClient } from "./CompareClient"

export default async function ComparePage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const [documents, user] = await Promise.all([
    prisma.document.findMany({
      where: { userId: session.user.id, status: { not: "FAILED" } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        title: true,
        type: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    }),
  ])

  let language = "EN"
  try {
    const prefs = typeof user?.preferences === "string" ? JSON.parse(user.preferences) : user?.preferences
    if (prefs && typeof prefs.language === "string" && ["EN", "HI", "GU"].includes(prefs.language)) {
      language = prefs.language
    }
  } catch {
    // defaults stand
  }

  return <CompareClient initialDocuments={documents} initialLanguage={language} />
}
