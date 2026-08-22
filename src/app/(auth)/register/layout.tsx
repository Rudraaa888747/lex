import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Your Lex Account",
  description: "Sign up free for Lex AI and start analyzing contracts, detecting risks, and understanding legal documents in seconds.",
  alternates: { canonical: "/register" },
  openGraph: { title: "Lex AI — Create Your Account", description: "Sign up free for Lex AI and start analyzing contracts, detecting risks, and understanding legal documents in seconds." },
  twitter: { title: "Lex AI — Create Your Account", description: "Sign up free for Lex AI and start analyzing contracts, detecting risks, and understanding legal documents in seconds." },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
