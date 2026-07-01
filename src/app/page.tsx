"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Upload, FileSearch, Shield, FileText, ArrowRight,
  CheckCircle, ChevronDown, Brain, AlertTriangle, GitCompare,
  MessageSquare, Globe, Download, Lock, Sparkles, Server,
  Eye, Key, Zap
} from "lucide-react"

const documentTypes = [
  { icon: FileText, label: "Rental Agreements", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Employment Contracts", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Service Agreements", accent: "var(--color-foreground)" },
  { icon: FileSearch, label: "NDAs", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Insurance Policies", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Privacy Policies", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Terms & Conditions", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Legal Notices", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Vendor Agreements", accent: "var(--color-foreground)" },
  { icon: FileText, label: "Business Contracts", accent: "var(--color-foreground)" },
]

const getDocSlug = (label: string) => {
  const map: Record<string, string> = {
    "Rental Agreements": "rental-agreements",
    "Employment Contracts": "employment-contracts",
    "Service Agreements": "service-agreements",
    "NDAs": "ndas",
    "Insurance Policies": "insurance-policies",
    "Privacy Policies": "privacy-policies",
    "Terms & Conditions": "terms-and-conditions",
    "Legal Notices": "legal-notices",
    "Vendor Agreements": "vendor-agreements",
    "Business Contracts": "business-contracts",
  }
  return map[label] || label.toLowerCase().replace(/\s+/g, "-")
}

const capabilities = [
  { icon: Brain, title: "AI Simplification", desc: "Dense legal jargon translated into clear, plain language anyone can understand instantly.", accent: "var(--color-foreground)" },
  { icon: AlertTriangle, title: "Risk Detection", desc: "Pinpoint hidden liabilities, unfavorable clauses, and penalty traps automatically.", accent: "var(--color-foreground)" },
  { icon: FileSearch, title: "Clause Mapping", desc: "Every clause automatically extracted, sorted, and cross-referenced by category.", accent: "var(--color-foreground)" },
  { icon: GitCompare, title: "Smart Comparison", desc: "Upload two versions and get a precise diff — every change highlighted and explained.", accent: "var(--color-foreground)" },
  { icon: MessageSquare, title: "Interactive Chat", desc: "Ask anything about your document. Answers grounded in the actual legal text.", accent: "var(--color-foreground)" },
  { icon: Globe, title: "Multi-language", desc: "Full analysis in English, Hindi (हिन्दी), and Gujarati (ગુજરાતી).", accent: "var(--color-foreground)" },
  { icon: Download, title: "Export Reports", desc: "Generate professional PDF and DOCX executive summaries with a single click.", accent: "var(--color-foreground)" },
]

const steps = [
  { n: "01", icon: Upload, title: "Upload", desc: "PDF, DOCX, TXT, or scanned image — drag & drop or browse from your device." },
  { n: "02", icon: Brain, title: "AI Reads", desc: "Our neural model parses every line, clause, obligation, and condition." },
  { n: "03", icon: AlertTriangle, title: "Risks Surface", desc: "Issues ranked by severity. Nothing buried. Nothing left to chance." },
  { n: "04", icon: MessageSquare, title: "You Ask", desc: "Chat with the document. Get answers grounded in the actual text." },
  { n: "05", icon: Download, title: "Download", desc: "Export a complete analysis in PDF or DOCX format." },
]

const securityFeatures = [
  { icon: Lock, title: "Encryption at Rest & In Transit", desc: "AES-256 encryption across the board. Same standard banks use." },
  { icon: Server, title: "Isolated Processing", desc: "Every document processed in a private, sandboxed container." },
  { icon: Eye, title: "Zero Data Leakage", desc: "Your data stays yours. We never train public models with your documents." },
  { icon: Shield, title: "GDPR Compliant", desc: "Privacy-first architecture built to meet European data protection standards." },
  { icon: Key, title: "Access Control", desc: "Strict permissions track exactly who accesses your documents and when." },
  { icon: CheckCircle, title: "Auto-Deletion", desc: "Set documents to self-destruct after 30, 60, or 90 days." },
]

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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-inner">

          <div>
            <div className="hero-eyebrow" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both", marginTop: "3rem" }}>
              <Sparkles style={{ width: 13, height: 13, animation: "pulse 2.5s ease-in-out infinite" }} />

              Enterprise-Grade Legal Intelligence
            </div>
            <h1 className="hero-h1" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <span className="tg">Understand every contract.</span>
              <br />In seconds, not days.
            </h1>
            <p className="hero-sub" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
              Instantly uncover hidden liabilities, map complex obligations, and translate dense legal jargon into plain English. Powered by advanced AI and secured with bank-grade encryption.
            </p>
            <div className="hero-actions" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              <Link href="/register" className="btn-primary">
                Start for Free
                <ArrowRight style={{ width: 17, height: 17 }} />
              </Link>
              <Link href="/how-it-works" className="btn-ghost g-subtle">
                See How It Works
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle style={{ width: 14, height: 14, color: "var(--success)" }} />
                Bank-grade Security
              </div>
              <div className="trust-item">
                <CheckCircle style={{ width: 14, height: 14, color: "var(--success)" }} />
                Free to Start
              </div>
              <div className="trust-item">
                <CheckCircle style={{ width: 14, height: 14, color: "var(--success)" }} />
                Cancel Anytime
              </div>
            </div>
            <div className="disclaimer" style={{ textAlign: "left", display: "flex", alignItems: "flex-start", gap: "8px", maxWidth: "480px", marginTop: "24px", marginLeft: 0 }}>
              <Lock style={{ width: 16, height: 16, color: "var(--color-muted-foreground)", flexShrink: 0, marginTop: "2px" }} />
              <span>Your documents are encrypted using AES-256 at rest and in transit. We enforce a strict zero-retention policy for analysis data.</span>
            </div>
          </div>

          {/* right — hero card */}
          <div className="hcard g-elevated" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}>
            <div className="hcard-topbar">
              <div className="hcard-dots">
                <div className="hcard-dot" style={{ background: "var(--error)" }} />
                <div className="hcard-dot" style={{ background: "var(--warn)" }} />
                <div className="hcard-dot" style={{ background: "var(--success)" }} />
              </div>
              <span className="hcard-filename">PREVIEW_DOC_v2.PDF</span>
              <span className="hcard-badge">Analyzed</span>
            </div>
            <div className="hcard-body">
              <div className="g-subtle" style={{ borderRadius: "var(--r-md)", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>
                SECTION 4.2: INDEMNIFICATION. THE PARTIES SHALL HEREBY AGREE TO HOLD HARMLESS,
                DEFEND, AND INDEMNIFY EACH OTHER...
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary-btn), var(--color-primary-light))", 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)", 
                  animation: "pulse 2.5s ease-in-out infinite",
                  position: "relative",
                  zIndex: 2
                }}>
                  <Zap style={{ width: 22, height: 22, color: "#FAF8F3", filter: "drop-shadow(0 0 8px rgba(250,248,243,0.5))" }} />
                </div>
              </div>
              <div className="hcard-summary g-subtle">
                <div className="hcard-summary-label">
                  <Sparkles style={{ width: 11, height: 11 }} />
                  AI Summary
                </div>
                <div className="hcard-summary-text">
                  Both parties agree to protect each other from legal costs and claims
                  if something goes wrong during the contract period.
                </div>
              </div>
              <div className="hcard-tags">
                <div className="hcard-tag g-subtle" style={{ color: "var(--success)" }}>
                  Fair Vesting
                </div>
                <div className="hcard-tag g-subtle" style={{ color: "var(--error)" }}>
                  Aggressive IP Clause
                </div>
                <div className="hcard-tag g-subtle" style={{ color: "var(--primary)" }}>
                  Mutual NDA
                </div>
                <div className="hcard-tag g-subtle" style={{ color: "var(--success)" }}>
                  Standard Jurisdiction
                </div>
              </div>
              <div className="hcard-footer">
                <div className="hcard-footer-dot" />
                Analysis complete &middot; 12 clauses &middot; 1 critical risk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <div className="disclaimer g-subtle">
        &#9888;&nbsp; AI analysis is for informational purposes only. Consult a qualified legal professional.
      </div>

      {/* ── TRUSTED STRIP ────────────────────────────────────────────── */}
      <section className="trusted-strip border-y border-[var(--outline-var)] bg-[var(--color-card)]">
        <div className="trusted-label">Trusted By</div>
        <div className="trusted-divider" />
        <div className="trusted-items">
          <div className="trusted-items-inner">
            <div className="trusted-item">Law Firms</div>
            <div className="trusted-item">Freelancers</div>
            <div className="trusted-item">Startups</div>
            <div className="trusted-item">HR Teams</div>
            <div className="trusted-item">Real Estate Agents</div>
            <div className="trusted-item">Enterprise Legal Depts</div>
            {/* Duplicate for marquee effect */}
            <div className="trusted-item">Law Firms</div>
            <div className="trusted-item">Freelancers</div>
            <div className="trusted-item">Startups</div>
            <div className="trusted-item">HR Teams</div>
            <div className="trusted-item">Real Estate Agents</div>
            <div className="trusted-item">Enterprise Legal Depts</div>
          </div>
        </div>
      </section>

      {/* ── DOC TYPES ─────────────────────────────────────────────────── */}
      <section className="py-24 px-[var(--gutter)] max-w-[var(--max-w)] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Analyzes what you sign most.</h2>
          <p className="text-[var(--on-bg-muted)] max-w-xl mx-auto text-lg">We support the most common document types across real estate, HR, and business operations.</p>
          <p className="text-[var(--on-bg-muted)] max-w-xl mx-auto text-lg">Click on the name to open infomation.</p>
        </div>
        <div className="doc-grid">
          {documentTypes.map((doc, i) => (
            <Link href={`/supported/${getDocSlug(doc.label)}`} key={i} className="doc-card g-subtle">
              <div className="doc-icon-wrap" style={{ background: "var(--color-muted)", color: doc.accent }}>
                <doc.icon size={20} />
              </div>
              <div className="doc-label font-medium">{doc.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-[var(--gutter)] max-w-[var(--max-w)] mx-auto w-full">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Everything you need to<br />understand your contracts.</h2>
          <p className="text-[var(--on-bg-muted)] max-w-xl text-lg">We&apos;ve trained our models on millions of legal clauses to give you the most accurate risk assessment possible.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <div key={i} className="cap-card g-subtle p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[var(--foreground)]">
                <cap.icon size={20} />
              </div>
              <h3 className="font-display font-bold text-lg">{cap.title}</h3>
              <p className="text-[var(--on-bg-muted)] text-sm leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-24 px-[var(--gutter)] border-y border-[var(--outline-var)] bg-[var(--color-muted)] section-alt">
        <div className="max-w-[var(--max-w)] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">How it works</h2>
            <p className="text-[var(--on-bg-muted)] max-w-xl mx-auto text-lg">Five simple steps to complete contract clarity.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step">
                {i !== steps.length - 1 && <div className="step-line" />}
                <span className="step-num">{step.n}</span>
                <div className="step-orb">
                  <step.icon size={20} color="var(--color-foreground)" />
                  <div className="step-badge">{i + 1}</div>
                </div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ───────────────────────────────────────────────────── */}
      <section className="py-24 px-[var(--gutter)] max-w-[var(--max-w)] mx-auto w-full">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-xs font-bold tracking-wide uppercase mb-6">
            <Shield size={14} /> Bank-Grade Security
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Your data never leaves the vault.</h2>
          <p className="text-[var(--on-bg-muted)] max-w-xl text-lg">We use the same encryption standards as major financial institutions. We don&apos;t train models on your data.</p>
        </div>
        <div className="sec-grid">
          {securityFeatures.map((sec, i) => (
            <div key={i} className="sec-card g-default">
              <div className="sec-icon-wrap bg-[var(--color-muted)] text-[var(--foreground)]">
                <sec.icon size={20} />
              </div>
              <div>
                <h3 className="sec-title font-bold mb-1">{sec.title}</h3>
                <p className="sec-desc text-[var(--on-bg-muted)] text-sm leading-relaxed">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
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
                <Link href="/register" className={`btn-plan ${plan.popular ? 'solid' : 'outline'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
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

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-[var(--gutter)]">
        <div className="cta-card g-elevated">
          <div className="cta-orb-1" />
          <div className="cta-orb-2" />
          <div className="cta-inner">
            <h2 className="cta-h2">Ready to understand your contracts?</h2>
            <p className="cta-sub">Join thousands of professionals who use Lax to review agreements faster and catch hidden risks.</p>
            <div className="cta-actions">
              <Link href="/register" className="btn-primary">Get Started Free <ArrowRight size={16} /></Link>
              <Link href="/pricing" className="btn-ghost g-subtle">View Pricing</Link>
            </div>
            <p className="cta-fine">No credit card required for Starter plan.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-12 px-[var(--gutter)] border-t border-[var(--outline-var)] bg-[var(--color-card)] text-center text-[var(--on-bg-muted)] text-sm font-mono mt-auto">
        <p className="mb-4 text-xs font-semibold text-[var(--danger)] bg-[var(--danger)]/10 inline-block px-4 py-2 rounded-full border border-[var(--danger)]/20">⚠ The information provided on this page is for educational purposes only and does not constitute legal advice. Always consult a qualified legal professional for advice specific to your situation.</p>
        <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Lax AI. All rights reserved.</p>
      </footer>
    </>
  )
}
