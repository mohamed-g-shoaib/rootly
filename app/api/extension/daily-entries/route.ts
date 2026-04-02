import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  getExtensionCorsHeaders,
  jsonWithExtensionCors,
} from "@/lib/extension-api"
import { createClient } from "@/lib/supabase/server"

const createDailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  addStudyTimeMinutes: z.number().int().positive(),
  mood: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  notes: z.string().nullable().optional(),
})

function normalizeNotes(notes: string | null | undefined) {
  if (notes == null) {
    return null
  }

  const trimmed = notes.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  const headers = getExtensionCorsHeaders(origin)

  if (!headers.has("Access-Control-Allow-Origin")) {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")

  let parsedBody: z.infer<typeof createDailyEntrySchema>
  let rawBody: unknown

  try {
    rawBody = await request.json()
    parsedBody = createDailyEntrySchema.parse(rawBody)
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message ?? "Invalid request payload."
        : "Invalid request payload."

    return jsonWithExtensionCors(
      { error: message },
      {
        status: 400,
        origin,
      }
    )
  }

  const supabase = await createClient()
  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims()
  const userId =
    !claimsError && typeof claimsData?.claims?.sub === "string"
      ? claimsData.claims.sub
      : null

  if (!userId) {
    return jsonWithExtensionCors(
      { error: "Unauthorized" },
      {
        status: 401,
        origin,
      }
    )
  }

  const { data: existingEntry, error: existingEntryError } = await supabase
    .from("daily_entries")
    .select("id,date,study_time_minutes,mood,notes,created_at,updated_at")
    .eq("user_id", userId)
    .eq("date", parsedBody.date)
    .maybeSingle()

  if (existingEntryError) {
    return jsonWithExtensionCors(
      {
        error:
          existingEntryError.message ?? "Failed to load today's daily entry.",
      },
      {
        status: 500,
        origin,
      }
    )
  }

  const bodyObject =
    rawBody && typeof rawBody === "object" ? (rawBody as Record<string, unknown>) : {}
  const notesWasProvided = Object.hasOwn(bodyObject, "notes")
  const moodWasProvided = Object.hasOwn(bodyObject, "mood")

  if (!existingEntry && !parsedBody.mood) {
    return jsonWithExtensionCors(
      { error: "Mood is required when creating a new daily entry." },
      {
        status: 400,
        origin,
      }
    )
  }

  if (!existingEntry) {
    const now = new Date().toISOString()
    const { data: createdEntry, error: createError } = await supabase
      .from("daily_entries")
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          date: parsedBody.date,
          study_time_minutes: parsedBody.addStudyTimeMinutes,
          mood: parsedBody.mood,
          notes: normalizeNotes(parsedBody.notes),
          created_at: now,
          updated_at: now,
        },
      ])
      .select("id,date,study_time_minutes,mood,notes,created_at,updated_at")
      .single()

    if (createError || !createdEntry) {
      return jsonWithExtensionCors(
        { error: createError?.message ?? "Failed to create daily entry." },
        {
          status: 500,
          origin,
        }
      )
    }

    return jsonWithExtensionCors(
      {
        entry: {
          id: createdEntry.id,
          date: createdEntry.date,
          studyTimeMinutes: createdEntry.study_time_minutes,
          mood: createdEntry.mood,
          notes: createdEntry.notes,
          createdAt: createdEntry.created_at,
          updatedAt: createdEntry.updated_at,
        },
      },
      {
        status: 200,
        origin,
      }
    )
  }

  const nextMood = moodWasProvided ? parsedBody.mood : existingEntry.mood
  const nextNotes = notesWasProvided
    ? normalizeNotes(parsedBody.notes)
    : existingEntry.notes

  const updatePayload = {
    study_time_minutes:
      existingEntry.study_time_minutes + parsedBody.addStudyTimeMinutes,
    mood: nextMood,
    notes: nextNotes,
    updated_at: new Date().toISOString(),
  }

  const { data: updatedEntry, error: updateError } = await supabase
    .from("daily_entries")
    .update(updatePayload)
    .eq("id", existingEntry.id)
    .eq("user_id", userId)
    .select("id,date,study_time_minutes,mood,notes,created_at,updated_at")
    .single()

  if (updateError || !updatedEntry) {
    return jsonWithExtensionCors(
      { error: updateError?.message ?? "Failed to update daily entry." },
      {
        status: 500,
        origin,
      }
    )
  }

  return jsonWithExtensionCors(
    {
      entry: {
        id: updatedEntry.id,
        date: updatedEntry.date,
        studyTimeMinutes: updatedEntry.study_time_minutes,
        mood: updatedEntry.mood,
        notes: updatedEntry.notes,
        createdAt: updatedEntry.created_at,
        updatedAt: updatedEntry.updated_at,
      },
    },
    {
      status: 200,
      origin,
    }
  )
}

