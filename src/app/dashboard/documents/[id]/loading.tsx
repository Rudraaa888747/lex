export default function DocumentDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-[rgba(0,0,0,0.04)] rounded-lg animate-pulse" />
        <div className="h-5 w-32 bg-[rgba(0,0,0,0.04)] rounded-lg animate-pulse" />
      </div>

      <div className="glass-default rounded-2xl p-6 border border-border space-y-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,0,0,0.04)]" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/2 bg-[rgba(0,0,0,0.04)] rounded-lg" />
            <div className="h-4 w-1/4 bg-[rgba(0,0,0,0.03)] rounded-md" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-36 bg-[rgba(0,0,0,0.04)] rounded-xl" />
          <div className="h-10 w-36 bg-[rgba(0,0,0,0.04)] rounded-xl" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-default rounded-2xl p-6 border border-border space-y-3 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="h-5 w-1/3 bg-[rgba(0,0,0,0.04)] rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[rgba(0,0,0,0.03)] rounded-md" />
              <div className="h-3 w-4/5 bg-[rgba(0,0,0,0.03)] rounded-md" />
              <div className="h-3 w-3/5 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
