"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  User, Save, Key, Camera, LogOut,
  Loader2, X, Monitor, Smartphone, Globe,
  Clock, Trash2, AlertTriangle, Eye, EyeOff, RefreshCw
} from "lucide-react"
import { showToast } from "@/components/premium-toast"

type ProfileSession = {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    createdAt?: string
  }
} | null

type ActiveSession = {
  id: string
  device: string
  userAgent?: string | null
  ip?: string | null
  createdAt?: string
  expiresAt?: string
  lastActive?: string
  isCurrent: boolean
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  const colors = ["", "#dc2626", "#d97706", "#2563eb", "#16a34a"]
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "rgba(0,0,0,0.1)" }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs font-medium" style={{ color: colors[score] }}>
          {labels[score]} password
        </p>
      )}
    </div>
  )
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`g-default border border-border shadow-[var(--shadow-sm)] rounded-2xl p-4 sm:p-6 bg-card ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border mb-5">
      <div className="w-8 h-8 rounded-lg bg-[rgba(0,0,0,0.04)] border border-border flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-sm text-foreground" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  )
}

function AvatarSection({ session, onAvatarChange }: { session: ProfileSession; onAvatarChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(session?.user?.image || null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error"); return
    }
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error"); return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      onAvatarChange(data.avatarUrl)
      showToast("Profile picture updated", "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error")
      setPreview(session?.user?.image || null)
    } finally {
      setUploading(false)
    }
  }

  const initials = (session?.user?.name || session?.user?.email || "U")
    .charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-5 pb-6 border-b border-border">
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-[var(--shadow-md)] border border-border">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary-btn flex items-center justify-center text-2xl font-bold text-[#FAF8F3]">
              {initials}
            </div>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-card border border-border shadow-[var(--shadow-sm)]
            flex items-center justify-center hover:bg-[rgba(0,0,0,0.04)] transition-colors cursor-pointer"
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            : <Camera className="w-3.5 h-3.5 text-foreground" />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="min-w-0">
        <h2 className="font-semibold text-lg truncate text-foreground" style={{ fontFamily: "var(--font-display)" }}>{session?.user?.name || "User"}</h2>
        <p className="text-sm text-muted-foreground truncate font-medium">{session?.user?.email}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click the camera to update photo · Max 5MB
        </p>
      </div>
    </div>
  )
}

function PersonalInfoSection({ session }: { session: ProfileSession }) {
  const { update } = useSession()
  const [saving, setSaving] = useState(false)
  const [changed, setChanged] = useState(false)
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setChanged(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("Name cannot be empty", "error"); return }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast("Enter a valid email", "error"); return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Update failed")
      await update({ name: form.name.trim(), email: form.email.trim() })
      setChanged(false)
      showToast("Profile updated successfully", "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <SectionHeader icon={User} title="Personal Information" subtitle="Update your name and email address" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={set("name")} />
        <Input label="Email Address" type="email" value={form.email} onChange={set("email")} />
      </div>
      {changed && (
        <div className="flex gap-2 mt-4">
          <Button variant="gradient" onClick={handleSave} loading={saving} className="w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => {
            setForm({ name: session?.user?.name || "", email: session?.user?.email || "" })
            setChanged(false)
          }} className="w-full sm:w-auto">
            <X className="w-4 h-4" />
            Discard
          </Button>
        </div>
      )}
    </SectionCard>
  )
}

function PasswordSection() {
  const [saving, setSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const mismatch = form.confirmPassword && form.newPassword !== form.confirmPassword
  const tooShort = form.newPassword && form.newPassword.length < 8

  const handleSave = async () => {
    if (!form.currentPassword) { showToast("Enter your current password", "error"); return }
    if (tooShort) { showToast("New password must be at least 8 characters", "error"); return }
    if (mismatch) { showToast("Passwords do not match", "error"); return }
    setSaving(true)
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Password change failed")
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      showToast("Password changed successfully", "success")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Password change failed", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard>
      <SectionHeader icon={Key} title="Change Password" subtitle="Use a strong password with letters, numbers & symbols" />
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={form.currentPassword}
            onChange={set("currentPassword")}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Input
                label="New Password"
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={set("newPassword")}
                error={tooShort ? "Minimum 8 characters" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={form.newPassword} />
          </div>
          <Input
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            error={mismatch ? "Passwords don't match" : undefined}
          />
        </div>
      </div>
      <Button
        variant="gradient"
        onClick={handleSave}
        loading={saving}
        disabled={Boolean(!form.currentPassword || !form.newPassword || !form.confirmPassword || tooShort || mismatch)}
        className="w-full sm:w-auto mt-4"
      >
        <Key className="w-4 h-4" />
        Update Password
      </Button>
    </SectionCard>
  )
}

function SessionsSection({ initialSessions }: { initialSessions: ActiveSession[] }) {
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions)
  const [revoking, setRevoking] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/profile/sessions")
      const data = await res.json()
      if (res.ok) setSessions((data.sessions || []) as ActiveSession[])
    } catch { /* silent */ }
  }

  const revoke = async (sessionId: string) => {
    setRevoking(sessionId)
    try {
      const res = await fetch(`/api/profile/sessions/${sessionId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setSessions((s) => s.filter((x) => x.id !== sessionId))
      showToast("Session revoked", "success")
    } catch {
      showToast("Failed to revoke session", "error")
    } finally {
      setRevoking(null)
    }
  }

  const revokeAll = async () => {
    setRevoking("all")
    try {
      const res = await fetch("/api/profile/sessions", { method: "DELETE" })
      if (!res.ok) throw new Error()
      await fetchSessions()
      showToast("All other sessions revoked", "success")
    } catch {
      showToast("Failed to revoke sessions", "error")
    } finally {
      setRevoking(null)
    }
  }

  const DeviceIcon = ({ ua }: { ua?: string | null }) => {
    if (!ua) return <Monitor className="w-4 h-4 text-foreground" />
    const isMobile = /mobile|android|iphone/i.test(ua)
    return isMobile ? <Smartphone className="w-4 h-4 text-foreground" /> : <Monitor className="w-4 h-4 text-foreground" />
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    const now = new Date()
    const diff = (now.getTime() - d.getTime()) / 1000
    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <SectionCard>
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,0,0,0.04)] border border-border flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <Globe className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground" style={{ fontFamily: "var(--font-display)" }}>Active Sessions</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Devices currently signed into your account</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={fetchSessions} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6 font-medium">No active sessions found</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-colors border ${
                s.isCurrent ? "bg-[rgba(0,0,0,0.02)] border-border shadow-[var(--shadow-sm)]" : "bg-card border-transparent hover:bg-[rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,0,0,0.06)] border border-border flex items-center justify-center flex-shrink-0">
                  <DeviceIcon ua={s.userAgent} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold truncate text-foreground">{s.device || "Unknown device"}</p>
                    {s.isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(22,163,74,0.08)] text-[#16a34a] border border-[rgba(22,163,74,0.20)] flex-shrink-0 font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-0.5 font-medium">
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <p className="text-xs truncate">{s.ip || "Unknown IP"}</p>
                    <span className="text-border">·</span>
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <p className="text-xs">{formatDate(s.lastActive)}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80 mt-1 font-medium">
                    Signed in {formatDate(s.createdAt)} · Expires {formatDate(s.expiresAt)}
                  </p>
                </div>
              </div>
              {!s.isCurrent && (
                <button
                  onClick={() => revoke(s.id)}
                  disabled={revoking === s.id}
                  className="text-muted-foreground hover:text-[#dc2626] transition-colors p-1.5 rounded-lg hover:bg-[rgba(220,38,38,0.06)] flex-shrink-0 cursor-pointer"
                >
                  {revoking === s.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <X className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {sessions.some((s) => !s.isCurrent) && (
        <Button
          variant="outline"
          onClick={revokeAll}
          loading={revoking === "all"}
          className="mt-4 w-full sm:w-auto border-[rgba(220,38,38,0.15)] text-[#dc2626] hover:bg-[rgba(220,38,38,0.06)] hover:text-[#dc2626]"
        >
          <Trash2 className="w-4 h-4" />
          Sign out all other sessions
        </Button>
      )}
    </SectionCard>
  )
}

function DangerZone() {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [typed, setTyped] = useState("")

  const handleDelete = async () => {
    if (typed !== "DELETE") { showToast('Type "DELETE" to confirm', "error"); return }
    setDeleting(true)
    try {
      const res = await fetch("/api/profile/delete", { method: "DELETE" })
      if (!res.ok) throw new Error()
      showToast("Account deletion initiated", "success")
      await signOut({ callbackUrl: "/" })
    } catch {
      showToast("Failed to delete account", "error")
      setDeleting(false)
    }
  }

  return (
    <SectionCard>
      <SectionHeader icon={AlertTriangle} title="Danger Zone" subtitle="Irreversible actions — proceed with caution" />
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-[var(--shadow-sm)]">
          <div>
            <p className="text-sm font-semibold text-foreground">Sign out everywhere</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Revoke all active sessions immediately</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>

        <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.15)] shadow-[var(--shadow-sm)]">
          <div>
            <p className="text-sm font-semibold text-[#dc2626]">Delete account</p>
            <p className="text-xs text-[rgba(220,38,38,0.8)] mt-0.5 font-medium">Permanently delete your account and all data</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmDelete((v) => !v)}
            className="border-[rgba(220,38,38,0.15)] text-[#dc2626] hover:bg-[rgba(220,38,38,0.08)] flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>

        {confirmDelete && (
          <div className="p-4 rounded-xl bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.15)] space-y-3 animate-in fade-in slide-in-from-top-2 shadow-[var(--shadow-sm)]">
            <p className="text-xs text-[#dc2626] font-medium leading-relaxed">
              This will permanently delete your account, all your analyses, and personal data.
              This action <strong>cannot</strong> be undone.
            </p>
            <div>
              <p className="text-xs text-[rgba(220,38,38,0.8)] mb-1.5 font-medium">Type <strong className="text-[#dc2626]">DELETE</strong> to confirm</p>
              <Input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type DELETE here"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                loading={deleting}
                disabled={typed !== "DELETE"}
                className="border-[rgba(220,38,38,0.15)] text-[#dc2626] hover:bg-[rgba(220,38,38,0.08)]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Permanently delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setConfirmDelete(false); setTyped("") }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

export function ProfileClient({ initialSessions }: { initialSessions: ActiveSession[] }) {
  const { data: session, update } = useSession()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [])

  const handleAvatarChange = (url: string) => update({ image: url })

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 lg:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Profile Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage your account, security, and preferences</p>
      </div>

      <SectionCard>
        <AvatarSection session={session} onAvatarChange={handleAvatarChange} />
        <div className="pt-5 grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[rgba(0,0,0,0.02)] border border-border shadow-[var(--shadow-sm)]">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Account status</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] inline-block shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
              <p className="text-sm font-bold text-foreground">Active</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[rgba(0,0,0,0.02)] border border-border shadow-[var(--shadow-sm)]">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Member since</p>
            <p className="text-sm font-bold mt-1.5 text-foreground">
              {session?.user?.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>
      </SectionCard>

      <PersonalInfoSection session={session} />

      <PasswordSection />

      <SessionsSection initialSessions={initialSessions} />

      <DangerZone />

      <div className="rounded-2xl bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.15)] p-4 shadow-[var(--shadow-sm)]">
        <p className="text-xs text-[#d97706] font-medium">
          ⚖️ This platform provides AI-generated analysis and should not be considered legal advice.
        </p>
      </div>
    </div>
  )
}
