import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import CoursesPageUI from "./ui/courses-page"
import type { Course } from "./ui/courses-model"

export const metadata: Metadata = {
  title: "Courses",
}

export default async function CoursesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialCourses: Course[] = []

  if (user) {
    const { data } = await supabase
      .from("courses")
      .select(
        "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

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

  return <CoursesPageUI user={user} initialCourses={initialCourses} />
}
