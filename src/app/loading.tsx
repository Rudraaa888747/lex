import { Loader2 } from "lucide-react"

// P2 perf: the old fixed inset-0 overlay blocked the whole screen on every
// navigation that suspended, making the app feel frozen. This lightweight,
// non-blocking indicator keeps the current page interactive while the next
// segment loads. Route segments with real skeletons keep their own loaders.
export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Loading">
      <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.85)] flex items-center justify-center glass-default shadow-[var(--shadow-lg)] border border-[rgba(0,0,0,0.08)]">
        <Loader2 className="w-6 h-6 text-foreground animate-spin" aria-hidden="true" />
      </div>
    </div>
  )
}
