import type { MetadataRoute } from "next"
import { absoluteUrl, siteConfig } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/overview", "/notes", "/courses", "/daily-entries", "/review"],
    },
    host: siteConfig.url,
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
