"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/PaymentModal"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useState } from "react"

const plans = [
  { name: "Starter", price: "₹0", period: "forever", desc: "For kicking the tires", features: ["3 documents / month", "Standard AI analysis", "Plain language summary", "Basic risk detection", "Community support"], cta: "Get Started Free", popular: false },
  { name: "Professional", price: "₹2,399", period: "/ month", desc: "For people who sign contracts regularly", features: ["50 documents / month", "Advanced AI models", "Deep clause breakdown", "Unlimited document chat", "PDF / DOCX reports", "Multi-language analysis", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Business", price: "₹8,199", period: "/ month", desc: "For teams dealing with contracts daily", features: ["200 documents / month", "Everything in Pro", "Side-by-side comparison", "Team collaboration", "API access", "Custom templates", "Dedicated manager"], cta: "Upgrade to Business", popular: false },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large organisations", features: ["Unlimited parsing", "Everything in Business", "Custom integrations", "On-premise deployment", "White-label options", "SLA guarantee", "24/7 technical hotline"], cta: "Contact Sales", popular: false },
]

export function PricingPlans() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null)

  const handleUpgradeClick = (e: React.MouseEvent, plan: { name: string; price: string }) => {
    if (plan.name === "Enterprise" || plan.name === "Starter") return
    e.preventDefault()
    setSelectedPlan(plan)
    setModalOpen(true)
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative">
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.02)] blur-[100px] pointer-events-none rounded-full" />

        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-6 rounded-3xl ${plan.popular ? "glass-elevated border-2 border-border" : "glass-default border border-border"} flex flex-col z-10 bg-card`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="default" className="bg-primary-btn text-[#FAF8F3] border border-[rgba(0,0,0,0.12)] shadow-[var(--shadow-sm)]">Most Popular</Badge></div>}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-display)" }}>{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{plan.desc}</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.name === "Enterprise" ? "/contact-sales" : plan.name === "Starter" ? "/register" : "#"}
              onClick={(e) => handleUpgradeClick(e, plan)}
            >
              <Button variant={plan.popular ? "gradient" : "outline"} className="w-full">{plan.cta}<ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </>
  )
}
