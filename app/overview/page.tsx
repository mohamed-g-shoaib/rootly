import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import OverviewPageUI from "./ui/overview-page"

export const metadata: Metadata = {
  title: "Overview",
}

type DailyStudyDatum = { date: string; label: string; minutes: number }
type DailyMoodDatum = { date: string; label: string; mood: 1 | 2 | 3 | null }
type UnderstandingDatum = { date: string; label: string; avg: number | null }
type CourseMasteryRow = { title: string; avg: number }
type ReviewAccuracyDatum = { date: string; label: string; accuracy: number }

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

function formatLongDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d)
}

function buildDaySeries(
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

export default async function OverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const now = new Date()
  const today = toDateInputValue(now)
  const days = 90
  const start = new Date(now)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  const startDate = toDateInputValue(start)

  let totalCourses = 0
  let totalNotes = 0
  let todayStudyMinutes = 0
  let avgUnderstanding = 0
  let streakDays = 0

  const dailyStudyTime: DailyStudyDatum[] = []
  const dailyMood: DailyMoodDatum[] = []
  const understandingProgress: UnderstandingDatum[] = []
  const courseMastery: CourseMasteryRow[] = []
  const reviewAccuracyTrend: ReviewAccuracyDatum[] = []

  if (user) {
    const [coursesCountRes, notesCountRes, entriesRes, reviewRes] =
      await Promise.all([
        supabase
          .from("courses")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("notes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("daily_entries")
          .select("date,study_time_minutes,mood")
          .eq("user_id", user.id)
          .gte("date", startDate)
          .lte("date", today)
          .order("date", { ascending: true }),
        supabase
          .from("review_sessions")
          .select("created_at,accuracy")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ])

    totalCourses = coursesCountRes.count ?? 0
    totalNotes = notesCountRes.count ?? 0

    const entryByDate = new Map<
      string,
      { minutes: number; mood: 1 | 2 | 3 | null }
    >()

    for (const row of (entriesRes.data ?? []) as Array<{
      date: string
      study_time_minutes: number
      mood: 1 | 2 | 3
    }>) {
      entryByDate.set(row.date, {
        minutes: row.study_time_minutes,
        mood: row.mood,
      })
      if (row.date === today) todayStudyMinutes += row.study_time_minutes
    }

    const series = buildDaySeries(now, days)
    for (const d of series) {
      const entry = entryByDate.get(d.date)
      dailyStudyTime.push({
        date: d.date,
        label: d.label,
        minutes: entry?.minutes ?? 0,
      })
      dailyMood.push({
        date: d.date,
        label: d.label,
        mood: entry?.mood ?? null,
      })
    }

    for (let i = series.length - 1; i >= 0; i -= 1) {
      const d = series[i]
      if (!d) continue
      const entry = entryByDate.get(d.date)
      if (!entry) break
      streakDays += 1
    }

    const understandingByDate = new Map<
      string,
      { sum: number; count: number }
    >()
    const masteryByCourse = new Map<
      string,
      { title: string; sum: number; count: number }
    >()

    const { data: notesForTrend } = await supabase
      .from("notes")
      .select("updated_at,course_id,understanding_level,courses(title)")
      .eq("user_id", user.id)
      .gte("updated_at", `${startDate}T00:00:00.000Z`)
      .order("updated_at", { ascending: true })

    for (const row of (notesForTrend ?? []) as Array<{
      updated_at: string
      course_id: string | null
      understanding_level: 1 | 2 | 3 | null
      courses: Array<{ title: string }> | { title: string } | null
    }>) {
      if (row.understanding_level != null) {
        const date = row.updated_at.slice(0, 10)
        const bucket = understandingByDate.get(date) ?? { sum: 0, count: 0 }
        bucket.sum += row.understanding_level
        bucket.count += 1
        understandingByDate.set(date, bucket)

        if (row.course_id) {
          const title = Array.isArray(row.courses)
            ? (row.courses[0]?.title ?? "")
            : (row.courses?.title ?? "")
          const courseBucket = masteryByCourse.get(row.course_id) ?? {
            title,
            sum: 0,
            count: 0,
          }
          courseBucket.sum += row.understanding_level
          courseBucket.count += 1
          courseBucket.title = courseBucket.title || title
          masteryByCourse.set(row.course_id, courseBucket)
        }
      }
    }

    for (const d of series) {
      const bucket = understandingByDate.get(d.date)
      const avg = bucket && bucket.count > 0 ? bucket.sum / bucket.count : null
      understandingProgress.push({
        date: d.date,
        label: d.label,
        avg: avg == null ? null : Number(avg.toFixed(2)),
      })
    }

    const allLevels = Array.from(understandingByDate.values())
    const totalLevelSum = allLevels.reduce((acc, b) => acc + b.sum, 0)
    const totalLevelCount = allLevels.reduce((acc, b) => acc + b.count, 0)
    avgUnderstanding = totalLevelCount > 0 ? totalLevelSum / totalLevelCount : 0

    for (const row of masteryByCourse.values()) {
      if (!row.title || row.count <= 0) continue
      courseMastery.push({
        title: row.title,
        avg: Number((row.sum / row.count).toFixed(2)),
      })
    }

    courseMastery.sort(
      (a, b) => a.avg - b.avg || a.title.localeCompare(b.title)
    )

    const reviewRows = (reviewRes.data ?? []) as Array<{
      created_at: string
      accuracy: number
    }>

    const reviewAsc = reviewRows.toReversed()
    for (const r of reviewAsc) {
      const d = new Date(r.created_at)
      reviewAccuracyTrend.push({
        date: r.created_at.slice(0, 10),
        label: formatShortDate(d),
        accuracy: r.accuracy,
      })
    }
  }

  return (
    <OverviewPageUI
      user={user}
      streakDays={streakDays}
      todayLabel={formatLongDate(now)}
      todayStudyMinutes={todayStudyMinutes}
      totalCourses={totalCourses}
      totalNotes={totalNotes}
      avgUnderstanding={avgUnderstanding}
      dailyStudyTime={dailyStudyTime}
      dailyMood={dailyMood}
      understandingProgress={understandingProgress}
      courseMastery={courseMastery}
      reviewAccuracyTrend={reviewAccuracyTrend}
    />
  )
}
