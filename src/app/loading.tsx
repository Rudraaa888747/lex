import { Loader2 } from "lucide-react"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.85)] flex items-center justify-center glass-default shadow-[var(--shadow-lg)] border border-[rgba(0,0,0,0.08)]">
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
      </div>
    </div>
  )
}
