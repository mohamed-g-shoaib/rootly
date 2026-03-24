import type { MetadataRoute } from "next"
import { absoluteUrl, siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: siteConfig.publishedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: siteConfig.legalUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: siteConfig.legalUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
