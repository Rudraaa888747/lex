import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Document Type Guide",
  description: "Learn how Lex AI analyzes this document type, the risks it flags, and what each clause means in plain language.",
  openGraph: { title: "Lex AI — Document Type Guide", description: "Learn how Lex AI analyzes this document type, the risks it flags, and what each clause means in plain language." },
  twitter: { title: "Lex AI — Document Type Guide", description: "Learn how Lex AI analyzes this document type, the risks it flags, and what each clause means in plain language." },
}

export default function SupportedSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
