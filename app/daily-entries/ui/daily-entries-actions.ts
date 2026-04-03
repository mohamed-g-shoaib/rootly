"use server"

import { cacheLife, cacheTag, updateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"

import type { DailyEntry, MoodFilter } from "./daily-entries-model"

type DbEntryRow = {
  id: string
  user_id: string
  date: string
  study_time_minutes: number
  mood: 1 | 2 | 3
  notes: string | null
  created_at: string
  updated_at: string
}

function fromDb(row: DbEntryRow): DailyEntry {
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

type DbInsertEntryRow = {
  id: string
  user_id: string
  date: string
  study_time_minutes: number
  mood: 1 | 2 | 3
  notes: string | null
  created_at: string
  updated_at: string
}

function toDbInsert(entry: DailyEntry, userId: string): DbInsertEntryRow {
  return {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    study_time_minutes: entry.studyTimeMinutes,
    mood: entry.mood,
    notes: entry.notes,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }
}

export async function getDailyEntriesPage({
  page,
  pageSize,
  fromDate,
  toDate,
  moodFilter,
  userId,
}: {
  page: number
  pageSize: number
  fromDate: string
  toDate: string
  moodFilter: MoodFilter
  userId: string
}): Promise<
  | { success: true; data: DailyEntry[]; totalCount: number }
  | { success: false; error: string }
> {
  "use cache: private"
  cacheLife("minutes")
  cacheTag(`daily-entries:user:${userId}`)

  const supabase = await createClient()
  const safePage = Math.max(1, Math.trunc(page))
  const safePageSize = Math.max(1, Math.min(100, Math.trunc(pageSize)))
  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  let query = supabase
    .from("daily_entries")
    .select(
      "id,user_id,date,study_time_minutes,mood,notes,created_at,updated_at",
      { count: "exact" }
    )
    .eq("user_id", userId)

  if (fromDate) {
    query = query.gte("date", fromDate)
  }
  if (toDate) {
    query = query.lte("date", toDate)
  }
  if (moodFilter !== "all") {
    query = query.eq("mood", moodFilter)
  }

  const { data, error, count } = await query
    .order("date", { ascending: false })
    .range(from, to)

  if (error) {
    return {
      success: false,
      error: error.message ?? "Failed to load daily entries",
    }
  }

  return {
    success: true,
    data: ((data ?? []) as DbEntryRow[]).map(fromDb),
    totalCount: count ?? 0,
  }
}

export async function createEntry({
  entry,
  userId,
}: {
  entry: DailyEntry
  userId: string
}): Promise<
  { success: true; data: DailyEntry } | { success: false; error: string }
> {
  const supabase = await createClient()

  const { data: existing, error: existingError } = await supabase
    .from("daily_entries")
    .select("id")
    .eq("user_id", userId)
    .eq("date", entry.date)
    .maybeSingle()

  if (existingError) {
    return {
      success: false,
      error: existingError.message ?? "Failed to check existing entry",
    }
  }

  if (existing) {
    return {
      success: false,
      error: "An entry for this date already exists.",
    }
  }

  const { data, error } = await supabase
    .from("daily_entries")
    .insert([toDbInsert(entry, userId)])
    .select(
      "id,user_id,date,study_time_minutes,mood,notes,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to create entry" }
  }

  updateTag(`daily-entries:user:${userId}`)
  updateTag(`overview-summary:user:${userId}`)
  updateTag(`overview-trend:user:${userId}`)

  return { success: true, data: fromDb(data as DbEntryRow) }
}

export async function updateEntry({
  entryId,
  patch,
  userId,
}: {
  entryId: string
  patch: Partial<DailyEntry>
  userId: string
}): Promise<
  { success: true; data: DailyEntry } | { success: false; error: string }
> {
  const supabase = await createClient()

  const updatedAt = new Date().toISOString()

  const updatePayload: Record<string, unknown> = { updated_at: updatedAt }

  if (patch.date !== undefined) updatePayload.date = patch.date
  if (patch.studyTimeMinutes !== undefined) {
    updatePayload.study_time_minutes = patch.studyTimeMinutes
  }
  if (patch.mood !== undefined) updatePayload.mood = patch.mood
  if (patch.notes !== undefined) updatePayload.notes = patch.notes

  const { data, error } = await supabase
    .from("daily_entries")
    .update(updatePayload)
    .eq("id", entryId)
    .eq("user_id", userId)
    .select(
      "id,user_id,date,study_time_minutes,mood,notes,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to update entry" }
  }

  updateTag(`daily-entries:user:${userId}`)
  updateTag(`overview-summary:user:${userId}`)
  updateTag(`overview-trend:user:${userId}`)

  return { success: true, data: fromDb(data as DbEntryRow) }
}

export async function deleteEntry({
  entryId,
  userId,
}: {
  entryId: string
  userId: string
}): Promise<
  { success: true; data: DailyEntry } | { success: false; error: string }
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("daily_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId)
    .select(
      "id,user_id,date,study_time_minutes,mood,notes,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to delete entry" }
  }

  updateTag(`daily-entries:user:${userId}`)
  updateTag(`overview-summary:user:${userId}`)
  updateTag(`overview-trend:user:${userId}`)

  return { success: true, data: fromDb(data as DbEntryRow) }
}
