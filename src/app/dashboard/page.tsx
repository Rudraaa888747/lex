import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Upload, Clock, ArrowRight,
  FileSearch, Sparkles, Scale, ChevronRight, TrendingUp,
  BarChart3, Zap, Shield
} from "lucide-react"
import { AnimatedNumber } from "@/components/animated-number"
import { getAuth } from "@/lib/auth-cached"
import { prisma } from "@/lib/database"
import { PLAN_LIMITS } from "@/lib/subscription"
import { redirect } from "next/navigation"

/* ─────────────────────────── status badge ──────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
    COMPLETED: { label: "Analyzed", variant: "success" },
    PROCESSING: { label: "Processing", variant: "warning" },
    OCR_PROCESSING: { label: "OCR", variant: "warning" },
    ANALYZING: { label: "Analyzing", variant: "warning" },
    READY_FOR_ANALYSIS: { label: "Ready", variant: "secondary" },
  }
  const cfg = map[status] ?? { label: "Pending", variant: "secondary" }
  return (
    <Badge variant={cfg.variant} className="text-xs px-3 py-1 shrink-0">
      {cfg.label}
    </Badge>
  )
}

/* ─────────────────────────── main page ─────────────────────── */
export default async function DashboardPage() {
  const session = await getAuth()
  if (!session?.user?.id) redirect("/login")

  const [documents, totalAnalyses, totalDocuments, monthDocuments] = await prisma.$transaction([
    prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        type: true,
        fileType: true,
        fileSize: true,
        status: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.analysis.count({
      where: { userId: session.user.id },
    }),
    prisma.document.count({
      where: { userId: session.user.id },
    }),
    prisma.document.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ])

  const stats = {
    totalDocuments,
    totalAnalyses,
  }

  const quickStats = [
    {
      icon: FileText,
      label: "Total Documents",
      value: stats.totalDocuments,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "shadow-violet-500/10",
    },
    {
      icon: FileSearch,
      label: "Analyses Done",
      value: stats.totalAnalyses,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10",
    },
    {
      icon: Clock,
      label: "This Month",
      value: monthDocuments,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/10",
    },
  ]

  const usedDocs = totalDocuments
  const userPlan = session.user.plan || "FREE"
  const limitDocs = PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.FREE
  const usagePct = limitDocs === Infinity ? 0 : Math.min((usedDocs / limitDocs) * 100, 100)
  const firstName = session.user.name?.split(" ")[0] ?? ""

  return (
    <div className="w-full space-y-8">
      {/* ── header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}
            <span className="ml-2 text-2xl sm:text-3xl lg:text-4xl select-none" aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
            Here&apos;s your document analysis overview
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="
            w-full sm:w-auto shrink-0 group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 h-12 px-8 text-base
            bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3] border border-[rgba(255,255,255,0.08)]
            hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5
            active:translate-y-0
          "
        >
          <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          Upload Document
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </header>

      {/* ── stat cards ── */}
      <section
        aria-label="Quick stats"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
      >
        {quickStats.map((s, idx) => (
          <article
            key={s.label}
            className={`
              glass-default rounded-2xl p-4 sm:p-5 lg:p-6
              border ${s.border}
              shadow-lg ${s.glow}
              group cursor-default
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            `}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl
              ${s.bg} flex items-center justify-center mb-3 sm:mb-4
              transition-transform duration-300
              group-hover:scale-110 group-hover:rotate-3
            `}>
              <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${s.color}`} />
            </div>

            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-none mb-1">
              <AnimatedNumber value={s.value} loading={false} />
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">
              {s.label}
            </p>
          </article>
        ))}
      </section>

      {/* ── main content grid ── */}
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

        {/* ── recent documents (col-span-2) ── */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-5 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Recent Documents
            </h2>
            <Link
              href="/dashboard/documents"
              className="
                text-sm font-medium text-blue-400 hover:text-blue-300
                flex items-center gap-1 group transition-colors
              "
            >
              View all
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {documents.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {documents.slice(0, 5).map((doc: { id: string; title: string; type: string; fileType: string | null; fileSize: number | null; status: string; language: string | null; createdAt: Date; updatedAt: Date; }, i: number) => (
                <li key={doc.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    href={`/dashboard/documents/${doc.id}`}
                    className="
                      flex items-center gap-3 sm:gap-4 p-4 sm:p-5
                      rounded-2xl glass-default
                      border border-white/5
                      transition-all duration-300
                      hover:-translate-y-0.5 hover:glass-elevated hover:border-blue-500/20
                      group
                    "
                  >
                    {/* icon */}
                    <div className="
                      w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl
                      bg-blue-500/10 flex items-center justify-center
                      transition-transform duration-300
                      group-hover:scale-105
                    ">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>

                    {/* title + date */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate text-foreground">
                        {doc.title}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {new Date(doc.createdAt).toLocaleDateString(undefined, {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* status */}
                    <StatusBadge status={doc.status} />

                    {/* chevron */}
                    <ChevronRight
                      className="
                        w-4 h-4 text-muted-foreground/50 shrink-0
                        transition-transform duration-300
                        group-hover:translate-x-1 group-hover:text-blue-400
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── sidebar ── */}
        <aside className="space-y-4 sm:space-y-5">

          {/* AI usage card */}
          <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">AI Usage</h2>
            </div>

            <dl className="space-y-3">
              {[
                { label: "Documents Processed", value: usedDocs },
                { label: "Analyses Completed", value: stats.totalAnalyses },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <dt className="text-sm text-muted-foreground truncate">{label}</dt>
                  <dd className="font-bold text-sm sm:text-base text-foreground shrink-0">{value}</dd>
                </div>
              ))}
            </dl>

            {/* progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{limitDocs === Infinity ? `${usedDocs} docs used (unlimited)` : `${usedDocs} of ${limitDocs} docs used`}</span>
                {limitDocs !== Infinity && <span>{Math.round(usagePct)}%</span>}
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                <div
                  className="
                    bg-gradient-to-r from-blue-600 to-blue-400
                    rounded-full h-full
                    shadow-[0_0_8px_rgba(59,130,246,0.5)]
                    transition-all duration-500 ease-out
                  "
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>

            <Link
              href="/pricing"
              className="block pt-1 text-center w-full rounded-xl border border-border bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.06)] text-foreground font-medium h-12 px-8 text-base inline-flex items-center justify-center gap-2 transition-colors group"
            >
              <Sparkles className="w-4 h-4 text-blue-400 transition-transform group-hover:scale-110" aria-hidden="true" />
              Upgrade Plan
            </Link>
          </div>

          {/* quick actions */}
          <div className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-3 border border-white/5">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Quick Actions</h2>
            {[
              { icon: Zap, label: "Analyze Document", href: "/dashboard/upload", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: Shield, label: "Risk Report", href: "/dashboard/documents", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: TrendingUp, label: "View Settings", href: "/dashboard/settings", color: "text-violet-400", bg: "bg-violet-500/10" },
            ].map(({ icon: Icon, label, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="
                  flex items-center gap-3 p-3 rounded-xl
                  hover:bg-white/5 transition-all duration-200
                  group
                "
              >
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto transition-transform duration-200 group-hover:translate-x-1 group-hover:text-muted-foreground" />
              </Link>
            ))}
          </div>

          {/* legal notice */}
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-amber-600/20 bg-amber-50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Scale className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 leading-tight">Legal Notice</p>
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mt-0.5">
                  AI-generated analysis
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 font-medium leading-relaxed">
              This analysis is AI-generated and should not be considered legal advice.
              Always consult a qualified legal professional for binding matters.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ─────────────────────────── empty state ───────────────────── */
function EmptyState() {
  return (
    <div className="
      glass-subtle rounded-2xl sm:rounded-3xl
      px-6 py-12 sm:py-16
      text-center
      border border-dashed border-white/10
    ">
      <div className="
        w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl
        bg-blue-500/10 flex items-center justify-center
        mx-auto mb-5 sm:mb-6
        shadow-lg shadow-blue-500/10
      ">
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
      </div>

      <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-2">
        No documents yet
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-7 max-w-xs mx-auto leading-relaxed">
        Upload your first legal document and let AI surface the risks instantly.
      </p>

      <Link
        href="/dashboard/upload"
        className="group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 h-12 px-8 text-base bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3]"
      >
        <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        Upload Your First Document
      </Link>
    </div>
  )
}
