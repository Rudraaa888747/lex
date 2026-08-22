"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  { q: "What document types can I analyze?", a: "Lex handles PDF, DOCX, TXT files, and scanned images (JPG, PNG) via advanced OCR. We support rental contracts, employment agreements, NDAs, insurance policies, vendor sheets, T&Cs, and more." },
  { q: "Is my private data completely secure?", a: "Security is our core foundation. Documents are encrypted using AES-256 standards throughout transit and lifecycle storage. We enforce a strict policy against selling or sharing user data with third parties." },
  { q: "How accurate is the AI analysis?", a: "Our AI provides deep analytical indicators and maps potential risk fields with high precision. That said — it is not authorised legal counsel. Think of it as a supercharged preparation tool before consulting an attorney." },
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. Upgrade, downgrade, or cancel directly from your settings at any time. Your access continues until the end of your current billing cycle." },
  { q: "What languages are supported?", a: "We support English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) natively — including summaries, clause explanations, and full analysis output." },
  { q: "How does document comparison work?", a: "Upload two documents and our AI produces a clause-level diff — highlighting every change in payment terms, obligations, restrictions, and liability points between the versions." },
  { q: "Is there a free trial for paid plans?", a: "Yes — the Professional plan includes a 14-day free trial. No credit card required to start. Cancel anytime during the trial." },
  { q: "What's included in an exported report?", a: "Reports include an executive summary, risk assessment by severity, full clause index, rights & obligations breakdown, and all financial terms — available in PDF or DOCX." },
]

export function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className="py-24 px-[var(--gutter)] max-w-[var(--max-w)] mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Frequently asked questions</h2>
      </div>
      <div className="faq-wrap">
        {faqs.map((item, i) => (
          <div key={i} className={`faq-item g-subtle ${openFaq === i ? 'open' : ''}`}>
            <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span>{item.q}</span>
              <div className="faq-chevron"><ChevronDown size={14} /></div>
            </button>
            <div className="faq-body">
              <div className="faq-body-inner">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
