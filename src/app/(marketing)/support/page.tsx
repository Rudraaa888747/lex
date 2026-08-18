import { LifeBuoy } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function SupportPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Support</h1>
          <p className="text-[#9aa0a6] mt-2">We&apos;re here to help</p>
        </div>
        <div className="space-y-6">
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Email Support</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Reach us at support@Lex.com. We typically respond within 24 hours.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Documentation</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Check our FAQ page for answers to common questions about document analysis, 
              pricing, and account management.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Response Times</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Free plan: 48 hours. Pro: 24 hours. Business: 12 hours. Enterprise: 4 hours with dedicated support manager.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
