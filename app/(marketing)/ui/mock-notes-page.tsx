"use client"

import * as React from "react"

import { MockNoteEditorSheet } from "./mock-note-editor-sheet"
import { MockNoteCard } from "./mock-note-card"
import { MockCodeViewerSheet, MockNoteViewerSheet } from "./mock-notes-sheets"
import { useDemoStore } from "./mock-store"

export function MockNotesPage({
  cardCap,
  breakpoint,
  createOpen,
  onCreateOpenChange,
}: {
  cardCap: number
  breakpoint: "mobile" | "tablet" | "desktop"
  createOpen: boolean
  onCreateOpenChange: (open: boolean) => void
}) {
  const isMobile = breakpoint !== "desktop"
  const store = useDemoStore()

  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [codeOpen, setCodeOpen] = React.useState(false)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)

  const courses = React.useMemo(
    () => store.courses.map((c) => ({ id: c.id, title: c.title })),
    [store.courses]
  )

  const notes = store.notes

  const filtered = React.useMemo(() => {
    const sorted = notes
      .slice()
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    if (breakpoint === "mobile") {
      const qa = sorted.filter((n) => n.type === "qa").slice(0, 1)
      const freeform = sorted.filter((n) => n.type === "freeform").slice(0, 2)
      return [...qa, ...freeform].toSorted((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    }

    const cap = Math.max(0, Math.floor(cardCap))
    return cap > 0 ? sorted.slice(0, cap) : sorted
  }, [breakpoint, cardCap, notes])

  const activeNote = React.useMemo(
    () =>
      activeNoteId ? (notes.find((n) => n.id === activeNoteId) ?? null) : null,
    [activeNoteId, notes]
  )

  function openView(id: string) {
    setActiveNoteId(id)
    setViewOpen(true)
  }

  function openCode(id: string) {
    setActiveNoteId(id)
    setCodeOpen(true)
  }

  function openEdit(id: string) {
    setActiveNoteId(id)
    setEditOpen(true)
  }

  function toggleFlag(id: string) {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    store.updateNote(id, { flag: !note.flag })
  }

  function deleteNote(id: string) {
    store.deleteNote(id)
  }

  return (
    <div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <MockNoteCard
              key={note.id}
              note={note}
              breakpoint={breakpoint}
              onToggleFlag={() => toggleFlag(note.id)}
              onEdit={() => openEdit(note.id)}
              onViewFull={() => openView(note.id)}
              onViewCode={() => openCode(note.id)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      </div>

      <MockNoteViewerSheet
        note={activeNote}
        open={viewOpen}
        onOpenChange={setViewOpen}
        isMobile={isMobile}
        onEdit={() => {
          setViewOpen(false)
          if (activeNoteId) setEditOpen(true)
        }}
      />

      <MockCodeViewerSheet
        note={activeNote}
        open={codeOpen}
        onOpenChange={setCodeOpen}
        isMobile={isMobile}
        onEdit={() => {
          setCodeOpen(false)
          if (activeNoteId) setEditOpen(true)
        }}
      />

      <MockNoteEditorSheet
        mode="create"
        note={null}
        courses={courses}
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        isMobile={isMobile}
        onSave={(next) => {
          store.addNote({
            type: next.type,
            courseId: next.courseId,
            courseTitle: next.courseTitle,
            question: next.question,
            answer: next.answer,
            body: next.body,
            understandingLevel: next.understandingLevel,
            flag: next.flag,
            codeSnippet: next.codeSnippet,
            codeLanguage: next.codeLanguage,
          })
          onCreateOpenChange(false)
        }}
      />

      <MockNoteEditorSheet
        mode="edit"
        note={activeNote}
        courses={courses}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        onSave={(next) => {
          store.updateNote(next.id, next)
          setEditOpen(false)
        }}
      />
    </div>
  )
}
