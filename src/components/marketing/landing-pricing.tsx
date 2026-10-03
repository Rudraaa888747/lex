"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { PaymentModal } from "@/components/PaymentModal"
import { plans, formatPlanPrice, planAmountRupees, type Plan } from "@/data/plans"

export function LandingPricing() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const openModal = (plan: Plan) => {
    if (plan.pricePaise == null) return
    setSelectedPlan(plan)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedPlan(null)
  }

  return (
    <section className="py-24 px-[var(--gutter)] bg-[var(--color-muted)] border-y border-[var(--outline-var)] section-alt">
      <div className="max-w-[var(--max-w)] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-[var(--on-bg-muted)] max-w-xl mx-auto text-lg">Start for free. Upgrade when you need more power.</p>
        </div>
        <div className="price-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`price-card g-default ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="price-dot bg-[var(--foreground)]" aria-hidden="true" />
              <h3 className="price-name">{plan.name}</h3>
              <p className="price-desc">{plan.desc}</p>
              <div className="mb-6">
                <span className="price-amount">{formatPlanPrice(plan)}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <div className="price-divider" aria-hidden="true" />
              <ul className="price-feats">
                {plan.features.map((feat) => (
                  <li key={feat} className="price-feat">
                    <CheckCircle className="price-check" aria-hidden="true" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              {plan.name === "Enterprise" ? (
                <Link href="/contact-sales" className={`btn-plan ${plan.popular ? 'solid' : 'outline'}`}>
                  {plan.cta}
                </Link>
              ) : plan.name === "Starter" ? (
                <Link href="/register" className={`btn-plan ${plan.popular ? 'solid' : 'outline'}`}>
                  {plan.cta}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openModal(plan)}
                  className={`btn-plan ${plan.popular ? 'solid' : 'outline'}`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={closeModal}
          planName={selectedPlan.name}
          amount={planAmountRupees(selectedPlan) ?? ""}
        />
      )}
    </section>
  )
}
