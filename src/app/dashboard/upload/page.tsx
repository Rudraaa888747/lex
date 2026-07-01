"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, File, Image, CheckCircle, AlertCircle, X, ArrowRight, Loader2 } from "lucide-react"
import { showToast } from "@/components/premium-toast"

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "png", "jpg", "jpeg"]
const MAX_FILE_SIZE = 50 * 1024 * 1024

const LANGUAGES = [
  { code: "EN", label: "English", native: "English" },
  { code: "HI", label: "Hindi", native: "हिन्दी" },
  { code: "GU", label: "Gujarati", native: "ગુજરાતી" },
]

const FILE_ICONS: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "text-rose-600" },
  docx: { icon: FileText, color: "text-blue-600" },
  txt: { icon: File, color: "text-gray-600" },
  png: { icon: Image, color: "text-emerald-600" },
  jpg: { icon: Image, color: "text-emerald-600" },
  jpeg: { icon: Image, color: "text-emerald-600" },
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || ""
  const info = FILE_ICONS[ext] || FILE_ICONS.txt
  return <info.icon className={`w-6 h-6 ${info.color}`} />
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || ""
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", txt: "TXT", png: "Image", jpg: "Image", jpeg: "Image" }
  return map[ext] || "Unknown"
}

export default function UploadPage() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [language, setLanguage] = useState<string>("")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase()
      return ext && ALLOWED_EXTENSIONS.includes(ext)
    })
    if (validFiles.length === 0) {
      showToast("Unsupported file type. Please upload PDF, DOCX, TXT, or images.", "error")
      return
    }
    const oversized = validFiles.filter((f) => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      showToast(`${oversized[0].name} exceeds 50MB limit`, "error")
      return
    }
    setFiles((prev) => [...prev, ...validFiles])
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (!language) {
      showToast("Please select a language first", "error")
      return
    }
    handleFiles(Array.from(e.dataTransfer.files))
  }, [language, handleFiles])


  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("language", language)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await res.json()
      if (res.ok) {
        showToast("Document uploaded successfully!", "success")
        setTimeout(() => {
          router.push(`/dashboard/documents/${data.document.id}`)
        }, 500)
      } else {
        showToast(data.error || "Upload failed", "error")
        setProgress(0)
      }
    } catch {
      showToast("Upload failed. Please try again.", "error")
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 overflow-hidden">
      <div className="pt-2">
        <h1 className="text-title" style={{ fontFamily: "var(--font-display)" }}>Upload Document</h1>
        <p className="text-subtitle mt-2">Upload a legal document for AI analysis</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground ml-1">Select Analysis Language <span className="text-rose-600">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                language === lang.code
                  ? "border-[rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.06)] shadow-[var(--shadow-sm)] scale-[1.02]"
                  : "border-border glass-subtle hover:border-[rgba(0,0,0,0.12)] hover:glass-default"
              }`}
            >
              <span className={`text-base font-bold ${language === lang.code ? "text-foreground" : "text-foreground"}`}>
                {lang.label}
              </span>
              <span className={`text-xs ${language === lang.code ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {lang.native}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-[2rem] border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 ${
          !language 
            ? "opacity-60 cursor-not-allowed border-border bg-[rgba(0,0,0,0.02)] grayscale-[0.5]" :
          dragActive
            ? "border-[rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.04)] scale-[1.02] shadow-[var(--shadow-lg)]"
            : "border-border hover:border-[rgba(0,0,0,0.15)] glass-subtle hover:glass-default"
        }`}
      >
        {!language && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem]" onClick={() => showToast("Please select a language first", "warning")}>
          </div>
        )}
        <input
          type="file"
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className={`absolute inset-0 opacity-0 z-10 ${!language ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={uploading || !language}
          aria-label="Choose file to upload"
        />
        <div className="space-y-5 relative z-0">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(0,0,0,0.06)] flex items-center justify-center mx-auto shadow-[var(--shadow-sm)]">
            <Upload className="w-10 h-10 text-foreground" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {dragActive ? "Drop your file here" : "Drag & drop your document here"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {ALLOWED_EXTENSIONS.filter((e) => !["jpg", "jpeg"].includes(e) || e === "jpg").map((ext) => (
              <Badge key={ext} variant="secondary" size="sm" className="px-3 bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.06)] border border-border text-foreground font-medium">{ext.toUpperCase()}</Badge>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/80 pt-2">
            Max file size: 50MB. Files are encrypted and processed securely.
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4 animate-in">
          <h2 className="text-heading text-lg" style={{ fontFamily: "var(--font-display)" }}>Selected Files</h2>
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center gap-5 p-5 rounded-2xl glass-default transition-all hover:glass-elevated border border-border">
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · {getFileType(file.name)}</p>
              </div>
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-foreground" />
              ) : (
                <button onClick={() => removeFile(i)} className="p-2 hover:bg-red-50 rounded-xl text-muted-foreground hover:text-red-600 transition-colors cursor-pointer" aria-label="Remove file">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {uploading && (
            <div className="space-y-3 p-5 rounded-2xl glass-subtle border border-border">
              <div className="flex justify-between text-xs font-medium text-foreground">
                <span>Uploading and analyzing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[rgba(0,0,0,0.07)] rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-primary-btn rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleUpload}
            disabled={uploading}
            loading={uploading}
          >
            {uploading ? "Processing..." : "Upload & Analyze"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="glass-subtle rounded-3xl p-6 sm:p-8 border border-amber-600/20 bg-amber-600/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-amber-600" /></div>
          <div><p className="text-base font-semibold text-amber-900">Analysis Notice</p><p className="text-xs font-medium text-amber-800 uppercase tracking-wider mt-0.5">AI-generated analysis</p></div>
        </div>
        <p className="text-sm text-amber-900/80 leading-relaxed font-medium">
          All analyses are AI-generated and should not be considered legal advice. 
          Consult a qualified legal professional before making legal decisions.
        </p>
      </div>
    </div>
  )
}
