export default function HistoryLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="h-8 w-40 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl glass-default border border-border animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,0,0,0.04)] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-3 w-1/4 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
            <div className="h-5 w-16 bg-[rgba(0,0,0,0.04)] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
