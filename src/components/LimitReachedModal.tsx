"use client"

import { useEffect, useRef } from "react"
import { X, AlertCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  userPlan: string
}

export function LimitReachedModal({ isOpen, onClose, userPlan }: LimitReachedModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevActiveRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!isOpen) return
    prevActiveRef.current = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKey)
      if (prevActiveRef.current instanceof HTMLElement) prevActiveRef.current.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="limit-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border animate-in zoom-in-95 duration-200"
      >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Close limit dialog"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>

            <h2 id="limit-title" className="text-2xl font-bold font-display text-foreground mb-3">
              {userPlan === "FREE" ? "Your Free Trial Has Ended" : "Document Limit Reached"}
            </h2>

            <p className="text-muted-foreground text-sm mb-8">
              {userPlan === "FREE"
                ? "You've reached the maximum number of documents allowed on the free plan. Upgrade your account to keep working and unlock premium features."
                : `You've reached your monthly upload limit for the ${userPlan} plan. Upgrade to a higher tier to process more documents.`
              }
            </p>

            <Link
              href="/pricing"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-lg font-medium rounded-xl bg-[#1A1816] hover:bg-[#2C2A26] text-[#FAF8F3] shadow-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              Upgrade to Pro
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={onClose}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
