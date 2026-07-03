"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scale, Eye, EyeOff, ArrowRight, Loader2, ChevronLeft, Check } from "lucide-react"
import { showToast } from "@/components/premium-toast"
import { motion } from "framer-motion"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  useEffect(() => {
    router.prefetch("/dashboard")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        showToast("Invalid email or password", "error")
        return
      }

      showToast("Welcome back!", "success")
      router.push("/dashboard")
      router.refresh()
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
        <BackToWebsite />

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
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[280px] mx-auto">
              Enter your credentials to access your account and documents.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            variants={itemVariants} 
            className="glass-elevated rounded-[2rem] p-6 sm:p-10 shadow-[var(--shadow-float)] border border-border/60 relative overflow-hidden"
          >
            {/* Inner highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] border border-white/40" style={{ mixBlendMode: 'overlay' }} />
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10" suppressHydrationWarning>
              <div className="space-y-4">
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between text-sm pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${rememberMe ? 'bg-primary-btn border-primary-btn' : 'bg-[rgba(255,255,255,0.5)] border-border/80 group-hover:border-[rgba(0,0,0,0.3)]'}`}>
                    <Check className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${rememberMe ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                  </div>
                  <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">Remember me</span>
                </button>
                <Link href="/reset-password" className="text-foreground font-semibold hover:text-foreground/80 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full relative overflow-hidden h-12 text-base rounded-xl" 
                disabled={loading} 
                suppressHydrationWarning
              >
                <div className="flex items-center justify-center w-full relative">
                  <span className={`flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className={`absolute flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                </div>
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-foreground font-semibold hover:text-foreground/80 transition-colors">
                Create one
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
