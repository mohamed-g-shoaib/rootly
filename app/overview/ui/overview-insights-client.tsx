"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Suspense, useMemo, useState, useId } from "react"

import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { PageContainer } from "@/components/ui/page-container"
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header"

type RangeKey = "7" | "30" | "90"

type DailyStudyDatum = { date: string; label: string; minutes: number }
type DailyMoodDatum = { date: string; label: string; mood: 1 | 2 | 3 | null }
type UnderstandingDatum = { date: string; label: string; avg: number | null }
type CourseMasteryRow = { title: string; avg: number }

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

export default function OverviewInsightsClient({
  dailyStudyTime,
  dailyMood,
  understandingProgress,
  courseMastery,
}: {
  dailyStudyTime: DailyStudyDatum[]
  dailyMood: DailyMoodDatum[]
  understandingProgress: UnderstandingDatum[]
  courseMastery: CourseMasteryRow[]
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
          <div className="text-sm text-pretty text-muted-foreground">
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
