export type Course = {
  id: string
  title: string
  instructor: string | null
  courseLink: string | null
  links: string[]
  topics: string[]
  progress: number
  createdAt: string
  updatedAt: string
}

export type SortKey =
  | "last_updated"
  | "date_created"
  | "progress_low"
  | "progress_high"
  | "alphabetical"

export type TopicFilter = "all" | string

export function isValidUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true
  try {
    const _url = new URL(trimmed)
    void _url
    return true
  } catch {
    return false
  }
}

export function totalLinkCount(course: Course) {
  return (course.courseLink ? 1 : 0) + course.links.length
}

export function formatUpdatedLabel(now: Date, updatedAtIso: string) {
  const updated = new Date(updatedAtIso)
  const diffMs = now.getTime() - updated.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return "Updated just now"
  if (diffHours < 24)
    return `Updated ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays <= 7)
    return `Updated ${diffDays} day${diffDays === 1 ? "" : "s"} ago`

  const short = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(updated)
  return `Updated ${short}`
}
