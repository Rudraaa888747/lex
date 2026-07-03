export default function DocumentsLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-[rgba(0,0,0,0.03)] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
      </div>

      <div className="flex gap-3">
        <div className="h-10 flex-1 max-w-sm bg-[rgba(0,0,0,0.03)] rounded-xl animate-pulse" />
        <div className="h-10 w-28 bg-[rgba(0,0,0,0.03)] rounded-xl animate-pulse" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl glass-default border border-border animate-pulse" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(0,0,0,0.04)] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-3 w-1/5 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
            <div className="h-6 w-20 bg-[rgba(0,0,0,0.04)] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
