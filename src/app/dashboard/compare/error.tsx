"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("[Compare Error]", error)
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4 animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-foreground tracking-tight">Something went wrong</h2>
      <p className="text-[0.95rem] text-muted-foreground mt-2 max-w-md leading-relaxed">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <div className="mt-8">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
