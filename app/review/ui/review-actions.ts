"use server"

import { createClient } from "@/lib/supabase/server"

import type { ReviewNote, ReviewSession } from "./review-model"

type DbReviewSessionRow = {
  id: string
  user_id: string
  name: string
  accuracy: number
  time_spent_minutes: number
  question_count: number
  shuffled: boolean
  flagged_only: boolean
  course_scores: Record<string, number>
  created_at: string
}

function buildWeakStrong(courseScores: Record<string, number>): {
  weakestCourseId: string | null
  strongestCourseId: string | null
} {
  const entries = Object.entries(courseScores)
  if (entries.length === 0) {
    return { weakestCourseId: null, strongestCourseId: null }
  }

  let weakestCourseId: string | null = null
  let strongestCourseId: string | null = null
  let weakest = Infinity
  let strongest = -Infinity

  for (const [courseId, score] of entries) {
    if (score < weakest) {
      weakest = score
      weakestCourseId = courseId
    }
    if (score > strongest) {
      strongest = score
      strongestCourseId = courseId
    }
  }

  return { weakestCourseId, strongestCourseId }
}

function fromDb(row: DbReviewSessionRow): ReviewSession {
  const derived = buildWeakStrong(row.course_scores ?? {})

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    date: row.created_at.slice(0, 10),
    questionCount: row.question_count,
    shuffled: row.shuffled,
    flaggedOnly: row.flagged_only,
    accuracy: row.accuracy,
    timeSpentMinutes: row.time_spent_minutes,
    notesLeveledUp: [],
    notesLeveledDown: [],
    weakestCourseId: derived.weakestCourseId,
    strongestCourseId: derived.strongestCourseId,
    createdAt: row.created_at,
  }
}

export async function saveReviewSession({
  session,
  userId,
  courseScores,
}: {
  session: ReviewSession
  userId: string
  courseScores: Record<string, number>
}): Promise<
  { success: true; data: ReviewSession } | { success: false; error: string }
> {
  const supabase = await createClient()

  const date = session.date?.trim()
    ? session.date
    : session.createdAt
      ? session.createdAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10)

  const insertPayload = {
    id: session.id,
    user_id: userId,
    name: session.name,
    date,
    accuracy: session.accuracy,
    time_spent_minutes: session.timeSpentMinutes,
    question_count: session.questionCount,
    shuffled: session.shuffled,
    flagged_only: session.flaggedOnly,
    course_scores: courseScores,
    created_at: session.createdAt,
  }

  const { data, error } = await supabase
    .from("review_sessions")
    .insert([insertPayload])
    .select(
      "id,user_id,name,accuracy,time_spent_minutes,question_count,shuffled,flagged_only,course_scores,created_at"
    )
    .single()

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Failed to save review session",
    }
  }

  return { success: true, data: fromDb(data as DbReviewSessionRow) }
}

export async function deleteReviewSession({
  sessionId,
  userId,
}: {
  sessionId: string
  userId: string
}): Promise<
  { success: true; data: ReviewSession } | { success: false; error: string }
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("review_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select(
      "id,user_id,name,accuracy,time_spent_minutes,question_count,shuffled,flagged_only,course_scores,created_at"
    )
    .single()

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Failed to delete review session",
    }
  }

  return { success: true, data: fromDb(data as DbReviewSessionRow) }
}

type DbReviewNoteRow = {
  id: string
  type: "qa"
  course_id: string | null
  question: string | null
  answer: string | null
  understanding_level: 1 | 2 | 3 | null
  flag: boolean
  courses: Array<{ title: string }> | { title: string } | null
}

function reviewNoteFromDb(row: DbReviewNoteRow): ReviewNote | null {
  if (!row.question || !row.answer || row.understanding_level == null) {
    return null
  }

  const courseTitle = Array.isArray(row.courses)
    ? (row.courses[0]?.title ?? null)
    : (row.courses?.title ?? null)

  return {
    id: row.id,
    type: "qa",
    courseId: row.course_id,
    courseTitle,
    question: row.question,
    answer: row.answer,
    understandingLevel: row.understanding_level,
    flag: row.flag,
    detailsLoaded: true,
  }
}

export async function getReviewNotes({
  noteIds,
  userId,
}: {
  noteIds: string[]
  userId: string
}): Promise<
  { success: true; data: ReviewNote[] } | { success: false; error: string }
> {
  if (noteIds.length === 0) {
    return { success: true, data: [] }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notes")
    .select(
      "id,type,course_id,question,answer,understanding_level,flag,courses(title)"
    )
    .eq("user_id", userId)
    .eq("type", "qa")
    .in("id", noteIds)

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Failed to load review notes",
    }
  }

  const byId = new Map(
    (data as DbReviewNoteRow[])
      .map((row) => reviewNoteFromDb(row))
      .filter((note): note is ReviewNote => note != null)
      .map((note) => [note.id, note] as const)
  )

  return {
    success: true,
    data: noteIds
      .map((noteId) => byId.get(noteId))
      .filter((note): note is ReviewNote => note != null),
  }
}
