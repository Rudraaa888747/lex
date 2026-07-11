"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  GitCompare,
  AlertTriangle,
  Loader2,
  FileText,
  CheckCircle,
  ChevronDown,
  ArrowLeftRight,
  ShieldAlert,
  ListChecks,
  ScrollText,
  Upload,
  Plus,
} from "lucide-react"
import { showToast } from "@/components/premium-toast"

// ─── Types ────────────────────────────────────────────────────────────────────
interface DocumentItem {
  id: string
  title: string
}

interface ComparisonClause {
  clauseName: string
  comparison: string
  evidenceDoc1?: string | null
  evidenceDoc2?: string | null
}

interface ComparisonResult {
  clauses?: Record<string, string> | ComparisonClause[]
  risks?: string[]
  differences?: string[]
  summary?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DOC_TYPES = ["contract", "nda", "policy", "terms", "license", "agreement"]

function detectDocType(title: string): string {
  const t = title.toLowerCase()
  return DOC_TYPES.find((dt) => t.includes(dt)) ?? "document"
}

function riskLevel(text: string): {
  label: string
  color: string
  bg: string
  border: string
} {
  const t = text.toLowerCase()
  if (t.includes("critical") || t.includes("severe") || t.includes("high"))
    return { label: "High", color: "text-red-700", bg: "bg-red-50", border: "border-red-600/20" }
  if (t.includes("medium") || t.includes("moderate") || t.includes("warning"))
    return { label: "Medium", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-600/20" }
  if (t.includes("low") || t.includes("minor"))
    return { label: "Low", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-600/20" }
  return { label: "Info", color: "text-muted-foreground", bg: "bg-card", border: "border-border" }
}

// ─── DocBadge ─────────────────────────────────────────────────────────────────
function DocBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[rgba(0,0,0,0.06)] text-foreground border border-[rgba(0,0,0,0.1)] shrink-0">
      {type}
    </span>
  )
}

// ─── SelectDropdown ───────────────────────────────────────────────────────────
function SelectDropdown({
  label,
  slot,
  value,
  onChange,
  documents,
  excludeId,
  placeholder,
}: {
  label: string
  slot: "A" | "B"
  value: string
  onChange: (v: string) => void
  documents: DocumentItem[]
  excludeId: string
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const selected = documents.find((d) => d.id === value)
  const slotColor = slot === "A" ? "text-foreground bg-[rgba(0,0,0,0.04)] border-[rgba(0,0,0,0.1)]" : "text-foreground bg-[rgba(0,0,0,0.08)] border-[rgba(0,0,0,0.2)]"

  return (
    <div className="space-y-2" ref={ref}>
      {/* Label row */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold border ${slotColor}`}>
          {slot}
        </span>
        <label className="text-sm font-medium text-foreground">{label}</label>
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-14 rounded-xl border border-border glass-subtle text-foreground px-4 text-[0.95rem] flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all hover:glass-default hover:border-[rgba(0,0,0,0.15)] active:scale-[0.99] shadow-[var(--shadow-sm)]"
      >
        <span className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
          {selected ? (
            <>
              <FileText className="w-4 h-4 shrink-0 text-foreground" />
              <span className="truncate text-foreground font-semibold">{selected.title}</span>
              <DocBadge type={detectDocType(selected.title)} />
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-[var(--shadow-lg)]">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false) }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[rgba(0,0,0,0.04)] border-b border-border font-medium ${
                !value ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {placeholder}
            </button>

            {documents.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No documents found
              </div>
            )}

            {documents.map((d) => {
              const isExcluded = d.id === excludeId
              const isSelected = d.id === value
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={isExcluded}
                  onClick={() => { if (!isExcluded) { onChange(d.id); setOpen(false) } }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                    isExcluded
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-[rgba(0,0,0,0.06)] text-foreground font-semibold"
                        : "text-foreground hover:bg-[rgba(0,0,0,0.04)]"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-foreground" />
                  <span className="truncate flex-1 text-sm">{d.title}</span>
                  <DocBadge type={detectDocType(d.title)} />
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />}
                  {isExcluded && (
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground shrink-0 font-bold">In use</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl glass-default p-5 space-y-3 animate-pulse border border-border">
      <div className="h-4 w-1/3 rounded-lg bg-[rgba(0,0,0,0.06)]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 rounded-lg bg-[rgba(0,0,0,0.04)]" style={{ width: `${55 + i * 14}%` }} />
      ))}
    </div>
  )
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function ResultSection({
  icon: Icon,
  title,
  accent = "#0F0E0D",
  children,
}: {
  icon: React.ElementType
  title: string
  accent?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-[rgba(0,0,0,0.02)]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-border bg-card shadow-sm">
          <Icon className="w-3.5 h-3.5 text-foreground" />
        </div>
        <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CompareClient({ initialDocuments }: { initialDocuments: DocumentItem[] }) {
  const router = useRouter()
  const [doc1, setDoc1] = useState("")
  const [doc2, setDoc2] = useState("")
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("language", "EN") // Provide a default language since the upload API requires it
      const res = await fetch("/api/documents/upload", { method: "POST", body: form })
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed")
      const data = await res.json()
      setDocuments((prev) => [...prev, { id: data.document.id, title: data.document.title }])
      if (!doc1) setDoc1(data.document.id)
      else if (!doc2) setDoc2(data.document.id)
      showToast("Document uploaded", "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }, [doc1, doc2])

  const handleCompare = async () => {
    if (!doc1 || !doc2) {
      showToast("Select two documents to compare", "error")
      return
    }
    if (doc1 === doc2) {
      showToast("Select two different documents", "error")
      return
    }
    setComparing(true)
    setResult(null)
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentIds: [doc1, doc2] }),
      })
      if (res.ok) {
        const data = await res.json()
        const raw = data.result
        setResult(raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : data)
      } else {
        showToast("Comparison failed. Try again.", "error")
      }
    } catch {
      showToast("Comparison failed. Try again.", "error")
    } finally {
      setComparing(false)
    }
  }

  const canCompare = !!doc1 && !!doc2 && !comparing

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-title" style={{ fontFamily: "var(--font-display)" }}>
          Compare Documents
        </h1>
        <p className="text-subtitle mt-2">
          Select two documents to compare clauses, risks, and key differences
        </p>
      </div>

      {/* Selector Card */}
      <div className="rounded-3xl glass-default p-6 space-y-6 border border-border shadow-[var(--shadow-sm)]">
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectDropdown
            label="First Document"
            slot="A"
            value={doc1}
            onChange={setDoc1}
            documents={documents}
            excludeId={doc2}
            placeholder="Select document…"
          />
          {/* VS divider — visible only on mobile between the two dropdowns */}
          <div className="sm:hidden flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">vs</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <SelectDropdown
            label="Second Document"
            slot="B"
            value={doc2}
            onChange={setDoc2}
            documents={documents}
            excludeId={doc1}
            placeholder="Select document…"
          />
        </div>

        {/* VS indicator desktop — between the two selected titles */}
        {doc1 && doc2 && (
          <div className="hidden sm:flex items-center justify-center gap-2 py-1">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">comparing two documents</span>
          </div>
        )}

        {/* Upload from device */}
        <div className="relative">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,.doc"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-[rgba(0,0,0,0.15)] hover:text-foreground hover:bg-[rgba(0,0,0,0.02)] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-foreground" />
            ) : (
              <Plus className="w-4 h-4 text-foreground" />
            )}
            {uploading ? "Uploading…" : "Upload a document from your device"}
          </button>
        </div>

        <Button
          variant="gradient"
          size="lg"
          onClick={handleCompare}
          disabled={!canCompare}
          loading={comparing}
          className="w-full"
        >
          {comparing ? (
            "Analyzing…"
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              Compare Documents
            </>
          )}
        </Button>
      </div>

      {/* Empty state */}
      {documents.length === 0 && (
        <div className="rounded-3xl glass-subtle p-12 text-center space-y-4 border border-dashed border-border bg-[rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto shadow-[var(--shadow-sm)]">
            <FileText className="w-8 h-8 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>No documents yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload at least two documents to start comparing</p>
          </div>
          <Button variant="gradient" size="sm" onClick={() => router.push("/dashboard/upload")}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      )}

      {/* Comparing skeleton */}
      {comparing && (
        <div className="space-y-3">
          <SkeletonBlock lines={2} />
          <SkeletonBlock lines={4} />
          <SkeletonBlock lines={3} />
        </div>
      )}

      {/* Results */}
      {result && !comparing && (
        <div className="space-y-4">
          {/* Summary */}
          {result.summary && (
            <ResultSection icon={ScrollText} title="Comparison Summary">
              <p className="text-sm text-foreground/80 leading-relaxed">{result.summary}</p>
            </ResultSection>
          )}

          {/* Clauses */}
          {result.clauses && (Array.isArray(result.clauses) ? result.clauses.length > 0 : Object.keys(result.clauses).length > 0) && (
            <ResultSection icon={GitCompare} title="Clause Comparison">
              <div className="space-y-2.5">
                {Array.isArray(result.clauses)
                  ? result.clauses.map((clause, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                        <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5">
                          {clause.clauseName}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{clause.comparison}</p>
                        {(clause.evidenceDoc1 || clause.evidenceDoc2) && (
                          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                            {clause.evidenceDoc1 && <p className="text-xs text-muted-foreground italic border-l-2 border-[var(--color-primary)] pl-2">Doc 1: {clause.evidenceDoc1}</p>}
                            {clause.evidenceDoc2 && <p className="text-xs text-muted-foreground italic border-l-2 border-[var(--color-primary)] pl-2">Doc 2: {clause.evidenceDoc2}</p>}
                          </div>
                        )}
                      </div>
                    ))
                  : Object.entries(result.clauses).map(([key, value]) => (
                      <div key={key} className="p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
                        <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{value as string}</p>
                      </div>
                    ))}
              </div>
            </ResultSection>
          )}

          {/* Risks */}
          {result.risks && result.risks.length > 0 && (
            <ResultSection icon={ShieldAlert} title="Risk Comparison" accent="#dc2626">
              <div className="space-y-2">
                {result.risks.map((risk, i) => {
                  const lvl = riskLevel(risk)
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-xl border ${lvl.bg} ${lvl.border} shadow-[var(--shadow-sm)]`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-border bg-card`}>
                        <AlertTriangle className={`w-3.5 h-3.5 ${lvl.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${lvl.color}`}>
                          {lvl.label}
                        </span>
                        <p className="text-sm text-foreground/90 leading-relaxed font-medium">{risk}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ResultSection>
          )}

          {/* Differences */}
          {result.differences && result.differences.length > 0 && (
            <ResultSection icon={ListChecks} title="Key Differences">
              <ol className="space-y-2">
                {result.differences.map((diff, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 text-[11px] font-bold text-foreground border border-border">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">{diff}</p>
                  </li>
                ))}
              </ol>
            </ResultSection>
          )}
        </div>
      )}
    </div>
  )
}
