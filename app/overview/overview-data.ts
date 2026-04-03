import { cache } from "react"
import { cacheLife, cacheTag } from "next/cache"

import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"

export type DailyStudyDatum = { date: string; label: string; minutes: number }
export type DailyMoodDatum = {
  date: string
  label: string
  mood: 1 | 2 | 3 | null
}
export type UnderstandingDatum = {
  date: string
  label: string
  avg: number | null
}
export type CourseMasteryRow = { title: string; avg: number }

type OverviewDateWindow = {
  now: Date
  days: number
  today: string
  startDate: string
}

type DailyEntryRow = {
  date: string
  study_time_minutes: number
  mood: 1 | 2 | 3 | null
}

type OverviewSummaryEntryRow = {
  date: string
  study_time_minutes: number
}

type OverviewTrendRow = {
  updated_at: string
  course_id: string | null
  understanding_level: 1 | 2 | 3 | null
  courses: Array<{ title: string }> | { title: string } | null
}

type OverviewSummaryRpcRow = {
  total_courses?: number | null
  total_notes?: number | null
  avg_understanding?: number | null
  today_study_minutes?: number | null
  streak_days?: number | null
}

export type OverviewSummaryStats = {
  totalCourses: number
  totalNotes: number
  avgUnderstanding: number
  todayStudyMinutes: number
  streakDays: number
  hasTodayAndStreakFields: boolean
}

export const getOverviewContext = cache(async () => {
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  return { supabase, userId }
})

function toDateInputValue(d: Date): string {
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatShortDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d)
}

export function getOverviewDateWindow(nowIso: string): OverviewDateWindow {
  const now = new Date(nowIso)
  const days = 90
  const today = toDateInputValue(now)
  const start = new Date(now)
  start.setUTCDate(start.getUTCDate() - (days - 1))

  return {
    now,
    days,
    today,
    startDate: toDateInputValue(start),
  }
}

export function buildDaySeries(
  now: Date,
  days: number
): Array<{ date: string; label: string }> {
  const items: Array<{ date: string; label: string }> = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    items.push({
      date: toDateInputValue(d),
      label: formatShortDate(d),
    })
  }
  return items
}

export const getOverviewEntryRows = cache(async (nowIso: string) => {
  const rows = await getOverviewDailyRows(nowIso)
  const { startDate, today } = getOverviewDateWindow(nowIso)

  return rows.filter((row) => row.date >= startDate && row.date <= today)
})

export const getOverviewSummaryEntryRows = cache(async (nowIso: string) => {
  const rows = await getOverviewDailyRows(nowIso)

  return rows.map((row) => ({
    date: row.date,
    study_time_minutes: row.study_time_minutes,
  })) as OverviewSummaryEntryRow[]
})

const getOverviewDailyRows = cache(async (nowIso: string) => {
  "use cache: private"
  cacheLife("minutes")

  const { supabase, userId } = await getOverviewContext()

  if (!userId) {
    cacheTag("daily-entries:user:anonymous")
    return [] as DailyEntryRow[]
  }

  cacheTag(`daily-entries:user:${userId}`)
  cacheTag(`overview-summary:user:${userId}`)

  const now = new Date(nowIso)
  const streakStart = new Date(now)
  streakStart.setUTCDate(streakStart.getUTCDate() - 364)

  const { today } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("daily_entries")
    .select("date,study_time_minutes,mood")
    .eq("user_id", userId)
    .gte("date", toDateInputValue(streakStart))
    .lte("date", today)
    .order("date", { ascending: true })

  return (data ?? []) as DailyEntryRow[]
})

export const getOverviewTrendRows = cache(async (nowIso: string) => {
  "use cache: private"
  cacheLife("minutes")

  const { supabase, userId } = await getOverviewContext()

  if (!userId) {
    cacheTag("overview-trend:user:anonymous")
    return [] as OverviewTrendRow[]
  }

  cacheTag(`overview-trend:user:${userId}`)

  const { startDate } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("notes")
    .select("updated_at,course_id,understanding_level,courses(title)")
    .eq("user_id", userId)
    .gte("updated_at", `${startDate}T00:00:00.000Z`)
    .order("updated_at", { ascending: true })

  return (data ?? []) as OverviewTrendRow[]
})

export const getOverviewSummaryStats = cache(
  async (): Promise<OverviewSummaryStats | null> => {
    "use cache: private"
    cacheLife("minutes")

    const { supabase, userId } = await getOverviewContext()

    if (!userId) {
      cacheTag("overview-summary:user:anonymous")
      return null
    }

    cacheTag(`overview-summary:user:${userId}`)

    const { data, error } = await supabase.rpc("get_overview_summary")

    if (error || !data) {
      return null
    }

    const row = (
      Array.isArray(data) ? data[0] : data
    ) as OverviewSummaryRpcRow | null

    if (!row || typeof row !== "object") {
      return null
    }

    const hasTodayAndStreakFields =
      Object.prototype.hasOwnProperty.call(row, "today_study_minutes") &&
      Object.prototype.hasOwnProperty.call(row, "streak_days")

    return {
      totalCourses: Number(row.total_courses ?? 0),
      totalNotes: Number(row.total_notes ?? 0),
      avgUnderstanding: Number(row.avg_understanding ?? 0),
      todayStudyMinutes: Number(row.today_study_minutes ?? 0),
      streakDays: Number(row.streak_days ?? 0),
      hasTodayAndStreakFields,
    }
  }
)
