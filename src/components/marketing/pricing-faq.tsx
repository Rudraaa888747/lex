"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
  { q: "Is there a free trial?", a: "Yes! Paid plans include a 14-day money-back guarantee. Pay via UPI to start; contact support within 14 days for a full refund." },
  { q: "What payment methods do you accept?", a: "We currently accept UPI payments (GPay, PhonePe, and other UPI apps) for paid plans. More payment options are coming soon." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time with no cancellation fees." },
]

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto relative z-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground tracking-tighter text-balance" style={{ fontFamily: "var(--font-display)" }}>Pricing FAQ</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const open = openIndex === i
          return (
          <div key={i} className="glass-default bg-card rounded-2xl overflow-hidden transition-all duration-300 border border-border hover:border-[rgba(0,0,0,0.15)] shadow-[var(--shadow-sm)]">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              aria-controls={`pricing-faq-panel-${i}`}
              className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.02)]"
            >
              <span className="font-semibold text-sm sm:text-base pr-4 text-foreground">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <div id={`pricing-faq-panel-${i}`} hidden={!open}>
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
