import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Supported Document Types",
  description: "See every document type Lex AI analyzes — rental agreements, NDAs, employment contracts, policies, and more.",
  alternates: { canonical: "/supported" },
  openGraph: { title: "Lex AI — Supported Document Types", description: "See every document type Lex AI analyzes — rental agreements, NDAs, employment contracts, policies, and more." },
  twitter: { title: "Lex AI — Supported Document Types", description: "See every document type Lex AI analyzes — rental agreements, NDAs, employment contracts, policies, and more." },
}

export default function SupportedPage() {
  redirect("/")
}
