import { DashboardShell } from "@/components/layout/DashboardLayout"
import { auth } from "@/lib/auth-config"
import { redirect } from "next/navigation"

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return <DashboardShell>{children}</DashboardShell>
}
