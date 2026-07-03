export default function SettingsLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="h-8 w-32 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />

      <div className="glass-default rounded-2xl p-6 border border-border space-y-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-3 w-64 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
            <div className="h-7 w-14 bg-[rgba(0,0,0,0.04)] rounded-full" />
          </div>
        ))}
      </div>

      <div className="h-12 w-32 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
    </div>
  )
}
