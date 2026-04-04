const FALLBACK_SITE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://rootly.app"

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export const siteConfig = {
  name: "Rootly",
  title: "Rootly | Learning tracker and study notebook",
  description:
    "Turn scattered learning into organized progress. Capture notes, track study time, and review what you learn—whether you're following coding tutorials, design courses, or any structured learning path.",
  ogDescription:
    "Organize your learning with structured notes, study time tracking, and spaced repetition review. Includes a browser extension for capturing notes from any webpage.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL),
  locale: "en_US",
  ogAlt:
    "Rootly, a learning tracker and study notebook for capturing notes, tracking progress, and reviewing what you learn.",
  keywords: [
    "learning tracker",
    "study notes app",
    "organized learning system",
    "study time tracker",
    "progress tracker for students",
    "developer learning notebook",
    "spaced repetition",
    "course progress tracker",
    "browser extension for learning",
    "study notes browser extension",
    "learning tracker chrome extension",
    "note taking side panel",
    "browser study timer",
    "chrome extension for students",
    "Rootly",
  ],
  publishedAt: "2026-03-24",
  legalUpdatedAt: "2026-03-24",
} as const

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, siteConfig.url).toString()
}
