import { Scale } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function TermsPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Terms of Service</h1>
          <p className="text-[#9aa0a6] mt-2">Last updated: June 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              By accessing and using Lex (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. 
              If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Description of Service</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Lex provides AI-powered document analysis services. The Platform uses artificial intelligence to analyze 
              legal documents and provide summaries, risk assessments, and plain-language explanations. The Platform is not a 
              law firm and does not provide legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. User Obligations</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              You agree to: (a) provide accurate information when creating an account, (b) maintain the confidentiality of 
              your account credentials, (c) use the Platform in compliance with all applicable laws, and (d) not upload 
              malicious content or attempt to disrupt the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Disclaimer of Legal Advice</h2>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-300/80">
                Lex provides AI-generated analysis only. The Platform does not provide legal advice, 
                legal representation, or create an attorney-client relationship. All analyses should be reviewed 
                by a qualified legal professional. You should not rely solely on AI-generated analysis for 
                making legal decisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Privacy</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your personal information and documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Intellectual Property</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              You retain all ownership rights to the documents you upload. Lex claims no ownership over your content. 
              The Platform, including its software, AI models, design, and trademarks, remains the exclusive property of Lex.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Subscription & Payments</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Certain features of the Platform are available on a subscription basis. Subscriptions automatically renew 
              unless canceled prior to the end of the current billing cycle. All payments are non-refundable unless 
              otherwise required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Termination</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, 
              if you violate these Terms of Service, engage in abusive behavior, use the Platform for illegal activities, 
              or fail to pay applicable fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Indemnification</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              You agree to indemnify and hold harmless Lex, its affiliates, and its operators from any claims, damages, 
              losses, liabilities, and expenses arising out of your use of the Platform, your violation of these Terms, 
              or your violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Limitation of Liability</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Lex and its operators shall not be liable for any damages arising from the use or inability 
              to use the Platform, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">11. Governing Law</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              These Terms of Service and any separate agreements whereby we provide you services shall be governed by 
              and construed in accordance with the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">12. Changes to Terms</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              We may update these Terms of Service from time to time. We will notify you of any changes by posting the 
              new Terms on this page and updating the "Last updated" date. Continued use of the Platform following such 
              changes constitutes your acceptance of the revised Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
