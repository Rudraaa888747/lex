export default function UploadLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="h-8 w-48 bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse mx-auto" />
        <div className="h-4 w-72 bg-[rgba(0,0,0,0.03)] rounded-lg animate-pulse mx-auto" />
      </div>

      {/* Dropzone skeleton */}
      <div className="glass-default rounded-2xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(0,0,0,0.04)]" />
        <div className="h-5 w-48 bg-[rgba(0,0,0,0.04)] rounded-lg" />
        <div className="h-3 w-64 bg-[rgba(0,0,0,0.03)] rounded-md" />
      </div>

      {/* Language selector */}
      <div className="glass-default rounded-2xl p-6 border border-border animate-pulse">
        <div className="h-5 w-32 bg-[rgba(0,0,0,0.04)] rounded-lg mb-3" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-[rgba(0,0,0,0.04)] rounded-xl" />
          ))}
        </div>
      </div>

      <div className="h-12 w-full bg-[rgba(0,0,0,0.04)] rounded-xl animate-pulse" />
    </div>
  )
}
