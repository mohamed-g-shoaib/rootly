"use client"

import * as React from "react"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

import type { DailyEntry } from "@/app/daily-entries/ui/daily-entries-model"
import {
  DAILY_ENTRY_WINDOW_EVENT,
  DAILY_ENTRY_WINDOW_SOURCE,
  getDailyEntryChannelName,
  isDailyEntry,
  isDailyEntryRow,
  toDailyEntry,
} from "@/lib/daily-entry-live"
import { createClient } from "@/lib/supabase/client"

function readPostgresPayloadEntry(
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
) {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const candidate = payload as {
    new?: unknown
    record?: unknown
  }

  if (isDailyEntryRow(candidate.new)) {
    return toDailyEntry(candidate.new)
  }

  if (isDailyEntryRow(candidate.record)) {
    return toDailyEntry(candidate.record)
  }

  return null
}

function readWindowMessageEntry(event: MessageEvent<unknown>) {
  if (event.source !== window || event.origin !== window.location.origin) {
    return null
  }

  const data = event.data

  if (!data || typeof data !== "object") {
    return null
  }

  const candidate = data as {
    source?: unknown
    type?: unknown
    entry?: unknown
  }

  if (
    candidate.source !== DAILY_ENTRY_WINDOW_SOURCE ||
    candidate.type !== DAILY_ENTRY_WINDOW_EVENT ||
    !isDailyEntry(candidate.entry)
  ) {
    return null
  }

  return candidate.entry
}

export function useDailyEntryLiveUpdates({
  userId,
  onEntryUpsert,
}: {
  userId: string | null
  onEntryUpsert: (entry: DailyEntry) => void
}) {
  const onEntryUpsertRef = React.useRef(onEntryUpsert)

  React.useEffect(() => {
    onEntryUpsertRef.current = onEntryUpsert
  }, [onEntryUpsert])

  React.useEffect(() => {
    if (!userId) {
      return
    }

    const supabase = createClient()
    const channel = supabase
      .channel(getDailyEntryChannelName(userId))
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_entries",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          const entry = readPostgresPayloadEntry(payload)

          if (entry) {
            onEntryUpsertRef.current(entry)
          }
        }
      )
      .subscribe()

    function handleWindowMessage(event: MessageEvent<unknown>) {
      const entry = readWindowMessageEntry(event)

      if (entry) {
        onEntryUpsertRef.current(entry)
      }
    }

    window.addEventListener("message", handleWindowMessage)

    return () => {
      window.removeEventListener("message", handleWindowMessage)
      void supabase.removeChannel(channel)
    }
  }, [userId])
}
