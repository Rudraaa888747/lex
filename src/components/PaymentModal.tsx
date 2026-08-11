"use client"

import { useState } from "react"
import { X, QrCode, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  amount: string
}

export function PaymentModal({ isOpen, onClose, planName, amount }: PaymentModalProps) {
  const [step, setStep] = useState<"pay" | "verify" | "success">("pay")
  const [utr, setUtr] = useState("")

  if (!isOpen) return null

  // Placeholder UPI link. The user will provide the actual ID later.
  const upiId = "yourupi@upi"
  const upiLink = `upi://pay?pa=${upiId}&pn=LexAI&am=${amount.replace(/[^0-9]/g, "")}&cu=INR`
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display text-foreground mb-2">Upgrade to {planName}</h2>
            <p className="text-muted-foreground text-sm">Amount payable: <span className="font-bold text-foreground">{amount}</span></p>
          </div>

          {step === "pay" && (
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center mb-6 text-muted-foreground">
                <QrCode className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-xs font-mono">QR Code Placeholder</span>
              </div>
              
              <p className="text-sm font-medium mb-4 text-center">Or pay directly using any UPI app</p>
              
              <a href={upiLink} className="w-full block">
                <Button variant="gradient" className="w-full py-6 text-lg shadow-lg">
                  Pay with GPay / PhonePe
                </Button>
              </a>

              <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure UPI Payment</span>
              </div>

              <Button 
                variant="ghost" 
                className="w-full mt-4 text-primary"
                onClick={() => setStep("verify")}
              >
                I have made the payment <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="flex flex-col">
              <p className="text-sm text-center mb-6 text-foreground">
                Please enter your 12-digit UPI Transaction ID (UTR) or Reference Number so we can verify your payment.
              </p>
              
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Transaction ID (UTR)
              </label>
              <input 
                type="text" 
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 312345678901"
                className="w-full p-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm mb-6"
              />

              <Button 
                variant="gradient" 
                className="w-full"
                disabled={utr.length < 6}
                onClick={() => setStep("success")}
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

          {step === "success" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">Payment Submitted!</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Your Transaction ID <strong>{utr}</strong> has been received. Our admin will verify the payment and activate your <strong>{planName}</strong> plan within 2-4 hours.
              </p>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close Window
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
