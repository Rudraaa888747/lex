import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackToWebsiteProps {
  href?: string
  text?: string
  className?: string
}

export function BackToWebsite({ 
  href = "/", 
  text = "Back to Website",
  className = ""
}: BackToWebsiteProps) {
  return (
    <div className={`mb-6 mt-4 sm:mt-8 relative z-20 flex justify-center md:justify-start ${className}`}>
      <Link 
        href={href} 
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-[rgba(0,0,0,0.04)] border border-border rounded-full shadow-sm transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        {text}
      </Link>
    </div>
  )
}
