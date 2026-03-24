import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import DailyEntriesPageUI from "./ui/daily-entries-page"
import type { DailyEntry } from "./ui/daily-entries-model"

export const metadata: Metadata = {
  title: "Daily Entries",
}

export default async function DailyEntriesPage() {
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

  return <DailyEntriesPageUI user={user} initialEntries={initialEntries} />
}
