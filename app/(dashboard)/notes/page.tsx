import type { Metadata } from "next"

import NotesPageUI from "@/app/notes/ui/notes-page"
import { buildNotePreview, type Note } from "@/app/notes/ui/notes-model"
import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"

export const metadata: Metadata = {
  title: "Notes",
}

export default async function NotesPage() {
  const perf = createDashboardRoutePerf("/notes")
  const notesPerf = perf.createScope("notes")
  const [supabase, userId] = await perf.measure(
    "session",
    () => Promise.all([getDashboardSupabase(), getDashboardUserId()]),
    ([, currentUserId]) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const initialNotes: Note[] = []
  const initialCourses: { id: string; title: string }[] = []

  if (userId) {
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
      courses: { title: string }[] | { title: string } | null
    }

    const { data: noteRows } = await notesPerf.measure(
      "query-notes",
      () =>
        supabase
          .from("notes")
          .select(
            "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
          )
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
      (result) => ({
        rows: result.data?.length ?? 0,
      })
    )

    if (noteRows) {
      initialNotes.push(
        ...(noteRows as NoteRow[]).map((row) => ({
          id: row.id,
          type: row.type,
          courseId: row.course_id,
          courseTitle: Array.isArray(row.courses)
            ? (row.courses[0]?.title ?? null)
            : (row.courses?.title ?? null),
          question: row.question,
          previewText: buildNotePreview({
            type: row.type,
            answer: row.answer,
            body: row.body,
          }),
          answer: null,
          body: null,
          understandingLevel: row.understanding_level,
          flag: row.flag,
          hasCodeSnippet: Boolean(row.code_snippet),
          codeSnippet: null,
          codeLanguage: row.code_language,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          detailsLoaded: false,
        }))
      )
    }

    const { data: courseRows } = await notesPerf.measure(
      "query-courses",
      () =>
        supabase
          .from("courses")
          .select("id,title")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
      (result) => ({
        rows: result.data?.length ?? 0,
      })
    )

    if (courseRows) {
      initialCourses.push(
        ...(courseRows as Array<{ id: string; title: string }>).map((c) => ({
          id: c.id,
          title: c.title,
        }))
      )
    }
  }

  perf.finish({
    notes: initialNotes.length,
    courses: initialCourses.length,
  })

  return (
    <NotesPageUI userId={userId} initialNotes={initialNotes} initialCourses={initialCourses} />
  )
}
