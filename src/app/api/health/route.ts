import { prisma } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const start = Date.now()
    
    // Test DB connectivity
    await prisma.$queryRaw`SELECT 1`
    
    const dbLatency = Date.now() - start

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        latencyMs: dbLatency,
      },
      version: process.env.npm_package_version || "1.0.0",
      uptime: process.uptime(),
    })
  } catch (err) {
    console.error("[health]", err)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: { connected: false },
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}
