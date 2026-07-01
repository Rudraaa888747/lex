import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        suspended: true,
        createdAt: true,
        emailVerified: true,
        image: true,
      },
    })

    return Response.json({
      users: users.map((user) => ({
        ...user,
        emailVerified: Boolean(user.emailVerified),
      })),
    })
  } catch (error) {
    console.error("Admin users error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
