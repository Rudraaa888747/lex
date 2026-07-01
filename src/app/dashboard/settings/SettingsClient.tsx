"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Save,
  Shield,
  Trash2,
  ChevronRight,
  Download,
  LogOut,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { showToast } from "@/components/premium-toast"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Settings {
  language: string
  analysisReminders: boolean
  productUpdates: boolean
  dataCollection: boolean
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        checked ? "bg-[#1A1816]" : "bg-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.18)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-[rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[rgba(0,0,0,0.06)] shrink-0">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-[var(--color-border)]">{children}</div>
    </div>
  )
}

// ─── Setting Row — Toggle ────────────────────────────────────────────────────
function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-6 py-5 transition-colors hover:bg-[rgba(0,0,0,0.02)]">
      <div className="min-w-0">
        <p className="text-[0.95rem] font-medium leading-snug text-foreground">{label}</p>
        <p className="text-[0.85rem] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

// ─── Setting Row — Action ────────────────────────────────────────────────────
function ActionRow({
  label,
  desc,
  icon: Icon,
  onClick,
  variant = "default",
  loading = false,
}: {
  label: string
  desc: string
  icon: React.ElementType
  onClick: () => void
  variant?: "default" | "danger"
  loading?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors group cursor-pointer ${
        variant === "danger"
          ? "hover:bg-[rgba(220,38,38,0.04)]"
          : "hover:bg-[rgba(0,0,0,0.03)]"
      }`}
    >
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors ${
          variant === "danger"
            ? "bg-red-50 border border-red-200"
            : "bg-[rgba(0,0,0,0.04)] border border-border"
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Icon
            className={`w-4 h-4 ${
              variant === "danger" ? "text-[#dc2626]" : "text-muted-foreground"
            }`}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[0.95rem] font-medium leading-snug ${
            variant === "danger" ? "text-[#dc2626]" : "text-foreground"
          }`}
        >
          {label}
        </p>
        <p className="text-[0.85rem] text-muted-foreground mt-1">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState<Settings>(initialSettings)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const toggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setHasChanges(true)
  }

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({ ...prev, language: value }))
    setHasChanges(true)
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setHasChanges(false)
      showToast("Settings saved successfully", "success")
      router.refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error")
    } finally {
      setSaving(false)
    }
  }, [settings, router])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch("/api/profile/export")
      if (!res.ok) throw new Error("Export failed")
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `lex-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast("Data exported successfully", "success")
    } catch {
      showToast("Failed to export data", "error")
    } finally {
      setExporting(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleDeleteAccount = () => {
    showToast("To delete your account, go to Profile → Danger Zone", "info")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 lg:pb-10">
      {/* Header */}
      <div>
        <h1 className="text-title">
          Settings
        </h1>
        <p className="text-subtitle mt-2">
          Manage your preferences and account
        </p>
      </div>

      {/* Language */}
      <Section title="Language" icon={Globe}>
        <div className="px-6 py-5 space-y-3">
          <label
            htmlFor="language"
            className="text-[0.9rem] font-medium text-foreground"
          >
            Analysis language
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-card text-foreground px-4 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[rgba(0,0,0,0.12)] appearance-none cursor-pointer transition-all hover:border-[rgba(0,0,0,0.15)]"
          >
            <option value="EN">English</option>
            <option value="HI">Hindi (हिन्दी)</option>
            <option value="GU">Gujarati (ગુજરાતી)</option>
          </select>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Documents will be analyzed and results returned in this language.
          </p>
        </div>
      </Section>

      {/* Preferences */}
      <Section title="Preferences" icon={Shield}>
        <ToggleRow
          label="Analysis reminders"
          desc="Nudge when you have unreviewed documents"
          checked={settings.analysisReminders}
          onChange={() => toggle("analysisReminders")}
        />
        <ToggleRow
          label="Product updates"
          desc="New features and improvements from LexAI"
          checked={settings.productUpdates}
          onChange={() => toggle("productUpdates")}
        />
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Data" icon={Shield}>
        <ToggleRow
          label="Usage analytics"
          desc="Help improve LexAI by sharing anonymous usage data"
          checked={settings.dataCollection}
          onChange={() => toggle("dataCollection")}
        />
        <ActionRow
          label="Export my data"
          desc="Download a copy of all your documents and analysis"
          icon={Download}
          onClick={handleExport}
          loading={exporting}
        />
      </Section>

      {/* Account */}
      <Section title="Account" icon={AlertTriangle}>
        <ActionRow
          label="Sign out"
          desc="Sign out of your account on this device"
          icon={LogOut}
          onClick={handleSignOut}
        />
        <ActionRow
          label="Delete account"
          desc="Permanently remove your account and all data"
          icon={Trash2}
          onClick={handleDeleteAccount}
          variant="danger"
        />
      </Section>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          variant="gradient"
          onClick={handleSave}
          loading={saving}
          disabled={!hasChanges}
          className="w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          {hasChanges ? "Save changes" : "All saved"}
        </Button>
      </div>
    </div>
  )
}
