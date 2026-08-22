import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lex — AI Legal Document Analysis",
    short_name: "Lex",
    description:
      "Upload and analyze legal documents with AI to understand risks, obligations, and fairness.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#1A1816",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
