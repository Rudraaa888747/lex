import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Lex AI. Start free, upgrade for advanced analysis, unlimited chat, comparison, and multi-language support.",
  alternates: { canonical: "/pricing" },
  openGraph: { title: "Lex AI — Pricing", description: "Simple, transparent pricing for Lex AI. Start free, upgrade for advanced analysis, unlimited chat, comparison, and multi-language support." },
  twitter: { title: "Lex AI — Pricing", description: "Simple, transparent pricing for Lex AI. Start free, upgrade for advanced analysis, unlimited chat, comparison, and multi-language support." },
}
import { Badge } from "@/components/ui/badge"
import { PricingPlans } from "@/components/marketing/pricing-plans"
import { PricingFaq } from "@/components/marketing/pricing-faq"

export default function PricingPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="default" size="lg" className="mb-4 bg-[rgba(0,0,0,0.06)] text-foreground border border-border">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tighter text-balance" style={{ fontFamily: "var(--font-display)" }}>Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs. Upgrade anytime.</p>
        </div>

        <PricingPlans />

        <PricingFaq />
      </div>
    </div>
  )
}
