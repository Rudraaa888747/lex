import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Lex AI — supported file types, security, plans, billing, and how our AI legal analysis works.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Lex AI — Frequently Asked Questions", description: "Answers about Lex AI — supported file types, security, plans, billing, and how our AI legal analysis works." },
  twitter: { title: "Lex AI — Frequently Asked Questions", description: "Answers about Lex AI — supported file types, security, plans, billing, and how our AI legal analysis works." },
}
import { BackToWebsite } from "@/components/ui/back-to-website"
import { FaqList } from "@/components/marketing/faq-list"

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
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <Badge variant="default" size="lg" className="mb-4 bg-[rgba(0,0,0,0.06)] text-foreground border-border shadow-[var(--shadow-sm)]">FAQ</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground font-medium">Everything you need to know about Lex</p>
        </div>

        <FaqList faqs={faqs} />
      </div>
    </div>
  )
}
