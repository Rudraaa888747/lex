import { Briefcase } from "lucide-react"
import Link from "next/link"
import { BackToWebsite } from "@/components/ui/back-to-website"

export default function CareersPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackToWebsite className="mb-8 justify-start mt-0" />
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e8eaed]">Careers</h1>
          <p className="text-[#9aa0a6] mt-2">Join us in making legal documents accessible to everyone</p>
        </div>
        <div className="space-y-6">
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Senior AI Engineer</h2>
            <p className="text-[#9aa0a6] leading-relaxed mb-3">
              Build and improve our NLP models for legal document analysis. Experience with transformer 
              architectures and LLM fine-tuning required.
            </p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#b4c5ff]/10 text-[#b4c5ff] border border-[#b4c5ff]/20">Full-time · Remote</span>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Full-Stack Developer</h2>
            <p className="text-[#9aa0a6] leading-relaxed mb-3">
              Work on our Next.js application, API infrastructure, and real-time analysis pipeline. 
              Experience with TypeScript, React, and Node.js required.
            </p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#b4c5ff]/10 text-[#b4c5ff] border border-[#b4c5ff]/20">Full-time · Remote</span>
          </section>
          <section className="g-default rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#e8eaed] mb-3">Product Designer</h2>
            <p className="text-[#9aa0a6] leading-relaxed mb-3">
              Design intuitive interfaces for complex legal analysis. Experience with design systems 
              and data visualization preferred.
            </p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#b4c5ff]/10 text-[#b4c5ff] border border-[#b4c5ff]/20">Full-time · Remote</span>
          </section>
          <p className="text-center text-[#9aa0a6] text-sm mt-8">
            Send your resume to careers@Lex.com. We welcome applicants from all backgrounds.
          </p>
        </div>
      </div>
    </div>
  )
}
