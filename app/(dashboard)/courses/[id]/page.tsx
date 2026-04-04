import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { Suspense } from "react"

import CourseDetailPageUI from "@/app/courses/ui/course-detail-page"
import type { Course } from "@/app/courses/ui/courses-model"
import { buildNotePreview, type Note } from "@/app/notes/ui/notes-model"
import { getDashboardUserId } from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"
import { createClient } from "@/lib/supabase/server"

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

async function getInitialCourseDetailData(userId: string, courseId: string) {
  "use cache: private"
  cacheLife("minutes")
  cacheTag(`course:${courseId}`)
  cacheTag(`course-notes:${courseId}`)

  const supabase = await createClient()
  let course: Course | null = null
  let initialNotes: Note[] = []

  const [{ data: courseRow }, { data: notesRows }] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
      )
      .eq("id", courseId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("notes")
      .select(
        "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
      )
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .order("updated_at", { ascending: false }),
  ])

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

  return { course, initialNotes }
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={null}>
      <CourseDetailPageContent params={params} />
    </Suspense>
  )
}

async function CourseDetailPageContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const perf = createDashboardRoutePerf("/courses/[id]")
  const { id } = await params
  const userId = await perf.measure(
    "session",
    () => getDashboardUserId(),
    (currentUserId) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const { course, initialNotes } = userId
    ? await perf.measure(
        "course-detail-query",
        () => getInitialCourseDetailData(userId, id),
        (result) => ({
          found: Boolean(result.course),
          rows: result.initialNotes.length,
        })
      )
    : { course: null, initialNotes: [] as Note[] }

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
