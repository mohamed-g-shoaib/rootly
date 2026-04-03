import type { Metadata } from "next"

import CourseDetailPageUI from "@/app/courses/ui/course-detail-page"
import type { Course } from "@/app/courses/ui/courses-model"
import { buildNotePreview, type Note } from "@/app/notes/ui/notes-model"
import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"

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

export const metadata: Metadata = {
  title: "Course",
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const perf = createDashboardRoutePerf("/courses/[id]")
  const { id } = await params
  const [supabase, userId] = await perf.measure(
    "session",
    () => Promise.all([getDashboardSupabase(), getDashboardUserId()]),
    ([, currentUserId]) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  let course: Course | null = null
  let initialNotes: Note[] = []

  if (userId) {
    const { data: courseRow } = await perf.measure(
      "course-query",
      () =>
        supabase
          .from("courses")
          .select(
            "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
          )
          .eq("id", id)
          .eq("user_id", userId)
          .maybeSingle(),
      (result) => ({
        found: Boolean(result.data),
      })
    )

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

    const { data: notesRows } = await perf.measure(
      "course-notes-query",
      () =>
        supabase
          .from("notes")
          .select(
            "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
          )
          .eq("user_id", userId)
          .eq("course_id", id)
          .order("updated_at", { ascending: false }),
      (result) => ({
        rows: result.data?.length ?? 0,
      })
    )

    if (notesRows) {
      initialNotes = (notesRows as NoteRow[]).map((row) => ({
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
        answer: row.answer,
        body: row.body,
        understandingLevel: row.understanding_level,
        flag: row.flag,
        hasCodeSnippet: Boolean(row.code_snippet),
        codeSnippet: row.code_snippet,
        codeLanguage: row.code_language,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        detailsLoaded: true,
      }))
    }
  }

  perf.finish({
    foundCourse: Boolean(course),
    notes: initialNotes.length,
  })

  return (
    <CourseDetailPageUI
      courseId={id}
      userId={userId}
      course={course}
      initialNotes={initialNotes}
    />
  )
}
