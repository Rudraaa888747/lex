"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

export function FaqList({ faqs }: { faqs: FaqCategory[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = faqs.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())),
  })).filter((cat) => cat.items.length > 0)

  return (
    <>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
        <input
          id="faq-search"
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-8">
        {filtered.map((cat) => (
          <div key={cat.category}>
            <h2 className="text-lg font-bold mb-4 text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{cat.category}</h2>
            <div className="space-y-3">
              {cat.items.map((item, i) => {
                const idx = `${cat.category}-${i}`
                const open = openIndex === idx
                return (
                  <div key={idx} className="glass-default bg-card rounded-2xl overflow-hidden transition-all duration-300 border border-border hover:border-[rgba(0,0,0,0.15)] shadow-[var(--shadow-sm)]">
                    <button
                      onClick={() => setOpenIndex(open ? null : idx)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${cat.category}-${i}`}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                    >
                      <span className="font-semibold text-sm sm:text-base pr-4 text-foreground">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <div
                      id={`faq-panel-${cat.category}-${i}`}
                      hidden={!open}
                    >
                      <p className="px-4 sm:px-5 pb-4 sm:px-5 text-sm text-muted-foreground font-medium leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
