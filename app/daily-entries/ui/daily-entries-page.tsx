"use client"

import type { User } from "@supabase/supabase-js"
import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageContainer } from "@/components/ui/page-container"

import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { toastManager } from "@/components/ui/toast"

import {
  DateRangeFilterSheet,
  EmptyState,
  EntryCard,
  EntryEditorSheet,
  MoodFilterSheet,
} from "./daily-entries-components"
import { DailyEntriesHeader } from "./daily-entries-header"
import { createEntry, deleteEntry, updateEntry } from "./daily-entries-actions"
import {
  isSameDay,
  toDateInputValue,
  type DailyEntry,
  type MoodFilter,
} from "./daily-entries-model"

export default function DailyEntriesPage({
  user,
  initialEntries,
}: {
  user: User | null
  initialEntries: DailyEntry[]
}) {
  const isMobile = useIsMobile()

  const now = React.useMemo(() => new Date(), [])
  const today = React.useMemo(() => toDateInputValue(now), [now])

  const [entries, setEntries] = React.useState<DailyEntry[]>(
    () => initialEntries
  )

  const entriesRef = React.useRef(entries)

  React.useEffect(() => {
    entriesRef.current = entries
  }, [entries])

  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  const [moodFilter, setMoodFilter] = React.useState<MoodFilter>("all")

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [activeEntryId, setActiveEntryId] = React.useState<string | null>(null)

  const [mobileDatesOpen, setMobileDatesOpen] = React.useState(false)
  const [mobileMoodOpen, setMobileMoodOpen] = React.useState(false)

  const activeEntry = React.useMemo(
    () => entries.find((e) => e.id === activeEntryId) ?? null,
    [activeEntryId, entries]
  )

  const todayEntry = React.useMemo(
    () => entries.find((e) => isSameDay(e.date, today)) ?? null,
    [entries, today]
  )

  const todayHasEntry = Boolean(todayEntry)

  const filteredEntries = React.useMemo(() => {
    return entries
      .filter((e) => {
        if (fromDate && e.date < fromDate) return false
        if (toDate && e.date > toDate) return false
        if (moodFilter !== "all" && e.mood !== moodFilter) return false
        return true
      })
      .toSorted((a, b) => (a.date < b.date ? 1 : -1))
  }, [entries, fromDate, moodFilter, toDate])

  const filtersActive = Boolean(fromDate || toDate || moodFilter !== "all")

  function clearFilters() {
    setFromDate("")
    setToDate("")
    setMoodFilter("all")
  }

  function openPrimaryAction() {
    if (todayEntry) {
      setActiveEntryId(todayEntry.id)
      setEditOpen(true)
      return
    }

    setActiveEntryId(null)
    setCreateOpen(true)
  }

  async function onCreateEntry(draft: DailyEntry) {
    if (!user) return

    if (entriesRef.current.some((e) => e.date === draft.date)) {
      toastManager.add({
        type: "error",
        title: "Could not create entry",
        description: "An entry for this date already exists.",
      })
      return
    }

    const optimistic: DailyEntry = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const prev = entriesRef.current

    setEntries((items) => [optimistic, ...items])
    setCreateOpen(false)

    const res = await createEntry({ entry: optimistic, userId: user.id })
    if (!res.success) {
      setEntries(prev)
      toastManager.add({
        type: "error",
        title: "Could not create entry",
        description: res.error,
      })
      return
    }

    setEntries((items) =>
      items.map((e) => (e.id === optimistic.id ? res.data : e))
    )
  }

  async function onUpdateEntry(next: DailyEntry) {
    if (!user) return

    const prev = entriesRef.current

    setEntries((items) => items.map((e) => (e.id === next.id ? next : e)))
    setEditOpen(false)

    const res = await updateEntry({
      entryId: next.id,
      patch: next,
      userId: user.id,
    })
    if (!res.success) {
      setEntries(prev)
      toastManager.add({
        type: "error",
        title: "Could not update entry",
        description: res.error,
      })
      return
    }

    setEntries((items) => items.map((e) => (e.id === next.id ? res.data : e)))
  }

  async function onDeleteEntry(id: string) {
    if (!user) return

    const prev = entriesRef.current

    setEntries((items) => items.filter((e) => e.id !== id))
    if (activeEntryId === id) setActiveEntryId(null)

    const res = await deleteEntry({ entryId: id, userId: user.id })
    if (!res.success) {
      setEntries(prev)
      toastManager.add({
        type: "error",
        title: "Could not delete entry",
        description: res.error,
      })
    }
  }

  return (
    <DashboardShell
      user={user}
      fab={{
        ariaLabel: todayHasEntry ? "Edit today's entry" : "Log today",
        icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
        onClick: openPrimaryAction,
      }}
    >
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
        <div className="py-6">
          {filteredEntries.length === 0 ? (
            <div className="flex justify-center">
              <EmptyState
                hasAnyEntries={entries.length > 0}
                hasFilters={filtersActive}
                onLogToday={openPrimaryAction}
                onClearFilters={clearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredEntries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  now={now}
                  onEdit={() => {
                    setActiveEntryId(e.id)
                    setEditOpen(true)
                  }}
                  onDelete={() => void onDeleteEntry(e.id)}
                />
              ))}
            </div>
          )}
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
          void onCreateEntry(next)
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
          void onUpdateEntry(next)
        }}
      />
    </DashboardShell>
  )
}
