const FALLBACK_SITE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://rootly.app"

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export const siteConfig = {
  name: "Rootly",
  title: "Rootly | Developer learning notebook",
  description:
    "Capture notes, track progress, and review what you learn in one deliberate system built for self-taught developers.",
  ogDescription:
    "Turn scattered tutorial tabs, rough notes, and progress fragments into one calm learning system.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL),
  locale: "en_US",
  ogAlt:
    "Rootly, a developer learning notebook for capturing notes, tracking progress, and reviewing what you learn.",
  keywords: [
    "developer learning notebook",
    "learning tracker for developers",
    "study notes for developers",
    "developer spaced repetition",
    "course progress tracker",
    "self-taught developer tools",
    "Rootly",
  ],
  publishedAt: "2026-03-24",
  legalUpdatedAt: "2026-03-24",
} as const

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, siteConfig.url).toString()
}
