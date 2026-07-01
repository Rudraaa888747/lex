import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center glass-default shadow-lg border border-white/10">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading dashboard...</p>
    </div>
  )
}
