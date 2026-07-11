"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-default rounded-3xl p-8 text-center border border-border shadow-[var(--shadow-md)]">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Something went critically wrong</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            {error.message || "An unexpected system error occurred."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="gradient" onClick={() => reset()} className="px-6">
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"} className="px-6">
              Return Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
