import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ViewTransition } from "react";

import DailyEntriesPageUI from "@/app/daily-entries/ui/daily-entries-page";
import type { DailyEntry } from "@/app/daily-entries/ui/daily-entries-model";
import { getDashboardUserId } from "@/lib/dashboard-session";
import { createDashboardRoutePerf } from "@/lib/dashboard-route-perf";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Daily Entries",
};

const DAILY_ENTRIES_PAGE_SIZE = 20;

async function getInitialDailyEntriesData(userId: string) {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`daily-entries:user:${userId}`);

  const supabase = await createClient();

  const { data, count } = await supabase
    .from("daily_entries")
    .select("id,date,study_time_minutes,mood,notes,created_at,updated_at", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .range(0, DAILY_ENTRIES_PAGE_SIZE - 1);

  const initialEntries: DailyEntry[] =
    (
      data as Array<{
        id: string;
        date: string;
        study_time_minutes: number;
        mood: 1 | 2 | 3;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }> | null
    )?.map((row) => ({
      id: row.id,
      date: row.date,
      studyTimeMinutes: row.study_time_minutes,
      mood: row.mood,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) ?? [];

  return {
    initialEntries,
    initialEntriesTotal: count ?? 0,
  };
}

export default async function DailyEntriesPage() {
  const perf = createDashboardRoutePerf("/daily-entries");
  const userId = await perf.measure(
    "session",
    () => getDashboardUserId(),
    (currentUserId) => ({
      authenticated: Boolean(currentUserId),
    }),
  );

  const { initialEntries, initialEntriesTotal } = userId
    ? await perf.measure(
        "entries-query",
        () => getInitialDailyEntriesData(userId),
        (result) => ({
          rows: result.initialEntries.length,
        }),
      )
    : { initialEntries: [] as DailyEntry[], initialEntriesTotal: 0 };

  perf.finish({
    entries: initialEntries.length,
  });

  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <DailyEntriesPageUI
        userId={userId}
        initialEntries={initialEntries}
        initialEntriesTotal={initialEntriesTotal}
        entriesPageSize={DAILY_ENTRIES_PAGE_SIZE}
      />
    </ViewTransition>
  );
}
