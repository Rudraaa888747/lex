import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log In to Lex",
  description: "Sign in to Lex AI to analyze contracts, chat with your documents, and track your legal insights.",
  alternates: { canonical: "/login" },
  openGraph: { title: "Lex AI — Log In", description: "Sign in to Lex AI to analyze contracts, chat with your documents, and track your legal insights." },
  twitter: { title: "Lex AI — Log In", description: "Sign in to Lex AI to analyze contracts, chat with your documents, and track your legal insights." },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
