import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// In-memory fallback
const tokenBuckets = new Map<string, { count: number; resetTime: number }>()

function inMemoryRateLimit(identifier: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  let record = tokenBuckets.get(identifier)

  if (!record || record.resetTime < now) {
    record = { count: 0, resetTime: now + windowMs }
  }

  record.count++
  tokenBuckets.set(identifier, record)

  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    reset: record.resetTime,
  }
}

// Check if Upstash is configured
const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const redis = hasUpstash ? Redis.fromEnv() : null

// Create a factory for ratelimiters
export function createRateLimiter(limit: number, windowStr: `${number} ${"ms" | "s" | "m" | "h" | "d"}`) {
  if (hasUpstash && redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, windowStr),
      analytics: true,
    })
  }

  // Parse window string to ms
  const [valStr, unit] = windowStr.split(" ")
  const val = parseInt(valStr, 10)
  let windowMs = val
  if (unit === "s") windowMs = val * 1000
  if (unit === "m") windowMs = val * 60 * 1000
  if (unit === "h") windowMs = val * 60 * 60 * 1000
  if (unit === "d") windowMs = val * 24 * 60 * 60 * 1000

  // NOTE: This in-memory version does not work correctly across multiple serverless instances.
  // Upstash (or equivalent distributed store) is required for production correctness.
  return {
    limit: async (identifier: string): Promise<RateLimitResult> => {
      return inMemoryRateLimit(identifier, limit, windowMs)
    }
  }
}

// Definitions
export const registerLimiter = createRateLimiter(5, "10 m")
export const chatLimiter = createRateLimiter(20, "1 m")
export const documentUploadLimiter = createRateLimiter(10, "1 h")
export const compareLimiter = createRateLimiter(10, "1 h")
