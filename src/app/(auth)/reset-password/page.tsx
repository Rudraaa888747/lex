"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scale, ArrowLeft, Mail } from "lucide-react"
import { showToast } from "@/components/premium-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
    showToast("Password reset link sent to your email", "success")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-[#9aa0a6] mt-1">
            {sent ? "Check your email for the reset link" : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 shadow-lg">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <p className="text-sm text-[#9aa0a6]">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="gradient" className="w-full" size="lg" loading={loading}>
                Send Reset Link
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-[#9aa0a6] hover:text-[#e8eaed] inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
