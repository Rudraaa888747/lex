import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"
import { SettingsClient } from "./SettingsClient"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true },
  })

  const defaults = {
    language: "EN",
    analysisReminders: false,
    productUpdates: true,
    dataCollection: false,
  }

  let prefs = defaults
  if (user?.preferences) {
    try {
      prefs = { ...defaults, ...(typeof user.preferences === "string" ? JSON.parse(user.preferences) : user.preferences) }
    } catch {
      prefs = defaults
    }
  }

  return <SettingsClient initialSettings={prefs} />
}
