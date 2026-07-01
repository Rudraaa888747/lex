export function isPremiumPlan(plan?: string | null) {
  return Boolean(plan && plan !== "FREE")
}
