"use client"

import { X, AlertCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  userPlan: string
}

export function LimitReachedModal({ isOpen, onClose, userPlan }: LimitReachedModalProps) {
  if (!isOpen) return null

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
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold font-display text-foreground mb-3">
              {userPlan === "FREE" ? "Your Free Trial Has Ended" : "Document Limit Reached"}
            </h2>
            
            <p className="text-muted-foreground text-sm mb-8">
              {userPlan === "FREE" 
                ? "You've reached the maximum number of documents allowed on the free plan. Upgrade your account to keep working and unlock premium features."
                : `You've reached your monthly upload limit for the ${userPlan} plan. Upgrade to a higher tier to process more documents.`
              }
            </p>

            <Link href="/pricing" className="w-full" onClick={onClose}>
              <Button variant="gradient" className="w-full py-6 text-lg shadow-lg group">
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade to Pro
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
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
