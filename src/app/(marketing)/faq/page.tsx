"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Search } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

const faqs = [
  { category: "General", items: [
    { q: "What is Lex?", a: "Lex is an AI-powered legal document analysis platform that helps you understand contracts, agreements, and legal documents. Our AI extracts key clauses, detects risks, and provides plain-language explanations." },
    { q: "Is Lex a law firm?", a: "No, Lex is not a law firm and does not provide legal advice. We are a technology platform that uses AI to analyze documents. All analyses should be reviewed by a qualified legal professional." },
    { q: "How does the AI analysis work?", a: "Our AI models are trained on thousands of legal documents. When you upload a document, the AI extracts text, identifies clauses, detects risks, and generates comprehensive analysis reports." },
  ]},
  { category: "Documents", items: [
    { q: "What file types are supported?", a: "We support PDF, DOCX, TXT, PNG, and JPG files. Images are processed using OCR technology to extract text." },
    { q: "Is there a file size limit?", a: "Yes, the maximum file size is 25MB per document. Enterprise plans may have higher limits." },
    { q: "Are my documents stored securely?", a: "Yes, all documents are encrypted using AES-256 both in transit and at rest. We use isolated storage and never share your documents with third parties." },
  ]},
  { category: "Plans & Billing", items: [
    { q: "What's included in the Free plan?", a: "The Free plan includes up to 3 documents per month with basic AI analysis, plain language summary, and risk detection." },
    { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time. Changes take effect immediately." },
    { q: "Is there a free trial?", a: "Yes, the Pro plan comes with a 14-day free trial. No credit card is required." },
  ]},
  { category: "Security", items: [
    { q: "How is my data protected?", a: "We use AES-256 encryption, secure file storage, role-based access control, and regular security audits. Our infrastructure is GDPR-compliant." },
    { q: "Do you share my documents?", a: "Never. Your documents are private and stored in isolated storage. We do not share, sell, or use your documents for any purpose other than providing the analysis service." },
  ]},
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = faqs.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())),
  })).filter((cat) => cat.items.length > 0)

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <Badge variant="default" size="lg" className="mb-4 bg-[rgba(0,0,0,0.06)] text-foreground border-border shadow-[var(--shadow-sm)]">FAQ</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground font-medium">Everything you need to know about Lex</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground" 
          />
        </div>

        <div className="space-y-8">
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-lg font-bold mb-4 text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map((item, i) => {
                  const idx = `${cat.category}-${i}`
                  return (
                    <div key={idx} className="glass-default bg-card rounded-2xl overflow-hidden transition-all duration-300 border border-border hover:border-[rgba(0,0,0,0.15)] shadow-[var(--shadow-sm)]">
                      <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.02)]">
                        <span className="font-semibold text-sm sm:text-base pr-4 text-foreground">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-96" : "max-h-0"}`}>
                        <p className="px-4 sm:px-5 pb-4 sm:px-5 text-sm text-muted-foreground font-medium leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
