import { cache } from "react"

import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"

export type DailyStudyDatum = { date: string; label: string; minutes: number }
export type DailyMoodDatum = { date: string; label: string; mood: 1 | 2 | 3 | null }
export type UnderstandingDatum = { date: string; label: string; avg: number | null }
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
  mood: 1 | 2 | 3
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

type OverviewUnderstandingRow = {
  understanding_level: 1 | 2 | 3 | null
}

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
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  if (!userId) {
    return [] as DailyEntryRow[]
  }

  const { startDate, today } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("daily_entries")
    .select("date,study_time_minutes,mood")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", today)
    .order("date", { ascending: true })

  return (data ?? []) as DailyEntryRow[]
})

export const getOverviewSummaryEntryRows = cache(async (nowIso: string) => {
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  if (!userId) {
    return [] as OverviewSummaryEntryRow[]
  }

  const now = new Date(nowIso)
  const streakStart = new Date(now)
  streakStart.setUTCDate(streakStart.getUTCDate() - 364)

  const { today } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("daily_entries")
    .select("date,study_time_minutes")
    .eq("user_id", userId)
    .gte("date", toDateInputValue(streakStart))
    .lte("date", today)
    .order("date", { ascending: false })

  return (data ?? []) as OverviewSummaryEntryRow[]
})

export const getOverviewTrendRows = cache(async (nowIso: string) => {
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  if (!userId) {
    return [] as OverviewTrendRow[]
  }

  const { startDate } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("notes")
    .select("updated_at,course_id,understanding_level,courses(title)")
    .eq("user_id", userId)
    .gte("updated_at", `${startDate}T00:00:00.000Z`)
    .order("updated_at", { ascending: true })

  return (data ?? []) as OverviewTrendRow[]
})

export const getOverviewUnderstandingLevels = cache(async (nowIso: string) => {
  const [supabase, userId] = await Promise.all([
    getDashboardSupabase(),
    getDashboardUserId(),
  ])

  if (!userId) {
    return [] as OverviewUnderstandingRow[]
  }

  const { startDate } = getOverviewDateWindow(nowIso)

  const { data } = await supabase
    .from("notes")
    .select("understanding_level")
    .eq("user_id", userId)
    .gte("updated_at", `${startDate}T00:00:00.000Z`)

  return (data ?? []) as OverviewUnderstandingRow[]
})
