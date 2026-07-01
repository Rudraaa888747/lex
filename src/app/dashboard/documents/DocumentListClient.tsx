"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Search, ArrowRight, Trash2 } from "lucide-react"
import { formatDate, formatFileSize } from "@/lib/helpers"
import { showToast } from "@/components/premium-toast"

interface DocumentItem {
  id: string
  title: string
  type: string
  fileSize: number
  status: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Analyzed",
  PROCESSING: "Processing",
  OCR_PROCESSING: "OCR Processing",
  READY_FOR_ANALYSIS: "Ready",
  ANALYZING: "Analyzing",
  FAILED: "Failed",
  PENDING: "Pending",
}

const STATUS_VARIANTS: Record<string, "success" | "warning" | "secondary" | "danger"> = {
  COMPLETED: "success",
  PROCESSING: "warning",
  OCR_PROCESSING: "warning",
  READY_FOR_ANALYSIS: "secondary",
  ANALYZING: "warning",
  FAILED: "danger",
  PENDING: "secondary",
}

export function DocumentListClient({ initialDocuments }: { initialDocuments: DocumentItem[] }) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [deleting, setDeleting] = useState<string | null>(null)

  const deleteDocument = useCallback(async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id))
        showToast("Document deleted", "success")
      } else {
        showToast("Failed to delete document", "error")
      }
    } catch {
      showToast("Failed to delete document", "error")
    } finally {
      setDeleting(null)
    }
  }, [])

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === "ALL" || doc.type === filter
      return matchesSearch && matchesFilter
    })
  }, [documents, search, filter])

  const filterOptions = [
    { value: "ALL", label: "All Types" },
    { value: "RENTAL_AGREEMENT", label: "Rental Agreement" },
    { value: "EMPLOYMENT_CONTRACT", label: "Employment Contract" },
    { value: "NDA", label: "NDA" },
    { value: "SERVICE_CONTRACT", label: "Service Contract" },
    { value: "OTHER", label: "Other" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-title" style={{ fontFamily: "var(--font-display)" }}>My Documents</h1>
          <p className="text-subtitle mt-2">{documents.length} document{documents.length !== 1 ? "s" : ""} uploaded</p>
        </div>
        <Link href="/dashboard/upload" className="w-full sm:w-auto"><Button variant="gradient" size="lg" className="w-full sm:w-auto"><Upload className="w-4 h-4" />Upload New<ArrowRight className="w-4 h-4" /></Button></Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-12 sm:h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground shadow-[var(--shadow-sm)]" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-12 sm:h-12 rounded-xl border border-border bg-card text-foreground px-4 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer shadow-[var(--shadow-sm)]">
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-subtle rounded-3xl p-14 text-center border border-dashed border-border">
          <div className="w-20 h-20 rounded-3xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-sm)]">
            <FileText className="w-10 h-10 text-foreground" />
          </div>
          <h3 className="font-semibold text-xl mb-3 text-foreground" style={{ fontFamily: "var(--font-display)" }}>No documents found</h3>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">Upload your first document or change your search filters.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-hidden">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-card border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] group relative">
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(0,0,0,0.04)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5 sm:pt-0">
                  <Link href={`/dashboard/documents/${doc.id}`} className="font-semibold text-[0.95rem] sm:text-base hover:text-foreground/80 transition-colors truncate block text-foreground pr-8 sm:pr-0">{doc.title}</Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] sm:text-[0.8rem] text-muted-foreground mt-1.5 font-medium">
                    <span>{formatDate(doc.createdAt)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize">{doc.type?.replace(/_/g, " ").toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end mt-1 sm:mt-0 pl-14 sm:pl-0">
                <Badge variant={STATUS_VARIANTS[doc.status] || "secondary"} className="text-[0.65rem] sm:text-xs px-2.5 sm:py-1">
                  {STATUS_LABELS[doc.status] || doc.status}
                </Badge>
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                disabled={deleting === doc.id}
                className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 sm:p-3 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50 opacity-100 sm:opacity-0 group-hover:opacity-100"
                aria-label={`Delete ${doc.title}`}
              >
                <Trash2 className={`w-4 h-4 sm:w-5 sm:h-5 ${deleting === doc.id ? "animate-spin" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
