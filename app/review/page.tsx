import { createClient } from "@/lib/supabase/server"
import ReviewPageUI from "./ui/review-page"
import type { ReviewCourse, ReviewNote, ReviewSession } from "./ui/review-model"

export default async function ReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialSessions: ReviewSession[] = []
  const courses: ReviewCourse[] = []
  const initialNotesPool: ReviewNote[] = []

  if (user) {
    const [{ data: sessionsData }, { data: coursesData }, { data: notesData }] =
      await Promise.all([
        supabase
          .from("review_sessions")
          .select(
            "id,name,accuracy,time_spent_minutes,question_count,shuffled,flagged_only,course_scores,created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("courses")
          .select("id,title")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("notes")
          .select(
            "id,type,course_id,question,answer,understanding_level,flag,courses(title)"
          )
          .eq("user_id", user.id)
          .eq("type", "qa")
          .order("updated_at", { ascending: false }),
      ])

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
          userId: user.id,
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
          question: row.question,
          answer: row.answer,
          understandingLevel: row.understanding_level,
          flag: row.flag,
        })
      }
    }
  }

  return (
    <ReviewPageUI
      user={user}
      initialSessions={initialSessions}
      courses={courses}
      initialNotesPool={initialNotesPool}
    />
  )
}
