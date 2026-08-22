import type { Metadata } from "next"
import { Mail, ArrowRight, ShieldCheck, Building2, Globe, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Enterprise Sales",
  description: "Talk to the Lex AI enterprise team about unlimited parsing, on-premise deployment, custom integrations, and volume discounts.",
  alternates: { canonical: "/contact-sales" },
  openGraph: { title: "Lex AI — Contact Enterprise Sales", description: "Talk to the Lex AI enterprise team about unlimited parsing, on-premise deployment, custom integrations, and volume discounts." },
  twitter: { title: "Lex AI — Contact Enterprise Sales", description: "Talk to the Lex AI enterprise team about unlimited parsing, on-premise deployment, custom integrations, and volume discounts." },
}
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function ContactSalesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <BackToWebsite />
      
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary-btn/10 to-transparent pointer-events-none" />
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-primary-btn/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column: Messaging */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-btn/10 border border-primary-btn/20 text-primary-btn text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Enterprise Solutions
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-foreground leading-[1.1] mb-6">
              Scale your legal analysis with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-btn to-rose-600">Enterprise</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Get unlimited parsing, custom AI model integration, on-premise deployment, and a dedicated 24/7 technical hotline for your organization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] flex items-center justify-center shrink-0 border border-[var(--outline-var)]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Bank-Grade Security</h3>
                <p className="text-xs text-muted-foreground mt-1">SOC2 Type II & GDPR compliant infrastructure.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] flex items-center justify-center shrink-0 border border-[var(--outline-var)]">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Global Deployment</h3>
                <p className="text-xs text-muted-foreground mt-1">Choose your data residency and server locations.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-card)] flex items-center justify-center shrink-0 border border-[var(--outline-var)]">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Volume Discounts</h3>
                <p className="text-xs text-muted-foreground mt-1">Special pricing for teams of 50+ members.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-btn/20 to-rose-500/20 rounded-3xl blur-2xl transform -rotate-3 scale-[1.05] opacity-50 pointer-events-none" />
          
          <div className="relative bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden text-center">
            <div className="w-20 h-20 bg-primary-btn/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-primary-btn" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground font-display mb-3">Talk to our Sales Team</h2>
            <p className="text-muted-foreground text-sm mb-8">
              We aim to respond to all enterprise inquiries within 24 hours. Send us an email directly to get started.
            </p>
            
            <a 
              href="mailto:rudrachokshi441@gmail.com?subject=Enterprise%20Inquiry%20-%20Lex%20AI" 
              className="inline-flex w-full"
            >
              <div className="w-full bg-primary-btn hover:bg-primary-btn/90 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group">
                rudrachokshi441@gmail.com
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <p className="text-xs text-muted-foreground mt-6">
              Or call us at +91 (Available for Enterprise customers)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
