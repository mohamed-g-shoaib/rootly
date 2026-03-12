"use client"

import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import * as React from "react"

import {
  ArrowLeft01Icon,
  Delete01Icon,
  Edit01Icon,
  Link01Icon,
  MoreVerticalIcon,
  AddCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { PageContainer } from "@/components/ui/page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"

import { buildMockCourses } from "./courses-mock-data"
import { LinksViewerSheet } from "./courses-components"
import { totalLinkCount } from "./courses-model"

import type { SortKey, TypeFilter } from "@/app/notes/ui/notes-model"
import { buildMockNotes } from "@/app/notes/ui/notes-mock-data"
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

export default function CourseDetailPage({
  courseId,
  user,
}: {
  courseId: string
  user: User | null
}) {
  const isMobile = useIsMobile()

  const allCourses = React.useMemo(() => buildMockCourses(), [])
  const allNotes = React.useMemo(() => buildMockNotes(), [])
  const course = React.useMemo(
    () => allCourses.find((c) => c.id === courseId) ?? null,
    [allCourses, courseId]
  )

  const [linksOpen, setLinksOpen] = React.useState(false)

  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all")
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
  const [mobileSortSheetOpen, setMobileSortSheetOpen] = React.useState(false)

  const [visibleCount, setVisibleCount] = React.useState(20)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

  const now = React.useMemo(() => new Date("2026-03-10T12:00:00Z"), [])

  const linkCount = course ? totalLinkCount(course) : 0
  const hasLinks = linkCount > 0

  const filtered = React.useMemo(() => {
    const base = allNotes.filter((n) => {
      if (n.courseId !== courseId) return false

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
  }, [allNotes, courseId, flaggedOnly, sortKey, typeFilter])

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

  function clearFilters() {
    setTypeFilter("all")
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

  function toggleFlag(noteId: string) {
    const next = allNotes.map((n) =>
      n.id === noteId
        ? {
            ...n,
            flag: !n.flag,
            updatedAt: now.toISOString(),
          }
        : n
    )

    void next
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
          <Button variant="ghost" onClick={() => void 0} className="gap-2">
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
          <Button variant="ghost" className="gap-2" onClick={() => void 0}>
            <HugeiconsIcon icon={Delete01Icon} size={18} />
            Delete Course
          </Button>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" aria-label="More" />}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => void 0}>
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
            <DropdownMenuItem variant="destructive" onClick={() => void 0}>
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
      <div className="sticky top-0 z-10 border-b bg-background">
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
                <div className="text-xl font-semibold">{course.title}</div>
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
                      <ProgressIndicator
                        style={{ width: `${course.progress}%` }}
                      />
                    </ProgressTrack>
                  </Progress>
                </div>
              </div>
            </div>

            {course.topics.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pt-3">
                {course.topics.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={typeFilter !== "all" ? "secondary" : "outline"}
                  onClick={() => setMobileTypeSheetOpen(true)}
                >
                  Type
                </Button>

                <Button
                  variant={flaggedOnly ? "secondary" : "outline"}
                  onClick={() => setFlaggedOnly((v) => !v)}
                >
                  Flagged
                </Button>

                <Button
                  variant={sortKey !== "last_updated" ? "secondary" : "outline"}
                  onClick={() => setMobileSortSheetOpen(true)}
                >
                  Sort by
                </Button>
              </div>

              {filtered.hasQa ? (
                <Button
                  variant={globalShowAnswers ? "secondary" : "outline"}
                  onClick={() => setGlobalShowAnswers((v) => !v)}
                >
                  {globalShowAnswers ? "Hide All Answers" : "Show All Answers"}
                </Button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.items.length === 0 ? (
                <EmptyState
                  hasAnyNotes={allNotes.length > 0}
                  hasFilters={filtersActive}
                  onNewNote={() => setCreateOpen(true)}
                  onClearFilters={clearFilters}
                />
              ) : (
                visibleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    now={now}
                    isMobile={isMobile}
                    globalShowAnswers={globalShowAnswers}
                    overrideShow={answerOverrides[note.id]}
                    onOverrideChange={(value) =>
                      setAnswerOverrides((prev) => ({
                        ...prev,
                        [note.id]: value,
                      }))
                    }
                    onToggleFlag={() => toggleFlag(note.id)}
                    onEdit={() => openEdit(note.id)}
                    onViewFull={() => openView(note.id)}
                    onViewCode={() => openCode(note.id)}
                    onDelete={() => void 0}
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
        courses={allCourses.map((c) => ({ id: c.id, title: c.title }))}
        open={createOpen}
        onOpenChange={setCreateOpen}
        isMobile={isMobile}
        lockedCourse={{ id: course.id, title: course.title }}
      />

      <NoteEditorSheet
        mode="edit"
        note={activeNote}
        courses={allCourses.map((c) => ({ id: c.id, title: c.title }))}
        open={editOpen}
        onOpenChange={setEditOpen}
        isMobile={isMobile}
        lockedCourse={{ id: course.id, title: course.title }}
      />
    </DashboardShell>
  )
}
