import { createClient } from "@/lib/supabase/server"
import { DashboardColorThemeStyle } from "@/components/dashboard-color-theme-style"
import CourseDetailPageUI from "../ui/course-detail-page"
import type { Course } from "../ui/courses-model"
import type { Note } from "@/app/notes/ui/notes-model"

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

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let course: Course | null = null
  let initialNotes: Note[] = []

  if (user) {
    const { data: courseRow } = await supabase
      .from("courses")
      .select(
        "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (courseRow) {
      course = {
        id: courseRow.id,
        title: courseRow.title,
        instructor: courseRow.instructor,
        courseLink: courseRow.course_link,
        links: courseRow.links,
        topics: courseRow.topics,
        progress: courseRow.progress,
        createdAt: courseRow.created_at,
        updatedAt: courseRow.updated_at,
      }
    }

    const { data: notesRows } = await supabase
      .from("notes")
      .select(
        "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
      )
      .eq("user_id", user.id)
      .eq("course_id", id)
      .order("updated_at", { ascending: false })

    if (notesRows) {
      initialNotes = (notesRows as NoteRow[]).map((row) => ({
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
    }
  }

  return (
    <>
      <DashboardColorThemeStyle />
      <CourseDetailPageUI
        courseId={id}
        user={user}
        course={course}
        initialNotes={initialNotes}
      />
    </>
  )
}
