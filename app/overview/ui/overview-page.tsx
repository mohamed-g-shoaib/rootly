"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { useDailyEntryLiveUpdates } from "@/hooks/use-daily-entry-live-updates"

export default function OverviewPage({
  userId,
  todayDate,
  streakDays,
  todayLabel,
  todayStudyMinutes,
  totalCourses,
  totalNotes,
  avgUnderstanding,
}: {
  userId: string | null
  todayDate: string
  streakDays: number
  todayLabel: string
  todayStudyMinutes: number
  totalCourses: number
  totalNotes: number
  avgUnderstanding: number
}) {
  const [liveStreakDays, setLiveStreakDays] = React.useState(streakDays)
  const [liveTodayStudyMinutes, setLiveTodayStudyMinutes] =
    React.useState(todayStudyMinutes)

  useDailyEntryLiveUpdates({
    userId,
    onEntryUpsert: React.useCallback(
      (entry) => {
        if (entry.date !== todayDate) {
          return
        }

        setLiveTodayStudyMinutes(entry.studyTimeMinutes)
        setLiveStreakDays((currentStreakDays) =>
          currentStreakDays > 0 ? currentStreakDays : 1
        )
      },
      [todayDate]
    ),
  })

  return (
    <PageContainer>
      <section className="pt-4 lg:pt-6">
        <HeroBlock
          streakDays={liveStreakDays}
          todayLabel={todayLabel}
          todayStudyMinutes={liveTodayStudyMinutes}
          totalCourses={totalCourses}
          totalNotes={totalNotes}
          avgUnderstanding={avgUnderstanding}
        />
      </section>
    </PageContainer>
  )
}

function HeroBlock({
  streakDays,
  todayLabel,
  todayStudyMinutes,
  totalCourses,
  totalNotes,
  avgUnderstanding,
}: {
  streakDays: number
  todayLabel: string
  todayStudyMinutes: number
  totalCourses: number
  totalNotes: number
  avgUnderstanding: number
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <div className="flex h-full flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Overview</Badge>
            <Badge variant="secondary">{streakDays} day streak</Badge>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{todayLabel}</div>
            <div className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
              {formatMinutesLabel(todayStudyMinutes)}
            </div>
            <div className="max-w-xl text-sm text-pretty text-muted-foreground">
              A steady snapshot of your current learning rhythm, so you can see
              momentum instead of guessing at it.
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <SummaryStatCard label="Total Courses" value={String(totalCourses)} />
        <SummaryStatCard label="Total Notes" value={String(totalNotes)} />
        <SummaryStatCard
          label="Avg. Understanding"
          value={`${avgUnderstanding.toFixed(1)} / 3`}
        />
      </div>
    </div>
  )
}

function SummaryStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="flex flex-col gap-2 p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold tabular-nums">{value}</div>
      </div>
    </Card>
  )
}

function formatMinutesLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
