export type NoteType = "qa" | "freeform"

export type UnderstandingLevel = 1 | 2 | 3

export type Note = {
  id: string
  type: NoteType
  courseId: string | null
  courseTitle: string | null
  question: string | null
  answer: string | null
  body: string | null
  understandingLevel: UnderstandingLevel | null
  flag: boolean
  codeSnippet: string | null
  codeLanguage: string
  createdAt: string
  updatedAt: string
}

export type SortKey =
  | "last_updated"
  | "date_created"
  | "understanding_low"
  | "understanding_high"
  | "course"

export type TypeFilter = "all" | NoteType

export type CourseFilter = "all" | "none" | string

export function understandingLabel(level: UnderstandingLevel) {
  if (level === 1) return "Confused"
  if (level === 2) return "Getting It"
  return "Clear"
}

export function toCodeBadgeLabel(language: string) {
  const trimmed = language.trim()
  if (!trimmed || trimmed.toLowerCase() === "text") return "Code"
  return trimmed
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
