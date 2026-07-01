import Link from "next/link"
import {
  Brain, AlertTriangle, FileSearch, MessageSquare,
  GitCompare, Download, Globe, BarChart2,
  Users, PenLine, Layout, Shield, Code, Smartphone
} from "lucide-react"

const availableFeatures = [
  {
    icon: Brain,
    title: "AI Simplification",
    desc: "Translates dense legal jargon into plain English instantly. No law degree required.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Detection",
    desc: "Automatically surfaces hidden liabilities, penalty traps, and unfavorable clauses.",
  },
  {
    icon: FileSearch,
    title: "Clause Mapping",
    desc: "Every clause extracted, categorized, and cross-referenced automatically.",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    desc: "Ask anything about your document. Answers grounded in the actual legal text.",
  },
  {
    icon: GitCompare,
    title: "Smart Comparison",
    desc: "Upload two versions and get a precise diff — every change highlighted and explained.",
  },
  {
    icon: Download,
    title: "Export Reports",
    desc: "Generate professional PDF and DOCX executive summaries in one click.",
  },
  {
    icon: Globe,
    title: "Multi-language",
    desc: "Full analysis in English, Hindi (हिन्दी), and Gujarati (ગુજરાતી).",
  },
  {
    icon: BarChart2,
    title: "Contract Scoring",
    desc: "Get an overall contract health score with breakdown by category.",
  },
]

const comingSoonFeatures = [
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite teammates to review, annotate, and sign off on contracts together.",
  },
  {
    icon: PenLine,
    title: "E-Signature Integration",
    desc: "Sign documents directly within Lex — integrated with major e-sign providers.",
  },
  {
    icon: Layout,
    title: "Contract Templates",
    desc: "Start from battle-tested templates for NDAs, service agreements, and more.",
  },
  {
    icon: Shield,
    title: "Audit Trail",
    desc: "Full activity log of who viewed, edited, or signed every document.",
  },
  {
    icon: Code,
    title: "API Access",
    desc: "Integrate Lex AI directly into your own products via REST API.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    desc: "Native iOS and Android apps for reviewing contracts on the go.",
  },
]

export default function FeaturesPage() {
  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "clamp(80px,10vw,120px) clamp(20px,5vw,32px) clamp(48px,6vw,64px)",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-muted-foreground)",
          marginBottom: 16,
        }}>
          Platform Capabilities
        </span>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem,5vw,4rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--color-foreground)",
          marginBottom: 20,
          textWrap: "balance",
        }}>
          Everything you need to<br />understand what you sign.
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1rem,1.8vw,1.2rem)",
          color: "var(--color-muted-foreground)",
          maxWidth: 560,
          margin: "0 auto 32px",
          lineHeight: 1.75,
        }}>
          Lex AI combines enterprise-grade AI with an intuitive interface to make
          legal document analysis accessible to everyone.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {["10+ Document Types", "3 Languages Supported", "Bank-grade Security"].map((stat) => (
            <span key={stat} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 99,
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "var(--color-foreground)",
            }}>
              {stat}
            </span>
          ))}
        </div>
      </section>

      {/* ── AVAILABLE NOW ── */}
      <section style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(20px,5vw,32px) clamp(60px,8vw,100px)",
      }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted-foreground)",
          }}>
            Available Now
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem,3vw,2.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--color-foreground)",
            marginTop: 8,
          }}>
            Core Features
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}>
          {availableFeatures.map((f) => (
            <div key={f.title} className="g-default" style={{
              borderRadius: 20,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s",
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <f.icon size={20} color="var(--color-foreground)" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-foreground)",
                    letterSpacing: "-0.02em",
                  }}>
                    {f.title}
                  </h3>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 99,
                    background: "rgba(22,163,74,0.08)",
                    border: "1px solid rgba(22,163,74,0.20)",
                    color: "#16a34a",
                    whiteSpace: "nowrap",
                  }}>
                    ✓ Available
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "var(--color-muted-foreground)",
                  lineHeight: 1.7,
                }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMING SOON ── */}
      <section style={{
        background: "var(--color-muted)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        padding: "clamp(60px,8vw,100px) clamp(20px,5vw,32px)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-muted-foreground)",
            }}>
              Roadmap
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem,3vw,2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-foreground)",
              marginTop: 8,
            }}>
              What&apos;s coming next
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "var(--color-muted-foreground)",
              marginTop: 8,
              lineHeight: 1.7,
            }}>
              We&apos;re building the future of legal intelligence. Here&apos;s a preview.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}>
            {comingSoonFeatures.map((f) => (
              <div key={f.title} style={{
                borderRadius: 20,
                padding: 28,
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.05)",
                opacity: 0.85,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={20} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--color-foreground)",
                      letterSpacing: "-0.02em",
                    }}>
                      {f.title}
                    </h3>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.58rem",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 99,
                      background: "rgba(217,119,6,0.08)",
                      border: "1px solid rgba(217,119,6,0.20)",
                      color: "#d97706",
                      whiteSpace: "nowrap",
                    }}>
                      Coming Soon
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "var(--color-muted-foreground)",
                    lineHeight: 1.7,
                  }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "clamp(60px,8vw,100px) clamp(20px,5vw,32px)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem,3vw,2.5rem)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "var(--color-foreground)",
          marginBottom: 14,
        }}>
          Ready to try it yourself?
        </h2>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          color: "var(--color-muted-foreground)",
          marginBottom: 28,
          lineHeight: 1.7,
        }}>
          Start free — no credit card required.
        </p>
        <Link href="/register" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 32px",
          borderRadius: 20,
          background: "var(--color-primary-btn)",
          color: "#FAF8F3",
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        }}>
          Analyze Your First Document →
        </Link>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--color-muted-foreground)",
          marginTop: 16,
        }}>
          No credit card · No commitment · 3 free analyses
        </p>
      </section>

    </div>
  )
}
