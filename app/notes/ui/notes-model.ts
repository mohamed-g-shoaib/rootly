import {
  Alert01Icon,
  CheckmarkCircle01Icon,
  Progress03Icon,
} from "@hugeicons/core-free-icons"

export type NoteType = "qa" | "freeform"

export type UnderstandingLevel = 1 | 2 | 3

export type Note = {
  id: string
  type: NoteType
  courseId: string | null
  courseTitle: string | null
  question: string | null
  previewText: string
  answer: string | null
  body: string | null
  understandingLevel: UnderstandingLevel | null
  flag: boolean
  hasCodeSnippet: boolean
  codeSnippet: string | null
  codeLanguage: string
  createdAt: string
  updatedAt: string
  detailsLoaded: boolean
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

export function understandingIcon(level: UnderstandingLevel) {
  if (level === 1) return Alert01Icon
  if (level === 2) return Progress03Icon
  return CheckmarkCircle01Icon
}

export function understandingColor(level: UnderstandingLevel) {
  if (level === 1) return "var(--destructive)"
  if (level === 2) return "var(--info)"
  return "var(--success)"
}

export function toCodeBadgeLabel(language: string) {
  const trimmed = language.trim()
  if (!trimmed || trimmed.toLowerCase() === "text") return "Code"
  return trimmed
}

export function buildNotePreview({
  type,
  answer,
  body,
}: {
  type: NoteType
  answer: string | null
  body: string | null
}) {
  const source = type === "qa" ? answer : body
  return (source ?? "").trim().slice(0, 280)
}
