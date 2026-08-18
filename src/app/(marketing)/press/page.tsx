import { Newspaper } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function PressPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Press Kit</h1>
          <p className="text-[#9aa0a6] mt-2">Resources for media and partners</p>
        </div>
        <div className="space-y-6">
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">About Lex</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              Lex is an AI-powered legal document analysis platform that makes contracts 
              and legal documents accessible to everyone. Our technology uses advanced AI to detect 
              risks, extract clauses, and provide plain-language explanations.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Brand Assets</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              For press inquiries and brand assets, please contact press@Lex.com.
            </p>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Media Contact</h2>
            <p className="text-[#9aa0a6] leading-relaxed">
              For interview requests and media inquiries, reach out to our press team at press@Lex.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
