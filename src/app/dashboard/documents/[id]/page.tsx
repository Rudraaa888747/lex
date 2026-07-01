"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft, MessageSquare, Download, AlertTriangle, Calendar, DollarSign, Shield, User, BookOpen, CheckCircle, XCircle, Brain, Loader2, Info } from "lucide-react"
import { formatDate } from "@/lib/helpers"
import { showToast } from "@/components/premium-toast"
import type { ContractScoreCard } from "@/types/analysis"
import { isPremiumPlan } from "@/lib/subscription"

interface DocumentData {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  content?: string
}

interface AnalysisData {
  summary?: string
  plainLanguage?: string
  keyClauses?: string
  rightsObligations?: string
  importantDates?: string
  financialTerms?: string
  riskAssessment?: string
  topRedFlags?: string
  importantClauses?: string
  beforeYouSign?: string
  legalInsights?: string
  contractScore?: string
}

function safeJsonParse<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export default function DocumentDetailsPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [doc, setDoc] = useState<DocumentData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [])

  useEffect(() => {
    if (!showUpgradeModal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUpgradeModal(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [showUpgradeModal])

  const handleStartAnalysis = useCallback(async () => {
    setAnalyzing(true)
    try {
      const res = await fetch(`/api/analyze/${params.id}`, { method: "POST" })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed")
      }
      
      // If analysis was returned synchronously (e.g. already existed)
      if (data.analysis) {
        setAnalysis(data.analysis)
        setDoc(prev => prev ? { ...prev, status: "COMPLETED" } : prev)
        setAnalyzing(false)
        showToast("Analysis complete", "success")
      }
      // If background task started, do NOT setAnalyzing(false). Let the polling handle it.
      
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Analysis failed", "error")
      setAnalyzing(false)
    }
  }, [params.id])

  useEffect(() => {
    if (!analyzing) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/documents/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.document?.status === "COMPLETED" || 
              data.analysis) {
            setDoc(data.document)
            setAnalysis(data.analysis)
            setAnalyzing(false)
            clearInterval(interval)
            showToast("Analysis complete", "success")
          }
          if (data.document?.status === "FAILED") {
            setAnalyzing(false)
            clearInterval(interval)
            showToast("Analysis failed", "error")
          }
        }
      } catch { /* silent */ }
    }, 3000)
    return () => clearInterval(interval)
  }, [analyzing, params.id])

  const handleDownloadReport = useCallback(async () => {
    if (!doc) return
    if (!isPremiumPlan(session?.user?.plan)) {
      setShowUpgradeModal(true)
      return
    }

    setDownloadingReport(true)
    try {
      const response = await fetch(`/api/documents/${doc.id}/report`)
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || "Report download failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${doc.title.replace(/[^a-zA-Z0-9-_]/g, "_")}-report.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Report download failed", "error")
    } finally {
      setDownloadingReport(false)
    }
  }, [doc, session?.user?.plan])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/documents/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) {
            setDoc(data.document)
            setAnalysis(data.analysis)
          }
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (params.id) load()
    return () => { cancelled = true }
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 rounded bg-[rgba(0,0,0,0.06)] shimmer" />
        <div className="h-48 rounded-2xl bg-[rgba(0,0,0,0.04)] border border-border shimmer" />
        <div className="h-64 rounded-2xl bg-[rgba(0,0,0,0.04)] border border-border shimmer" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground">Document not found</h2>
        <Link href="/dashboard/documents" className="text-foreground hover:underline text-sm mt-2 inline-block font-medium">Back to documents</Link>
      </div>
    )
  }

  type RedFlag = { title: string, severityScore: number, riskLevel: string, explanation: string, evidence: string, businessImpact: string }
  type ImportantClause = { section: string, title: string, importance: string, shortSummary: string, evidence: string }
  type BeforeYouSign = { questionsToAsk: string[], clausesToNegotiate: string[], missingProtections: string[], potentialLegalConcerns: string[] }
  type LegalInsight = { answer: boolean, evidence: string }
  type LegalInsightsData = {
    canClientTerminate?: LegalInsight,
    canProviderTerminate?: LegalInsight,
    liabilityLimitation?: LegalInsight,
    arbitrationRequired?: LegalInsight,
    jurisdictionSpecified?: LegalInsight,
    confidentialityPresent?: LegalInsight,
    autoRenewalPresent?: LegalInsight,
    indemnificationPresent?: LegalInsight,
    nonCompetePresent?: LegalInsight,
    ipTransferPresent?: LegalInsight,
    conflictOfInterestPresent?: LegalInsight,
    unusualClauses?: string[],
    oneSidedProvisions?: string[]
  }
  type FinancialData = { expectedCosts: string, paymentObligations: string, hiddenCosts: string, collectionExposure: string, financialRedFlags: string[] }
  type RightObligationItem = { clause?: string; category?: string; explanation?: string; evidence?: string, right?: string, obligation?: string }
  type DateItem = { deadline?: string; meaning?: string, impact?: string, date?: string, description?: string }

  const topRedFlags = safeJsonParse<RedFlag[]>(analysis?.topRedFlags || analysis?.riskAssessment, [])
  const importantClauses = safeJsonParse<ImportantClause[]>(analysis?.importantClauses || analysis?.keyClauses, [])
  const contractScore = safeJsonParse<ContractScoreCard | null>(analysis?.contractScore, null)
  const beforeYouSign = safeJsonParse<BeforeYouSign | null>(analysis?.beforeYouSign, null)
  const legalInsights = safeJsonParse<LegalInsightsData | null>(analysis?.legalInsights, null)
  const financialData = safeJsonParse<FinancialData | null>(analysis?.financialTerms, null)
  const rightsObligations = safeJsonParse<{ rights?: RightObligationItem[]; obligations?: RightObligationItem[] }>(analysis?.rightsObligations, {})
  const importantDates = safeJsonParse<DateItem[]>(analysis?.importantDates, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto overflow-hidden pb-20 lg:pb-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="icon" className="w-10 h-10 bg-card border border-border hover:bg-[rgba(0,0,0,0.04)]">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground truncate" style={{ fontFamily: "var(--font-display)" }}>{doc.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium capitalize">
            {doc.type?.replace(/_/g, " ").toLowerCase()} · {formatDate(doc.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {analysis && (
            <>
              <Link href={`/dashboard/chat?doc=${doc.id}`}>
                <Button variant="outline" size="sm" className="px-2 sm:px-4">
                  <MessageSquare className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Chat</span>
                </Button>
              </Link>
              <Button variant="gradient" size="sm" className="px-2 sm:px-4" onClick={handleDownloadReport} loading={downloadingReport}>
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {doc.content && (
        <div className="glass-subtle rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-border bg-[rgba(0,0,0,0.02)]">
          <button
            onClick={() => setShowContent(!showContent)}
            className="flex items-center justify-between w-full text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 border border-border">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-foreground/70 transition-colors flex items-center flex-wrap gap-1 sm:gap-2">
                Document Text
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">({doc.content.length.toLocaleString()} chars)</span>
              </h2>
            </div>
            <span className={`transition-transform duration-300 text-muted-foreground group-hover:text-foreground ${showContent ? "rotate-180" : ""}`}>▼</span>
          </button>
          {showContent && (
            <pre className="mt-5 p-5 rounded-2xl bg-card border border-border text-[0.85rem] text-foreground leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto font-mono scrollbar-hide shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
              {doc.content.substring(0, 10000)}{doc.content.length > 10000 ? "\n\n... (truncated)" : ""}
            </pre>
          )}
        </div>
      )}

      {analysis ? (
        <>
          {contractScore && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 border border-border">
              <div className="flex-1 space-y-2">
                <h2 className="text-heading text-2xl" style={{ fontFamily: "var(--font-display)" }}>Contract Fairness Score</h2>
                <p className="text-[0.95rem] text-foreground leading-relaxed">{contractScore.fairnessExplanation}</p>
                <div className="flex gap-3 mt-4">
                  <Badge variant={contractScore.score >= 7 ? "success" : contractScore.score >= 4 ? "warning" : "danger"} className="px-3 py-1 text-xs">
                    {contractScore.balance}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-xs">
                    Risk Exposure: {contractScore.riskExposure}
                  </Badge>
                </div>
              </div>
              <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)] border-4" 
                style={{ borderColor: contractScore.score >= 7 ? '#16a34a' : contractScore.score >= 4 ? '#d97706' : '#dc2626', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <span className="text-3xl font-bold" style={{ color: contractScore.score >= 7 ? '#16a34a' : contractScore.score >= 4 ? '#d97706' : '#dc2626' }}>
                  {contractScore.score}/10
                </span>
              </div>
            </div>
          )}

          {analysis.summary && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 border border-border">
                  <Brain className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Executive Summary</h2>
              </div>
              <p className="text-[0.95rem] text-foreground leading-relaxed">{analysis.summary}</p>
              {analysis.plainLanguage && (
                <div className="rounded-2xl bg-[rgba(0,0,0,0.03)] border border-border p-5 relative overflow-hidden">
                  <p className="text-[0.7rem] font-bold text-foreground uppercase tracking-[0.15em] mb-2 relative z-10">Plain Language Explanation</p>
                  <p className="text-[0.9rem] text-foreground/80 leading-relaxed relative z-10">{analysis.plainLanguage}</p>
                </div>
              )}
            </div>
          )}

          {topRedFlags && topRedFlags.length > 0 && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 border border-red-600/20 bg-red-600/5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-heading text-lg text-[#7f1d1d]" style={{ fontFamily: "var(--font-display)" }}>Top Red Flags</h2>
              </div>
              <div className="space-y-4">
                {topRedFlags.map((flag, i) => (
                  <div key={i} className="flex flex-col gap-2 text-sm p-5 rounded-xl bg-[rgba(220,38,38,0.06)] border border-red-600/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#dc2626] text-[1rem] flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        {flag.title || (flag as any).reason || "Risk"}
                      </span>
                      {flag.severityScore && <Badge variant="danger">Severity: {flag.severityScore}/10</Badge>}
                    </div>
                    <p className="text-[#7f1d1d] leading-relaxed">{flag.explanation || (flag as any).reason}</p>
                    {flag.businessImpact && <p className="text-[#991b1b] leading-relaxed text-xs font-semibold mt-1">Impact: {flag.businessImpact}</p>}
                    {flag.evidence && <p className="text-xs text-[#7f1d1d]/70 italic pl-3 border-l-2 border-red-600/30 mt-2 py-1">Evidence: {flag.evidence}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importantClauses && importantClauses.length > 0 && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Important Clauses</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {importantClauses.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-card border border-border hover:bg-[rgba(0,0,0,0.02)] transition-colors shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[0.75rem] font-bold text-foreground uppercase tracking-wider">
                        {item.title || (item as any).description?.substring(0, 20)}
                      </p>
                      {item.importance && <Badge variant="outline" className="text-[0.6rem] py-0">{item.importance}</Badge>}
                    </div>
                    {item.shortSummary && <p className="text-[0.9rem] text-foreground leading-relaxed">{item.shortSummary}</p>}
                    {!item.shortSummary && (item as any).description && <p className="text-[0.9rem] text-foreground leading-relaxed">{(item as any).description}</p>}
                    {item.evidence && (
                      <p className="text-xs text-muted-foreground italic pl-3 border-l-2 border-border mt-3 py-1">Evidence: {item.evidence}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightsObligations && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(22,163,74,0.08)] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Your Rights</h2>
                </div>
                <ul className="space-y-4">
                  {rightsObligations.rights && rightsObligations.rights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-[0.9rem] text-foreground leading-relaxed block font-medium">{item.clause || item.explanation || item.right}</span>
                        {item.evidence && <p className="text-xs text-muted-foreground mt-1.5 italic border-l-2 border-border pl-2">Evidence: {item.evidence}</p>}
                      </div>
                    </li>
                  ))}
                  {(!rightsObligations.rights || rightsObligations.rights.length === 0) && (
                    <li className="text-[0.9rem] text-muted-foreground">Not specified in document</li>
                  )}
                </ul>
              </div>
              <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(217,119,6,0.08)] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-[#d97706]" />
                  </div>
                  <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Your Obligations</h2>
                </div>
                <ul className="space-y-4">
                  {rightsObligations.obligations && rightsObligations.obligations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-[0.9rem] text-foreground leading-relaxed block font-medium">{item.clause || item.explanation || item.obligation}</span>
                        {item.evidence && <p className="text-xs text-muted-foreground mt-1.5 italic border-l-2 border-border pl-2">Evidence: {item.evidence}</p>}
                      </div>
                    </li>
                  ))}
                  {(!rightsObligations.obligations || rightsObligations.obligations.length === 0) && (
                    <li className="text-[0.9rem] text-muted-foreground">Not specified in document</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {(importantDates || financialData) && (
            <div className="grid sm:grid-cols-2 gap-6">
              {importantDates && importantDates.length > 0 && (
                <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.08)] flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Important Dates</h2>
                  </div>
                  <div className="space-y-3">
                    {importantDates.map((item, i) => (
                      <div key={i} className="flex flex-col p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                        <span className="font-bold text-foreground text-[0.95rem]">{item.deadline || item.date}</span>
                        {(item.meaning || item.description) && <span className="text-foreground/80 mt-1 text-[0.85rem] leading-relaxed">{item.meaning || item.description}</span>}
                        {item.impact && <span className="text-red-600 mt-1 text-[0.8rem] italic leading-relaxed">Impact: {item.impact}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {financialData && (
                <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(22,163,74,0.08)] flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-[#16a34a]" />
                    </div>
                    <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Financial Terms</h2>
                  </div>
                  <div className="space-y-3">
                    {financialData.expectedCosts && (
                      <div className="flex flex-col p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                        <span className="text-muted-foreground text-[0.85rem] font-bold uppercase tracking-wider">Expected Costs</span>
                        <span className="font-bold text-foreground text-[0.95rem]">{financialData.expectedCosts}</span>
                      </div>
                    )}
                    {financialData.paymentObligations && (
                      <div className="flex flex-col p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                        <span className="text-muted-foreground text-[0.85rem] font-bold uppercase tracking-wider">Payment Obligations</span>
                        <span className="font-bold text-foreground text-[0.95rem]">{financialData.paymentObligations}</span>
                      </div>
                    )}
                    {financialData.hiddenCosts && (
                      <div className="flex flex-col p-4 rounded-xl bg-[rgba(217,119,6,0.06)] border border-amber-600/20">
                        <span className="text-[#b45309] text-[0.85rem] font-bold uppercase tracking-wider">Hidden Costs</span>
                        <span className="font-bold text-[#78350f] text-[0.95rem]">{financialData.hiddenCosts}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {legalInsights && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-[#4f46e5]" />
                </div>
                <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Legal Insights</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Can Client Terminate?", data: legalInsights.canClientTerminate },
                  { label: "Can Provider Terminate?", data: legalInsights.canProviderTerminate },
                  { label: "Liability Limitation?", data: legalInsights.liabilityLimitation },
                  { label: "Arbitration Required?", data: legalInsights.arbitrationRequired },
                  { label: "Confidentiality Present?", data: legalInsights.confidentialityPresent },
                  { label: "Auto Renewal?", data: legalInsights.autoRenewalPresent },
                ].filter(i => i.data).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                    {item.data?.answer ? (
                      <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-[0.9rem] text-foreground">{item.label} {item.data?.answer ? "Yes" : "No"}</span>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.data?.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {beforeYouSign && (
            <div className="glass-default rounded-3xl p-6 sm:p-8 border border-foreground/20 bg-gradient-to-br from-card to-[rgba(0,0,0,0.04)] shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,0,0,0.08)] flex items-center justify-center shrink-0 border border-border">
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-heading text-xl text-foreground" style={{ fontFamily: "var(--font-display)" }}>Before You Sign (Actionable Advice)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {beforeYouSign.questionsToAsk && beforeYouSign.questionsToAsk.length > 0 && (
                  <div>
                    <h3 className="font-bold text-foreground uppercase text-xs tracking-wider mb-3">Questions to Ask</h3>
                    <ul className="space-y-2">
                      {beforeYouSign.questionsToAsk.map((q, i) => (
                        <li key={i} className="text-sm text-foreground/90 flex gap-2"><span className="text-foreground font-bold">•</span> {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {beforeYouSign.clausesToNegotiate && beforeYouSign.clausesToNegotiate.length > 0 && (
                  <div>
                    <h3 className="font-bold text-foreground uppercase text-xs tracking-wider mb-3">Clauses to Negotiate</h3>
                    <ul className="space-y-2">
                      {beforeYouSign.clausesToNegotiate.map((q, i) => (
                        <li key={i} className="text-sm text-foreground/90 flex gap-2"><span className="text-foreground font-bold">•</span> {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {beforeYouSign.missingProtections && beforeYouSign.missingProtections.length > 0 && (
                  <div>
                    <h3 className="font-bold text-[#b45309] uppercase text-xs tracking-wider mb-3">Missing Protections</h3>
                    <ul className="space-y-2">
                      {beforeYouSign.missingProtections.map((q, i) => (
                        <li key={i} className="text-sm text-foreground/90 flex gap-2"><span className="text-[#d97706] font-bold">•</span> {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {beforeYouSign.potentialLegalConcerns && beforeYouSign.potentialLegalConcerns.length > 0 && (
                  <div>
                    <h3 className="font-bold text-[#dc2626] uppercase text-xs tracking-wider mb-3">Potential Legal Concerns</h3>
                    <ul className="space-y-2">
                      {beforeYouSign.potentialLegalConcerns.map((q, i) => (
                        <li key={i} className="text-sm text-foreground/90 flex gap-2"><span className="text-red-600 font-bold">•</span> {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="glass-subtle rounded-3xl p-6 sm:p-8 border border-amber-600/20 bg-[rgba(217,119,6,0.06)] text-center">
            <p className="text-sm text-[#78350f] font-medium">
              ⚖️ This analysis is AI-generated and should not be considered legal advice. Consult a qualified legal professional.
            </p>
          </div>
        </>
      ) : doc.status === "PROCESSING" || doc.status === "OCR_PROCESSING" || doc.status === "ANALYZING" ? (
        <div className="glass-default rounded-3xl p-14 text-center border border-border bg-card shadow-[var(--shadow-md)]">
          <Loader2 className="w-14 h-14 animate-spin text-foreground mx-auto mb-6 drop-shadow-[var(--shadow-sm)]" />
          <h2 className="text-heading text-xl mb-3 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {doc.status === "OCR_PROCESSING"
              ? "Running OCR on Your Document"
              : doc.status === "PROCESSING"
                ? "Extracting Document Text"
                : "Analyzing Your Document"}
          </h2>
          <p className="text-[0.95rem] text-muted-foreground max-w-sm mx-auto">
            {doc.status === "OCR_PROCESSING"
              ? "We are reading text from the uploaded image before legal analysis starts."
              : doc.status === "PROCESSING"
                ? "Our system is extracting text from your document. This may take a moment..."
                : "Our AI is processing your document. This may take a minute..."}
          </p>
        </div>
      ) : doc.status === "FAILED" ? (
        <div className="glass-default rounded-3xl p-14 text-center border border-red-600/20 bg-[rgba(220,38,38,0.06)] shadow-[var(--shadow-sm)]">
          <div className="w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-heading text-xl mb-3 text-[#7f1d1d]" style={{ fontFamily: "var(--font-display)" }}>Extraction Failed</h2>
          <p className="text-[0.95rem] text-[#991b1b]/80 max-w-sm mx-auto">We couldn't extract readable text from this document. Please ensure the file contains selectable text and try again.</p>
        </div>
      ) : analyzing ? (
        <div className="glass-default rounded-3xl border border-border"
          style={{
            padding: "clamp(48px,6vw,80px) 32px",
            textAlign: "center",
            background: "rgba(255,255,255,0.85)",
          }}>
          
          {/* Animated rings */}
          <div style={{
            position: "relative",
            width: 80,
            height: 80,
            margin: "0 auto 32px",
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.06)",
            }} />
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "var(--color-foreground)",
              animation: "spin 1s linear infinite",
            }} />
            <div style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "rgba(0,0,0,0.3)",
              animation: "spin 1.5s linear infinite reverse",
            }} />
            <div style={{
              position: "absolute",
              inset: "50%",
              transform: "translate(-50%,-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Brain size={14} color="var(--color-foreground)" />
            </div>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-foreground)",
            marginBottom: 12,
          }}>
            Analyzing Your Document
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            color: "var(--color-muted-foreground)",
            maxWidth: 400,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            Our AI is reading every clause, identifying risks, 
            and building your report. This takes 30–60 seconds.
          </p>

          {/* Steps */}
          {[
            "Parsing document structure",
            "Identifying key clauses",
            "Detecting risks & red flags",
            "Generating plain language summary",
            "Building your report",
          ].map((step, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              maxWidth: 320,
              margin: "0 auto 10px",
              padding: "10px 16px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.05)",
              animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s both`,
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.1)",
                borderTopColor: "var(--color-foreground)",
                animation: "spin 1s linear infinite",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--color-muted-foreground)",
              }}>
                {step}
              </span>
            </div>
          ))}

          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--color-muted-foreground)",
            marginTop: 24,
            opacity: 0.6,
          }}>
            Do not close this page
          </p>
        </div>
      ) : (
        <div className="glass-default rounded-3xl p-14 text-center border border-border shadow-[var(--shadow-sm)]">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
            <Brain className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-heading text-xl mb-3 text-foreground" style={{ fontFamily: "var(--font-display)" }}>Analysis Pending</h2>
          <p className="text-[0.95rem] text-muted-foreground mb-8 max-w-sm mx-auto">Your document is queued for analysis. Start the AI process when you are ready.</p>
          <Button variant="gradient" size="lg" onClick={handleStartAnalysis} loading={analyzing} className="px-8">
            <Brain className="w-4 h-4 mr-2" />
            {analyzing ? "Analyzing…" : "Start Analysis"}
          </Button>
        </div>
      )}

      {showUpgradeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: "rgba(15,14,13,0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpgradeModal(false)
          }}
        >
          <div style={{
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(48px)",
            WebkitBackdropFilter: "blur(48px)",
            borderRadius: 24,
            padding: "32px",
            width: "100%",
            maxWidth: 420,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 32px 80px -12px rgba(0,0,0,0.25), 0 8px 32px -8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1)",
            animation: "modalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
          }}>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Premium Feature</h2>
            <p className="text-muted-foreground mt-3">
              Report Download is available for Premium members only.
            </p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeModal(false)}>
                Maybe later
              </Button>
              <Link href="/pricing" className="flex-1">
                <Button variant="gradient" className="w-full" onClick={() => setShowUpgradeModal(false)}>
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
