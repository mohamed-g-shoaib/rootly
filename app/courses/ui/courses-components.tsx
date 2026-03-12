"use client"

import Link from "next/link"
import * as React from "react"

import {
  AddCircleIcon,
  Cancel01Icon,
  CourseIcon,
  Delete01Icon,
  Edit01Icon,
  FilterIcon,
  Link01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

import { useReducedMotion } from "motion/react"
import type { Course } from "./courses-model"
import { isValidUrl } from "./courses-model"

export function CourseEditorSheet({
  mode,
  course,
  open,
  onOpenChange,
  breakpoint,
  onSave,
}: {
  mode: "create" | "edit"
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
  breakpoint: "mobile" | "tablet" | "desktop"
  onSave: (course: Course) => void
}) {
  const [discardOpen, setDiscardOpen] = React.useState(false)

  const [title, setTitle] = React.useState("")
  const [instructor, setInstructor] = React.useState("")
  const [courseLink, setCourseLink] = React.useState("")
  const [links, setLinks] = React.useState<string[]>([])
  const [topics, setTopics] = React.useState<string[]>([])
  const [topicDraft, setTopicDraft] = React.useState("")
  const [progress, setProgress] = React.useState(0)

  const [courseLinkInvalid, setCourseLinkInvalid] = React.useState(false)
  const [linkInvalidByIndex, setLinkInvalidByIndex] = React.useState<
    Record<number, boolean>
  >({})

  const isMobile = breakpoint === "mobile"
  const side = isMobile ? "bottom" : "right"
  const shouldReduceMotion = useReducedMotion()

  const _initial = shouldReduceMotion ? undefined : { opacity: 0, y: 10 }
  const _animate = shouldReduceMotion ? undefined : { opacity: 1, y: 0 }

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (
            !next &&
            (title !== (course?.title ?? "") ||
              instructor !== (course?.instructor ?? "") ||
              courseLink !== (course?.courseLink ?? "") ||
              JSON.stringify(links) !== JSON.stringify(course?.links ?? []) ||
              JSON.stringify(topics) !== JSON.stringify(course?.topics ?? []) ||
              progress !== (course?.progress ?? 0))
          ) {
            setDiscardOpen(true)
          } else {
            onOpenChange(next)
          }
        }}
      >
        <SheetPopup side={side} variant="inset">
          <Form className="h-full gap-0">
            <SheetHeader>
              <SheetTitle>
                {mode === "create" ? "New Course" : "Edit Course"}
              </SheetTitle>
            </SheetHeader>
            <SheetPanel className="px-4 pb-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Course Title</Label>
                  <Input
                    value={title}
                    placeholder="e.g. Machine Learning Fundamentals"
                    onValueChange={(v) => setTitle(v)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Instructor</Label>
                  <Input
                    value={instructor}
                    placeholder="e.g. Andrew Ng"
                    onValueChange={(v) => setInstructor(v)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Main Course URL</Label>
                  <Input
                    value={courseLink}
                    placeholder="https://..."
                    aria-invalid={courseLinkInvalid}
                    onBlur={() => setCourseLinkInvalid(!isValidUrl(courseLink))}
                    onValueChange={(v) => {
                      setCourseLink(v)
                      if (courseLinkInvalid) setCourseLinkInvalid(false)
                    }}
                  />
                  {courseLinkInvalid ? (
                    <div className="text-sm text-destructive-foreground">
                      Enter a valid URL.
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Additional Links</Label>
                  <div className="flex flex-col gap-2">
                    {links.map((value, index) => (
                      <div
                        key={`link_${index}`}
                        className="flex items-center gap-2"
                      >
                        <Input
                          id={`link_${index}`}
                          value={value}
                          placeholder="https://..."
                          aria-invalid={linkInvalidByIndex[index] ?? false}
                          onBlur={() =>
                            setLinkInvalidByIndex((prev) => ({
                              ...prev,
                              [index]: !isValidUrl(value),
                            }))
                          }
                          onValueChange={(v) => {
                            setLinks((prev) =>
                              prev.map((x, i) => (i === index ? v : x))
                            )
                            if (linkInvalidByIndex[index])
                              setLinkInvalidByIndex((prev) => ({
                                ...prev,
                                [index]: false,
                              }))
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove link"
                          onClick={() => {
                            setLinks((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="gap-2 self-start"
                    onClick={() => {
                      setLinks((prev) => [...prev, ""])
                    }}
                  >
                    <HugeiconsIcon icon={AddCircleIcon} size={18} />
                    Add link
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Topics</Label>
                  <div className="flex flex-wrap gap-2">
                    {(topics ?? []).map((t) => (
                      <Badge key={t} variant="outline">
                        <span className="flex items-center gap-1">
                          {t}
                          <button
                            type="button"
                            className="inline-flex cursor-pointer"
                            aria-label={`Remove topic ${t}`}
                            onClick={() =>
                              setTopics((prev) => prev.filter((x) => x !== t))
                            }
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={16} />
                          </button>
                        </span>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={topicDraft}
                    placeholder="Type a topic and press Enter..."
                    onValueChange={(v) => setTopicDraft(v)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault()
                        if (topicDraft.trim()) {
                          setTopics((prev) => {
                            if (prev.includes(topicDraft.trim())) return prev
                            return [...prev, topicDraft.trim()]
                          })
                          setTopicDraft("")
                        }
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Progress</Label>
                    <div className="text-sm tabular-nums">{progress}%</div>
                  </div>
                  <Slider
                    value={progress}
                    onValueChange={(v) =>
                      setProgress(Array.isArray(v) ? (v[0] ?? 0) : v)
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </SheetPanel>
            <SheetFooter>
              <SheetClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </SheetClose>
              <Button
                type="button"
                onClick={() => {
                  if (!title.trim()) return
                  onSave({
                    ...course,
                    id: course?.id ?? `course_${Date.now()}`,
                    title: title.trim(),
                    instructor: instructor.trim(),
                    courseLink: courseLink.trim(),
                    links,
                    topics,
                    progress,
                    createdAt: course?.createdAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  } as Course)
                }}
                disabled={
                  !title.trim() ||
                  Object.values(linkInvalidByIndex).some(Boolean) ||
                  (mode === "edit" &&
                    title === course?.title &&
                    instructor === (course?.instructor ?? "") &&
                    courseLink === (course?.courseLink ?? "") &&
                    JSON.stringify(links) ===
                      JSON.stringify(course?.links ?? []) &&
                    JSON.stringify(topics) ===
                      JSON.stringify(course?.topics ?? []) &&
                    progress === course?.progress)
                }
              >
                {mode === "create" ? "Save Course" : "Save Changes"}
              </Button>
            </SheetFooter>
          </Form>
        </SheetPopup>
      </Sheet>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" type="button" />}>
              Cancel
            </AlertDialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setDiscardOpen(false)
                onOpenChange(false)
              }}
            >
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function EmptyState({
  hasAnyCourses,
  hasFilters,
  onNewCourse,
  onClearFilters,
}: {
  hasAnyCourses: boolean
  hasFilters: boolean
  onNewCourse: () => void
  onClearFilters: () => void
}) {
  if (!hasAnyCourses) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={CourseIcon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No courses yet</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Add your first course to start organizing your notes and tracking
          progress.
        </div>
        <Button onClick={onNewCourse} className="mt-2">
          New Course
        </Button>
      </div>
    )
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={FilterIcon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No courses match your filters</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Try adjusting your search or clearing the topic filters.
        </div>
        <Button variant="ghost" onClick={onClearFilters} className="mt-2">
          Clear filters
        </Button>
      </div>
    )
  }

  return null
}

export function CourseCard({
  course,
  now: _now,
  onEdit,
  onViewLinks,
  onDelete,
}: {
  course: Course
  now: Date
  onEdit: () => void
  onViewLinks: () => void
  onDelete: () => void
}) {
  const showTopics = course.topics.length > 0
  const visibleTopics = course.topics.slice(0, 3)
  const remainingTopics = Math.max(
    0,
    course.topics.length - visibleTopics.length
  )
  const hasLinks = Boolean(course.courseLink) || course.links.length > 0

  return (
    <div className="h-[220px]">
      <Card className="h-full p-4">
        <div className="flex h-full flex-col gap-3">
          <div className="shrink-0">
            <div className="flex flex-col gap-1">
              {course.instructor ? (
                <div className="truncate text-xs text-muted-foreground">
                  {course.instructor}
                </div>
              ) : null}

              <Link href={`/courses/${course.id}`} className="min-w-0 flex-1">
                <div className="line-clamp-2 font-medium">{course.title}</div>
              </Link>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-sm tabular-nums">{course.progress}%</div>
            </div>
            <div>
              <Progress value={course.progress}>
                <ProgressTrack>
                  <ProgressIndicator style={{ width: `${course.progress}%` }} />
                </ProgressTrack>
              </Progress>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-2 pt-2">
            <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
              {showTopics ? (
                <>
                  {visibleTopics.map((t) => (
                    <Badge key={t} variant="outline" className="shrink-0">
                      {t}
                    </Badge>
                  ))}
                  {remainingTopics > 0 ? (
                    <PreviewCard>
                      <PreviewCardTrigger
                        render={
                          <Badge
                            variant="outline"
                            className="shrink-0 cursor-pointer"
                          />
                        }
                      >
                        +{remainingTopics} more
                      </PreviewCardTrigger>
                      <PreviewCardPopup>
                        <div className="flex flex-wrap gap-1.5">
                          {course.topics.map((t) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </PreviewCardPopup>
                    </PreviewCard>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {hasLinks ? (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="View links"
                  onClick={onViewLinks}
                >
                  <HugeiconsIcon icon={Link01Icon} size={18} />
                </Button>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" aria-label="More" />
                  }
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <HugeiconsIcon icon={Edit01Icon} size={18} />
                    Edit
                  </DropdownMenuItem>
                  {hasLinks ? (
                    <DropdownMenuItem onClick={onViewLinks}>
                      <HugeiconsIcon icon={Link01Icon} size={18} />
                      View links
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DeleteDialog onDelete={onDelete}>
                    <DropdownMenuItem variant="destructive">
                      <HugeiconsIcon icon={Delete01Icon} size={18} />
                      Delete
                    </DropdownMenuItem>
                  </DeleteDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function DeleteDialog({
  children,
  onDelete,
}: {
  children: React.ReactNode
  onDelete: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        nativeButton={false}
        render={children as React.ReactElement}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete course?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the course. Your notes linked to this
            course will not be deleted — they will simply be unlinked from it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <Button variant="destructive" onClick={onDelete}>
            Delete Course
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function FilterSheet({
  title,
  open,
  onOpenChange,
  value,
  options,
  onValueChange,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  options: { label: string; value: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            <div className="flex flex-col gap-2">
              {options.map((o) => (
                <Button
                  key={o.value}
                  variant={o.value === value ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    onValueChange(o.value)
                    onOpenChange(false)
                  }}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}

export function LinksViewerSheet({
  course,
  open,
  onOpenChange,
  isMobile,
  onEditCourse,
}: {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
  onEditCourse: () => void
}) {
  const side = isMobile ? "bottom" : "right"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={side} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>Course Links</SheetTitle>
          </SheetHeader>
          <SheetPanel>
            <div className="flex flex-col gap-3">
              {course?.courseLink ? (
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground">
                    Main Course URL
                  </div>
                  <a
                    className="text-sm break-all underline"
                    href={course.courseLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {course.courseLink}
                  </a>
                </div>
              ) : null}

              {(course?.links ?? []).map((link, index) => (
                <div className="flex flex-col gap-1" key={link}>
                  <div className="text-sm text-muted-foreground">
                    Link {index + 1}
                  </div>
                  <a
                    className="text-sm break-all underline"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link}
                  </a>
                </div>
              ))}

              {course && !course.courseLink && course.links.length === 0 ? (
                <div className="text-sm text-muted-foreground">No links</div>
              ) : null}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
            <Button variant="secondary" onClick={onEditCourse}>
              Edit Course
            </Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}
