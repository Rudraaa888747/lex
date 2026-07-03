export default function ChatLoading() {
  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
        <div className="h-10 w-40 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
      </div>

      <div className="glass-default rounded-2xl border border-border p-6 min-h-[60vh] flex flex-col animate-pulse">
        <div className="flex-1 space-y-4 py-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.04)] shrink-0" />
            <div className="space-y-2 flex-1 max-w-[70%]">
              <div className="h-4 w-full bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-4 w-3/4 bg-[rgba(0,0,0,0.03)] rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="space-y-2 max-w-[60%]">
              <div className="h-4 w-full bg-[rgba(0,0,0,0.04)] rounded-lg" />
              <div className="h-4 w-1/2 bg-[rgba(0,0,0,0.03)] rounded-lg" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[rgba(0,0,0,0.04)] shrink-0" />
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-auto">
          <div className="h-12 w-full bg-[rgba(0,0,0,0.03)] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
