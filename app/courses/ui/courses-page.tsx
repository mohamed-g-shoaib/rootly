"use client"

import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useIsMobile } from "@/hooks/use-media-query"

import { useDashboardShellFab } from "@/app/ui/dashboard-shell"
import { PageContainer } from "@/components/ui/page-container"
import { toastManager } from "@/components/ui/toast"

import type { Course, SortKey, TopicFilter } from "./courses-model"
import { createCourse, deleteCourse, updateCourse } from "./courses-actions"
import { CoursesHeader } from "./courses-header"
import {
  CourseCard,
  CourseEditorSheet,
  EmptyState,
  FilterSheet,
  LinksViewerSheet,
} from "./courses-components"

export default function CoursesPage({
  userId,
  initialCourses,
}: {
  userId: string | null
  initialCourses: Course[]
}) {
  const isMobile = useIsMobile()
  const shellFab = React.useMemo(
    () =>
      isMobile
        ? {
            ariaLabel: "New course",
            icon: <HugeiconsIcon icon={AddCircleIcon} size={20} />,
            onClick: () => setCreateOpen(true),
          }
        : undefined,
    [isMobile]
  )
  useDashboardShellFab(shellFab)

  const [courses, setCourses] = React.useState<Course[]>(() => initialCourses)

  const [topicFilter, setTopicFilter] = React.useState<TopicFilter>("all")
  const [sortKey, setSortKey] = React.useState<SortKey>("last_updated")

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [linksOpen, setLinksOpen] = React.useState(false)
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(
    null
  )

  const [mobileTopicSheetOpen, setMobileTopicSheetOpen] = React.useState(false)
  const [mobileSortSheetOpen, setMobileSortSheetOpen] = React.useState(false)

  const now = React.useMemo(() => new Date(), [])

  const topicItems = React.useMemo(() => {
    const unique = new Set<string>()
    for (const course of courses) {
      for (const t of course.topics) unique.add(t)
    }
    const items = Array.from(unique)
      .toSorted((a, b) => a.localeCompare(b))
      .map((t) => ({ value: t, label: t }))

    return [{ value: "all" as const, label: "All Topics" }, ...items]
  }, [courses])

  const filtered = React.useMemo(() => {
    const base = courses.filter((c) => {
      if (topicFilter !== "all" && !c.topics.includes(topicFilter)) return false
      return true
    })

    const sorted = base.toSorted((a, b) => {
      if (sortKey === "alphabetical") return a.title.localeCompare(b.title)
      if (sortKey === "date_created")
        return b.createdAt.localeCompare(a.createdAt)
      if (sortKey === "progress_low") return a.progress - b.progress
      if (sortKey === "progress_high") return b.progress - a.progress
      return b.updatedAt.localeCompare(a.updatedAt)
    })

    return { items: sorted }
  }, [courses, sortKey, topicFilter])

  const filtersActive = topicFilter !== "all" || sortKey !== "last_updated"

  const activeCourse = React.useMemo(
    () =>
      activeCourseId
        ? (courses.find((c) => c.id === activeCourseId) ?? null)
        : null,
    [activeCourseId, courses]
  )

  function clearFilters() {
    setTopicFilter("all")
    setSortKey("last_updated")
  }

  function openLinks(courseId: string) {
    setActiveCourseId(courseId)
    setLinksOpen(true)
  }

  function openEdit(courseId: string) {
    setActiveCourseId(courseId)
    setEditOpen(true)
  }

  async function onDeleteCourse(courseId: string) {
    if (!userId) return

    const prev = courses

    setCourses((items) => items.filter((c) => c.id !== courseId))
    if (activeCourseId === courseId) setActiveCourseId(null)

    const res = await deleteCourse({ courseId, userId })
    if (!res.success) {
      setCourses(prev)
      toastManager.add({
        type: "error",
        title: "Could not delete course",
        description: res.error,
      })
    }
  }

  async function onCreateCourse(draft: Course) {
    if (!userId) return

    const optimistic: Course = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const prev = courses

    setCourses((items) => [optimistic, ...items])
    setCreateOpen(false)

    const res = await createCourse({ course: optimistic, userId })
    if (!res.success) {
      setCourses(prev)
      toastManager.add({
        type: "error",
        title: "Could not create course",
        description: res.error,
      })
      return
    }

    setCourses((items) =>
      items.map((c) => (c.id === optimistic.id ? res.data : c))
    )
  }

  async function onUpdateCourse(next: Course) {
    if (!userId) return

    const prev = courses

    setCourses((items) => items.map((c) => (c.id === next.id ? next : c)))
    setEditOpen(false)

    const res = await updateCourse({
      courseId: next.id,
      patch: next,
      userId,
    })
    if (!res.success) {
      setCourses(prev)
      toastManager.add({
        type: "error",
        title: "Could not update course",
        description: res.error,
      })
      return
    }

    setCourses((items) => items.map((c) => (c.id === next.id ? res.data : c)))
  }

  const header = (
    <CoursesHeader
      isMobile={isMobile}
      topicItems={topicItems}
      topicFilter={topicFilter}
      sortKey={sortKey}
      filtersActive={filtersActive}
      onTopicChange={setTopicFilter}
      onSortChange={setSortKey}
      onNewCourse={() => setCreateOpen(true)}
      onClearFilters={clearFilters}
      onOpenMobileTopic={() => setMobileTopicSheetOpen(true)}
      onOpenMobileSort={() => setMobileSortSheetOpen(true)}
    />
  )

  return (
    <>
      {header}

      <PageContainer>
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.items.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  hasAnyCourses={courses.length > 0}
                  hasFilters={filtersActive}
                  onNewCourse={() => setCreateOpen(true)}
                  onClearFilters={clearFilters}
                />
              </div>
            ) : (
              filtered.items.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  now={now}
                  isMobile={isMobile}
                  onEdit={() => openEdit(course.id)}
                  onViewLinks={() => openLinks(course.id)}
                  onDelete={() => void onDeleteCourse(course.id)}
                />
              ))
            )}
          </div>
        </div>
      </PageContainer>

      <FilterSheet
        title="Topic"
        open={mobileTopicSheetOpen}
        onOpenChange={setMobileTopicSheetOpen}
        value={topicFilter}
        options={topicItems.map((t) => ({ label: t.label, value: t.value }))}
        onValueChange={(v) => setTopicFilter(v as TopicFilter)}
      />

      <FilterSheet
        title="Sort by"
        open={mobileSortSheetOpen}
        onOpenChange={setMobileSortSheetOpen}
        value={sortKey}
        options={[
          { label: "Last Updated", value: "last_updated" },
          { label: "Date Created", value: "date_created" },
          { label: "Progress (Low → High)", value: "progress_low" },
          { label: "Progress (High → Low)", value: "progress_high" },
          { label: "Alphabetical", value: "alphabetical" },
        ]}
        onValueChange={(v) => setSortKey(v as SortKey)}
      />

      <LinksViewerSheet
        course={activeCourse}
        open={linksOpen}
        onOpenChange={setLinksOpen}
        isMobile={isMobile}
        onEditCourse={() => {
          setLinksOpen(false)
          if (activeCourseId) setEditOpen(true)
        }}
      />

      <CourseEditorSheet
        mode="create"
        course={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        breakpoint={isMobile ? "mobile" : "desktop"}
        onSave={(next: Course) => {
          void onCreateCourse(next)
        }}
      />

      <CourseEditorSheet
        mode="edit"
        course={activeCourse}
        open={editOpen}
        onOpenChange={setEditOpen}
        breakpoint={isMobile ? "mobile" : "desktop"}
        onSave={(next: Course) => {
          void onUpdateCourse(next)
        }}
      />
    </>
  )
}
