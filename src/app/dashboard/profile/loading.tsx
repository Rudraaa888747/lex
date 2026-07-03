export default function ProfileLoading() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="h-8 w-32 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />

      {/* Profile card */}
      <div className="glass-default rounded-2xl p-6 border border-border space-y-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,0,0,0.04)]" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-40 bg-[rgba(0,0,0,0.04)] rounded-lg" />
            <div className="h-4 w-56 bg-[rgba(0,0,0,0.03)] rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-[rgba(0,0,0,0.03)] rounded-md" />
            <div className="h-10 w-full bg-[rgba(0,0,0,0.04)] rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-[rgba(0,0,0,0.03)] rounded-md" />
            <div className="h-10 w-full bg-[rgba(0,0,0,0.04)] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="glass-default rounded-2xl p-6 border border-border space-y-4 animate-pulse">
        <div className="h-6 w-36 bg-[rgba(0,0,0,0.04)] rounded-lg" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(0,0,0,0.02)] border border-border">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,0,0,0.04)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-[rgba(0,0,0,0.04)] rounded-md" />
              <div className="h-3 w-1/4 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
