import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { getThemeById, THEME_IDS } from "@/lib/themes"
import CoursesPageUI from "./ui/courses-page"
import type { Course } from "./ui/courses-model"

export default async function CoursesPage() {
  const cookieStore = await cookies()
  const paletteCookie = cookieStore.get("reway.dashboard.paletteTheme")?.value
  const paletteThemeId =
    paletteCookie === "default" ||
    (paletteCookie && THEME_IDS.includes(paletteCookie))
      ? paletteCookie
      : "default"

  const paletteCss =
    paletteThemeId && paletteThemeId !== "default"
      ? (() => {
          const theme = getThemeById(paletteThemeId)
          if (!theme) return ""
          const light = Object.entries(theme.light)
            .map(([k, v]) => `--${k}:${v};`)
            .join("")
          const dark = Object.entries(theme.dark)
            .map(([k, v]) => `--${k}:${v};`)
            .join("")
          return `:root{${light}}.dark{${dark}}`
        })()
      : ""

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

  return (
    <>
      {paletteCss ? <style>{paletteCss}</style> : null}
      <CoursesPageUI user={user} initialCourses={initialCourses} />
    </>
  )
}
