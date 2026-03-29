import type { Metadata } from "next"
import { Suspense } from "react"

import {
  getOverviewDateWindow,
  getOverviewSummaryEntryRows,
  getOverviewUnderstandingLevels,
} from "@/app/overview/overview-data"
import OverviewInsights, {
  OverviewInsightsSkeleton,
} from "@/app/overview/ui/overview-insights"
import OverviewPageUI from "@/app/overview/ui/overview-page"
import {
  getDashboardSupabase,
  getDashboardUserId,
} from "@/lib/dashboard-session"
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf"

export const metadata: Metadata = {
  title: "Overview",
}

function toDateInputValue(d: Date): string {
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatLongDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d)
}

export default async function OverviewPage() {
  const perf = createDashboardRoutePerf("/overview")
  const summaryPerf = perf.createScope("summary")
  const [supabase, userId] = await perf.measure(
    "session",
    () => Promise.all([getDashboardSupabase(), getDashboardUserId()]),
    ([, currentUserId]) => ({
      authenticated: Boolean(currentUserId),
    })
  )

  const now = new Date()
  const nowIso = now.toISOString()
  const { days, today } = getOverviewDateWindow(nowIso)

  let totalCourses = 0
  let totalNotes = 0
  let todayStudyMinutes = 0
  let avgUnderstanding = 0
  let streakDays = 0

  if (userId) {
    const [coursesCountRes, notesCountRes, summaryEntryRows, understandingRows] =
      await Promise.all([
        summaryPerf.measure(
          "course-count",
          () =>
            supabase
              .from("courses")
              .select("id", { count: "exact", head: true })
              .eq("user_id", userId),
          (result) => ({
            totalCourses: result.count ?? 0,
          })
        ),
        summaryPerf.measure(
          "note-count",
          () =>
            supabase
              .from("notes")
              .select("id", { count: "exact", head: true })
              .eq("user_id", userId),
          (result) => ({
            totalNotes: result.count ?? 0,
          })
        ),
        summaryPerf.measure(
          "entry-rows",
          () => getOverviewSummaryEntryRows(nowIso),
          (result) => ({
            rows: result.length,
          })
        ),
        summaryPerf.measure(
          "understanding-levels",
          () => getOverviewUnderstandingLevels(nowIso),
          (result) => ({
            rows: result.length,
          })
        ),
      ])

    totalCourses = coursesCountRes.count ?? 0
    totalNotes = notesCountRes.count ?? 0

    const entryByDate = new Map<
      string,
      { minutes: number }
    >()

    for (const row of summaryEntryRows) {
      entryByDate.set(row.date, {
        minutes: row.study_time_minutes,
      })
      if (row.date === today) todayStudyMinutes += row.study_time_minutes
    }

    for (let i = 0; i < days; i += 1) {
      const d = new Date(now)
      d.setUTCDate(d.getUTCDate() - i)
      const entry = entryByDate.get(toDateInputValue(d))
      if (!entry) break
      streakDays += 1
    }

    avgUnderstanding = await summaryPerf.measure(
      "derive-understanding",
      async () => {
        const nonNullLevels = understandingRows
          .map((row) => row.understanding_level)
          .filter((level): level is 1 | 2 | 3 => level != null)
        const totalLevelSum = nonNullLevels.reduce((acc, level) => acc + level, 0)
        const totalLevelCount = nonNullLevels.length
        return totalLevelCount > 0 ? totalLevelSum / totalLevelCount : 0
      }
    )
  }

  perf.finish({
    totalCourses,
    totalNotes,
    streakDays,
    todayStudyMinutes,
  })

  return (
    <>
      <OverviewPageUI
        streakDays={streakDays}
        todayLabel={formatLongDate(now)}
        todayStudyMinutes={todayStudyMinutes}
        totalCourses={totalCourses}
        totalNotes={totalNotes}
        avgUnderstanding={avgUnderstanding}
      />
      <Suspense fallback={<OverviewInsightsSkeleton />}>
        <OverviewInsights nowIso={nowIso} />
      </Suspense>
    </>
  )
}
