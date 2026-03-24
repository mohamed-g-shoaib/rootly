"use client"

import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import * as React from "react"

import {
  ArrowLeft01Icon,
  Delete01Icon,
  Edit01Icon,
  Flag01Icon,
  Link01Icon,
  MoreVerticalIcon,
  AddCircleIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useAnswerVisibility } from "@/hooks/use-answer-visibility"
import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header"
import { PageContainer } from "@/components/ui/page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toastManager } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"

import { CourseEditorSheet, LinksViewerSheet } from "./courses-components"
import type { Course } from "./courses-model"
import { totalLinkCount } from "./courses-model"

import { deleteCourse, updateCourse } from "./courses-actions"

import type { Note, SortKey, TypeFilter } from "@/app/notes/ui/notes-model"
import {
  EmptyState,
  FilterSheet,
  NoteCard,
} from "@/app/notes/ui/notes-components"
import {
  CodeViewerSheet,
  NoteEditorSheet,
  NoteViewerSheet,
} from "@/app/notes/ui/notes-sheets"

import {
  createNote,
  deleteNote,
  updateNote,
} from "@/app/notes/ui/notes-actions"

export default function CourseDetailPage({
  courseId: _courseId,
  user,
  course,
  initialNotes,
}: {
  courseId: string
  user: User | null
  course: Course | null
  initialNotes: Note[]
}) {
  const isMobile = useIsMobile()

  const [allNotes, setAllNotes] = React.useState<Note[]>(() => initialNotes)

  const [linksOpen, setLinksOpen] = React.useState(false)
  const [editCourseOpen, setEditCourseOpen] = React.useState(false)

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")
  const [flaggedOnly, setFlaggedOnly] = React.useState(false)
  const [sortKey, setSortKey] = React.useState<SortKey>("last_updated")
  const answerVisibility = useAnswerVisibility()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [codeOpen, setCodeOpen] = React.useState(false)
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null)

  const [mobileTypeSheetOpen, setMobileTypeSheetOpen] = React.useState(false)
  const [mobileSortSheetOpen, setMobileSortSheetOpen] = React.useState(false)

  const [deleteCourseOpen, setDeleteCourseOpen] = React.useState(false)

  const [visibleCount, setVisibleCount] = React.useState(20)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

  const now = React.useMemo(() => new Date(), [])

  const linkCount = course ? totalLinkCount(course) : 0
  const hasLinks = linkCount > 0

  const filtered = React.useMemo(() => {
    const base = allNotes.filter((n) => {
      if (typeFilter !== "all" && n.type !== typeFilter) return false
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
  }, [allNotes, flaggedOnly, sortKey, typeFilter])

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
    typeFilter !== "all" || flaggedOnly || sortKey !== "last_updated"

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

  const sortLabel = React.useMemo(() => {
    switch (sortKey) {
      case "date_created":
        return "Date Created"
      case "understanding_low":
        return "Understanding (Low → High)"
      case "understanding_high":
        return "Understanding (High → Low)"
      case "course":
        return "Course"
      default:
        return "Last Updated"
    }
  }, [sortKey])

  const typeLabel = React.useMemo(() => {
    switch (typeFilter) {
      case "qa":
        return "Q&A"
      case "freeform":
        return "Freeform"
      default:
        return "All Types"
    }
  }, [typeFilter])

  function clearFilters() {
    setTypeFilter("all")
    setFlaggedOnly(false)
    setSortKey("last_updated")
  }

  async function onUpdateCourse(next: Course) {
    if (!user) return

    const res = await updateCourse({
      courseId: next.id,
      patch: next,
      userId: user.id,
    })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not update course",
        description: res.error,
      })
      return
    }

    setEditCourseOpen(false)
  }

  async function onDeleteCourse() {
    if (!user) return
    if (!course) return
    const res = await deleteCourse({ courseId: course.id, userId: user.id })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not delete course",
        description: res.error,
      })
      return
    }

    window.location.assign("/courses")
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

  async function onDeleteNote(noteId: string) {
    if (!user) return

    const prev = allNotes
    setAllNotes((items) => items.filter((n) => n.id !== noteId))
    answerVisibility.clearForId(noteId)

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

  async function onSaveNote(next: Note, mode: "create" | "edit") {
    if (!user) return

    if (mode === "create") {
      const optimistic: Note = {
        ...next,
        id: crypto.randomUUID(),
        courseId: course?.id ?? null,
        courseTitle: course?.title ?? null,
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
      return
    }

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

  if (!course) {
    return (
      <DashboardShell user={user}>
        <PageContainer>
          <div className="pt-6">
            <div className="text-lg font-medium">Course not found</div>
            <div className="pt-3">
              <Button render={<Link href="/courses" />}>Back to Courses</Button>
            </div>
          </div>
        </PageContainer>
      </DashboardShell>
    )
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      {!isMobile ? (
        <>
          <Button
            variant="ghost"
            onClick={() => setEditCourseOpen(true)}
            className="gap-2"
          >
            <HugeiconsIcon icon={Edit01Icon} size={18} />
            Edit Course
          </Button>
          {hasLinks ? (
            <Button
              variant="ghost"
              onClick={() => setLinksOpen(true)}
              className="gap-2"
            >
              <HugeiconsIcon icon={Link01Icon} size={18} />
              View Links
            </Button>
          ) : null}
          <AlertDialog
            open={deleteCourseOpen}
            onOpenChange={setDeleteCourseOpen}
          >
            <AlertDialogTrigger
              render={
                <Button variant="ghost" className="gap-2" type="button" />
              }
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} />
              Delete Course
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete course?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the course. Notes will not be
                  deleted — they will be unlinked.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose
                  render={<Button variant="ghost" type="button" />}
                >
                  Cancel
                </AlertDialogClose>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => void onDeleteCourse()}
                >
                  Delete Course
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" aria-label="More" />}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditCourseOpen(true)}>
              <HugeiconsIcon icon={Edit01Icon} size={18} />
              Edit Course
            </DropdownMenuItem>
            {hasLinks ? (
              <DropdownMenuItem onClick={() => setLinksOpen(true)}>
                <HugeiconsIcon icon={Link01Icon} size={18} />
                View Links
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteCourseOpen(true)}
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} />
              Delete Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
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
      <DashboardStickyHeader>
        <PageContainer>
          <div className="py-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                className="gap-2"
                render={<Link href="/courses" />}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                Courses
              </Button>
              {headerActions}
            </div>

            <div className="flex items-start justify-between gap-4 pt-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-xl font-semibold">{course.title}</div>
                  {course.topics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                {course.instructor ? (
                  <div className="pt-1 text-sm text-muted-foreground">
                    {course.instructor}
                  </div>
                ) : null}
              </div>

              <div className="w-56 shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-sm tabular-nums">{course.progress}%</div>
                </div>
                <div className="pt-2">
                  <Progress value={course.progress}>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                  </Progress>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </DashboardStickyHeader>

      <PageContainer>
        <div className="pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {!isMobile ? (
                  <>
                    <Select
                      value={typeFilter}
                      onValueChange={(v) => setTypeFilter(v as TypeFilter)}
                    >
                      <SelectTrigger className="w-40 **:data-[slot=select-icon]:hidden">
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="min-w-0 truncate">{typeLabel}</span>
                          <HugeiconsIcon icon={UnfoldMoreIcon} size={18} />
                        </span>
                      </SelectTrigger>
                      <SelectPopup alignItemWithTrigger={false}>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="qa">Q&A</SelectItem>
                        <SelectItem value="freeform">Freeform</SelectItem>
                      </SelectPopup>
                    </Select>

                    <Select
                      value={sortKey}
                      onValueChange={(v) => setSortKey(v as SortKey)}
                    >
                      <SelectTrigger className="w-44 **:data-[slot=select-icon]:hidden">
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="min-w-0 truncate">{sortLabel}</span>
                          <HugeiconsIcon icon={UnfoldMoreIcon} size={18} />
                        </span>
                      </SelectTrigger>
                      <SelectPopup alignItemWithTrigger={false}>
                        <SelectItem value="last_updated">
                          Last Updated
                        </SelectItem>
                        <SelectItem value="date_created">
                          Date Created
                        </SelectItem>
                        <SelectItem value="understanding_low">
                          Understanding (Low → High)
                        </SelectItem>
                        <SelectItem value="understanding_high">
                          Understanding (High → Low)
                        </SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                      </SelectPopup>
                    </Select>

                    <Button
                      variant={flaggedOnly ? "secondary" : "outline"}
                      size="icon"
                      aria-label={
                        flaggedOnly ? "Show all notes" : "Show flagged notes"
                      }
                      onClick={() => setFlaggedOnly((v) => !v)}
                    >
                      <HugeiconsIcon
                        icon={Flag01Icon}
                        size={18}
                        color={
                          flaggedOnly ? "var(--destructive)" : "currentColor"
                        }
                      />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={typeFilter !== "all" ? "secondary" : "outline"}
                      onClick={() => setMobileTypeSheetOpen(true)}
                    >
                      Type
                    </Button>

                    <Button
                      size="icon"
                      aria-label={
                        flaggedOnly ? "Show all notes" : "Show flagged notes"
                      }
                      variant={flaggedOnly ? "secondary" : "ghost"}
                      onClick={() => setFlaggedOnly((v) => !v)}
                    >
                      <HugeiconsIcon
                        icon={Flag01Icon}
                        size={18}
                        color={
                          flaggedOnly ? "var(--destructive)" : "currentColor"
                        }
                      />
                    </Button>

                    <Button
                      variant={
                        sortKey !== "last_updated" ? "secondary" : "outline"
                      }
                      onClick={() => setMobileSortSheetOpen(true)}
                    >
                      Sort by
                    </Button>
                  </>
                )}
              </div>

              {filtered.hasQa ? (
                <Button
                  variant={globalShowAnswers ? "secondary" : "outline"}
                  onClick={() =>
                    answerVisibility.setAllShown(!globalShowAnswers)
                  }
                >
                  {globalShowAnswers ? "Hide All Answers" : "Show All Answers"}
                </Button>
              ) : null}
            </div>

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
                    showAnswer={answerVisibility.isShown(note.id)}
                    onShowAnswerChange={(value) =>
                      answerVisibility.setShown(note.id, value)
                    }
                    onEdit={() => openEdit(note.id)}
                    onViewFull={() => openView(note.id)}
                    onViewCode={() => openCode(note.id)}
                    onDelete={() => void onDeleteNote(note.id)}
                  />
                ))
              )}

              {loadingMore ? (
                <div className="flex items-center justify-center py-6">
                  <div className="text-sm text-muted-foreground">Loading…</div>
                </div>
              ) : null}

              <div ref={loadMoreRef} />
            </div>
          </div>
        </div>
      </PageContainer>

      <LinksViewerSheet
        course={course}
        open={linksOpen}
        onOpenChange={setLinksOpen}
        isMobile={isMobile}
        onEditCourse={() => {
          setLinksOpen(false)
        }}
      />

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
        courses={course ? [{ id: course.id, title: course.title }] : []}
        open={createOpen}
        onOpenChange={setCreateOpen}
        isMobile={isMobile}
        lockedCourse={
          course ? { id: course.id, title: course.title } : undefined
        }
        onSave={(note) => {
          void onSaveNote(note, "create")
        }}
      />

      <NoteEditorSheet
        mode="edit"
        note={activeNote}
        courses={course ? [{ id: course.id, title: course.title }] : []}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        lockedCourse={
          course ? { id: course.id, title: course.title } : undefined
        }
        onSave={(note) => {
          void onSaveNote(note, "edit")
        }}
      />
      <CourseEditorSheet
        mode="edit"
        course={course}
        open={editCourseOpen}
        onOpenChange={setEditCourseOpen}
        breakpoint={isMobile ? "mobile" : "desktop"}
        onSave={(next) => {
          void onUpdateCourse(next)
        }}
      />
    </DashboardShell>
  )
}
