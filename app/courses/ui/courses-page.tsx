"use client"

import type { User } from "@supabase/supabase-js"
import * as React from "react"

import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useIsMobile } from "@/hooks/use-media-query"

import { DashboardShell } from "@/app/ui/dashboard-shell"
import { PageContainer } from "@/components/ui/page-container"

import type { Course, SortKey, TopicFilter } from "./courses-model"
import { buildMockCourses } from "./courses-mock-data"
import { CoursesHeader } from "./courses-header"
import {
  CourseCard,
  CourseEditorSheet,
  EmptyState,
  FilterSheet,
  LinksViewerSheet,
} from "./courses-components"

export default function CoursesPage({ user }: { user: User | null }) {
  const isMobile = useIsMobile()

  const [courses, setCourses] = React.useState(() => buildMockCourses())

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

  const now = React.useMemo(() => new Date("2026-03-10T12:00:00Z"), [])

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

  function deleteCourse(courseId: string) {
    setCourses((prev) => prev.filter((c) => c.id !== courseId))
    if (activeCourseId === courseId) setActiveCourseId(null)
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
    <DashboardShell
      user={user}
      fab={
        isMobile
          ? {
              ariaLabel: "New course",
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
              <EmptyState
                hasAnyCourses={courses.length > 0}
                hasFilters={filtersActive}
                onNewCourse={() => setCreateOpen(true)}
                onClearFilters={clearFilters}
              />
            ) : (
              filtered.items.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  now={now}
                  onEdit={() => openEdit(course.id)}
                  onViewLinks={() => openLinks(course.id)}
                  onDelete={() => deleteCourse(course.id)}
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
          setCourses((prev) => [next, ...prev])
          setCreateOpen(false)
        }}
      />

      <CourseEditorSheet
        mode="edit"
        course={activeCourse}
        open={editOpen}
        onOpenChange={setEditOpen}
        breakpoint={isMobile ? "mobile" : "desktop"}
        onSave={(next: Course) => {
          setCourses((prev) => prev.map((c) => (c.id === next.id ? next : c)))
          setEditOpen(false)
        }}
      />
    </DashboardShell>
  )
}
