import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

const publicRoutes = [
  "",
  "/pricing",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/support",
  "/press",
  "/supported",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
