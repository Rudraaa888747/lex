export function isPremiumPlan(plan?: string | null) {
  return Boolean(plan && plan !== "FREE")
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PROFESSIONAL: 50,
  BUSINESS: 200,
  ENTERPRISE: Infinity,
}
