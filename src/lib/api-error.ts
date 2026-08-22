export class UserFacingError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "UserFacingError";
    this.statusCode = statusCode;
  }
}

export function apiError(error: unknown, fallbackMessage: string = "An unexpected error occurred", fallbackStatus: number = 500) {
  if (error instanceof UserFacingError) {
    return Response.json({ error: error.message }, { status: error.statusCode });
  }
  
  if (error instanceof Error) {
    console.error(`[API Error]: ${error.message}`, error.stack);
  } else {
    console.error(`[API Error]:`, error);
  }
  
  return Response.json({ error: fallbackMessage }, { status: fallbackStatus });
}

/**
 * Error pattern matchers — maps raw internal error substrings to safe,
 * actionable, user-friendly messages. Order matters: first match wins.
 */
const ERROR_PATTERNS: { test: (msg: string) => boolean; userMessage: string }[] = [
  // Document extraction / OCR failures
  {
    test: (msg) => /no\s*readable\s*text|ocr\s*fail|extract.*text|couldn.*read/i.test(msg),
    userMessage: "We couldn't read this document. Try a clearer scan or a different file format.",
  },
  // AI / OpenRouter / OpenAI service errors
  {
    test: (msg) => /openai|openrouter|model.*error|rate.*limit.*api|completion|ai\s*service|token.*limit|context.*length/i.test(msg),
    userMessage: "Analysis is taking longer than expected or the AI service is temporarily unavailable. Please retry in a moment.",
  },
  // Timeout errors (generic)
  {
    test: (msg) => /timeout|timed?\s*out|ETIMEDOUT|ESOCKETTIMEDOUT/i.test(msg),
    userMessage: "The request took too long to complete. Please try again.",
  },
  // Database / Prisma / transaction errors
  {
    test: (msg) => /transaction|prisma|postgres|pgbouncer|supavisor|database|ECONNREFUSED|connection.*pool|unable\s*to\s*start/i.test(msg),
    userMessage: "Something went wrong while saving your data. Please retry.",
  },
  // Network / fetch errors
  {
    test: (msg) => /ECONNRESET|ENOTFOUND|fetch\s*failed|network|socket\s*hang/i.test(msg),
    userMessage: "A network error occurred. Please check your connection and try again.",
  },
  // File processing errors
  {
    test: (msg) => /file.*corrupt|invalid.*pdf|unsupported.*format|parse.*error/i.test(msg),
    userMessage: "This file appears to be corrupted or in an unsupported format. Please try a different file.",
  },
]

/**
 * Converts a raw internal error message into a safe, user-friendly string.
 * Use this in any frontend-facing context (toasts, error UI, API responses to end users).
 * The raw error should still be logged server-side and stored in DB for admin debugging.
 */
export function getUserFriendlyErrorMessage(rawMessage: string | null | undefined): string {
  if (!rawMessage) return "Something went wrong. Please try again or contact support."

  const msg = rawMessage.trim()

  for (const pattern of ERROR_PATTERNS) {
    if (pattern.test(msg)) return pattern.userMessage
  }

  // Generic fallback — never leak the raw message
  return "Something went wrong. Please try again or contact support."
}
