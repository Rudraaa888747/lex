export interface Plan {
  name: string
  /** Price in INR paise; null = custom/enterprise pricing */
  pricePaise: number | null
  period: string
  desc: string
  features: string[]
  cta: string
  popular: boolean
  /** Uppercase plan key matching the User/Subscription plan enum */
  planKey: "FREE" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE"
}

export const plans: Plan[] = [
  {
    name: "Starter",
    pricePaise: 0,
    period: "forever",
    desc: "For kicking the tires",
    features: ["3 documents / month", "Standard AI analysis", "Plain language summary", "Basic risk detection", "Community support"],
    cta: "Get Started Free",
    popular: false,
    planKey: "FREE",
  },
  {
    name: "Professional",
    pricePaise: 239900,
    period: "/ month",
    desc: "For people who sign contracts regularly",
    features: ["50 documents / month", "Advanced AI models", "Deep clause breakdown", "Unlimited document chat", "PDF / DOCX reports", "Multi-language analysis", "Priority support"],
    cta: "Upgrade to Pro",
    popular: true,
    planKey: "PROFESSIONAL",
  },
  {
    name: "Business",
    pricePaise: 819900,
    period: "/ month",
    desc: "For teams dealing with contracts daily",
    features: ["200 documents / month", "Everything in Pro", "Side-by-side comparison", "Team collaboration", "API access", "Custom templates", "Dedicated manager"],
    cta: "Upgrade to Business",
    popular: false,
    planKey: "BUSINESS",
  },
  {
    name: "Enterprise",
    pricePaise: null,
    period: "",
    desc: "For large organisations",
    features: ["Unlimited parsing", "Everything in Business", "Custom integrations", "On-premise deployment", "White-label options", "SLA guarantee", "24/7 technical hotline"],
    cta: "Contact Sales",
    popular: false,
    planKey: "ENTERPRISE",
  },
]

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatPlanPrice(plan: Plan): string {
  if (plan.pricePaise == null) return "Custom"
  return inr.format(plan.pricePaise / 100)
}

/** Numeric rupee amount for the UPI intent; null when custom priced. */
export function planAmountRupees(plan: Pick<Plan, "pricePaise">): string | null {
  if (plan.pricePaise == null) return null
  return String(Math.round(plan.pricePaise / 100))
}
