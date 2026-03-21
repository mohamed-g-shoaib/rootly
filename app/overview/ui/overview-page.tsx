"use client"

import type { User } from "@supabase/supabase-js"
import * as React from "react"
import dynamic from "next/dynamic"
import { Suspense, useMemo, useState, useId } from "react"

import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { PageContainer } from "@/components/ui/page-container"
import { DashboardShell } from "@/app/ui/dashboard-shell"
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header"

type RangeKey = "7" | "30" | "90"

const DailyStudyTimeChart = dynamic(
  () => import("../ui/charts/daily-study-time-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-56" /> }
)

const DailyMoodChart = dynamic(() => import("../ui/charts/daily-mood-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton heightClassName="h-56" />,
})

const UnderstandingProgressChart = dynamic(
  () => import("../ui/charts/understanding-progress-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-56" /> }
)

const CourseMasteryList = dynamic(
  () => import("../ui/charts/course-mastery-list"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-64" /> }
)

type DailyStudyDatum = { date: string; label: string; minutes: number }
type DailyMoodDatum = { date: string; label: string; mood: 1 | 2 | 3 | null }
type UnderstandingDatum = { date: string; label: string; avg: number | null }
type CourseMasteryRow = { title: string; avg: number }
type ReviewAccuracyDatum = { date: string; label: string; accuracy: number }

export default function OverviewPage({
  user,
  streakDays,
  todayLabel,
  todayStudyMinutes,
  totalCourses,
  totalNotes,
  avgUnderstanding,
  dailyStudyTime,
  dailyMood,
  understandingProgress,
  courseMastery,
  reviewAccuracyTrend: _reviewAccuracyTrend,
}: {
  user: User | null
  streakDays: number
  todayLabel: string
  todayStudyMinutes: number
  totalCourses: number
  totalNotes: number
  avgUnderstanding: number
  dailyStudyTime: DailyStudyDatum[]
  dailyMood: DailyMoodDatum[]
  understandingProgress: UnderstandingDatum[]
  courseMastery: CourseMasteryRow[]
  reviewAccuracyTrend: ReviewAccuracyDatum[]
}) {
  const isMobile = useIsMobile()
  const id = useId()
  const [range, setRange] = useState<RangeKey>("7")

  const days = range === "7" ? 7 : range === "30" ? 30 : 90

  const slicedStudy = useMemo(
    () => dailyStudyTime.slice(-days),
    [dailyStudyTime, days]
  )
  const slicedMood = useMemo(() => dailyMood.slice(-days), [dailyMood, days])
  const slicedUnderstanding = useMemo(
    () => understandingProgress.slice(-days),
    [understandingProgress, days]
  )

  const emptyStates = useMemo(
    () => ({
      studyTime: slicedStudy.every((d) => d.minutes === 0),
      mood: slicedMood.every((d) => d.mood == null),
      understanding: slicedUnderstanding.every((d) => d.avg == null),
    }),
    [slicedMood, slicedStudy, slicedUnderstanding]
  )

  return (
    <DashboardShell user={user}>
      <PageContainer>
        {isMobile ? (
          <DashboardStickyHeader className="lg:hidden">
            <div className="-mx-4 px-4 pt-3 pb-3">
              <RangeToggle
                id={`${id}-mobile`}
                range={range}
                onRangeChange={setRange}
                fullWidth
              />
            </div>
          </DashboardStickyHeader>
        ) : null}

        <section className="pt-4 lg:pt-6">
          <HeroBlock
            streakDays={streakDays}
            todayLabel={todayLabel}
            todayStudyMinutes={todayStudyMinutes}
            totalCourses={totalCourses}
            totalNotes={totalNotes}
            avgUnderstanding={avgUnderstanding}
          />
        </section>

        {!isMobile ? (
          <section className="pt-6">
            <RangeToggle
              id={`${id}-desktop`}
              range={range}
              onRangeChange={setRange}
            />
          </section>
        ) : null}

        <section className="pt-6">
          <ChartFrame
            title="Daily Study Time"
            description="Minutes logged across your selected range."
          >
            <Suspense fallback={<ChartSkeleton heightClassName="h-56" />}>
              <DailyStudyTimeChart data={slicedStudy} />
            </Suspense>
            {emptyStates.studyTime ? (
              <div className="pt-3 text-sm text-muted-foreground">
                No study sessions logged in this period.
              </div>
            ) : null}
          </ChartFrame>
        </section>

        <section className="pt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Daily Mood"
              description="A quick read on how your study sessions have felt."
            >
              <Suspense fallback={<ChartSkeleton heightClassName="h-56" />}>
                <DailyMoodChart data={slicedMood} />
              </Suspense>
              {emptyStates.mood ? (
                <div className="pt-3 text-sm text-muted-foreground">
                  No mood entries in this period.
                </div>
              ) : null}
            </ChartFrame>

            <ChartFrame
              title="Understanding Progress"
              description="Average understanding level across your Q&A notes."
            >
              <Suspense fallback={<ChartSkeleton heightClassName="h-48" />}>
                <UnderstandingProgressChart data={slicedUnderstanding} />
              </Suspense>
              {emptyStates.understanding ? (
                <div className="pt-3 text-sm text-muted-foreground">
                  No understanding data in this period.
                </div>
              ) : null}
            </ChartFrame>
          </div>
        </section>

        <section className="pt-6 pb-6">
          <ChartFrame
            title="Course Mastery"
            description="Which courses need more review, and which ones feel settled."
          >
            <Suspense fallback={<ChartSkeleton heightClassName="h-64" />}>
              <CourseMasteryList
                rows={courseMastery}
                emptyLabel="No course data for this period."
              />
            </Suspense>
          </ChartFrame>
        </section>
      </PageContainer>
    </DashboardShell>
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
            <div className="max-w-xl text-sm text-muted-foreground text-pretty">
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

function RangeToggle({
  range,
  onRangeChange,
  fullWidth = false,
  id,
}: {
  range: RangeKey
  onRangeChange: (value: RangeKey) => void
  fullWidth?: boolean
  id?: string
}) {
  return (
    <Tabs
      id={id}
      value={range}
      onValueChange={(v) => onRangeChange(v as RangeKey)}
      orientation="horizontal"
    >
      <TabsList className={cn(fullWidth && "w-full")}>
        <TabsTab value="7" className={cn(fullWidth && "flex-1")}>
          7 Days
        </TabsTab>
        <TabsTab value="30" className={cn(fullWidth && "flex-1")}>
          30 Days
        </TabsTab>
        <TabsTab value="90" className={cn(fullWidth && "flex-1")}>
          90 Days
        </TabsTab>
      </TabsList>
    </Tabs>
  )
}

function ChartFrame({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground text-pretty">
            {description}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </Card>
  )
}

function ChartSkeleton({ heightClassName }: { heightClassName: string }) {
  return <Skeleton className={cn("w-full", heightClassName)} />
}

function formatMinutesLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
