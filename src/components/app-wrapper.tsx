"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import { ScrollToTop } from "@/components/scroll-to-top"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={300} refetchOnWindowFocus>
      <ScrollToTop />
      {children}
      <Toaster
        position="top-right"
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            color: "var(--color-foreground)",
            fontSize: "14px",
            padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06)",
          },
        }}
        className="!pointer-events-auto"
      />
    </SessionProvider>
  )
}
