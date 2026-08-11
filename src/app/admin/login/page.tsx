"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { showToast } from "@/components/premium-toast"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

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
        showToast("Invalid credentials", "error")
        return
      }

      showToast("Admin access granted", "success")
      router.push("/admin")
      router.refresh()
    } catch {
      showToast("Authentication failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden w-full">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div 
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-700">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
              Restricted access. Please authenticate to continue.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="glass-elevated rounded-[2rem] p-8 shadow-2xl border border-red-500/20 relative overflow-hidden bg-card"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50" />
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-4">
                <Input
                  label="Admin Email"
                  type="email"
                  placeholder="admin@lexai.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-muted/50 border-border h-12 rounded-xl"
                />
                <div className="relative">
                  <Input
                    label="Master Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="bg-muted/50 border-border h-12 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[40px] p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="default" 
                className="w-full relative overflow-hidden h-12 text-base rounded-xl bg-slate-900 hover:bg-slate-800 text-white" 
                disabled={loading} 
              >
                <div className="flex items-center justify-center w-full relative">
                  <span className={`flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    Authenticate <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className={`absolute flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </span>
                </div>
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
