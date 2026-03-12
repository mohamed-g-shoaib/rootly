"use client"

import * as React from "react"

import type { Course } from "@/app/courses/ui/courses-model"
import type { DailyEntry } from "@/app/daily-entries/ui/daily-entries-model"
import type { Note } from "@/app/notes/ui/notes-model"

import {
  DEMO_SEED_COURSES,
  DEMO_SEED_DAILY_ENTRIES,
  DEMO_SEED_NOTES,
} from "./mock-seed"

export type DemoNote = Note
export type DemoCourse = Course
export type DemoDailyEntry = DailyEntry

export type DemoStoreSnapshot = {
  notes: DemoNote[]
  courses: DemoCourse[]
  dailyEntries: DemoDailyEntry[]
}

type DemoStoreApi = {
  // Notes
  getNotes: () => DemoNote[]
  addNote: (note: Omit<DemoNote, "id" | "createdAt" | "updatedAt">) => void
  updateNote: (id: string, patch: Partial<DemoNote>) => void
  deleteNote: (id: string) => void

  // Courses
  getCourses: () => DemoCourse[]
  addCourse: (
    course: Omit<DemoCourse, "id" | "createdAt" | "updatedAt">
  ) => void
  updateCourse: (id: string, patch: Partial<DemoCourse>) => void
  deleteCourse: (id: string) => void

  // Daily Entries
  getDailyEntries: () => DemoDailyEntry[]
  addDailyEntry: (
    entry: Omit<DemoDailyEntry, "id" | "createdAt" | "updatedAt">
  ) => void
  updateDailyEntry: (id: string, patch: Partial<DemoDailyEntry>) => void
  deleteDailyEntry: (id: string) => void
}

export type DemoStore = DemoStoreSnapshot & DemoStoreApi

const KEY_NOTES = "rootly_demo_notes"
const KEY_COURSES = "rootly_demo_courses"
const KEY_DAILY_ENTRIES = "rootly_demo_daily_entries"
const KEY_REVIEW_SESSIONS = "rootly_demo_review_sessions"

type Listener = () => void

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function readNotes(): DemoNote[] {
  const parsed = safeParse<DemoNote[]>(localStorage.getItem(KEY_NOTES))
  return parsed ?? []
}

function readCourses(): DemoCourse[] {
  const parsed = safeParse<DemoCourse[]>(localStorage.getItem(KEY_COURSES))
  return parsed ?? []
}

function readDailyEntries(): DemoDailyEntry[] {
  const parsed = safeParse<DemoDailyEntry[]>(
    localStorage.getItem(KEY_DAILY_ENTRIES)
  )
  return parsed ?? []
}

function writeNotes(items: DemoNote[]) {
  localStorage.setItem(KEY_NOTES, JSON.stringify(items))
}

function writeCourses(items: DemoCourse[]) {
  localStorage.setItem(KEY_COURSES, JSON.stringify(items))
}

function writeDailyEntries(items: DemoDailyEntry[]) {
  localStorage.setItem(KEY_DAILY_ENTRIES, JSON.stringify(items))
}

function ensureSeedWritten() {
  writeCourses([...DEMO_SEED_COURSES])
  writeNotes([...DEMO_SEED_NOTES])
  writeDailyEntries([...DEMO_SEED_DAILY_ENTRIES])
  localStorage.setItem(KEY_REVIEW_SESSIONS, JSON.stringify([]))
}

