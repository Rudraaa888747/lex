export default function AdminLoading() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
        <div className="h-5 w-96 bg-[rgba(0,0,0,0.03)] rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-default rounded-2xl p-4 sm:p-5 border border-border animate-pulse h-[140px] flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,0,0,0.04)]" />
            <div className="space-y-2">
              <div className="h-8 w-16 bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-3 w-20 bg-[rgba(0,0,0,0.03)] rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mt-8">
        {[1, 2].map((i) => (
          <div key={i} className="glass-default rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border animate-pulse h-[400px]">
             <div className="h-6 w-40 bg-[rgba(0,0,0,0.04)] rounded-lg mb-6" />
             <div className="space-y-4">
               {[1, 2, 3, 4].map((j) => (
                 <div key={j} className="h-14 w-full bg-[rgba(0,0,0,0.03)] rounded-xl" />
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
