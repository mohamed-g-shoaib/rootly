"use client"

import type { User } from "@supabase/supabase-js"
import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCanAnimate } from "@/hooks/use-can-animate"
import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { PageContainer } from "@/components/ui/page-container"
import { toastManager } from "@/components/ui/toast"

import { Spinner } from "@/components/ui/spinner"

import type { CourseFilter, Note, SortKey, TypeFilter } from "./notes-model"
import {
  createNote,
  deleteNote,
  toggleNoteFlag,
  updateNote,
} from "./notes-actions"
import { NotesHeader } from "./notes-header"
import {
  EmptyState,
  ExportSheet,
  NoteCard,
  FilterSheet,
} from "./notes-components"
import {
  NoteViewerSheet,
  CodeViewerSheet,
  NoteEditorSheet,
} from "./notes-sheets"
import { exportNotesAsMarkdown } from "./notes-export"
import { useExportPdf } from "./notes-pdf"

export default function NotesPage({
  user,
  initialNotes,
  initialCourses,
}: {
  user: User | null
  initialNotes: Note[]
  initialCourses: { id: string; title: string }[]
}) {
  const isMobile = useIsMobile()
  const canAnimate = useCanAnimate()

  const [courses] = React.useState(() => initialCourses)
  const [allNotes, setAllNotes] = React.useState<Note[]>(() => initialNotes)

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")
  const [courseFilter, setCourseFilter] = React.useState<CourseFilter>("all")
  const [flaggedOnly, setFlaggedOnly] = React.useState(false)
  const [sortKey, setSortKey] = React.useState<SortKey>("last_updated")

  const [globalShowAnswers, setGlobalShowAnswers] = React.useState(false)
  const [answerOverrides, setAnswerOverrides] = React.useState<
    Record<string, boolean>
  >({})

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [codeOpen, setCodeOpen] = React.useState(false)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)

  const [mobileTypeSheetOpen, setMobileTypeSheetOpen] = React.useState(false)
  const [mobileCourseSheetOpen, setMobileCourseSheetOpen] =
    React.useState(false)
  const [mobileSortSheetOpen, setMobileSortSheetOpen] = React.useState(false)
  const [mobileExportSheetOpen, setMobileExportSheetOpen] =
    React.useState(false)

  const [visibleCount, setVisibleCount] = React.useState(20)
  const [loadingMore, setLoadingMore] = React.useState(false)

  const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

  const now = React.useMemo(() => new Date(), [])

  const filtered = React.useMemo(() => {
    const base = allNotes.filter((n) => {
      if (typeFilter !== "all" && n.type !== typeFilter) return false

      if (courseFilter === "none" && n.courseId != null) return false
      if (
        courseFilter !== "all" &&
        courseFilter !== "none" &&
        n.courseId !== courseFilter
      )
        return false

      if (flaggedOnly && !n.flag) return false

      return true
    })

    const listHasQa = base.some((n) => n.type === "qa")
    const listIsOnlyFreeform =
      base.length > 0 && base.every((n) => n.type === "freeform")

    const effectiveSortKey =
      listIsOnlyFreeform &&
      (sortKey === "understanding_low" || sortKey === "understanding_high")
        ? "last_updated"
        : sortKey

    const sorted = base.toSorted((a, b) => {
      if (effectiveSortKey === "last_updated")
        return b.updatedAt.localeCompare(a.updatedAt)
      if (effectiveSortKey === "date_created")
        return b.createdAt.localeCompare(a.createdAt)
      if (effectiveSortKey === "course")
        return (a.courseTitle ?? "").localeCompare(b.courseTitle ?? "")

      const aLevel = a.understandingLevel ?? 0
      const bLevel = b.understandingLevel ?? 0

      if (effectiveSortKey === "understanding_low") return aLevel - bLevel
      return bLevel - aLevel
    })

    return { items: sorted, hasQa: listHasQa }
  }, [allNotes, courseFilter, flaggedOnly, sortKey, typeFilter])
  const { exportPdf, exporting } = useExportPdf(filtered.items)

  const visibleNotes = React.useMemo(
    () =>
      filtered.items.slice(0, Math.min(visibleCount, filtered.items.length)),
    [filtered.items, visibleCount]
  )

  const activeNote = React.useMemo(
    () =>
      activeNoteId
        ? (allNotes.find((n) => n.id === activeNoteId) ?? null)
        : null,
    [activeNoteId, allNotes]
  )

  const filtersActive =
    typeFilter !== "all" ||
    courseFilter !== "all" ||
    flaggedOnly ||
    sortKey !== "last_updated"

  function clearFilters() {
    setTypeFilter("all")
    setCourseFilter("all")
    setFlaggedOnly(false)
    setSortKey("last_updated")
  }

  function openView(noteId: string) {
    setActiveNoteId(noteId)
    setViewOpen(true)
  }

  function openCode(noteId: string) {
    setActiveNoteId(noteId)
    setCodeOpen(true)
  }

  function openEdit(noteId: string) {
    setActiveNoteId(noteId)
    setEditOpen(true)
  }

  async function onToggleFlag(noteId: string) {
    if (!user) return

    const prev = allNotes

    setAllNotes((items) =>
      items.map((n) =>
        n.id === noteId
          ? { ...n, flag: !n.flag, updatedAt: now.toISOString() }
          : n
      )
    )

    const res = await toggleNoteFlag({ noteId, userId: user.id })
    if (!res.success) {
      setAllNotes(prev)
      toastManager.add({
        type: "error",
        title: "Could not update note",
        description: res.error,
      })
      return
    }

    setAllNotes((items) => items.map((n) => (n.id === noteId ? res.data : n)))
  }

  async function onDeleteNote(noteId: string) {
    if (!user) return

    const prev = allNotes

    setAllNotes((items) => items.filter((n) => n.id !== noteId))
    setAnswerOverrides((prevOverrides) => {
      const next = { ...prevOverrides }
      delete next[noteId]
      return next
    })

    const res = await deleteNote({ noteId, userId: user.id })
    if (!res.success) {
      setAllNotes(prev)
      toastManager.add({
        type: "error",
        title: "Could not delete note",
        description: res.error,
      })
    }
  }

  async function onCreateNote(draft: Note) {
    if (!user) return

    const optimistic: Note = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const prev = allNotes

    setAllNotes((items) => [optimistic, ...items])
    setCreateOpen(false)

    const res = await createNote({ note: optimistic, userId: user.id })
    if (!res.success) {
      setAllNotes(prev)
      toastManager.add({
        type: "error",
        title: "Could not create note",
        description: res.error,
      })
      return
    }

    setAllNotes((items) =>
      items.map((n) => (n.id === optimistic.id ? res.data : n))
    )
  }

  async function onUpdateNote(next: Note) {
    if (!user) return

    const prev = allNotes

    setAllNotes((items) => items.map((n) => (n.id === next.id ? next : n)))
    setEditOpen(false)

    const res = await updateNote({
      noteId: next.id,
      patch: next,
      userId: user.id,
    })
    if (!res.success) {
      setAllNotes(prev)
      toastManager.add({
        type: "error",
        title: "Could not update note",
        description: res.error,
      })
      return
    }

    setAllNotes((items) => items.map((n) => (n.id === next.id ? res.data : n)))
  }

  React.useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    if (loadingMore) return
    if (visibleCount >= filtered.items.length) return

    const obs = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        if (loadingMore) return
        if (visibleCount >= filtered.items.length) return
        setLoadingMore(true)
        await new Promise((r) => setTimeout(r, 450))
        setVisibleCount((c) => c + 20)
        setLoadingMore(false)
      },
      { root: null, rootMargin: "300px" }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [filtered.items.length, loadingMore, visibleCount])

  const header = (
    <NotesHeader
      isMobile={isMobile}
      courses={courses}
      filteredCount={filtered.items.length}
      hasQa={filtered.hasQa}
      filtersActive={filtersActive}
      typeFilter={typeFilter}
      courseFilter={courseFilter}
      flaggedOnly={flaggedOnly}
      sortKey={sortKey}
      globalShowAnswers={globalShowAnswers}
      onTypeChange={setTypeFilter}
      onCourseChange={setCourseFilter}
      onToggleFlaggedOnly={() => setFlaggedOnly((v) => !v)}
      onSortChange={setSortKey}
      onToggleGlobalAnswers={() => setGlobalShowAnswers((v) => !v)}
      onNewNote={() => setCreateOpen(true)}
      onClearFilters={clearFilters}
      onOpenMobileType={() => setMobileTypeSheetOpen(true)}
      onOpenMobileCourse={() => setMobileCourseSheetOpen(true)}
      onOpenMobileSort={() => setMobileSortSheetOpen(true)}
      onOpenMobileExport={() => setMobileExportSheetOpen(true)}
      onExportPdf={() => void exportPdf()}
      onExportMarkdown={() => exportNotesAsMarkdown(filtered.items)}
      exporting={exporting}
    />
  )

  return (
    <DashboardShell
      user={user}
      fab={
        isMobile
          ? {
              ariaLabel: "New note",
              icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
              onClick: () => setCreateOpen(true),
            }
          : undefined
      }
    >
      {header}

      <PageContainer>
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.items.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  hasAnyNotes={allNotes.length > 0}
                  hasFilters={filtersActive}
                  onNewNote={() => setCreateOpen(true)}
                  onClearFilters={clearFilters}
                />
              </div>
            ) : (
              visibleNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  now={now}
                  isMobile={isMobile}
                  canAnimate={canAnimate}
                  globalShowAnswers={globalShowAnswers}
                  overrideShow={answerOverrides[note.id]}
                  onOverrideChange={(value) =>
                    setAnswerOverrides((prev) => ({
                      ...prev,
                      [note.id]: value,
                    }))
                  }
                  onToggleFlag={() => void onToggleFlag(note.id)}
                  onEdit={() => openEdit(note.id)}
                  onViewFull={() => openView(note.id)}
                  onViewCode={() => openCode(note.id)}
                  onDelete={() => void onDeleteNote(note.id)}
                />
              ))
            )}

            {loadingMore ? (
              <div className="flex items-center justify-center py-6">
                <Spinner />
              </div>
            ) : null}

            <div ref={loadMoreRef} />
          </div>
        </div>
      </PageContainer>

      <FilterSheet
        title="Type"
        open={mobileTypeSheetOpen}
        onOpenChange={setMobileTypeSheetOpen}
        value={typeFilter}
        options={[
          { label: "All Types", value: "all" },
          { label: "Q&A", value: "qa" },
          { label: "Freeform", value: "freeform" },
        ]}
        onValueChange={(v) => setTypeFilter(v as TypeFilter)}
      />

      <FilterSheet
        title="Course"
        open={mobileCourseSheetOpen}
        onOpenChange={setMobileCourseSheetOpen}
        value={courseFilter}
        options={[
          { label: "All Courses", value: "all" },
          { label: "No course", value: "none" },
          ...courses
            .toSorted((a, b) => a.title.localeCompare(b.title))
            .map((c) => ({ label: c.title, value: c.id })),
        ]}
        onValueChange={(v) => setCourseFilter(v as CourseFilter)}
      />

      <FilterSheet
        title="Sort by"
        open={mobileSortSheetOpen}
        onOpenChange={setMobileSortSheetOpen}
        value={sortKey}
        options={[
          { label: "Last Updated", value: "last_updated" },
          { label: "Date Created", value: "date_created" },
          { label: "Understanding (Low → High)", value: "understanding_low" },
          { label: "Understanding (High → Low)", value: "understanding_high" },
          { label: "Course", value: "course" },
        ]}
        onValueChange={(v) => setSortKey(v as SortKey)}
      />

      <ExportSheet
        open={mobileExportSheetOpen}
        onOpenChange={setMobileExportSheetOpen}
        exporting={exporting}
        onExportPdf={async () => {
          await exportPdf()
          setMobileExportSheetOpen(false)
        }}
        onExportMarkdown={() => {
          exportNotesAsMarkdown(filtered.items)
          setMobileExportSheetOpen(false)
        }}
      />

      <NoteViewerSheet
        note={activeNote}
        open={viewOpen}
        onOpenChange={setViewOpen}
        isMobile={isMobile}
        onEdit={() => {
          setViewOpen(false)
          if (activeNoteId) setEditOpen(true)
        }}
      />

      <CodeViewerSheet
        note={activeNote}
        open={codeOpen}
        onOpenChange={setCodeOpen}
        isMobile={isMobile}
        onEdit={() => {
          setCodeOpen(false)
          if (activeNoteId) setEditOpen(true)
        }}
      />

      <NoteEditorSheet
        mode="create"
        note={null}
        courses={courses}
        open={createOpen}
        onOpenChange={setCreateOpen}
        isMobile={isMobile}
        onSave={(next) => {
          void onCreateNote(next)
        }}
      />

      <NoteEditorSheet
        mode="edit"
        note={activeNote}
        courses={courses}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        onSave={(next) => {
          void onUpdateNote(next)
        }}
      />
    </DashboardShell>
  )
}
