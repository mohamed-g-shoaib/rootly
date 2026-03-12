"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useState } from "react";

import { AddCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { PageContainer } from "@/components/ui/page-container";
import { DashboardShell } from "@/app/ui/dashboard-shell";

type RangeKey = "7" | "30" | "90";

const DailyStudyTimeChart = dynamic(
  () => import("../ui/charts/daily-study-time-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-56" /> },
);

const DailyMoodChart = dynamic(() => import("../ui/charts/daily-mood-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton heightClassName="h-56" />,
});

const UnderstandingProgressChart = dynamic(
  () => import("../ui/charts/understanding-progress-chart"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-48" /> },
);

const CourseMasteryList = dynamic(
  () => import("../ui/charts/course-mastery-list"),
  { ssr: false, loading: () => <ChartSkeleton heightClassName="h-64" /> },
);

export default function OverviewPage() {
  const isMobile = useIsMobile();
  const [range, setRange] = useState<RangeKey>("7");

  const mock = useMemo(() => buildMockOverview(range), [range]);

  return (
    <DashboardShell
      streakDays={mock.streakDays}
      fab={
        isMobile
          ? {
              ariaLabel: "Primary action",
              icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
              onClick: () => {},
            }
          : undefined
      }
    >
      <PageContainer>
        {isMobile ? (
          <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pt-3 pb-3 lg:hidden">
            <RangeToggle range={range} onRangeChange={setRange} fullWidth />
          </div>
        ) : null}

        <section className="pt-4 lg:pt-6">
          <HeroBlock
            isMobile={isMobile}
            streakDays={mock.streakDays}
            todayLabel={mock.todayLabel}
            todayStudyMinutes={mock.todayStudyMinutes}
            totalCourses={mock.totalCourses}
            totalNotes={mock.totalNotes}
            avgUnderstanding={mock.avgUnderstanding}
          />
        </section>

        {!isMobile ? (
          <section className="pt-6">
            <RangeToggle range={range} onRangeChange={setRange} />
          </section>
        ) : null}

        <section className="pt-6">
          <ChartFrame title="Daily Study Time">
            <Suspense fallback={<ChartSkeleton heightClassName="h-56" />}>
              <DailyStudyTimeChart data={mock.dailyStudyTime} />
            </Suspense>
            {mock.emptyStates.studyTime ? (
              <div className="pt-3 text-sm text-muted-foreground">
                No study sessions logged in this period.
              </div>
            ) : null}
          </ChartFrame>
        </section>

        <section className="pt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Daily Mood">
              <Suspense fallback={<ChartSkeleton heightClassName="h-56" />}>
                <DailyMoodChart data={mock.dailyMood} />
              </Suspense>
              {mock.emptyStates.mood ? (
                <div className="pt-3 text-sm text-muted-foreground">
                  No mood entries in this period.
                </div>
              ) : null}
            </ChartFrame>

            <ChartFrame title="Understanding Progress">
              <Suspense fallback={<ChartSkeleton heightClassName="h-48" />}>
                <UnderstandingProgressChart data={mock.understandingProgress} />
              </Suspense>
              {mock.emptyStates.understanding ? (
                <div className="pt-3 text-sm text-muted-foreground">
                  No understanding data in this period.
                </div>
              ) : null}
            </ChartFrame>
          </div>
        </section>

        <section className="pt-6 pb-6">
          <ChartFrame title="Course Mastery">
            <Suspense fallback={<ChartSkeleton heightClassName="h-64" />}>
              <CourseMasteryList
                rows={mock.courseMastery}
                emptyLabel="No course data for this period."
              />
            </Suspense>
          </ChartFrame>
        </section>
      </PageContainer>
    </DashboardShell>
  );
}

function HeroBlock({
  isMobile,
  streakDays,
  todayLabel,
  todayStudyMinutes,
  totalCourses,
  totalNotes,
  avgUnderstanding,
}: {
  isMobile: boolean;
  streakDays: number;
  todayLabel: string;
  todayStudyMinutes: number;
  totalCourses: number;
  totalNotes: number;
  avgUnderstanding: number;
}) {
  return (
    <div className={cn("grid gap-6", !isMobile && "lg:grid-cols-3")}>
      <div className={cn("lg:col-span-2", "flex flex-col gap-2")}>
        {isMobile ? (
          <div className="text-sm text-muted-foreground">
            <span aria-hidden="true">🔥</span> {streakDays} day streak
          </div>
        ) : null}

        <div className="text-sm text-muted-foreground">
          Today&apos;s Study Time
        </div>
        <div className="text-4xl leading-none font-semibold">
          {todayStudyMinutes} min
        </div>
        <div className="text-sm text-muted-foreground">{todayLabel}</div>
      </div>

      <div className={cn("flex flex-col gap-3", isMobile && "lg:hidden")}>
        {isMobile ? (
          <div className="grid grid-cols-3 gap-3">
            <SummaryCell label="Total Courses" value={String(totalCourses)} />
            <SummaryCell label="Total Notes" value={String(totalNotes)} />
            <SummaryCell
              label="Avg. Understanding"
              value={`${avgUnderstanding.toFixed(1)} / 3`}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SummaryRow label="Total Courses" value={String(totalCourses)} />
            <SummaryRow label="Total Notes" value={String(totalNotes)} />
            <SummaryRow
              label="Avg. Understanding"
              value={`${avgUnderstanding.toFixed(1)} / 3`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function RangeToggle({
  range,
  onRangeChange,
  fullWidth = false,
}: {
  range: RangeKey;
  onRangeChange: (value: RangeKey) => void;
  fullWidth?: boolean;
}) {
  return (
    <Tabs
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
  );
}

function ChartFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-medium">{title}</div>
      <div className="pt-3">{children}</div>
    </div>
  );
}

function ChartSkeleton({ heightClassName }: { heightClassName: string }) {
  return <Skeleton className={cn("w-full", heightClassName)} />;
}

type MockPoint = {
  date: string;
  label: string;
};

type MockStudy = MockPoint & { minutes: number };

type MockMood = MockPoint & { mood: 1 | 2 | 3 | null };

type MockUnderstanding = MockPoint & { avg: number | null };

type MockCourseMasteryRow = {
  title: string;
  avg: number;
};

function buildMockOverview(range: RangeKey) {
  const now = new Date("2026-03-10T12:00:00Z");

  const days = range === "7" ? 7 : range === "30" ? 30 : 90;

  const series = buildDaySeries(now, days);

  const dailyStudyTime: MockStudy[] = series.map((d, idx) => {
    const minutes = idx % 6 === 0 ? 0 : 35 + (idx % 5) * 18;
    return { ...d, minutes };
  });

  const dailyMood: MockMood[] = series.map((d, idx) => {
    const hasEntry = idx % 8 !== 0;
    if (!hasEntry) return { ...d, mood: null };
    const mood: 1 | 2 | 3 = ((idx % 3) + 1) as 1 | 2 | 3;
    return { ...d, mood };
  });

  const understandingProgress: MockUnderstanding[] = series.map((d, idx) => {
    const hasData = idx % 7 !== 0;
    if (!hasData) return { ...d, avg: null };
    const avg = Math.min(3, 1.4 + idx * 0.03);
    return { ...d, avg: Number(avg.toFixed(2)) };
  });

  const courseMastery: MockCourseMasteryRow[] = [
    { title: "Advanced React Patterns", avg: 1.6 },
    { title: "Postgres Performance", avg: 1.9 },
    { title: "TypeScript Deep Dive", avg: 2.2 },
    { title: "Next.js App Router", avg: 2.5 },
  ];

  const emptyStates = {
    studyTime: dailyStudyTime.every((d) => d.minutes === 0),
    mood: dailyMood.every((d) => d.mood == null),
    understanding: understandingProgress.every((d) => d.avg == null),
  };

  return {
    streakDays: 12,
    todayLabel: formatLongDate(now),
    todayStudyMinutes: 0,
    totalCourses: 4,
    totalNotes: 86,
    avgUnderstanding: 2.1,
    dailyStudyTime,
    dailyMood,
    understandingProgress,
    courseMastery,
    emptyStates,
  };
}

function buildDaySeries(now: Date, days: number): MockPoint[] {
  const items: MockPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    items.push({
      date: d.toISOString().slice(0, 10),
      label: formatShortDate(d),
    });
  }
  return items;
}

function formatLongDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
}

function formatShortDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}
