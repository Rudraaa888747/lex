import { cookies, headers } from "next/headers"
import { prisma } from "@/lib/database"

const SESSION_COOKIE_NAMES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const

const SESSION_TOUCH_INTERVAL_MS = 5 * 60 * 1000

function getClientIpFromHeaders(headerMap: Headers) {
  const forwardedFor = headerMap.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null
  }

  return headerMap.get("x-real-ip")?.trim() || null
}

// In-memory cache to skip DB writes within the interval (per-process)
const lastTouchMap = new Map<string, number>()

// Periodically purge stale entries so long-running processes don't grow unboundedly.
// unref() keeps the timer from holding the Node process open during builds/short-lived invocations.
const TOUCH_SWEEP_INTERVAL_MS = 10 * 60 * 1000
const touchSweepTimer = setInterval(() => {
  const now = Date.now()
  for (const [key, lastTouch] of lastTouchMap) {
    if (now - lastTouch >= SESSION_TOUCH_INTERVAL_MS) {
      lastTouchMap.delete(key)
    }
  }
}, TOUCH_SWEEP_INTERVAL_MS)
touchSweepTimer.unref?.()

export async function touchCurrentSession(userId: string, sessionToken: string) {
  if (!sessionToken) return

  // Skip if we've touched this session recently in this process
  const cacheKey = `${userId}:${sessionToken}`
  const lastTouch = lastTouchMap.get(cacheKey)
  const now = Date.now()
  if (lastTouch && (now - lastTouch) < SESSION_TOUCH_INTERVAL_MS) return

  const headerMap = await headers()
  const userAgent = headerMap.get("user-agent")
  const ip = getClientIpFromHeaders(headerMap)
  const threshold = new Date(now - SESSION_TOUCH_INTERVAL_MS)

  await prisma.session.updateMany({
    where: {
      sessionToken,
      userId,
      OR: [
        { lastActive: { lt: threshold } },
        { userAgent: null },
        { ip: null },
      ],
    },
    data: {
      lastActive: new Date(),
      userAgent,
      ip,
    },
  })

  lastTouchMap.set(cacheKey, now)
}
