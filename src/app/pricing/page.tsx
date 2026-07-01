"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Sparkles, ChevronDown } from "lucide-react"

const plans = [
  { name: "Starter", price: "₹0", period: "forever", desc: "For kicking the tires", features: ["3 documents / month", "Standard AI analysis", "Plain language summary", "Basic risk detection", "Community support"], cta: "Get Started Free", popular: false },
  { name: "Professional", price: "₹2,399", period: "/ month", desc: "For people who sign contracts regularly", features: ["50 documents / month", "Advanced AI models", "Deep clause breakdown", "Unlimited document chat", "PDF / DOCX reports", "Multi-language analysis", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Business", price: "₹8,199", period: "/ month", desc: "For teams dealing with contracts daily", features: ["200 documents / month", "Everything in Pro", "Side-by-side comparison", "Team collaboration", "API access", "Custom templates", "Dedicated manager"], cta: "Upgrade to Business", popular: false },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large organisations", features: ["Unlimited parsing", "Everything in Business", "Custom integrations", "On-premise deployment", "White-label options", "SLA guarantee", "24/7 technical hotline"], cta: "Contact Sales", popular: false },
]

const faqs = [
  { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
  { q: "Is there a free trial?", a: "Yes! Pro plan comes with a 14-day free trial. No credit card required." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time with no cancellation fees." },
]

export default function PricingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="default" size="lg" className="mb-4 bg-[rgba(0,0,0,0.06)] text-foreground border border-border">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tighter text-balance" style={{ fontFamily: "var(--font-display)" }}>Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs. Upgrade anytime.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative">
          {/* Subtle background glow for cream theme */}
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
              <Link href={plan.name === "Enterprise" ? "/pricing" : "/register"}>
                <Button variant={plan.popular ? "gradient" : "outline"} className="w-full">{plan.cta}<ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground tracking-tighter text-balance" style={{ fontFamily: "var(--font-display)" }}>Pricing FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-default bg-card rounded-2xl overflow-hidden transition-all duration-300 border border-border hover:border-[rgba(0,0,0,0.15)] shadow-[var(--shadow-sm)]">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)} 
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                >
                  <span className="font-semibold text-sm sm:text-base pr-4 text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
