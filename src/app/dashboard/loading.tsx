import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
        <div className="h-5 w-96 bg-[rgba(0,0,0,0.03)] rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-default rounded-2xl p-5 sm:p-6 border border-border h-36 animate-pulse flex flex-col justify-between">
             <div className="h-10 w-10 bg-[rgba(0,0,0,0.04)] rounded-xl" />
             <div className="space-y-2 mt-4">
               <div className="h-7 w-20 bg-[rgba(0,0,0,0.04)] rounded-lg" />
               <div className="h-3 w-28 bg-[rgba(0,0,0,0.03)] rounded-md" />
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-8 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-48 bg-[rgba(0,0,0,0.04)] rounded-lg animate-pulse mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-[88px] glass-subtle border border-border rounded-2xl animate-pulse flex items-center p-4 gap-4">
               <div className="w-12 h-12 rounded-xl bg-[rgba(0,0,0,0.04)]" />
               <div className="space-y-2 flex-1">
                 <div className="h-5 w-1/3 bg-[rgba(0,0,0,0.04)] rounded-lg" />
                 <div className="h-3 w-1/4 bg-[rgba(0,0,0,0.03)] rounded-md" />
               </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="w-full h-64 glass-default border border-border rounded-3xl animate-pulse" />
          <div className="w-full h-48 glass-default border border-border rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
