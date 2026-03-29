"use client"

import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useAnswerVisibility } from "@/hooks/use-answer-visibility"
import { useIsMobile } from "@/hooks/use-media-query"

import { useDashboardShellFab } from "@/app/ui/dashboard-shell"
import { PageContainer } from "@/components/ui/page-container"
import { toastManager } from "@/components/ui/toast"

import { Spinner } from "@/components/ui/spinner"

import type { CourseFilter, Note, SortKey, TypeFilter } from "./notes-model"
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
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
  userId,
  initialNotes,
  initialCourses,
}: {
  userId: string | null
  initialNotes: Note[]
  initialCourses: { id: string; title: string }[]
}) {
  const isMobile = useIsMobile()
  const shellFab = React.useMemo(
    () =>
      isMobile
        ? {
            ariaLabel: "New note",
            icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
            onClick: () => setCreateOpen(true),
          }
        : undefined,
    [isMobile]
  )
  useDashboardShellFab(shellFab)

  const [courses] = React.useState(() => initialCourses)
  const [allNotes, setAllNotes] = React.useState<Note[]>(() => initialNotes)

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")
  const [courseFilter, setCourseFilter] = React.useState<CourseFilter>("all")
  const [flaggedOnly, setFlaggedOnly] = React.useState(false)
  const [sortKey, setSortKey] = React.useState<SortKey>("last_updated")
  const answerVisibility = useAnswerVisibility()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [codeOpen, setCodeOpen] = React.useState(false)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)
  const [loadingNoteId, setLoadingNoteId] = React.useState<string | null>(null)
  const [exportingFullNotes, setExportingFullNotes] = React.useState(false)

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
  const activeNoteLoading =
    loadingNoteId != null && activeNoteId === loadingNoteId

  const filtersActive =
    typeFilter !== "all" ||
    courseFilter !== "all" ||
    flaggedOnly ||
    sortKey !== "last_updated"

  const qaNoteIds = React.useMemo(
    () =>
      filtered.items
        .filter((note) => note.type === "qa")
        .map((note) => note.id),
    [filtered.items]
  )

  const globalShowAnswers =
    qaNoteIds.length > 0 &&
    qaNoteIds.every((id) => answerVisibility.isShown(id))

  function clearFilters() {
    setTypeFilter("all")
    setCourseFilter("all")
    setFlaggedOnly(false)
    setSortKey("last_updated")
  }

  async function ensureNoteDetails(noteId: string) {
    const existing = allNotes.find((note) => note.id === noteId)
    if (!userId || !existing || existing.detailsLoaded) {
      return existing ?? null
    }

    setLoadingNoteId(noteId)
    const res = await getNote({ noteId, userId })
    setLoadingNoteId((current) => (current === noteId ? null : current))

    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not load note",
        description: res.error,
      })
      return null
    }

    setAllNotes((items) =>
      items.map((note) => (note.id === noteId ? res.data : note))
    )

    return res.data
  }

  async function ensureNotesDetails(noteIds: string[]) {
    if (!userId) return []

    const missingNoteIds = noteIds.filter((noteId) => {
      const note = allNotes.find((candidate) => candidate.id === noteId)
      return note != null && !note.detailsLoaded
    })

    if (missingNoteIds.length === 0) {
      return allNotes.filter((note) => noteIds.includes(note.id))
    }

    const res = await getNotes({ noteIds: missingNoteIds, userId })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not load notes",
        description: res.error,
      })
      return []
    }

    const fetchedById = new Map(res.data.map((note) => [note.id, note] as const))

    setAllNotes((items) =>
      items.map((note) => fetchedById.get(note.id) ?? note)
    )

    return noteIds
      .map((noteId) => fetchedById.get(noteId) ?? allNotes.find((note) => note.id === noteId))
      .filter((note): note is Note => note != null)
  }

  async function openView(noteId: string) {
    setActiveNoteId(noteId)
    setViewOpen(true)
    await ensureNoteDetails(noteId)
  }

  async function openCode(noteId: string) {
    setActiveNoteId(noteId)
    setCodeOpen(true)
    await ensureNoteDetails(noteId)
  }

  async function openEdit(noteId: string) {
    setActiveNoteId(noteId)
    setEditOpen(true)
    await ensureNoteDetails(noteId)
  }

  async function onDeleteNote(noteId: string) {
    if (!userId) return

    const prev = allNotes

    setAllNotes((items) => items.filter((n) => n.id !== noteId))
    answerVisibility.clearForId(noteId)

    const res = await deleteNote({ noteId, userId })
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
    if (!userId) return

    const optimistic: Note = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const prev = allNotes

    setAllNotes((items) => [optimistic, ...items])
    setCreateOpen(false)

    const res = await createNote({ note: optimistic, userId })
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
    if (!userId) return

    const prev = allNotes

    setAllNotes((items) => items.map((n) => (n.id === next.id ? next : n)))
    setEditOpen(false)

    const res = await updateNote({
      noteId: next.id,
      patch: next,
      userId,
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

  async function exportFilteredNotesAsPdf() {
    setExportingFullNotes(true)
    try {
      const notes = await ensureNotesDetails(filtered.items.map((note) => note.id))
      if (notes.length > 0) {
        await exportPdf(notes)
      }
    } finally {
      setExportingFullNotes(false)
    }
  }

  async function exportFilteredNotesAsMarkdown() {
    setExportingFullNotes(true)
    try {
      const notes = await ensureNotesDetails(filtered.items.map((note) => note.id))
      if (notes.length > 0) {
        exportNotesAsMarkdown(notes)
      }
    } finally {
      setExportingFullNotes(false)
    }
  }

  return (
    <>
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
        onToggleGlobalAnswers={() => answerVisibility.setAllShown(!globalShowAnswers)}
        onNewNote={() => setCreateOpen(true)}
        onClearFilters={clearFilters}
        onOpenMobileType={() => setMobileTypeSheetOpen(true)}
        onOpenMobileCourse={() => setMobileCourseSheetOpen(true)}
        onOpenMobileSort={() => setMobileSortSheetOpen(true)}
        onOpenMobileExport={() => setMobileExportSheetOpen(true)}
        onExportPdf={() => {
          void exportFilteredNotesAsPdf()
        }}
        onExportMarkdown={() => {
          void exportFilteredNotesAsMarkdown()
        }}
        exporting={exporting || exportingFullNotes}
      />

      <NotesGridSection
        allNotesCount={allNotes.length}
        filtersActive={filtersActive}
        filteredItemsCount={filtered.items.length}
        visibleNotes={visibleNotes}
        now={now}
        isMobile={isMobile}
        answerVisibility={answerVisibility}
        loadingMore={loadingMore}
        loadMoreRef={loadMoreRef}
        onNewNote={() => setCreateOpen(true)}
        onClearFilters={clearFilters}
        onEdit={openEdit}
        onViewFull={openView}
        onViewCode={openCode}
        onDelete={onDeleteNote}
      />

      <NotesFilterSheets
        courses={courses}
        typeFilter={typeFilter}
        courseFilter={courseFilter}
        sortKey={sortKey}
        mobileTypeSheetOpen={mobileTypeSheetOpen}
        mobileCourseSheetOpen={mobileCourseSheetOpen}
        mobileSortSheetOpen={mobileSortSheetOpen}
        onTypeOpenChange={setMobileTypeSheetOpen}
        onCourseOpenChange={setMobileCourseSheetOpen}
        onSortOpenChange={setMobileSortSheetOpen}
        onTypeChange={setTypeFilter}
        onCourseChange={setCourseFilter}
        onSortChange={setSortKey}
      />

      <NotesOverlaySheets
        activeNote={activeNote}
        activeNoteId={activeNoteId}
        activeNoteLoading={activeNoteLoading}
        courses={courses}
        isMobile={isMobile}
        createOpen={createOpen}
        editOpen={editOpen}
        viewOpen={viewOpen}
        codeOpen={codeOpen}
        mobileExportSheetOpen={mobileExportSheetOpen}
        exporting={exporting || exportingFullNotes}
        onCreateOpenChange={setCreateOpen}
        onEditOpenChange={setEditOpen}
        onViewOpenChange={setViewOpen}
        onCodeOpenChange={setCodeOpen}
        onMobileExportOpenChange={setMobileExportSheetOpen}
        onOpenEdit={openEdit}
        onCreateNote={onCreateNote}
        onUpdateNote={onUpdateNote}
        onExportPdf={async () => {
          await exportFilteredNotesAsPdf()
          setMobileExportSheetOpen(false)
        }}
        onExportMarkdown={async () => {
          await exportFilteredNotesAsMarkdown()
          setMobileExportSheetOpen(false)
        }}
      />
    </>
  )
}

function NotesGridSection({
  allNotesCount,
  filtersActive,
  filteredItemsCount,
  visibleNotes,
  now,
  isMobile,
  answerVisibility,
  loadingMore,
  loadMoreRef,
  onNewNote,
  onClearFilters,
  onEdit,
  onViewFull,
  onViewCode,
  onDelete,
}: {
  allNotesCount: number
  filtersActive: boolean
  filteredItemsCount: number
  visibleNotes: Note[]
  now: Date
  isMobile: boolean
  answerVisibility: ReturnType<typeof useAnswerVisibility>
  loadingMore: boolean
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  onNewNote: () => void
  onClearFilters: () => void
  onEdit: (noteId: string) => Promise<void>
  onViewFull: (noteId: string) => Promise<void>
  onViewCode: (noteId: string) => Promise<void>
  onDelete: (noteId: string) => Promise<void>
}) {
  return (
    <PageContainer>
      <div className="pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItemsCount === 0 ? (
            <div className="col-span-full">
              <EmptyState
                hasAnyNotes={allNotesCount > 0}
                hasFilters={filtersActive}
                onNewNote={onNewNote}
                onClearFilters={onClearFilters}
              />
            </div>
          ) : (
            visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                now={now}
                isMobile={isMobile}
                showAnswer={answerVisibility.isShown(note.id)}
                onShowAnswerChange={(value) => answerVisibility.setShown(note.id, value)}
                onEdit={() => void onEdit(note.id)}
                onViewFull={() => void onViewFull(note.id)}
                onViewCode={() => void onViewCode(note.id)}
                onDelete={() => void onDelete(note.id)}
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
  )
}

function NotesFilterSheets({
  courses,
  typeFilter,
  courseFilter,
  sortKey,
  mobileTypeSheetOpen,
  mobileCourseSheetOpen,
  mobileSortSheetOpen,
  onTypeOpenChange,
  onCourseOpenChange,
  onSortOpenChange,
  onTypeChange,
  onCourseChange,
  onSortChange,
}: {
  courses: { id: string; title: string }[]
  typeFilter: TypeFilter
  courseFilter: CourseFilter
  sortKey: SortKey
  mobileTypeSheetOpen: boolean
  mobileCourseSheetOpen: boolean
  mobileSortSheetOpen: boolean
  onTypeOpenChange: (open: boolean) => void
  onCourseOpenChange: (open: boolean) => void
  onSortOpenChange: (open: boolean) => void
  onTypeChange: (value: TypeFilter) => void
  onCourseChange: (value: CourseFilter) => void
  onSortChange: (value: SortKey) => void
}) {
  return (
    <>
      <FilterSheet
        title="Type"
        open={mobileTypeSheetOpen}
        onOpenChange={onTypeOpenChange}
        value={typeFilter}
        options={[
          { label: "All Types", value: "all" },
          { label: "Q&A", value: "qa" },
          { label: "Freeform", value: "freeform" },
        ]}
        onValueChange={(v) => onTypeChange(v as TypeFilter)}
      />

      <FilterSheet
        title="Course"
        open={mobileCourseSheetOpen}
        onOpenChange={onCourseOpenChange}
        value={courseFilter}
        options={[
          { label: "All Courses", value: "all" },
          { label: "No course", value: "none" },
          ...courses
            .toSorted((a, b) => a.title.localeCompare(b.title))
            .map((c) => ({ label: c.title, value: c.id })),
        ]}
        onValueChange={(v) => onCourseChange(v as CourseFilter)}
      />

      <FilterSheet
        title="Sort by"
        open={mobileSortSheetOpen}
        onOpenChange={onSortOpenChange}
        value={sortKey}
        options={[
          { label: "Last Updated", value: "last_updated" },
          { label: "Date Created", value: "date_created" },
          { label: "Understanding (Low → High)", value: "understanding_low" },
          { label: "Understanding (High → Low)", value: "understanding_high" },
          { label: "Course", value: "course" },
        ]}
        onValueChange={(v) => onSortChange(v as SortKey)}
      />
    </>
  )
}

function NotesOverlaySheets({
  activeNote,
  activeNoteId,
  activeNoteLoading,
  courses,
  isMobile,
  createOpen,
  editOpen,
  viewOpen,
  codeOpen,
  mobileExportSheetOpen,
  exporting,
  onCreateOpenChange,
  onEditOpenChange,
  onViewOpenChange,
  onCodeOpenChange,
  onMobileExportOpenChange,
  onOpenEdit,
  onCreateNote,
  onUpdateNote,
  onExportPdf,
  onExportMarkdown,
}: {
  activeNote: Note | null
  activeNoteId: string | null
  activeNoteLoading: boolean
  courses: { id: string; title: string }[]
  isMobile: boolean
  createOpen: boolean
  editOpen: boolean
  viewOpen: boolean
  codeOpen: boolean
  mobileExportSheetOpen: boolean
  exporting: boolean
  onCreateOpenChange: (open: boolean) => void
  onEditOpenChange: (open: boolean) => void
  onViewOpenChange: (open: boolean) => void
  onCodeOpenChange: (open: boolean) => void
  onMobileExportOpenChange: (open: boolean) => void
  onOpenEdit: (noteId: string) => Promise<void>
  onCreateNote: (note: Note) => Promise<void>
  onUpdateNote: (note: Note) => Promise<void>
  onExportPdf: () => Promise<void>
  onExportMarkdown: () => Promise<void>
}) {
  return (
    <>
      <ExportSheet
        open={mobileExportSheetOpen}
        onOpenChange={onMobileExportOpenChange}
        exporting={exporting}
        onExportPdf={() => {
          void onExportPdf()
        }}
        onExportMarkdown={() => {
          void onExportMarkdown()
        }}
      />

      <NoteViewerSheet
        note={activeNote}
        open={viewOpen}
        onOpenChange={onViewOpenChange}
        isMobile={isMobile}
        loading={activeNoteLoading}
        onEdit={() => {
          onViewOpenChange(false)
          if (activeNoteId) void onOpenEdit(activeNoteId)
        }}
      />

      <CodeViewerSheet
        note={activeNote}
        open={codeOpen}
        onOpenChange={onCodeOpenChange}
        isMobile={isMobile}
        loading={activeNoteLoading}
        onEdit={() => {
          onCodeOpenChange(false)
          if (activeNoteId) void onOpenEdit(activeNoteId)
        }}
      />

      <NoteEditorSheet
        mode="create"
        note={null}
        courses={courses}
        open={createOpen}
        onOpenChange={onCreateOpenChange}
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
        onOpenChange={onEditOpenChange}
        isMobile={isMobile}
        loading={activeNoteLoading}
        onSave={(next) => {
          void onUpdateNote(next)
        }}
      />
    </>
  )
}
