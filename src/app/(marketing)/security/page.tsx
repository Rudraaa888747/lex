import { Shield, Lock, Server, FileCheck, Eye, KeyRound, Trash2 } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function SecurityPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />

        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Security</h1>
          <p className="text-[#9aa0a6] mt-2">Built with a security-first architecture, from encryption to infrastructure</p>
        </div>

        <div className="space-y-6">
          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Encryption in Transit & at Rest</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  Every request to LexAI is secured with TLS 1.3 end-to-end, so your documents are
                  never exposed while uploading or downloading. At rest, files and extracted data are
                  encrypted using AES-256, the same standard relied on by banks and government systems,
                  with keys managed and rotated separately from the data they protect.
                </p>
              </div>
            </div>
          </section>

          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Isolated Processing Infrastructure</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  Document analysis runs inside isolated, sandboxed environments provisioned per request.
                  Each session is logically separated from every other tenant, ensuring your data is never
                  visible to, or processed alongside, anyone else's. Processing environments are torn down
                  immediately once analysis completes.
                </p>
              </div>
            </div>
          </section>

          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Data Minimization & Retention</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  We only retain what's needed to deliver your analysis and account history. You can
                  permanently delete any document and its extracted data at any time, and deleted files
                  are purged from active storage rather than lingering in the background.
                </p>
              </div>
            </div>
          </section>

          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Authentication & Access Control</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  Accounts are protected with modern authentication, including secure session handling
                  and support for OAuth-based sign-in. Internally, access to production systems is
                  restricted through role-based permissions, so only authorized personnel can interact
                  with infrastructure that touches customer data.
                </p>
              </div>
            </div>
          </section>

          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Monitoring & Audit Logging</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  Access to sensitive systems and data is logged and continuously monitored for unusual
                  activity. This gives us visibility into how data is accessed and helps us detect and
                  respond to anomalies quickly.
                </p>
              </div>
            </div>
          </section>

          <section className="g-default rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-[#e8eaed]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed] mb-2">Privacy by Design</h2>
                <p className="text-[#9aa0a6] leading-relaxed">
                  LexAI is built around data protection principles aligned with GDPR — clear consent,
                  purpose-limited processing, and your right to access or delete your data at any time.
                  Security isn't an afterthought here; it's part of how every feature is designed.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}