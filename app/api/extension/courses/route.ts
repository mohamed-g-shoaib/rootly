import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  getExtensionCorsHeaders,
  jsonWithExtensionCors,
} from "@/lib/extension-api"
import { createClient } from "@/lib/supabase/server"

const createCourseSchema = z.object({
  title: z.string().trim().min(1),
  instructor: z.string().trim().nullable().optional(),
  courseLink: z.string().trim().nullable().optional(),
})

function normalizeOptionalText(value: string | null | undefined) {
  if (value == null) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isValidUrl(value: string | null) {
  if (!value) {
    return true
  }

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
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

  let parsedBody: z.infer<typeof createCourseSchema>

  try {
    const rawBody = await request.json()
    parsedBody = createCourseSchema.parse(rawBody)
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? (error.issues[0]?.message ?? "Invalid request payload.")
        : "Invalid request payload."

    return jsonWithExtensionCors(
      { error: message },
      {
        status: 400,
        origin,
      }
    )
  }

  const courseLink = normalizeOptionalText(parsedBody.courseLink)

  if (!isValidUrl(courseLink)) {
    return jsonWithExtensionCors(
      { error: "Enter a valid course URL." },
      {
        status: 400,
        origin,
      }
    )
  }

  const supabase = await createClient()
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims()
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

  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        id: crypto.randomUUID(),
        user_id: userId,
        title: parsedBody.title.trim(),
        instructor: normalizeOptionalText(parsedBody.instructor),
        course_link: courseLink,
        links: [],
        topics: [],
        progress: 0,
        created_at: now,
        updated_at: now,
      },
    ])
    .select(
      "id,title,instructor,course_link,links,topics,progress,created_at,updated_at"
    )
    .single()

  if (error || !data) {
    return jsonWithExtensionCors(
      { error: error?.message ?? "Failed to create course." },
      {
        status: 500,
        origin,
      }
    )
  }

  return jsonWithExtensionCors(
    {
      course: {
        id: data.id,
        title: data.title,
        instructor: data.instructor,
        courseLink: data.course_link,
        links: data.links,
        topics: data.topics,
        progress: data.progress,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    },
    {
      status: 200,
      origin,
    }
  )
}
