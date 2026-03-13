"use server"

import { createClient } from "@/lib/supabase/server"

import type { Note } from "./notes-model"

type DbNoteRow = {
  id: string
  user_id: string
  type: "qa" | "freeform"
  course_id: string | null
  question: string | null
  answer: string | null
  body: string | null
  understanding_level: 1 | 2 | 3 | null
  flag: boolean
  code_snippet: string | null
  code_language: string
  created_at: string
  updated_at: string
  courses: { title: string }[] | { title: string } | null
}

function getCourseTitle(courses: DbNoteRow["courses"]): string | null {
  if (!courses) return null
  if (Array.isArray(courses)) return courses[0]?.title ?? null
  return courses.title ?? null
}

function fromDb(row: DbNoteRow): Note {
  return {
    id: row.id,
    type: row.type,
    courseId: row.course_id,
    courseTitle: getCourseTitle(row.courses),
    question: row.question,
    answer: row.answer,
    body: row.body,
    understandingLevel: row.understanding_level,
    flag: row.flag,
    codeSnippet: row.code_snippet,
    codeLanguage: row.code_language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

type DbInsertNoteRow = {
  id: string
  user_id: string
  type: "qa" | "freeform"
  course_id: string | null
  question: string | null
  answer: string | null
  body: string | null
  understanding_level: 1 | 2 | 3 | null
  flag: boolean
  code_snippet: string | null
  code_language: string
  created_at: string
  updated_at: string
}

function toDbInsert(note: Note, userId: string): DbInsertNoteRow {
  return {
    id: note.id,
    user_id: userId,
    type: note.type,
    course_id: note.courseId,
    question: note.question,
    answer: note.answer,
    body: note.body,
    understanding_level: note.understandingLevel,
    flag: note.flag,
    code_snippet: note.codeSnippet,
    code_language: note.codeLanguage,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  }
}

export async function createNote({
  note,
  userId,
}: {
  note: Note
  userId: string
}): Promise<{ success: true; data: Note } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notes")
    .insert([toDbInsert(note, userId)])
    .select(
      "id,user_id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
    )
    .eq("user_id", userId)
    .eq("id", note.id)
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to create note" }
  }

  return { success: true, data: fromDb(data as DbNoteRow) }
}

export async function updateNote({
  noteId,
  patch,
  userId,
}: {
  noteId: string
  patch: Partial<Note>
  userId: string
}): Promise<{ success: true; data: Note } | { success: false; error: string }> {
  const supabase = await createClient()

  const updatedAt = new Date().toISOString()

  const updatePayload: Record<string, unknown> = {
    updated_at: updatedAt,
  }

  if (patch.type !== undefined) updatePayload.type = patch.type
  if (patch.courseId !== undefined) updatePayload.course_id = patch.courseId
  if (patch.question !== undefined) updatePayload.question = patch.question
  if (patch.answer !== undefined) updatePayload.answer = patch.answer
  if (patch.body !== undefined) updatePayload.body = patch.body
  if (patch.understandingLevel !== undefined)
    updatePayload.understanding_level = patch.understandingLevel
  if (patch.flag !== undefined) updatePayload.flag = patch.flag
  if (patch.codeSnippet !== undefined)
    updatePayload.code_snippet = patch.codeSnippet
  if (patch.codeLanguage !== undefined)
    updatePayload.code_language = patch.codeLanguage

  const { data, error } = await supabase
    .from("notes")
    .update(updatePayload)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select(
      "id,user_id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to update note" }
  }

  return { success: true, data: fromDb(data as DbNoteRow) }
}

export async function deleteNote({
  noteId,
  userId,
}: {
  noteId: string
  userId: string
}): Promise<{ success: true; data: Note } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId)
    .select(
      "id,user_id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to delete note" }
  }

  return { success: true, data: fromDb(data as DbNoteRow) }
}

export async function toggleNoteFlag({
  noteId,
  userId,
}: {
  noteId: string
  userId: string
}): Promise<{ success: true; data: Note } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data: existing, error: existingError } = await supabase
    .from("notes")
    .select("flag")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single()

  if (existingError || !existing) {
    return {
      success: false,
      error: existingError?.message ?? "Failed to read note",
    }
  }

  const updatedAt = new Date().toISOString()

  const { data, error } = await supabase
    .from("notes")
    .update({ flag: !existing.flag, updated_at: updatedAt })
    .eq("id", noteId)
    .eq("user_id", userId)
    .select(
      "id,user_id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
    )
    .single()

  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to toggle flag" }
  }

  return { success: true, data: fromDb(data as DbNoteRow) }
}
