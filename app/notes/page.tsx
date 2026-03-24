import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import NotesPageUI from "./ui/notes-page"
import type { Note } from "./ui/notes-model"

export const metadata: Metadata = {
  title: "Notes",
}

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialNotes: Note[] = []
  const initialCourses: { id: string; title: string }[] = []

  if (user) {
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

    const { data: noteRows } = await supabase
      .from("notes")
      .select(
        "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

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
          answer: row.answer,
          body: row.body,
          understandingLevel: row.understanding_level,
          flag: row.flag,
          codeSnippet: row.code_snippet,
          codeLanguage: row.code_language,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
      )
    }

    const { data: courseRows } = await supabase
      .from("courses")
      .select("id,title")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (courseRows) {
      initialCourses.push(
        ...(courseRows as Array<{ id: string; title: string }>).map((c) => ({
          id: c.id,
          title: c.title,
        }))
      )
    }
  }

  return (
    <NotesPageUI
      user={user}
      initialNotes={initialNotes}
      initialCourses={initialCourses}
    />
  )
}
