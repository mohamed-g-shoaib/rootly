"use client"

import * as React from "react"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

import type { Note } from "@/app/notes/ui/notes-model"
import {
  isNote,
  isNoteRow,
  NOTE_WINDOW_EVENT,
  NOTE_WINDOW_SOURCE,
  toNote,
} from "@/lib/note-live"
import { createClient } from "@/lib/supabase/client"

function readPostgresPayloadNote(
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  getCourseTitle: (courseId: string | null) => string | null
) {
  const candidate = payload as {
    new?: unknown
    record?: unknown
  }

  const row = isNoteRow(candidate.new)
    ? candidate.new
    : isNoteRow(candidate.record)
      ? candidate.record
      : null

  if (!row) {
    return null
  }

  return toNote(row, getCourseTitle(row.course_id), false)
}

function readWindowMessageNote(event: MessageEvent<unknown>) {
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
    note?: unknown
  }

  if (
    candidate.source !== NOTE_WINDOW_SOURCE ||
    candidate.type !== NOTE_WINDOW_EVENT ||
    !isNote(candidate.note)
  ) {
    return null
  }

  return candidate.note
}

export function useNoteLiveUpdates({
  userId,
  getCourseTitle,
  onNoteUpsert,
}: {
  userId: string | null
  getCourseTitle: (courseId: string | null) => string | null
  onNoteUpsert: (note: Note) => void
}) {
  const onNoteUpsertRef = React.useRef(onNoteUpsert)
  const getCourseTitleRef = React.useRef(getCourseTitle)

  React.useEffect(() => {
    onNoteUpsertRef.current = onNoteUpsert
    getCourseTitleRef.current = getCourseTitle
  }, [getCourseTitle, onNoteUpsert])

  React.useEffect(() => {
    if (!userId) {
      return
    }

    const supabase = createClient()
    const channel = supabase
      .channel(`notes-live:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          const note = readPostgresPayloadNote(
            payload,
            getCourseTitleRef.current
          )

          if (note) {
            onNoteUpsertRef.current(note)
          }
        }
      )
      .subscribe()

    function handleWindowMessage(event: MessageEvent<unknown>) {
      const note = readWindowMessageNote(event)

      if (note) {
        onNoteUpsertRef.current(note)
      }
    }

    window.addEventListener("message", handleWindowMessage)

    return () => {
      window.removeEventListener("message", handleWindowMessage)
      void supabase.removeChannel(channel)
    }
  }, [userId])
}
