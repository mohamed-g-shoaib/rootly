import type { Metadata } from "next"

import CoursesPageUI from "@/app/courses/ui/courses-page"
import type { Course } from "@/app/courses/ui/courses-model"
import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"

export const metadata: Metadata = {
  title: "Courses",
}

export default async function CoursesPage() {
  const perf = createDashboardRoutePerf("/courses")
  const [supabase, userId] = await perf.measure(
    "session",
    () => Promise.all([getDashboardSupabase(), getDashboardUserId()]),
    ([, currentUserId]) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const initialCourses: Course[] = []

  if (userId) {
    const { data } = await perf.measure(
      "courses-query",
      () =>
        supabase
          .from("courses")
          .select(
              "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
            )
          .eq("user_id", userId)
          .order("updated_at", { ascending: false }),
      (result) => ({
        rows: result.data?.length ?? 0,
      })
    )

    if (data) {
      for (const row of data as Array<{
        id: string
        title: string
        instructor: string | null
        course_link: string | null
        links: string[]
        topics: string[]
        progress: number
        created_at: string
        updated_at: string
      }>) {
        initialCourses.push({
          id: row.id,
          title: row.title,
          instructor: row.instructor,
          courseLink: row.course_link,
          links: row.links,
          topics: row.topics,
          progress: row.progress,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
      }
    }
  }

  perf.finish({
    courses: initialCourses.length,
  })

  return <CoursesPageUI userId={userId} initialCourses={initialCourses} />
}
