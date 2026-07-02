"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { FileText, FileSearch, Shield, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { documentTypes, type DocumentTypeInfo } from "@/data/document-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, typeof FileText> = {
  FileText,
  FileSearch,
  Shield,
}

function DocIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = iconMap[name] || FileText
  return <Icon className={className} style={style} />
}

const sectionStyles =
  "g-default rounded-2xl p-5 sm:p-7 space-y-4 animate-in"
const sectionHeading = "flex items-center gap-2.5 text-base sm:text-lg font-bold"
const listItem = "flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"

export default function DocumentTypePage() {
  const params = useParams()
  const slug = params.slug as string
  const doc = documentTypes.find((d) => d.slug === slug)

  if (!doc) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-[#9aa0a6]/20 mx-auto mb-5" />
          <h1 className="text-2xl font-bold mb-2">Document type not found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We don&apos;t have an information page for &ldquo;{slug}&rdquo; yet. Check our supported document list or go back home.
          </p>
          <Link href="/">
            <Button variant="gradient" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <style>{`
        :root {
          --max-w: 860px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-in-delay-1 { animation-delay: 0.1s; }
        .animate-in-delay-2 { animation-delay: 0.2s; }
        .animate-in-delay-3 { animation-delay: 0.3s; }
        .animate-in-delay-4 { animation-delay: 0.4s; }
        .animate-in-delay-5 { animation-delay: 0.5s; }
        .animate-in-delay-6 { animation-delay: 0.6s; }
      `}</style>

      {/* mesh bg */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(at 20% 15%, rgba(255,255,255,0.03) 0px, transparent 50%),
            radial-gradient(at 80% 85%, rgba(255,255,255,0.02) 0px, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-[var(--max-w)] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        {/* Back */}
        <div className="animate-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-[rgba(0,0,0,0.04)] border border-border rounded-full shadow-sm transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        {/* Header */}
        <header className="g-default rounded-2xl p-6 sm:p-8 animate-in animate-in-delay-1">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(180,197,255,0.1)" }}
            >
              <DocIcon name={doc.icon} className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{doc.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Supported Document Type</p>
            </div>
          </div>
        </header>

        {/* What Is This Document? */}
        <section className={`${sectionStyles} animate-in-delay-2`}>
          <h2 className={sectionHeading}>
            <FileSearch className="w-5 h-5" style={{ color: "var(--primary)" }} />
            What Is This Document?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{doc.whatItIs}</p>
        </section>

        {/* Why It Matters */}
        <section className={`${sectionStyles} animate-in-delay-3`}>
          <h2 className={sectionHeading}>
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--warn)" }} />
            Why It Matters
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{doc.whyItMatters}</p>
        </section>

        {/* Common Risks */}
        <section className={`${sectionStyles} animate-in-delay-3`}>
          <h2 className={sectionHeading}>
            <Shield className="w-5 h-5" style={{ color: "var(--error)" }} />
            Common Risks to Watch For
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {doc.commonRisks.map((risk) => (
              <Badge key={risk} variant="danger" size="sm">
                {risk}
              </Badge>
            ))}
          </div>
          <ul className="space-y-2">
            {doc.commonRisks.map((risk) => (
              <li key={risk} className={listItem}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--error)" }} />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What the AI Analyzes */}
        <section className={`${sectionStyles} animate-in-delay-4`}>
          <h2 className={sectionHeading}>
            <FileText className="w-5 h-5" style={{ color: "var(--primary)" }} />
            What the AI Analyzes
          </h2>
          <ul className="space-y-2">
            {doc.aiAnalyzes.map((item) => (
              <li key={item} className={listItem}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What Insights You'll Receive */}
        <section className={`${sectionStyles} animate-in-delay-5`}>
          <h2 className={sectionHeading}>
            <FileSearch className="w-5 h-5" style={{ color: "var(--primary)" }} />
            What Insights You&apos;ll Receive
          </h2>
          <ul className="space-y-2">
            {doc.insightsYouReceive.map((insight) => (
              <li key={insight} className={listItem}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How Lex Helps */}
        <section className={`${sectionStyles} animate-in-delay-5`}>
          <h2 className={sectionHeading}>
            <Shield className="w-5 h-5" style={{ color: "var(--primary)" }} />
            How Lex Helps
          </h2>
          <ul className="space-y-2">
            {doc.howPlatformHelps.map((help) => (
              <li key={help} className={listItem}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                <span>{help}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="g-default rounded-2xl p-6 sm:p-10 text-center animate-in animate-in-delay-6 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: "rgba(255,255,255,0.03)", filter: "blur(80px)" }}
          />
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Want to analyze your own {doc.title.toLowerCase()}?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your document and get an instant AI-powered analysis with plain-language explanations.
            </p>
            <Link href="/dashboard/upload">
              <Button variant="gradient" size="xl">
                Analyze Your Document
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs font-medium text-center text-muted-foreground/80 leading-relaxed animate-in animate-in-delay-6">
          The information provided on this page is for educational purposes only and does not constitute legal advice.
          Always consult a qualified legal professional for advice specific to your situation.
        </p>
      </div>
    </div>
  )
}
