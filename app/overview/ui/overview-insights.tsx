import OverviewInsightsClient from "@/app/overview/ui/overview-insights-client";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import {
  buildDaySeries,
  type CourseMasteryRow,
  type DailyMoodDatum,
  type DailyStudyDatum,
  getOverviewDateWindow,
  getOverviewEntryRows,
  getOverviewTrendRows,
  type UnderstandingDatum,
} from "@/app/overview/overview-data";
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf";

export default async function OverviewInsights({ nowIso }: { nowIso: string }) {
  const perf = createDashboardRoutePerf("/overview#insights");
  const insightsPerf = perf.createScope("insights");
  const { now, days } = getOverviewDateWindow(nowIso);

  const dailyStudyTime: DailyStudyDatum[] = [];
  const dailyMood: DailyMoodDatum[] = [];
  const understandingProgress: UnderstandingDatum[] = [];
  const courseMastery: CourseMasteryRow[] = [];

  const [entriesData, notesForTrend] = await Promise.all([
    insightsPerf.measure(
      "entry-rows",
      () => getOverviewEntryRows(nowIso),
      (result) => ({
        rows: result.length,
      }),
    ),
    insightsPerf.measure(
      "trend-rows",
      () => getOverviewTrendRows(nowIso),
      (result) => ({
        rows: result.length,
      }),
    ),
  ]);

  await insightsPerf.measure("derive-series", async () => {
    const series = buildDaySeries(now, days);
    const entryByDate = new Map<
      string,
      { minutes: number; mood: 1 | 2 | 3 | null }
    >();

    for (const row of entriesData) {
      entryByDate.set(row.date, {
        minutes: row.study_time_minutes,
        mood: row.mood,
      });
    }

    for (const d of series) {
      const entry = entryByDate.get(d.date);
      dailyStudyTime.push({
        date: d.date,
        label: d.label,
        minutes: entry?.minutes ?? 0,
      });
      dailyMood.push({
        date: d.date,
        label: d.label,
        mood: entry?.mood ?? null,
      });
    }

    const understandingByDate = new Map<
      string,
      { sum: number; count: number }
    >();
    const masteryByCourse = new Map<
      string,
      { title: string; sum: number; count: number }
    >();

    for (const row of notesForTrend) {
      if (row.understanding_level == null) continue;

      const date = row.updated_at.slice(0, 10);
      const bucket = understandingByDate.get(date) ?? { sum: 0, count: 0 };
      bucket.sum += row.understanding_level;
      bucket.count += 1;
      understandingByDate.set(date, bucket);

      if (row.course_id) {
        const title = Array.isArray(row.courses)
          ? (row.courses[0]?.title ?? "")
          : (row.courses?.title ?? "");
        const courseBucket = masteryByCourse.get(row.course_id) ?? {
          title,
          sum: 0,
          count: 0,
        };
        courseBucket.sum += row.understanding_level;
        courseBucket.count += 1;
        courseBucket.title = courseBucket.title || title;
        masteryByCourse.set(row.course_id, courseBucket);
      }
    }

    for (const d of series) {
      const bucket = understandingByDate.get(d.date);
      const avg = bucket && bucket.count > 0 ? bucket.sum / bucket.count : null;
      understandingProgress.push({
        date: d.date,
        label: d.label,
        avg: avg == null ? null : Number(avg.toFixed(2)),
      });
    }

    for (const row of masteryByCourse.values()) {
      if (!row.title || row.count <= 0) continue;
      courseMastery.push({
        title: row.title,
        avg: Number((row.sum / row.count).toFixed(2)),
      });
    }

    courseMastery.sort(
      (a, b) => a.avg - b.avg || a.title.localeCompare(b.title),
    );

    return {
      dailyStudyTime: dailyStudyTime.length,
      dailyMood: dailyMood.length,
      understandingProgress: understandingProgress.length,
      courseMastery: courseMastery.length,
    };
  });

  perf.finish({
    dailyStudyTime: dailyStudyTime.length,
    dailyMood: dailyMood.length,
    understandingProgress: understandingProgress.length,
    courseMastery: courseMastery.length,
  });

  return (
    <OverviewInsightsClient
      dailyStudyTime={dailyStudyTime}
      dailyMood={dailyMood}
      understandingProgress={understandingProgress}
      courseMastery={courseMastery}
    />
  );
}

export function OverviewInsightsSkeleton() {
  return (
    <PageContainer>
      <section className="pt-6">
        <LiteSkeleton className="h-10 w-full max-w-72" />
      </section>

      <section className="pt-6">
        <Card>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1">
              <LiteSkeleton className="h-5 w-40" />
              <LiteSkeleton className="h-4 w-64" />
            </div>
            <ChartLiteSkeleton className="h-56" />
          </div>
        </Card>
      </section>

      <section className="pt-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <LiteSkeleton className="h-5 w-32" />
                <LiteSkeleton className="h-4 w-60" />
              </div>
              <ChartLiteSkeleton className="h-56" />
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <LiteSkeleton className="h-5 w-44" />
                <LiteSkeleton className="h-4 w-64" />
              </div>
              <ChartLiteSkeleton className="h-48" />
            </div>
          </Card>
        </div>
      </section>

      <section className="pt-6 pb-6">
        <Card>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1">
              <LiteSkeleton className="h-5 w-36" />
              <LiteSkeleton className="h-4 w-72" />
            </div>
            <ChartLiteSkeleton className="h-64" />
          </div>
        </Card>
      </section>
    </PageContainer>
  );
}

function LiteSkeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted/70 ${className}`} />
  );
}

function ChartLiteSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`flex w-full items-end gap-2 rounded-md bg-muted/40 p-3 ${className}`}
    >
      <div className="h-7 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-11 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-9 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-14 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-12 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-16 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-10 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-6 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-13 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-8 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-5 w-4 animate-pulse rounded-sm bg-muted/70" />
      <div className="h-12 w-4 animate-pulse rounded-sm bg-muted/70" />
    </div>
  );
}
