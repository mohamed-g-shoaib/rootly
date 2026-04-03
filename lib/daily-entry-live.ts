import type { DailyEntry } from "@/app/daily-entries/ui/daily-entries-model"

export const DAILY_ENTRY_BROADCAST_EVENT = "daily-entry-upsert"
export const DAILY_ENTRY_WINDOW_EVENT = "rootly:daily-entry-upsert"
export const DAILY_ENTRY_WINDOW_SOURCE = "rootly-extension"

type DailyEntryRow = {
  id: string
  date: string
  study_time_minutes: number
  mood: 1 | 2 | 3
  notes: string | null
  created_at: string
  updated_at: string
}

export function getDailyEntryChannelName(userId: string) {
  return `daily-entries:${userId}`
}

export function isDailyEntry(value: unknown): value is DailyEntry {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.studyTimeMinutes === "number" &&
    (candidate.mood === 1 || candidate.mood === 2 || candidate.mood === 3) &&
    (candidate.notes == null || typeof candidate.notes === "string") &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  )
}

export function isDailyEntryRow(value: unknown): value is DailyEntryRow {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.study_time_minutes === "number" &&
    (candidate.mood === 1 || candidate.mood === 2 || candidate.mood === 3) &&
    (candidate.notes == null || typeof candidate.notes === "string") &&
    typeof candidate.created_at === "string" &&
    typeof candidate.updated_at === "string"
  )
}

export function toDailyEntry(row: DailyEntryRow): DailyEntry {
  return {
    id: row.id,
    date: row.date,
    studyTimeMinutes: row.study_time_minutes,
    mood: row.mood,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function upsertDailyEntry(
  entries: DailyEntry[],
  nextEntry: DailyEntry
): DailyEntry[] {
  const filteredEntries = entries.filter((entry) => entry.id !== nextEntry.id)

  return [nextEntry, ...filteredEntries].toSorted((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1
    }

    return a.updatedAt < b.updatedAt ? 1 : -1
  })
}
