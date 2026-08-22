"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { PaymentModal } from "@/components/PaymentModal"

const plans = [
  {
    name: "Starter", price: "₹0", period: "forever",
    desc: "For kicking the tires",
    features: ["3 documents / month", "Standard AI analysis", "Plain language summary", "Basic risk detection", "Community support"],
    cta: "Get Started Free", popular: false,
  },
  {
    name: "Professional", price: "₹2,399", period: "/ month",
    desc: "For people who sign contracts regularly",
    features: ["50 documents / month", "Advanced AI models", "Deep clause breakdown", "Unlimited document chat", "PDF / DOCX reports", "Multi-language analysis", "Priority support"],
    cta: "Start Free Trial", popular: true,
  },
  {
    name: "Business", price: "₹8,199", period: "/ month",
    desc: "For teams dealing with contracts daily",
    features: ["200 documents / month", "Everything in Pro", "Side-by-side comparison", "Team collaboration", "API access", "Custom templates", "Dedicated manager"],
    cta: "Upgrade to Business", popular: false,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "For large organisations",
    features: ["Unlimited parsing", "Everything in Business", "Custom integrations", "On-premise deployment", "White-label options", "SLA guarantee", "24/7 technical hotline"],
    cta: "Contact Sales", popular: false,
  },
]

export function LandingPricing() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null)

  const handleUpgradeClick = (e: React.MouseEvent, plan: { name: string; price: string }) => {
    if (plan.name === "Enterprise" || plan.name === "Starter") return
    e.preventDefault()
    setSelectedPlan(plan)
    setModalOpen(true)
  }

  return (
    <section className="py-24 px-[var(--gutter)] bg-[var(--color-muted)] border-y border-[var(--outline-var)] section-alt">
      <div className="max-w-[var(--max-w)] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-[var(--on-bg-muted)] max-w-xl mx-auto text-lg">Start for free. Upgrade when you need more power.</p>
        </div>
        <div className="price-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`price-card g-default ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="price-dot bg-[var(--foreground)]" />
              <h3 className="price-name">{plan.name}</h3>
              <p className="price-desc">{plan.desc}</p>
              <div className="mb-6">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <div className="price-divider" />
              <ul className="price-feats">
                {plan.features.map((feat, j) => (
                  <li key={j} className="price-feat">
                    <CheckCircle className="price-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Enterprise" ? "/contact-sales" : plan.name === "Starter" ? "/register" : "#"}
                className={`btn-plan ${plan.popular ? 'solid' : 'outline'}`}
                onClick={(e) => handleUpgradeClick(e, plan)}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </section>
  )
}
