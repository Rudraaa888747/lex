import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Lex AI password to regain access to your legal document analysis dashboard.",
  alternates: { canonical: "/reset-password" },
  openGraph: { title: "Lex AI — Reset Password", description: "Reset your Lex AI password to regain access to your legal document analysis dashboard." },
  twitter: { title: "Lex AI — Reset Password", description: "Reset your Lex AI password to regain access to your legal document analysis dashboard." },
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
