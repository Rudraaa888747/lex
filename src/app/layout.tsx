import type { Metadata } from "next"
import "./globals.css"
import { AppWrapper } from "@/components/app-wrapper"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { siteUrl } from "@/lib/site"
import { Fraunces, DM_Sans, IBM_Plex_Mono } from "next/font/google"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lex | AI Legal Document Analyzer & Contract Risk Detector",
    template: "%s | Lex",
  },
  description: "Understand every contract in seconds. Lex AI simplifies legal jargon, identifies hidden risks, and provides clause-by-clause breakdowns for NDAs, agreements, and policies.",
  keywords: ["AI contract analyzer", "legal document AI", "contract risk detection", "AI for legal documents", "clause breakdown AI", "Next.js legal tech"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lex | AI Legal Document Analyzer & Contract Risk Detector",
    description: "Understand every contract in seconds. Lex AI simplifies legal jargon, identifies hidden risks, and provides clause-by-clause breakdowns for NDAs, agreements, and policies.",
    url: siteUrl,
    siteName: "Lex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lex | AI Legal Document Analyzer & Contract Risk Detector",
    description: "Understand every contract in seconds. Lex AI simplifies legal jargon, identifies hidden risks, and provides clause-by-clause breakdowns for NDAs, agreements, and policies.",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full antialiased ${fraunces.variable} ${dmSans.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AppWrapper>
          <SiteHeader />
          <main className="flex-1 pt-24 lg:pt-32 safe-top">{children}</main>
          <SiteFooter />
        </AppWrapper>
      </body>
    </html>
  )
}
