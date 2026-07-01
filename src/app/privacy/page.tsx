import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Privacy Policy</h1>
          <p className="text-[#9aa0a6] mt-2">Last updated: June 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Lex (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We collect information you provide directly, including account information (name, email, password) and 
              documents you upload for analysis. We also automatically collect certain technical information such as 
              IP address, browser type, and usage patterns to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We use your information to: (a) provide and improve our document analysis services, (b) communicate 
              with you about your account, (c) send service-related notifications, (d) detect and prevent abuse, 
              and (e) comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We implement industry-standard security measures including AES-256 encryption, secure file storage, 
              and access controls. Your documents are stored in isolated environments and are never shared with 
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Retention</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We retain your account information for as long as your account is active. You may request deletion 
              of your account and associated data at any time. Documents and analyses are retained according to 
              your subscription plan terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              You have the right to: (a) access your personal data, (b) correct inaccurate data, (c) delete your 
              data, (d) restrict processing, (e) data portability, and (f) withdraw consent. To exercise these 
              rights, please contact us through the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. GDPR Compliance</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              For users in the European Economic Area, we comply with the General Data Protection Regulation (GDPR). 
              This includes providing clear information about data processing, obtaining consent where required, 
              and enabling data portability and deletion.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
