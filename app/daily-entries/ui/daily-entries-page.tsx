"use client";

import * as React from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  AddCircleIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageContainer } from "@/components/ui/page-container";

import { useDailyEntryLiveUpdates } from "@/hooks/use-daily-entry-live-updates";
import { useIsMobile } from "@/hooks/use-media-query";

import { useDashboardShellFab } from "@/app/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { upsertDailyEntry } from "@/lib/daily-entry-live";

import {
  DateRangeFilterSheet,
  EmptyState,
  EntryCard,
  EntryEditorSheet,
  MoodFilterSheet,
} from "./daily-entries-components";
import { DailyEntriesHeader } from "./daily-entries-header";
import {
  createEntry,
  deleteEntry,
  getDailyEntriesPage,
  updateEntry,
} from "./daily-entries-actions";
import {
  isSameDay,
  toDateInputValue,
  type DailyEntry,
  type MoodFilter,
} from "./daily-entries-model";

type DailyEntriesPageData = {
  success: true;
  data: DailyEntry[];
  totalCount: number;
};

const EMPTY_DAILY_ENTRIES_PAGE_DATA: DailyEntriesPageData = {
  success: true,
  data: [],
  totalCount: 0,
};

export default function DailyEntriesPage({
  userId,
  initialEntries,
  initialEntriesTotal,
  entriesPageSize,
}: {
  userId: string | null;
  initialEntries: DailyEntry[];
  initialEntriesTotal: number;
  entriesPageSize: number;
}) {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const now = React.useMemo(() => new Date(), []);
  const today = React.useMemo(() => toDateInputValue(now), [now]);

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [moodFilter, setMoodFilter] = React.useState<MoodFilter>("all");

  const [currentPage, setCurrentPage] = React.useState(1);

  const resolvedEntriesQueryKey = React.useMemo(
    () =>
      userId
        ? [
            "daily-entries-page",
            userId,
            currentPage,
            entriesPageSize,
            fromDate,
            toDate,
            moodFilter,
          ]
        : null,
    [currentPage, entriesPageSize, fromDate, moodFilter, toDate, userId],
  );

  const isInitialEntriesQuery =
    currentPage === 1 && !fromDate && !toDate && moodFilter === "all";

  const entriesQuery = useQuery({
    queryKey: resolvedEntriesQueryKey ?? ["daily-entries-page", "anonymous"],
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await getDailyEntriesPage({
        page: currentPage,
        pageSize: entriesPageSize,
        fromDate,
        toDate,
        moodFilter,
        userId: userId as string,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    initialData: isInitialEntriesQuery
      ? {
          success: true as const,
          data: initialEntries,
          totalCount: initialEntriesTotal,
        }
      : undefined,
    placeholderData: keepPreviousData,
  });

  React.useEffect(() => {
    if (!entriesQuery.error) return;

    toastManager.add({
      type: "error",
      title: "Could not load entries",
      description: entriesQuery.error.message,
    });
  }, [entriesQuery.error]);

  const entries = React.useMemo(
    () => entriesQuery.data?.data ?? [],
    [entriesQuery.data],
  );
  const entriesTotal = entriesQuery.data?.totalCount ?? 0;
  const pageLoading = entriesQuery.isFetching;

  const setEntriesCache = React.useCallback(
    (updater: (items: DailyEntry[]) => DailyEntry[]) => {
      if (!resolvedEntriesQueryKey) return;

      queryClient.setQueryData<DailyEntriesPageData>(
        resolvedEntriesQueryKey,
        (state) => {
          if (!state) {
            return {
              success: true,
              data: updater([]),
              totalCount: 0,
            };
          }

          return {
            ...state,
            data: updater(state.data),
          };
        },
      );
    },
    [queryClient, resolvedEntriesQueryKey],
  );

  const getEntriesCache = React.useCallback(
    (): DailyEntriesPageData =>
      resolvedEntriesQueryKey
        ? (queryClient.getQueryData<DailyEntriesPageData>(
            resolvedEntriesQueryKey,
          ) ?? EMPTY_DAILY_ENTRIES_PAGE_DATA)
        : EMPTY_DAILY_ENTRIES_PAGE_DATA,
    [queryClient, resolvedEntriesQueryKey],
  );

  const restoreEntriesCache = React.useCallback(
    (previous: DailyEntriesPageData) => {
      if (!resolvedEntriesQueryKey) return;
      queryClient.setQueryData(resolvedEntriesQueryKey, previous);
    },
    [queryClient, resolvedEntriesQueryKey],
  );

  useDailyEntryLiveUpdates({
    userId,
    onEntryUpsert: React.useCallback(
      (entry: DailyEntry) => {
        setEntriesCache((items) => upsertDailyEntry(items, entry));
      },
      [setEntriesCache],
    ),
  });

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [activeEntryId, setActiveEntryId] = React.useState<string | null>(null);

  const [mobileDatesOpen, setMobileDatesOpen] = React.useState(false);
  const [mobileMoodOpen, setMobileMoodOpen] = React.useState(false);

  const activeEntry = React.useMemo(
    () => entries.find((e) => e.id === activeEntryId) ?? null,
    [activeEntryId, entries],
  );

  const todayEntry = React.useMemo(
    () => entries.find((e) => isSameDay(e.date, today)) ?? null,
    [entries, today],
  );

  const todayHasEntry = Boolean(todayEntry);

  const totalPages = Math.max(1, Math.ceil(entriesTotal / entriesPageSize));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, moodFilter, toDate]);

  React.useEffect(() => {
    if (!userId) return;
    if (currentPage >= totalPages) return;

    void queryClient.prefetchQuery({
      queryKey: [
        "daily-entries-page",
        userId,
        currentPage + 1,
        entriesPageSize,
        fromDate,
        toDate,
        moodFilter,
      ],
      queryFn: async () => {
        const result = await getDailyEntriesPage({
          page: currentPage + 1,
          pageSize: entriesPageSize,
          fromDate,
          toDate,
          moodFilter,
          userId,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        return result;
      },
    });
  }, [
    currentPage,
    entriesPageSize,
    fromDate,
    moodFilter,
    queryClient,
    toDate,
    totalPages,
    userId,
  ]);

  const filtersActive = Boolean(fromDate || toDate || moodFilter !== "all");
  const openPrimaryAction = React.useCallback(() => {
    if (todayEntry) {
      setActiveEntryId(todayEntry.id);
      setEditOpen(true);
      return;
    }

    setActiveEntryId(null);
    setCreateOpen(true);
  }, [todayEntry]);

  const shellFab = React.useMemo(
    () => ({
      ariaLabel: todayHasEntry ? "Edit today's entry" : "Log today",
      icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
      onClick: openPrimaryAction,
    }),
    [openPrimaryAction, todayHasEntry],
  );
  useDashboardShellFab(shellFab);

  function clearFilters() {
    setFromDate("");
    setToDate("");
    setMoodFilter("all");
  }

  async function onCreateEntry(draft: DailyEntry) {
    if (!userId) return;

    if (entries.some((e) => e.date === draft.date)) {
      toastManager.add({
        type: "error",
        title: "Could not create entry",
        description: "An entry for this date already exists.",
      });
      return;
    }

    const optimistic: DailyEntry = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const prev = getEntriesCache();

    setEntriesCache((items) => [optimistic, ...items]);
    setCreateOpen(false);

    const res = await createEntry({ entry: optimistic, userId });
    if (!res.success) {
      restoreEntriesCache(prev);
      toastManager.add({
        type: "error",
        title: "Could not create entry",
        description: res.error,
      });
      return;
    }

    setEntriesCache((items) =>
      items.map((e) => (e.id === optimistic.id ? res.data : e)),
    );
    setCurrentPage(1);
    await queryClient.invalidateQueries({
      queryKey: ["daily-entries-page", userId],
    });
  }

  async function onUpdateEntry(next: DailyEntry) {
    if (!userId) return;

    const prev = getEntriesCache();

    setEntriesCache((items) => items.map((e) => (e.id === next.id ? next : e)));
    setEditOpen(false);

    const res = await updateEntry({
      entryId: next.id,
      patch: next,
      userId,
    });
    if (!res.success) {
      restoreEntriesCache(prev);
      toastManager.add({
        type: "error",
        title: "Could not update entry",
        description: res.error,
      });
      return;
    }

    setEntriesCache((items) =>
      items.map((e) => (e.id === next.id ? res.data : e)),
    );
    await queryClient.invalidateQueries({
      queryKey: ["daily-entries-page", userId],
    });
  }

  async function onDeleteEntry(id: string) {
    if (!userId) return;

    const prev = getEntriesCache();

    setEntriesCache((items) => items.filter((e) => e.id !== id));
    if (activeEntryId === id) setActiveEntryId(null);

    const res = await deleteEntry({ entryId: id, userId });
    if (!res.success) {
      restoreEntriesCache(prev);
      toastManager.add({
        type: "error",
        title: "Could not delete entry",
        description: res.error,
      });
      return;
    }

    const nextPage =
      entries.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    setCurrentPage(nextPage);
    await queryClient.invalidateQueries({
      queryKey: ["daily-entries-page", userId],
    });
  }

  return (
    <>
      <DailyEntriesHeader
        isMobile={isMobile}
        fromDate={fromDate}
        toDate={toDate}
        moodFilter={moodFilter}
        filtersActive={filtersActive}
        todayHasEntry={todayHasEntry}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onMoodChange={setMoodFilter}
        onClearFilters={clearFilters}
        onPrimaryAction={openPrimaryAction}
        onOpenMobileDates={() => setMobileDatesOpen(true)}
        onOpenMobileMood={() => setMobileMoodOpen(true)}
      />

      <PageContainer>
        <div className="flex min-h-[calc(100vh-14rem)] flex-col py-6 pb-8">
          {entriesTotal === 0 ? (
            <div className="flex justify-center">
              <EmptyState
                hasAnyEntries={entriesTotal > 0}
                hasFilters={filtersActive}
                onLogToday={openPrimaryAction}
                onClearFilters={clearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  now={now}
                  onEdit={() => {
                    setActiveEntryId(e.id);
                    setEditOpen(true);
                  }}
                  onDelete={() => void onDeleteEntry(e.id)}
                />
              ))}
            </div>
          )}

          {entriesTotal > 0 ? (
            <div className="mt-auto flex items-center justify-start gap-2 pt-6">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setCurrentPage((page) => Math.max(1, page - 1));
                }}
                disabled={currentPage <= 1 || pageLoading}
                aria-label="Previous page"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setCurrentPage((page) => Math.min(totalPages, page + 1));
                }}
                disabled={currentPage >= totalPages || pageLoading}
                aria-label="Next page"
              >
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
              </Button>
            </div>
          ) : null}
        </div>
      </PageContainer>

      <DateRangeFilterSheet
        open={mobileDatesOpen}
        onOpenChange={setMobileDatesOpen}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <MoodFilterSheet
        open={mobileMoodOpen}
        onOpenChange={setMobileMoodOpen}
        value={moodFilter}
        onValueChange={setMoodFilter}
      />

      <EntryEditorSheet
        mode="create"
        entry={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        isMobile={isMobile}
        lockDate
        lockedDateValue={today}
        onSave={(next) => {
          void onCreateEntry(next);
        }}
      />

      <EntryEditorSheet
        mode="edit"
        entry={activeEntry}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        lockDate={false}
        lockedDateValue={today}
        onSave={(next) => {
          void onUpdateEntry(next);
        }}
      />
    </>
  );
}
