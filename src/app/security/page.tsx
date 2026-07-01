import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#9aa0a6] hover:text-[#e8eaed] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Website
        </Link>
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Security</h1>
          <p className="text-[#9aa0a6] mt-2">How we protect your documents and data</p>
        </div>
        <div className="space-y-6">
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Encryption</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              All documents are encrypted using AES-256 standards both in transit via TLS 1.3 and at rest. 
              This is the same encryption standard used by financial institutions and government agencies.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Infrastructure</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Our infrastructure runs on isolated, sandboxed containers. Each document is processed in a 
              private environment that is destroyed after analysis completes. No cross-tenant data leakage.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Compliance</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We are GDPR-compliant and follow industry best practices for data protection. Regular 
              security audits are conducted by independent third-party firms.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Access Control</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Strict role-based access controls ensure only authorized personnel can access your 
              documents. All access is logged and audited.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
