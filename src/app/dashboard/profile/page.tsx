import { getAuth } from "@/lib/auth-cached"
import { redirect } from "next/navigation"
import { ProfileClient } from "./ProfileClient"

export default async function ProfilePage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  return <ProfileClient />
}
