import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"

import ReviewPageUI from "@/app/review/ui/review-page"
import type {
  ReviewCourse,
  ReviewNote,
  ReviewSession,
} from "@/app/review/ui/review-model"
import { getDashboardUserId } from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Review",
}

const REVIEW_SESSIONS_PAGE_SIZE = 8

async function getInitialReviewData(userId: string) {
  "use cache: private"
  cacheLife("minutes")
  cacheTag(`review-sessions:user:${userId}`)
  cacheTag(`courses:user:${userId}`)
  cacheTag(`notes:user:${userId}`)

  const supabase = await createClient()

  const [
    { data: sessionsData, count: sessionsCount },
    { data: coursesData },
    { data: notesData },
  ] = await Promise.all([
    supabase
      .from("review_sessions")
      .select(
        "id,name,accuracy,time_spent_minutes,question_count,shuffled,flagged_only,course_scores,created_at",
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(0, REVIEW_SESSIONS_PAGE_SIZE - 1),
    supabase
      .from("courses")
      .select("id,title")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("notes")
      .select("id,course_id,understanding_level,flag,courses(title)")
      .eq("user_id", userId)
      .eq("type", "qa")
      .not("question", "is", null)
      .not("answer", "is", null)
      .order("updated_at", { ascending: false }),
  ])

  const initialSessions: ReviewSession[] = []
  const courses: ReviewCourse[] = []
  const initialNotesPool: ReviewNote[] = []

  if (coursesData) {
    for (const row of coursesData as Array<{ id: string; title: string }>) {
      courses.push({ id: row.id, title: row.title })
    }
  }

  if (sessionsData) {
    for (const row of sessionsData as Array<{
      id: string
      name: string
      accuracy: number
      time_spent_minutes: number
      question_count: number
      shuffled: boolean
      flagged_only: boolean
      course_scores: Record<string, number>
      created_at: string
    }>) {
      const courseScores = row.course_scores ?? {}
      const entries = Object.entries(courseScores)

      let weakestCourseId: string | null = null
      let strongestCourseId: string | null = null
      let weakest = Infinity
      let strongest = -Infinity

      for (const [courseId, score] of entries) {
        if (score < weakest) {
          weakest = score
          weakestCourseId = courseId
        }
        if (score > strongest) {
          strongest = score
          strongestCourseId = courseId
        }
      }

      initialSessions.push({
        id: row.id,
        userId,
        name: row.name,
        date: row.created_at.slice(0, 10),
        questionCount: row.question_count,
        shuffled: row.shuffled,
        flaggedOnly: row.flagged_only,
        accuracy: row.accuracy,
        timeSpentMinutes: row.time_spent_minutes,
        notesLeveledUp: [],
        notesLeveledDown: [],
        weakestCourseId,
        strongestCourseId,
        createdAt: row.created_at,
      })
    }
  }

  if (notesData) {
    for (const row of notesData as Array<{
      id: string
      type: "qa" | "freeform"
      course_id: string | null
      question: string | null
      answer: string | null
      understanding_level: 1 | 2 | 3 | null
      flag: boolean
      courses: Array<{ title: string }>
    }>) {
      if (!row.question || !row.answer || row.understanding_level == null) {
        continue
      }

      const courseTitle = row.courses?.[0]?.title ?? null

      initialNotesPool.push({
        id: row.id,
        type: "qa",
        courseId: row.course_id,
        courseTitle,
        question: null,
        answer: null,
        understandingLevel: row.understanding_level,
        flag: row.flag,
        detailsLoaded: false,
      })
    }
  }

  return {
    initialSessions,
    initialSessionsTotal: sessionsCount ?? initialSessions.length,
    courses,
    initialNotesPool,
  }
}

export default async function ReviewPage() {
  const perf = createDashboardRoutePerf("/review")
  const userId = await perf.measure(
    "session",
    () => getDashboardUserId(),
    (currentUserId) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const { initialSessions, initialSessionsTotal, courses, initialNotesPool } =
    userId
      ? await perf.measure(
          "review-data",
          () => getInitialReviewData(userId),
          (result) => ({
            sessions: result.initialSessions.length,
            courses: result.courses.length,
            notes: result.initialNotesPool.length,
          })
        )
      : {
          initialSessions: [] as ReviewSession[],
          initialSessionsTotal: 0,
          courses: [] as ReviewCourse[],
          initialNotesPool: [] as ReviewNote[],
        }

  perf.finish({
    sessions: initialSessions.length,
    courses: courses.length,
    notes: initialNotesPool.length,
  })

  return (
    <ReviewPageUI
      userId={userId}
      initialSessions={initialSessions}
      initialSessionsTotal={initialSessionsTotal}
      sessionsPageSize={REVIEW_SESSIONS_PAGE_SIZE}
      courses={courses}
      initialNotesPool={initialNotesPool}
    />
  )
}
