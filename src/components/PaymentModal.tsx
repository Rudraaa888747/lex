"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, QrCode, ArrowRight, ShieldCheck, CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  amount: string
}

// UPI ID comes from env. When unset, paid checkout is unavailable — the
// modal says so instead of showing a fake "yourupi@upi" QR/link.
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || ""

export function PaymentModal({ isOpen, onClose, planName, amount }: PaymentModalProps) {
  const [step, setStep] = useState<"pay" | "verify" | "success">("pay")
  const [utr, setUtr] = useState("")
  const [utrError, setUtrError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevActiveRef = useRef<Element | null>(null)

  // Reset on close (event handlers, not effects) so every open starts
  // fresh with no stale step/UTR. Initial useState defaults cover first open.
  const resetState = () => {
    setStep("pay")
    setUtr("")
    setUtrError(null)
    setCopied(false)
    setSubmitting(false)
  }
  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [onClose])

  // Focus management + scroll lock + Escape while open (no setState inside).
  useEffect(() => {
    if (!isOpen) return
    prevActiveRef.current = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKey)
      if (prevActiveRef.current instanceof HTMLElement) prevActiveRef.current.focus()
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const numericAmount = amount.replace(/[^0-9]/g, "")
  const displayAmount = numericAmount
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(numericAmount))
    : amount
  const upiLink = UPI_ID && numericAmount ? `upi://pay?pa=${UPI_ID}&pn=LexAI&am=${numericAmount}&cu=INR` : ""

  const submitUtr = async () => {
    if (!/^\d{12}$/.test(utr.trim())) {
      setUtrError("Enter the 12-digit UPI Transaction ID / UTR number.")
      return
    }
    setUtrError(null)
    setSubmitting(true)
    try {
      // Persist the claim server-side BEFORE showing success — the UTR
      // must reach the admin for verification, never live only in state.
      const res = await fetch("/api/payments/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, amount, utr: utr.trim() }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Failed to submit. Try again.")
      }
      setStep("success")
    } catch (err) {
      setUtrError(err instanceof Error ? err.message : "Failed to submit. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — ID is still visible for manual copy
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border animate-in zoom-in-95 duration-200"
      >
        <button
          ref={closeRef}
          onClick={handleClose}
          aria-label="Close payment dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 id="payment-title" className="text-2xl font-bold font-display text-foreground mb-2">Upgrade to {planName}</h2>
            <p className="text-muted-foreground text-sm">Amount payable: <span className="font-bold text-foreground">{displayAmount}</span></p>
          </div>

          {!UPI_ID ? (
            <div className="text-center py-6">
              <p className="text-sm text-foreground font-medium mb-2">Online payments are coming soon</p>
              <p className="text-sm text-muted-foreground">
                Please contact sales to upgrade your plan.
              </p>
            </div>
          ) : step === "pay" && (
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center mb-4 text-muted-foreground">
                <QrCode className="w-12 h-12 mb-2 opacity-50" aria-hidden="true" />
                <span className="text-xs font-mono">Scan with any UPI app</span>
              </div>

              <button
                type="button"
                onClick={copyUpiId}
                className="mb-6 inline-flex items-center gap-2 text-sm font-mono bg-muted/50 border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                aria-label="Copy UPI ID"
              >
                {UPI_ID}
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                {copied && <span className="text-xs text-emerald-600">Copied</span>}
              </button>

              <p className="text-sm font-medium mb-4 text-center">Or pay directly using any UPI app</p>

              <a
                href={upiLink}
                className="w-full block text-center bg-primary-btn hover:bg-primary-btn/90 text-white font-medium py-3.5 rounded-xl text-lg shadow-lg transition-colors"
              >
                Pay with GPay / PhonePe
              </a>

              <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>100% Secure UPI Payment</span>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-primary"
                onClick={() => setStep("verify")}
              >
                I have made the payment <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </div>
          )}

          {UPI_ID && step === "verify" && (
            <div className="flex flex-col">
              <p className="text-sm text-center mb-6 text-foreground">
                Please enter your 12-digit UPI Transaction ID (UTR) or Reference Number so we can verify your payment.
              </p>

              <label htmlFor="utr-input" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Transaction ID (UTR)
              </label>
              <input
                id="utr-input"
                type="text"
                inputMode="numeric"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value)
                  if (utrError) setUtrError(null)
                }}
                placeholder="e.g. 312345678901"
                aria-invalid={utrError ? true : undefined}
                aria-describedby={utrError ? "utr-error" : undefined}
                className="w-full p-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm mb-2"
              />
              {utrError && (
                <p id="utr-error" role="alert" className="text-xs text-red-600 mb-4">{utrError}</p>
              )}
              {!utrError && <div className="mb-4" />}

              <Button
                variant="gradient"
                className="w-full"
                onClick={submitUtr}
                loading={submitting}
              >
                Submit for Verification
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setStep("pay")}
              >
                Back to payment
              </Button>
            </div>
          )}

          {UPI_ID && step === "success" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">Payment Submitted!</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Your Transaction ID <strong>{utr}</strong> has been received. Our admin will verify the payment and activate your <strong>{planName}</strong> plan within 2-4 hours.
              </p>
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Close Window
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
