"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scale, Eye, EyeOff, ArrowRight, Check, ChevronLeft, Loader2, ShieldCheck, ShieldAlert, Shield } from "lucide-react"
import { showToast } from "@/components/premium-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  // Dynamic Password Strength
  const passwordStrength = useMemo(() => {
    const pw = form.password
    let score = 0
    let label = "Empty"
    let color = "bg-[rgba(0,0,0,0.1)]"
    let icon = Shield

    if (!pw) return { score, label, color, icon, hasLength: false, hasNumOrSym: false }

    const hasLength = pw.length >= 8
    const hasNumOrSym = /[0-9!@#$%^&*(),.?":{}|<>]/.test(pw)
    const hasUpper = /[A-Z]/.test(pw)
    const isLong = pw.length >= 12

    if (hasLength) score += 1
    if (hasNumOrSym) score += 1
    if (hasUpper) score += 1
    if (isLong) score += 1

    if (score === 1) { label = "Weak"; color = "bg-red-500"; icon = ShieldAlert }
    else if (score === 2) { label = "Fair"; color = "bg-amber-500"; icon = Shield }
    else if (score >= 3) { label = "Strong"; color = "bg-emerald-500"; icon = ShieldCheck }

    return { score, label, color, icon, hasLength, hasNumOrSym }
  }, [form.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordStrength.hasLength || !passwordStrength.hasNumOrSym) {
      showToast("Please meet the minimum password requirements", "error")
      return
    }
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || "Registration failed", "error")
        return
      }

      showToast("Account created! Please sign in.", "success")
      router.push("/login")
    } catch {
      showToast("Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6 relative z-20 flex justify-center md:justify-start">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-[rgba(0,0,0,0.04)] border border-border rounded-full shadow-sm transition-all group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Website
          </Link>
        </div>

        {/* Ambient Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[400px] rounded-full pointer-events-none z-0 blur-[120px]" 
          style={{ background: "rgba(180, 160, 120, 0.15)" }} 
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-btn text-[#FAF8F3] flex items-center justify-center shadow-[var(--shadow-md)] border border-[rgba(0,0,0,0.1)]">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[300px] mx-auto">
              Start analyzing legal documents with AI in seconds.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            variants={itemVariants} 
            className="glass-elevated rounded-[2rem] p-6 sm:p-10 shadow-[var(--shadow-float)] border border-border/60 relative overflow-hidden"
          >
            {/* Inner highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] border border-white/40" style={{ mixBlendMode: 'overlay' }} />
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-[rgba(255,255,255,0.5)] border-border/80 focus:bg-card transition-colors h-12 rounded-xl"
                  suppressHydrationWarning
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-[rgba(255,255,255,0.5)] border-border/80 focus:bg-card transition-colors h-12 rounded-xl"
                  suppressHydrationWarning
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="bg-[rgba(255,255,255,0.5)] border-border/80 focus:bg-card transition-colors h-12 rounded-xl pr-10"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[40px] p-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors rounded-md hover:bg-[rgba(0,0,0,0.04)]"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Password Strength */}
              <AnimatePresence>
                {form.password.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-1 pb-1 space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <passwordStrength.icon className={`w-3.5 h-3.5 ${passwordStrength.score > 0 ? passwordStrength.color.replace('bg-', 'text-') : 'text-muted-foreground'}`} />
                        Password Strength
                      </span>
                      <span className={passwordStrength.score > 0 ? passwordStrength.color.replace('bg-', 'text-') : 'text-muted-foreground'}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.score ? passwordStrength.color : 'bg-[rgba(0,0,0,0.06)]'}`} 
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-muted-foreground pt-1">
                      <div className={`flex items-center gap-1.5 transition-colors ${passwordStrength.hasLength ? 'text-emerald-600' : ''}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passwordStrength.hasLength ? 'bg-emerald-100' : 'bg-[rgba(0,0,0,0.06)]'}`}>
                          <Check className={`w-2.5 h-2.5 ${passwordStrength.hasLength ? 'text-emerald-600' : 'text-muted-foreground opacity-50'}`} />
                        </div>
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1.5 transition-colors ${passwordStrength.hasNumOrSym ? 'text-emerald-600' : ''}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passwordStrength.hasNumOrSym ? 'bg-emerald-100' : 'bg-[rgba(0,0,0,0.06)]'}`}>
                          <Check className={`w-2.5 h-2.5 ${passwordStrength.hasNumOrSym ? 'text-emerald-600' : 'text-muted-foreground opacity-50'}`} />
                        </div>
                        Number or symbol
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full relative overflow-hidden h-12 text-base rounded-xl mt-2" 
                disabled={loading || (form.password.length > 0 && (!passwordStrength.hasLength || !passwordStrength.hasNumOrSym))} 
                suppressHydrationWarning
              >
                <div className="flex items-center justify-center w-full relative">
                  <span className={`flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className={`absolute flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </span>
                </div>
              </Button>
            </form>

            <p className="mt-6 text-[11px] text-muted-foreground/80 text-center leading-relaxed relative z-10">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-foreground font-semibold hover:text-foreground/80 transition-colors underline decoration-border underline-offset-2">Terms</Link> and{" "}
              <Link href="/privacy" className="text-foreground font-semibold hover:text-foreground/80 transition-colors underline decoration-border underline-offset-2">Privacy Policy</Link>.
            </p>

            <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground font-semibold hover:text-foreground/80 transition-colors">
                Sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
