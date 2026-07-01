"use client"

import Link from "next/link"
import { Upload, Brain, FileSearch, Download, ArrowRight, ShieldCheck, Zap, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    icon: Key,
    title: "1. Create an Account or Log In",
    desc: "Sign up securely in seconds. We use bank-grade encryption to ensure your data stays safe from the moment you join.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    glow: "shadow-[var(--shadow-sm)]"
  },
  {
    icon: Upload,
    title: "2. Upload Your Legal Document",
    desc: "Drag and drop any Rental Agreement, NDA, Employment Contract, or Policy. We support PDF, DOCX, TXT, and scanned images.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "shadow-[var(--shadow-sm)]"
  },
  {
    icon: Brain,
    title: "3. AI Deep Analysis",
    desc: "Our neural engine scans every line of the fine print, mapping obligations, identifying hidden risks, and decoding complex legal jargon.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    glow: "shadow-[var(--shadow-sm)]"
  },
  {
    icon: FileSearch,
    title: "4. Get Plain English Summaries",
    desc: "Instantly see what the contract actually means. Complex clauses are simplified into easy-to-understand terms so you know exactly what you're agreeing to.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    glow: "shadow-[var(--shadow-sm)]"
  },
  {
    icon: Download,
    title: "5. Export & Act with Confidence",
    desc: "Download a professional PDF or DOCX report of the analysis to share with your team, lawyer, or counterparties before you sign.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    glow: "shadow-[var(--shadow-sm)]"
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgba(0,0,0,0.02)] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[rgba(0,0,0,0.03)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.06)] border border-border text-foreground text-sm font-semibold mb-6 shadow-[var(--shadow-sm)]">
            <Zap className="w-4 h-4 text-amber-500" />
            Simple & Transparent Process
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 text-balance" style={{ fontFamily: "var(--font-display)" }}>
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">Lex</span> Works
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            We turn dense, intimidating legal contracts into clear, actionable insights in seconds. Here is the step-by-step journey from upload to clarity.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 relative before:absolute before:inset-0 before:ml-[28px] sm:before:ml-[39px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start sm:items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full border-[4px] border-card bg-card shadow-[var(--shadow-md)] z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 group-hover:scale-110 transition-transform duration-500">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border ${step.bg} ${step.border} ${step.glow} transition-all duration-500`}>
                  <step.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${step.color}`} />
                </div>
              </div>
              <div className="w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)] md:w-[calc(50%-3rem)] glass-elevated border border-border bg-card rounded-3xl p-6 sm:p-8 hover:bg-[rgba(0,0,0,0.02)] transition-colors duration-300 shadow-[var(--shadow-sm)]">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-subtle border border-border bg-card rounded-3xl p-8 sm:p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-[var(--shadow-md)]" style={{ animationDelay: "800ms" }}>
          <div className="w-16 h-16 bg-[rgba(0,0,0,0.06)] border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-sm)]">
            <ShieldCheck className="w-8 h-8 text-foreground" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-foreground mb-4 text-balance" style={{ fontFamily: "var(--font-display)" }}>Ready to understand your contracts?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto font-medium">
            Join thousands of professionals who use Lex to sign agreements with confidence and eliminate legal blind spots.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="gradient" className="w-full sm:w-auto px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
