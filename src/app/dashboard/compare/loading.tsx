export default function CompareLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="h-8 w-52 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
      <div className="h-4 w-80 bg-[rgba(0,0,0,0.03)] rounded-lg animate-pulse" />

      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-default rounded-2xl p-6 border border-border space-y-4 animate-pulse">
            <div className="h-5 w-28 bg-[rgba(0,0,0,0.04)] rounded-lg" />
            <div className="h-12 w-full bg-[rgba(0,0,0,0.03)] rounded-xl" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-3 bg-[rgba(0,0,0,0.03)] rounded-md" style={{ width: `${85 - j * 15}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-12 w-40 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse mx-auto" />
    </div>
  )
}
