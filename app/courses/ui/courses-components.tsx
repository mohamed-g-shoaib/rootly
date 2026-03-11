"use client"

import Link from "next/link"
import * as React from "react"

import {
  Delete01Icon,
  Edit01Icon,
  Link01Icon,
  MoreVerticalIcon,
  Cancel01Icon,
  AddCircleIcon,
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
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

import type { Course } from "./courses-model"
import { isValidUrl } from "./courses-model"

export function CourseEditorSheet({
  mode,
  course,
  open,
  onOpenChange,
  isMobile,
  onSave,
}: {
  mode: "create" | "edit"
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
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

  const baseId = course?.id ?? ""
  const now = React.useMemo(() => new Date("2026-03-10T12:00:00Z"), [])

  React.useEffect(() => {
    if (!open) return

    if (mode === "edit" && course) {
      setTitle(course.title)
      setInstructor(course.instructor ?? "")
      setCourseLink(course.courseLink ?? "")
      setLinks(course.links)
      setTopics(course.topics)
      setTopicDraft("")
      setProgress(course.progress)
      setCourseLinkInvalid(false)
      setLinkInvalidByIndex({})
      return
    }

    if (mode === "create") {
      setTitle("")
      setInstructor("")
      setCourseLink("")
      setLinks([])
      setTopics([])
      setTopicDraft("")
      setProgress(0)
      setCourseLinkInvalid(false)
      setLinkInvalidByIndex({})
    }
  }, [course, mode, open])

  const hasChanges = React.useMemo(() => {
    if (mode === "create") {
      return (
        title.trim() !== "" ||
        instructor.trim() !== "" ||
        courseLink.trim() !== "" ||
        links.some((l) => l.trim() !== "") ||
        topics.length > 0 ||
        progress !== 0
      )
    }

    if (!course) return false

    return (
      title.trim() !== course.title.trim() ||
      instructor.trim() !== (course.instructor ?? "").trim() ||
      courseLink.trim() !== (course.courseLink ?? "").trim() ||
      links.join("\n").trim() !== course.links.join("\n").trim() ||
      topics.join("\n").trim() !== course.topics.join("\n").trim() ||
      progress !== course.progress
    )
  }, [course, courseLink, instructor, links, mode, progress, title, topics])

  const canSave = title.trim() !== "" && !courseLinkInvalid

  function requestClose(nextOpen: boolean) {
    if (nextOpen) {
      onOpenChange(true)
      return
    }

    if (hasChanges) {
      setDiscardOpen(true)
      return
    }

    onOpenChange(false)
  }

  function addLink() {
    setLinks((prev) => [...prev, ""])
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
    setLinkInvalidByIndex((prev) => {
      const next: Record<number, boolean> = {}
      for (const [k, v] of Object.entries(prev)) {
        const i = Number(k)
        if (i < index) next[i] = v
        if (i > index) next[i - 1] = v
      }
      return next
    })
  }

  function addTopic(raw: string) {
    const next = raw.trim().replace(/,$/, "")
    if (!next) return
    const normalized = next.toLowerCase()
    setTopics((prev) =>
      prev.some((t) => t.toLowerCase() === normalized) ? prev : [...prev, next]
    )
    setTopicDraft("")
  }

  function removeTopic(topic: string) {
    setTopics((prev) => prev.filter((t) => t !== topic))
  }

  function onSubmit() {
    if (!canSave) return

    const id = mode === "edit" && course ? course.id : `course_${Date.now()}`
    const createdAt =
      mode === "edit" && course ? course.createdAt : now.toISOString()

    const nextCourse: Course = {
      id,
      title: title.trim(),
      instructor: instructor.trim() ? instructor.trim() : null,
      courseLink: courseLink.trim() ? courseLink.trim() : null,
      links: links.map((l) => l.trim()).filter(Boolean),
      topics: topics.map((t) => t.trim()).filter(Boolean),
      progress,
      createdAt,
      updatedAt: now.toISOString(),
    }

    onSave(nextCourse)
  }

  const side = isMobile ? "bottom" : "right"

  return (
    <>
      <Sheet open={open} onOpenChange={requestClose}>
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
                        key={`${baseId}_${index}`}
                        className="flex items-center gap-2"
                      >
                        <Input
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
                          onClick={() => removeLink(index)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="gap-2 self-start"
                    onClick={addLink}
                  >
                    <HugeiconsIcon icon={AddCircleIcon} size={18} />
                    Add link
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Topics</Label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <Badge key={t} variant="outline">
                        <span className="flex items-center gap-1">
                          {t}
                          <button
                            type="button"
                            className="inline-flex"
                            aria-label="Remove topic"
                            onClick={() => removeTopic(t)}
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
                        addTopic(topicDraft)
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
              <SheetClose render={<Button variant="ghost" />}>
                Cancel
              </SheetClose>
              <Button
                onClick={onSubmit}
                disabled={
                  !canSave ||
                  Object.values(linkInvalidByIndex).some(Boolean) ||
                  (mode === "edit" && !hasChanges)
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
            <AlertDialogClose render={<Button variant="ghost" />}>
              Cancel
            </AlertDialogClose>
            <Button
              variant="destructive"
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
        <div className="text-lg font-medium">No courses yet</div>
        <div className="text-sm text-muted-foreground">
          Add your first course to start organizing your notes.
        </div>
        <Button onClick={onNewCourse}>New Course</Button>
      </div>
    )
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="text-lg font-medium">No courses match your filters</div>
        <div className="text-sm text-muted-foreground">
          Try adjusting your topic filter.
        </div>
        <Button variant="ghost" onClick={onClearFilters}>
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
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/courses/${course.id}`} className="min-w-0 flex-1">
          <div className="line-clamp-2 font-medium">{course.title}</div>
          {course.instructor ? (
            <div className="pt-1 text-sm text-muted-foreground">
              {course.instructor}
            </div>
          ) : null}
        </Link>

        <div className="flex items-center gap-1">
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
              render={<Button variant="ghost" size="icon" aria-label="More" />}
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

      <div className="pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-sm tabular-nums">{course.progress}%</div>
        </div>
        <div className="pt-2">
          <Progress value={course.progress}>
            <ProgressTrack>
              <ProgressIndicator style={{ width: `${course.progress}%` }} />
            </ProgressTrack>
          </Progress>
        </div>
      </div>

      {showTopics ? (
        <div className="flex flex-wrap gap-2 pt-4">
          {visibleTopics.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
          {remainingTopics > 0 ? (
            <Badge variant="outline">+{remainingTopics} more</Badge>
          ) : null}
        </div>
      ) : null}

      <div className="pt-4" />
    </Card>
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
