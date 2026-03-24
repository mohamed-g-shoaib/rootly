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
