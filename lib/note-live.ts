import { buildNotePreview, type Note } from "@/app/notes/ui/notes-model"

export const NOTE_WINDOW_EVENT = "rootly:note-upsert"
export const NOTE_WINDOW_SOURCE = "rootly-extension"

type NoteRow = {
  id: string
  type: "qa" | "freeform"
  course_id: string | null
  question: string | null
  answer: string | null
  body: string | null
  understanding_level: 1 | 2 | 3 | null
  flag: boolean
  code_snippet: string | null
  code_language: string
  created_at: string
  updated_at: string
}

export function isNote(value: unknown): value is Note {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === "string" &&
    (candidate.type === "qa" || candidate.type === "freeform") &&
    (candidate.courseId == null || typeof candidate.courseId === "string") &&
    (candidate.courseTitle == null ||
      typeof candidate.courseTitle === "string") &&
    (candidate.question == null || typeof candidate.question === "string") &&
    typeof candidate.previewText === "string" &&
    (candidate.answer == null || typeof candidate.answer === "string") &&
    (candidate.body == null || typeof candidate.body === "string") &&
    (candidate.understandingLevel == null ||
      candidate.understandingLevel === 1 ||
      candidate.understandingLevel === 2 ||
      candidate.understandingLevel === 3) &&
    typeof candidate.flag === "boolean" &&
    typeof candidate.hasCodeSnippet === "boolean" &&
    (candidate.codeSnippet == null ||
      typeof candidate.codeSnippet === "string") &&
    typeof candidate.codeLanguage === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    typeof candidate.detailsLoaded === "boolean"
  )
}

export function isNoteRow(value: unknown): value is NoteRow {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === "string" &&
    (candidate.type === "qa" || candidate.type === "freeform") &&
    (candidate.course_id == null || typeof candidate.course_id === "string") &&
    (candidate.question == null || typeof candidate.question === "string") &&
    (candidate.answer == null || typeof candidate.answer === "string") &&
    (candidate.body == null || typeof candidate.body === "string") &&
    (candidate.understanding_level == null ||
      candidate.understanding_level === 1 ||
      candidate.understanding_level === 2 ||
      candidate.understanding_level === 3) &&
    typeof candidate.flag === "boolean" &&
    (candidate.code_snippet == null ||
      typeof candidate.code_snippet === "string") &&
    typeof candidate.code_language === "string" &&
    typeof candidate.created_at === "string" &&
    typeof candidate.updated_at === "string"
  )
}

export function toNote(
  row: NoteRow,
  courseTitle: string | null = null,
  detailsLoaded = false
): Note {
  return {
    id: row.id,
    type: row.type,
    courseId: row.course_id,
    courseTitle,
    question: row.question,
    previewText: buildNotePreview({
      type: row.type,
      answer: row.answer,
      body: row.body,
    }),
    answer: detailsLoaded ? row.answer : null,
    body: detailsLoaded ? row.body : null,
    understandingLevel: row.understanding_level,
    flag: row.flag,
    hasCodeSnippet: Boolean(row.code_snippet),
    codeSnippet: detailsLoaded ? row.code_snippet : null,
    codeLanguage: row.code_language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    detailsLoaded,
  }
}

export function upsertNote(notes: Note[], nextNote: Note): Note[] {
  const filteredNotes = notes.filter((note) => note.id !== nextNote.id)

  return [nextNote, ...filteredNotes].toSorted((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )
}
