"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/PaymentModal"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import { plans, formatPlanPrice, planAmountRupees, type Plan } from "@/data/plans"

export function PricingPlans() {
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
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative">
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.02)] blur-[100px] pointer-events-none rounded-full" aria-hidden="true" />

        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-6 rounded-3xl ${plan.popular ? "glass-elevated border-2 border-border" : "glass-default border border-border"} flex flex-col z-10 bg-card`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="default" className="bg-primary-btn text-[#FAF8F3] border border-[rgba(0,0,0,0.12)] shadow-[var(--shadow-sm)]">Most Popular</Badge></div>}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-display)" }}>{formatPlanPrice(plan)}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{plan.desc}</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {plan.name === "Enterprise" ? (
              <Link
                href="/contact-sales"
                className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-xl font-medium border border-border bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.06)] text-foreground transition-colors"
              >
                {plan.cta}<ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : plan.name === "Starter" ? (
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-xl font-medium border border-border bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.06)] text-foreground transition-colors"
              >
                {plan.cta}<ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openModal(plan)}
                className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-xl font-medium bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3] transition-colors"
              >
                {plan.cta}<ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={closeModal}
          planName={selectedPlan.name}
          amount={planAmountRupees(selectedPlan) ?? ""}
        />
      )}
    </>
  )
}
