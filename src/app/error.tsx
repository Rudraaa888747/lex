"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[App Error]", error)
  }, [error])
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div role="alert" className="max-w-md w-full glass-default rounded-3xl p-8 text-center border border-border shadow-[var(--shadow-md)]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Something went wrong</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          An unexpected error occurred. Please try again or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" onClick={() => reset()} className="px-6">
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-medium px-6 h-11 border border-border bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.06)] text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
