import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  getExtensionCorsHeaders,
  jsonWithExtensionCors,
} from "@/lib/extension-api"
import { createClient } from "@/lib/supabase/server"

const createNoteSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("qa"),
    courseId: z.string().uuid().nullable().optional(),
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
    understandingLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  z.object({
    type: z.literal("freeform"),
    courseId: z.string().uuid().nullable().optional(),
    body: z.string().trim().min(1),
  }),
])

function normalizeCourseId(courseId: string | null | undefined) {
  return courseId ?? null
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

  let parsedBody: z.infer<typeof createNoteSchema>

  try {
    const rawBody = await request.json()
    parsedBody = createNoteSchema.parse(rawBody)
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

  const now = new Date().toISOString()
  const noteId = crypto.randomUUID()

  const insertPayload =
    parsedBody.type === "qa"
      ? {
          id: noteId,
          user_id: userId,
          type: "qa" as const,
          course_id: normalizeCourseId(parsedBody.courseId),
          question: parsedBody.question.trim(),
          answer: parsedBody.answer.trim(),
          body: null,
          understanding_level: parsedBody.understandingLevel,
          flag: false,
          code_snippet: null,
          code_language: "text",
          created_at: now,
          updated_at: now,
        }
      : {
          id: noteId,
          user_id: userId,
          type: "freeform" as const,
          course_id: normalizeCourseId(parsedBody.courseId),
          question: null,
          answer: null,
          body: parsedBody.body.trim(),
          understanding_level: null,
          flag: false,
          code_snippet: null,
          code_language: "text",
          created_at: now,
          updated_at: now,
        }

  const { data, error } = await supabase
    .from("notes")
    .insert([insertPayload])
    .select(
      "id,type,course_id,question,answer,body,understanding_level,flag,code_snippet,code_language,created_at,updated_at,courses(title)"
    )
    .single()

  if (error || !data) {
    return jsonWithExtensionCors(
      { error: error?.message ?? "Failed to create note." },
      {
        status: 500,
        origin,
      }
    )
  }

  const courseRelation = data.courses as
    | { title: string | null }
    | Array<{ title: string | null }>
    | null

  const courseTitle = Array.isArray(courseRelation)
    ? (courseRelation[0]?.title ?? null)
    : (courseRelation?.title ?? null)

  const previewSource = data.type === "qa" ? data.answer : data.body

  return jsonWithExtensionCors(
    {
      note: {
        id: data.id,
        type: data.type,
        courseId: data.course_id,
        courseTitle,
        question: data.question,
        previewText: (previewSource ?? "").trim().slice(0, 280),
        answer: data.answer,
        body: data.body,
        understandingLevel: data.understanding_level,
        flag: data.flag,
        hasCodeSnippet: Boolean(data.code_snippet),
        codeSnippet: data.code_snippet,
        codeLanguage: data.code_language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        detailsLoaded: true,
      },
    },
    {
      status: 200,
      origin,
    }
  )
}


