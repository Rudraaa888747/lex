import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { suspended, plan, role } = await request.json()

    const updateData: Record<string, any> = {}
    if (typeof suspended === "boolean") updateData.suspended = suspended
    if (plan) updateData.plan = plan
    if (role) updateData.role = role

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Admin user update error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
