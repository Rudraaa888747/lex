import { headers } from "next/headers"

export async function getRequestMetadata() {
  const h = await headers()
  const forwardedFor = h.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || h.get("x-real-ip") || "Unknown"
  const userAgent = h.get("user-agent") || "Unknown"
  return { ip, userAgent }
}
