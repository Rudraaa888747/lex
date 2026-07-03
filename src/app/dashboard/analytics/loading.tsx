export default function AnalyticsLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="h-8 w-36 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-default rounded-3xl p-5 sm:p-6 border border-border animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-2xl bg-[rgba(0,0,0,0.04)] mb-4" />
            <div className="h-7 w-16 bg-[rgba(0,0,0,0.04)] rounded-lg mb-2" />
            <div className="h-4 w-24 bg-[rgba(0,0,0,0.03)] rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-default rounded-3xl p-6 border border-border animate-pulse h-72">
          <div className="h-5 w-32 bg-[rgba(0,0,0,0.04)] rounded-lg mb-4" />
          <div className="h-full bg-[rgba(0,0,0,0.02)] rounded-2xl" />
        </div>
        <div className="glass-default rounded-3xl p-6 border border-border animate-pulse h-72">
          <div className="h-5 w-28 bg-[rgba(0,0,0,0.04)] rounded-lg mb-4" />
          <div className="h-full bg-[rgba(0,0,0,0.02)] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
