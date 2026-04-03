import { NextRequest, NextResponse } from "next/server"

import {
  getExtensionCorsHeaders,
  jsonWithExtensionCors,
} from "@/lib/extension-api"
import { createClient } from "@/lib/supabase/server"

type BootstrapCourse = {
  id: string
  title: string
  updatedAt: string
}

type BootstrapDailyEntry = {
  id: string
  date: string
  studyTimeMinutes: number
  mood: 1 | 2 | 3
  notes: string | null
  updatedAt: string
}

function getRequestedDate(searchParams: URLSearchParams) {
  const today = searchParams.get("today")

  if (!today) {
    return null
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(today) ? today : null
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

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin")
  const requestedDate = getRequestedDate(request.nextUrl.searchParams)

  if (request.nextUrl.searchParams.get("today") && !requestedDate) {
    return jsonWithExtensionCors(
      { error: "Invalid 'today' query parameter. Expected YYYY-MM-DD." },
      {
        status: 400,
        origin,
      }
    )
  }

  const supabase = await createClient()
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims()
  const claims = claimsData?.claims
  const userId = typeof claims?.sub === "string" ? claims.sub : null

  if (claimsError || !userId) {
    return jsonWithExtensionCors(
      { error: "Unauthorized" },
      {
        status: 401,
        origin,
      }
    )
  }

  const [{ data: coursesData, error: coursesError }, dailyEntryResult] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id,title,updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(8),
      requestedDate
        ? supabase
            .from("daily_entries")
            .select("id,date,study_time_minutes,mood,notes,updated_at")
            .eq("user_id", userId)
            .eq("date", requestedDate)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])

  if (coursesError) {
    return jsonWithExtensionCors(
      { error: coursesError.message ?? "Failed to load extension bootstrap." },
      {
        status: 500,
        origin,
      }
    )
  }

  if (dailyEntryResult.error) {
    return jsonWithExtensionCors(
      {
        error:
          dailyEntryResult.error.message ??
          "Failed to load today's daily entry.",
      },
      {
        status: 500,
        origin,
      }
    )
  }

  const userMetadata =
    claims?.user_metadata &&
    typeof claims.user_metadata === "object" &&
    !Array.isArray(claims.user_metadata)
      ? claims.user_metadata
      : null

  const courses: BootstrapCourse[] = (coursesData ?? []).map((course) => ({
    id: course.id,
    title: course.title,
    updatedAt: course.updated_at,
  }))

  const todayEntry = dailyEntryResult.data
    ? ({
        id: dailyEntryResult.data.id,
        date: dailyEntryResult.data.date,
        studyTimeMinutes: dailyEntryResult.data.study_time_minutes,
        mood: dailyEntryResult.data.mood,
        notes: dailyEntryResult.data.notes,
        updatedAt: dailyEntryResult.data.updated_at,
      } satisfies BootstrapDailyEntry)
    : null

  return jsonWithExtensionCors(
    {
      user: {
        id: userId,
        email: typeof claims?.email === "string" ? claims.email : null,
        fullName:
          userMetadata && typeof userMetadata.full_name === "string"
            ? userMetadata.full_name
            : null,
        name:
          userMetadata && typeof userMetadata.name === "string"
            ? userMetadata.name
            : null,
      },
      courses,
      todayEntry,
    },
    {
      status: 200,
      origin,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
