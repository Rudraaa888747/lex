import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"
import { blogPosts } from "@/lib/blog-data"
import { documentTypes } from "@/data/document-types"

const publicRoutes = [
  "",
  "/pricing",
  "/faq",
  "/features",
  "/how-it-works",
  "/blog",
  "/contact-sales",
  "/careers",
  "/privacy",
  "/terms",
  "/security",
  "/support",
  "/press",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    ...publicRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...documentTypes.map((doc) => ({
      url: `${siteUrl}/supported/${doc.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