function buildStore({ getNoteCap }: { getNoteCap: () => number }) {
  const listeners = new Set<Listener>()

  const EMPTY_SNAPSHOT: DemoStoreSnapshot = {
    notes: [],
    courses: [],
    dailyEntries: [],
  }

  let lastNotesRaw: string | null = null
  let lastCoursesRaw: string | null = null
  let lastDailyEntriesRaw: string | null = null
  let lastSnapshot: DemoStoreSnapshot = EMPTY_SNAPSHOT

  function emit() {
    for (const l of listeners) l()
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function getSnapshot(): DemoStoreSnapshot {
    const notesRaw = localStorage.getItem(KEY_NOTES)
    const coursesRaw = localStorage.getItem(KEY_COURSES)
    const dailyEntriesRaw = localStorage.getItem(KEY_DAILY_ENTRIES)

    if (
      notesRaw === lastNotesRaw &&
      coursesRaw === lastCoursesRaw &&
      dailyEntriesRaw === lastDailyEntriesRaw
    ) {
      return lastSnapshot
    }

    lastNotesRaw = notesRaw
    lastCoursesRaw = coursesRaw
    lastDailyEntriesRaw = dailyEntriesRaw

    const next: DemoStoreSnapshot = {
      notes: safeParse<DemoNote[]>(notesRaw) ?? [],
      courses: safeParse<DemoCourse[]>(coursesRaw) ?? [],
      dailyEntries: safeParse<DemoDailyEntry[]>(dailyEntriesRaw) ?? [],
    }

    lastSnapshot = next
    return next
  }

  function getServerSnapshot(): DemoStoreSnapshot {
    return EMPTY_SNAPSHOT
  }

  function addNote(note: Omit<DemoNote, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString()
    const cap = Math.max(0, Math.floor(getNoteCap()))

    const base = readNotes()

    const next: DemoNote = {
      id: `note_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...note,
    }

    const sortedOldestFirst = base
      .slice()
      .toSorted((a, b) => a.createdAt.localeCompare(b.createdAt))

    const afterCap =
      cap > 0 && sortedOldestFirst.length >= cap
        ? sortedOldestFirst.slice(sortedOldestFirst.length - (cap - 1))
        : sortedOldestFirst

    const appended = [next, ...afterCap]
      .slice()
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    writeNotes(appended)
    emit()
  }

  function updateNote(id: string, patch: Partial<DemoNote>) {
    const now = new Date().toISOString()
    const items = readNotes().map((n) =>
      n.id === id ? { ...n, ...patch, updatedAt: now } : n
    )
    writeNotes(items)
    emit()
  }

  function deleteNote(id: string) {
    writeNotes(readNotes().filter((n) => n.id !== id))
    emit()
  }

  function addCourse(
    course: Omit<DemoCourse, "id" | "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString()
    const next: DemoCourse = {
      id: `course_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...course,
    }
    writeCourses([next, ...readCourses()])
    emit()
  }

  function updateCourse(id: string, patch: Partial<DemoCourse>) {
    const now = new Date().toISOString()
    const items = readCourses().map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: now } : c
    )
    writeCourses(items)
    emit()
  }

  function deleteCourse(id: string) {
    writeCourses(readCourses().filter((c) => c.id !== id))
    emit()
  }

  function addDailyEntry(
    entry: Omit<DemoDailyEntry, "id" | "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString()
    const next: DemoDailyEntry = {
      id: `entry_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...entry,
    }

    const items = readDailyEntries()

    if (items.some((e) => e.date === next.date)) {
      emit()
      return
    }

    writeDailyEntries([next, ...items])
    emit()
  }

  function updateDailyEntry(id: string, patch: Partial<DemoDailyEntry>) {
    const now = new Date().toISOString()
    const items = readDailyEntries().map((e) =>
      e.id === id ? { ...e, ...patch, updatedAt: now } : e
    )
    writeDailyEntries(items)
    emit()
  }

  function deleteDailyEntry(id: string) {
    writeDailyEntries(readDailyEntries().filter((e) => e.id !== id))
    emit()
  }

  function useStore(): DemoStore {
    const snapshot = React.useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
    )

    return {
      ...snapshot,
      getNotes: () => readNotes(),
      addNote,
      updateNote,
      deleteNote,

      getCourses: () => readCourses(),
      addCourse,
      updateCourse,
      deleteCourse,

      getDailyEntries: () => readDailyEntries(),
      addDailyEntry,
      updateDailyEntry,
      deleteDailyEntry,
    }
  }

  return { useStore, emit, writeSeed: ensureSeedWritten }
}

const DemoStoreContext = React.createContext<
  { useStore: () => DemoStore; writeSeed: () => void } | undefined
>(undefined)

export function DemoStoreProvider({
  children,
  noteCap,
}: {
  children: React.ReactNode
  noteCap: number
}) {
  const noteCapRef = React.useRef(noteCap)
  noteCapRef.current = noteCap

  const storeRef = React.useRef<ReturnType<typeof buildStore> | null>(null)
  if (!storeRef.current) {
    storeRef.current = buildStore({ getNoteCap: () => noteCapRef.current })
  }

  React.useEffect(() => {
    storeRef.current?.writeSeed()
    storeRef.current?.emit()
  }, [])

  const value = React.useMemo(() => {
    if (!storeRef.current) return undefined
    return {
      useStore: storeRef.current.useStore,
      writeSeed: storeRef.current.writeSeed,
    }
  }, [])

  return React.createElement(DemoStoreContext.Provider, { value }, children)
}

export function useDemoStore() {
  const ctx = React.useContext(DemoStoreContext)
  if (!ctx)
    throw new Error("useDemoStore must be used within DemoStoreProvider")
  return ctx.useStore()
}
