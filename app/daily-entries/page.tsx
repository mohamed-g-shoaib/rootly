import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import { getThemeById, THEME_IDS } from "@/lib/themes"
import DailyEntriesPageUI from "./ui/daily-entries-page"
import type { DailyEntry } from "./ui/daily-entries-model"

export default async function DailyEntriesPage() {
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

  const initialEntries: DailyEntry[] = []

  if (user) {
    const { data } = await supabase
      .from("daily_entries")
      .select("id,date,study_time_minutes,mood,notes,created_at,updated_at")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (data) {
      for (const row of data as Array<{
        id: string
        date: string
        study_time_minutes: number
        mood: 1 | 2 | 3
        notes: string | null
        created_at: string
        updated_at: string
      }>) {
        initialEntries.push({
          id: row.id,
          date: row.date,
          studyTimeMinutes: row.study_time_minutes,
          mood: row.mood,
          notes: row.notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
      }
    }
  }

  return (
    <>
      {paletteCss ? <style>{paletteCss}</style> : null}
      <DailyEntriesPageUI user={user} initialEntries={initialEntries} />
    </>
  )
}
