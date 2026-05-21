import { NextResponse } from "next/server"

import { writeSupabaseBeacon } from "@/lib/supabase/beacon"

function getProvidedSecret(request: Request) {
  const url = new URL(request.url)

  const headerSecret =
    request.headers.get("x-beacon-secret") ??
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")

  return headerSecret ?? url.searchParams.get("secret")
}

async function handle(request: Request) {
  const requiredSecret = process.env.BEACON_SECRET

  if (requiredSecret) {
    const provided = getProvidedSecret(request)
    if (!provided || provided !== requiredSecret) {
      // Return 404 to avoid advertising that this endpoint exists.
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
  }

  const source =
    request.headers.get("user-agent") ??
    request.headers.get("x-beacon-source") ??
    "unknown"

  const { error } = await writeSupabaseBeacon({ source })

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
