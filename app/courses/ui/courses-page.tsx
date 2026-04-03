"use client"

import * as React from "react"

import {
  AddCircleIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useIsMobile } from "@/hooks/use-media-query"

import { useDashboardShellFab } from "@/app/ui/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { toastManager } from "@/components/ui/toast"

import type { Course, SortKey, TopicFilter } from "./courses-model"
import {
  createCourse,
  deleteCourse,
  getCourseTopics,
  getCoursesPage,
  updateCourse,
} from "./courses-actions"
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
  initialCoursesTotal,
  coursesPageSize,
  initialTopicItems,
}: {
  userId: string | null
  initialCourses: Course[]
  initialCoursesTotal: number
  coursesPageSize: number
  initialTopicItems: string[]
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
  const [coursesTotal, setCoursesTotal] = React.useState(
    () => initialCoursesTotal
  )
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageLoading, setPageLoading] = React.useState(false)
  const [topicItemsState, setTopicItemsState] = React.useState<string[]>(
    () => initialTopicItems
  )

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

  const topicItems = React.useMemo<{ value: TopicFilter; label: string }[]>(
    () => [
      { value: "all", label: "All Topics" },
      ...topicItemsState.map((t) => ({ value: t, label: t })),
    ],
    [topicItemsState]
  )

  const totalPages = Math.max(1, Math.ceil(coursesTotal / coursesPageSize))

  const filtersActive = topicFilter !== "all" || sortKey !== "last_updated"

  const activeCourse = React.useMemo(
    () =>
      activeCourseId
        ? (courses.find((c) => c.id === activeCourseId) ?? null)
        : null,
    [activeCourseId, courses]
  )

  const loadCoursesPage = React.useCallback(
    async (page: number) => {
      if (!userId) return

      setPageLoading(true)
      try {
        const result = await getCoursesPage({
          page,
          pageSize: coursesPageSize,
          sortKey,
          topicFilter,
          userId,
        })

        if (!result.success) {
          toastManager.add({
            type: "error",
            title: "Could not load courses",
            description: result.error,
          })
          return
        }

        setCourses(result.data)
        setCoursesTotal(result.totalCount)
        setCurrentPage(page)
      } finally {
        setPageLoading(false)
      }
    },
    [coursesPageSize, sortKey, topicFilter, userId]
  )

  React.useEffect(() => {
    if (!userId) return
    void loadCoursesPage(1)
  }, [loadCoursesPage, userId])

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
    if (activeCourseId === courseId) setActiveCourseId(null)

    const res = await deleteCourse({ courseId, userId })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not delete course",
        description: res.error,
      })
      return
    }

    const nextPage =
      courses.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage
    await loadCoursesPage(nextPage)
  }

  async function onCreateCourse(draft: Course) {
    if (!userId) return

    const optimistic: Course = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCreateOpen(false)

    const res = await createCourse({ course: optimistic, userId })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not create course",
        description: res.error,
      })
      return
    }

    await loadCoursesPage(1)
    const topicsResult = await getCourseTopics({ userId })
    if (topicsResult.success) {
      setTopicItemsState(topicsResult.topics)
    }
  }

  async function onUpdateCourse(next: Course) {
    if (!userId) return

    setEditOpen(false)

    const res = await updateCourse({
      courseId: next.id,
      patch: next,
      userId,
    })
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not update course",
        description: res.error,
      })
      return
    }

    await loadCoursesPage(currentPage)
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
        <div className="flex min-h-[calc(100vh-14rem)] flex-col pt-4 pb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coursesTotal === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  hasAnyCourses={coursesTotal > 0}
                  hasFilters={filtersActive}
                  onNewCourse={() => setCreateOpen(true)}
                  onClearFilters={clearFilters}
                />
              </div>
            ) : (
              courses.map((course) => (
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

          {coursesTotal > 0 ? (
            <div className="mt-auto flex items-center justify-start gap-2 pt-6">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  void loadCoursesPage(Math.max(1, currentPage - 1))
                }}
                disabled={currentPage <= 1 || pageLoading}
                aria-label="Previous page"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  void loadCoursesPage(Math.min(totalPages, currentPage + 1))
                }}
                disabled={currentPage >= totalPages || pageLoading}
                aria-label="Next page"
              >
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
              </Button>
            </div>
          ) : null}
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
