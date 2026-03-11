"use client"

import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageContainer } from "@/components/ui/page-container"

import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"

import {
  DateRangeFilterSheet,
  EmptyState,
  EntryCard,
  EntryEditorSheet,
  MoodFilterSheet,
} from "./daily-entries-components"
import { DailyEntriesHeader } from "./daily-entries-header"
import { DAILY_ENTRIES_MOCK } from "./daily-entries-mock-data"
import {
  isSameDay,
  toDateInputValue,
  type DailyEntry,
  type MoodFilter,
} from "./daily-entries-model"

export function DailyEntriesPage() {
  const isMobile = useIsMobile()

  const now = React.useMemo(() => new Date("2026-03-10T12:00:00Z"), [])
  const today = React.useMemo(() => toDateInputValue(now), [now])

  const [entries, setEntries] = React.useState<DailyEntry[]>(DAILY_ENTRIES_MOCK)

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

  function saveEntry(next: DailyEntry) {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === next.id)
      if (existingIndex >= 0) {
        return prev.map((e) => (e.id === next.id ? next : e))
      }

      if (prev.some((e) => e.date === next.date)) {
        return prev
      }

      return [next, ...prev]
    })

    setCreateOpen(false)
    setEditOpen(false)
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (activeEntryId === id) setActiveEntryId(null)
  }

  return (
    <DashboardShell
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
            <EmptyState
              hasAnyEntries={entries.length > 0}
              hasFilters={filtersActive}
              onLogToday={openPrimaryAction}
              onClearFilters={clearFilters}
            />
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
                  onDelete={() => deleteEntry(e.id)}
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
        onSave={saveEntry}
      />

      <EntryEditorSheet
        mode="edit"
        entry={activeEntry}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        lockDate={false}
        lockedDateValue={today}
        onSave={saveEntry}
      />
    </DashboardShell>
  )
}
