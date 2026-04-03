import type { Metadata } from "next"
import { Suspense } from "react"

import {
  getOverviewDateWindow,
  getOverviewContext,
  getOverviewEntryRows,
  getOverviewSummaryStats,
  getOverviewTrendRows,
  getOverviewSummaryEntryRows,
} from "@/app/overview/overview-data"
import OverviewInsights, {
  OverviewInsightsSkeleton,
} from "@/app/overview/ui/overview-insights"
import OverviewPageUI from "@/app/overview/ui/overview-page"
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

function computeTodayAndStreakFromEntries({
  days,
  now,
  today,
  rows,
}: {
  days: number
  now: Date
  today: string
  rows: Array<{ date: string; study_time_minutes: number }>
}) {
  let todayStudyMinutes = 0
  let streakDays = 0

  const entryByDate = new Map<string, { minutes: number }>()

  for (const row of rows) {
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

  return { streakDays, todayStudyMinutes }
}

export default async function OverviewPage() {
  const perf = createDashboardRoutePerf("/overview")
  const summaryPerf = perf.createScope("summary")
  const useSummaryRpc = process.env.ROOTLY_OVERVIEW_USE_SUMMARY_RPC === "1"

  const now = new Date()
  const nowIso = now.toISOString()
  const { days, today } = getOverviewDateWindow(nowIso)

  // Start insights data early so it can overlap with summary work.
  // Do not await here; streamed insights will consume these cached promises.
  void getOverviewEntryRows(nowIso)
  void getOverviewTrendRows(nowIso)

  // Start async work early so session/context and data queries overlap.
  const sessionPromise = perf.measure(
    "session",
    () => getOverviewContext(),
    (ctx) => ({
      authenticated: Boolean(ctx.userId),
    })
  )
  let summaryEntryRowsPromise: Promise<
    Array<{ date: string; study_time_minutes: number }>
  > | null = null

  const loadSummaryEntryRows = () => {
    if (!summaryEntryRowsPromise) {
      summaryEntryRowsPromise = summaryPerf.measure(
        "entry-rows",
        () => getOverviewSummaryEntryRows(nowIso),
        (result) => ({
          rows: result.length,
        })
      )
    }

    return summaryEntryRowsPromise
  }
  const summaryStatsPromise = useSummaryRpc
    ? summaryPerf.measure(
        "summary-rpc",
        () => getOverviewSummaryStats(),
        (result) => ({
          hasData: Boolean(result),
        })
      )
    : null
  const { supabase, userId } = await sessionPromise

  let totalCourses = 0
  let totalNotes = 0
  let todayStudyMinutes = 0
  let avgUnderstanding = 0
  let streakDays = 0

  if (userId) {
    const summaryStats = summaryStatsPromise ? await summaryStatsPromise : null

    if (summaryStats) {
      totalCourses = summaryStats.totalCourses
      totalNotes = summaryStats.totalNotes
      avgUnderstanding = summaryStats.avgUnderstanding
      todayStudyMinutes = summaryStats.todayStudyMinutes
      streakDays = summaryStats.streakDays

      // Older RPC versions may not return today/streak fields yet.
      if (!summaryStats.hasTodayAndStreakFields) {
        const summaryEntryRows = await loadSummaryEntryRows()
        const fallback = computeTodayAndStreakFromEntries({
          days,
          now,
          today,
          rows: summaryEntryRows,
        })
        todayStudyMinutes = fallback.todayStudyMinutes
        streakDays = fallback.streakDays
      }
    } else {
      const [coursesCountRes, notesCountRes, trendRows] = await Promise.all([
        summaryPerf.measure(
          "fallback-course-count",
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
          "fallback-note-count",
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
          "fallback-trend-rows",
          () => getOverviewTrendRows(nowIso),
          (result) => ({
            rows: result.length,
          })
        ),
      ])

      totalCourses = coursesCountRes.count ?? 0
      totalNotes = notesCountRes.count ?? 0
      const nonNullLevels = trendRows
        .map((row) => row.understanding_level)
        .filter((level): level is 1 | 2 | 3 => level != null)
      const totalLevelSum = nonNullLevels.reduce((acc, level) => acc + level, 0)
      avgUnderstanding =
        nonNullLevels.length > 0 ? totalLevelSum / nonNullLevels.length : 0

      const summaryEntryRows = await loadSummaryEntryRows()
      const fallback = computeTodayAndStreakFromEntries({
        days,
        now,
        today,
        rows: summaryEntryRows,
      })
      todayStudyMinutes = fallback.todayStudyMinutes
      streakDays = fallback.streakDays
    }

    await summaryPerf.measure(
      "derive-understanding",
      async () => avgUnderstanding
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
        userId={userId}
        todayDate={today}
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
