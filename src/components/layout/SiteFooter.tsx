import Link from "next/link"
import Image from "next/image"
import { Scale, Shield, Zap, ArrowUpRight } from "lucide-react"

/* ─────────────────────── nav data ─────────────────────── */
const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Support", href: "/support" },
      { label: "Press Kit", href: "/press" },
    ],
  },
]

/* ─────────────────────── trust pills ──────────────────── */
const TRUST = [
  { icon: Shield, label: "SOC 2 Ready" },
  { icon: Zap, label: "256-bit Encryption" },
  { icon: Scale, label: "GDPR Compliant" },
]

/* ─────────────────────── component ────────────────────── */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-secondary overflow-hidden">

      {/* subtle radial glow — doesn't affect layout */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{ background: "rgba(180, 160, 120, 0.06)", filter: "blur(80px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16 pb-8">

        {/* ── main grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-x-6 gap-y-10 sm:gap-x-8 lg:gap-x-12">

          {/* brand col — full width on xs, spans 2 cols on sm, 1 col on lg */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-5 max-w-xs">

            {/* logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
              aria-label="Lex home"
            >
              <div className="
                relative w-9 h-9 rounded-xl overflow-hidden shrink-0
                shadow-md
                ring-1 ring-border
                transition-transform duration-300 group-hover:scale-105
              ">
                <Image src="/logo.jpg" alt="" fill sizes="36px" className="object-cover" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Lex</span>
            </Link>

            {/* tagline */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered legal document analysis. Understand contracts, surface risks, and decide with confidence.
            </p>

            {/* trust pills */}
            <ul className="flex flex-wrap gap-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="
                    inline-flex items-center gap-1.5
                    px-2.5 py-1 rounded-full
                    bg-[rgba(0,0,0,0.04)] border border-border
                    text-[11px] font-medium text-muted-foreground
                  "
                >
                  <Icon className="w-3 h-3 text-foreground shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            {/* legal micro-note */}
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              AI analysis only — not legal advice. Always consult a qualified legal professional.
            </p>
          </div>

          {/* nav cols */}
          {NAV.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 sm:mb-5">
                {heading}
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="
                        group inline-flex items-center gap-1
                        text-sm text-muted-foreground
                        hover:text-foreground
                        transition-colors duration-200
                      "
                    >
                      {label}
                      <ArrowUpRight
                        className="
                          w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5
                          group-hover:opacity-60
                          transition-all duration-200
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── divider ── */}
        <div className="mt-10 sm:mt-12 border-t border-border" />

        {/* ── bottom bar ── */}
        <div className="
          mt-6 flex flex-col sm:flex-row
          items-center sm:items-start lg:items-center
          justify-between gap-4
        ">
          {/* copyright */}
          <p className="text-xs text-muted-foreground shrink-0 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Lex. All rights reserved.
          </p>

          {/* disclaimer */}
          <p className="
            text-[10px] text-muted-foreground leading-relaxed text-center sm:text-right
            max-w-xl order-1 sm:order-2
          ">
            <span className="font-semibold text-foreground/60 uppercase tracking-wide">Disclaimer: </span>
            Lex is an AI document analysis tool. It does not provide legal advice, representation,
            or create an attorney-client relationship. All analyses should be reviewed by a qualified legal professional.
          </p>
        </div>

      </div>
    </footer>
  )
}
