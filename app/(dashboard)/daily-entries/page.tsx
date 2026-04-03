import type { Metadata } from "next"

import DailyEntriesPageUI from "@/app/daily-entries/ui/daily-entries-page"
import type { DailyEntry } from "@/app/daily-entries/ui/daily-entries-model"
import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"

export const metadata: Metadata = {
  title: "Daily Entries",
}

const DAILY_ENTRIES_PAGE_SIZE = 20

export default async function DailyEntriesPage() {
  const perf = createDashboardRoutePerf("/daily-entries")
  const [supabase, userId] = await perf.measure(
    "session",
    () => Promise.all([getDashboardSupabase(), getDashboardUserId()]),
    ([, currentUserId]) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const initialEntries: DailyEntry[] = []
  let initialEntriesTotal = 0

  if (userId) {
    const { data, count } = await perf.measure(
      "entries-query",
      () =>
        supabase
          .from("daily_entries")
          .select(
            "id,date,study_time_minutes,mood,notes,created_at,updated_at",
            {
              count: "exact",
            }
          )
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .range(0, DAILY_ENTRIES_PAGE_SIZE - 1),
      (result) => ({
        rows: result.data?.length ?? 0,
      })
    )

    initialEntriesTotal = count ?? 0

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

  perf.finish({
    entries: initialEntries.length,
  })

  return (
    <DailyEntriesPageUI
      userId={userId}
      initialEntries={initialEntries}
      initialEntriesTotal={initialEntriesTotal}
      entriesPageSize={DAILY_ENTRIES_PAGE_SIZE}
    />
  )
}
