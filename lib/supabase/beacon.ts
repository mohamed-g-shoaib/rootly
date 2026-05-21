import { createAdminClient } from "@/lib/supabase/admin"

export type BeaconWriteOptions = {
  table?: string
  key?: string
  source?: string
  timestamp?: Date
}

export async function writeSupabaseBeacon(options: BeaconWriteOptions = {}) {
  const table = options.table ?? "beacon_heartbeats"
  const key = options.key ?? "rootly"
  const source = options.source ?? "unknown"
  const timestamp = options.timestamp ?? new Date()

  const supabase = createAdminClient()

  // We intentionally write a very small row. This is meant to be called from
  // any scheduler (Vercel Cron, Cloudflare, a VPS cron job, etc).
  return supabase.from(table).upsert(
    {
      key,
      last_ping_at: timestamp.toISOString(),
      last_source: source.slice(0, 200),
    },
    { onConflict: "key" }
  )
}
