"use client";

import Link from "next/link";
import * as React from "react";

import {
  AddCircleIcon,
  Cancel01Icon,
  CourseIcon,
  Delete01Icon,
  Edit01Icon,
  FilterIcon,
  Link01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormSection } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

import type { Course } from "./courses-model";
import { isValidUrl } from "./courses-model";

type CourseEditorSheetProps = {
  mode: "create" | "edit";
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakpoint: "mobile" | "tablet" | "desktop";
  onSave: (course: Course) => void;
};

type EditableLink = {
  id: string;
  value: string;
};

function toEditableLinks(links: string[]): EditableLink[] {
  return links.map((value) => ({
    id: crypto.randomUUID(),
    value,
  }));
}

export function CourseEditorSheet({
  mode,
  course,
  open,
  onOpenChange,
  breakpoint,
  onSave,
}: CourseEditorSheetProps) {
  const editorKey =
    mode === "edit" ? `edit-${course?.id ?? "missing"}` : "create";

  return (
    <CourseEditorSheetBody
      key={`${editorKey}-${breakpoint}`}
      mode={mode}
      course={course}
      open={open}
      onOpenChange={onOpenChange}
      breakpoint={breakpoint}
      onSave={onSave}
    />
  );
}

function CourseEditorSheetBody({
  mode,
  course,
  open,
  onOpenChange,
  breakpoint,
  onSave,
}: CourseEditorSheetProps) {
  const [discardOpen, setDiscardOpen] = React.useState(false);

  const [title, setTitle] = React.useState(course?.title ?? "");
  const [instructor, setInstructor] = React.useState(course?.instructor ?? "");
  const [courseLink, setCourseLink] = React.useState(course?.courseLink ?? "");
  const [links, setLinks] = React.useState<EditableLink[]>(() =>
    toEditableLinks(course?.links ?? []),
  );
  const [topics, setTopics] = React.useState<string[]>(
    () => course?.topics ?? [],
  );
  const [topicDraft, setTopicDraft] = React.useState("");
  const [progress, setProgress] = React.useState(course?.progress ?? 0);

  const [courseLinkInvalid, setCourseLinkInvalid] = React.useState(false);
  const [linkInvalidById, setLinkInvalidById] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (!open) return;

    setDiscardOpen(false);
    setTitle(course?.title ?? "");
    setInstructor(course?.instructor ?? "");
    setCourseLink(course?.courseLink ?? "");
    setLinks(toEditableLinks(course?.links ?? []));
    setTopics(course?.topics ?? []);
    setTopicDraft("");
    setProgress(course?.progress ?? 0);
    setCourseLinkInvalid(false);
    setLinkInvalidById({});
  }, [open, course, mode]);

  const linkValues = React.useMemo(
    () => links.map((link) => link.value),
    [links],
  );

  const side = breakpoint === "mobile" ? "bottom" : "right";

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
              JSON.stringify(linkValues) !==
                JSON.stringify(course?.links ?? []) ||
              JSON.stringify(topics) !== JSON.stringify(course?.topics ?? []) ||
              progress !== (course?.progress ?? 0))
          ) {
            setDiscardOpen(true);
            return;
          }

          onOpenChange(next);
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
              <div className="flex flex-col gap-5">
                <FormSection>
                  <Label>Course Title</Label>
                  <Input
                    value={title}
                    placeholder="e.g. Machine Learning Fundamentals"
                    onValueChange={(v) => setTitle(v)}
                  />
                </FormSection>

                <FormSection>
                  <Label>Instructor</Label>
                  <Input
                    value={instructor}
                    placeholder="e.g. Andrew Ng"
                    onValueChange={(v) => setInstructor(v)}
                  />
                </FormSection>

                <FormSection>
                  <Label>Main Course URL</Label>
                  <Input
                    value={courseLink}
                    placeholder="https://..."
                    aria-invalid={courseLinkInvalid}
                    onBlur={() => setCourseLinkInvalid(!isValidUrl(courseLink))}
                    onValueChange={(v) => {
                      setCourseLink(v);
                      if (courseLinkInvalid) setCourseLinkInvalid(false);
                    }}
                  />
                  {courseLinkInvalid ? (
                    <div className="text-sm text-destructive-foreground">
                      Enter a valid URL.
                    </div>
                  ) : null}
                </FormSection>

                <FormSection>
                  <Label>Additional Links</Label>
                  <div className="flex flex-col gap-2">
                    {links.map((link, index) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <Input
                          id={`link_${index}`}
                          value={link.value}
                          placeholder="https://..."
                          aria-invalid={linkInvalidById[link.id] ?? false}
                          onBlur={() =>
                            setLinkInvalidById((prev) => ({
                              ...prev,
                              [link.id]: !isValidUrl(link.value),
                            }))
                          }
                          onValueChange={(v) => {
                            setLinks((prev) =>
                              prev.map((item) =>
                                item.id === link.id
                                  ? { ...item, value: v }
                                  : item,
                              ),
                            );
                            if (linkInvalidById[link.id]) {
                              setLinkInvalidById((prev) => ({
                                ...prev,
                                [link.id]: false,
                              }));
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove link"
                          onClick={() => {
                            setLinks((prev) =>
                              prev.filter((item) => item.id !== link.id),
                            );
                            setLinkInvalidById((prev) => {
                              const next = { ...prev };
                              delete next[link.id];
                              return next;
                            });
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
                      setLinks((prev) => [
                        ...prev,
                        { id: crypto.randomUUID(), value: "" },
                      ]);
                    }}
                  >
                    <HugeiconsIcon icon={AddCircleIcon} size={18} />
                    Add link
                  </Button>
                </FormSection>

                <FormSection>
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
                        e.preventDefault();
                        if (topicDraft.trim()) {
                          setTopics((prev) => {
                            if (prev.includes(topicDraft.trim())) return prev;
                            return [...prev, topicDraft.trim()];
                          });
                          setTopicDraft("");
                        }
                      }
                    }}
                  />
                </FormSection>

                <FormSection>
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
                </FormSection>
              </div>
            </SheetPanel>
            <SheetFooter>
              <SheetClose render={<Button variant="ghost" type="button" />}>
                Cancel
              </SheetClose>
              <Button
                type="button"
                onClick={() => {
                  if (!title.trim()) return;
                  onSave({
                    ...course,
                    id: course?.id ?? crypto.randomUUID(),
                    title: title.trim(),
                    instructor: instructor.trim(),
                    courseLink: courseLink.trim(),
                    links: linkValues,
                    topics,
                    progress,
                    createdAt: course?.createdAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  } as Course);
                }}
                disabled={
                  !title.trim() ||
                  Object.values(linkInvalidById).some(Boolean) ||
                  (mode === "edit" &&
                    title === course?.title &&
                    instructor === (course?.instructor ?? "") &&
                    courseLink === (course?.courseLink ?? "") &&
                    JSON.stringify(linkValues) ===
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
                setDiscardOpen(false);
                onOpenChange(false);
              }}
            >
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function EmptyState({
  hasAnyCourses,
  hasFilters,
  onNewCourse,
  onClearFilters,
}: {
  hasAnyCourses: boolean;
  hasFilters: boolean;
  onNewCourse: () => void;
  onClearFilters: () => void;
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
        <Button onClick={onNewCourse} className="mt-2 gap-2">
          <HugeiconsIcon icon={AddCircleIcon} size={18} />
          New Course
        </Button>
      </div>
    );
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
    );
  }

  return null;
}

export function CourseCard({
  course,
  now: _now,
  isMobile,
  onEdit,
  onViewLinks,
  onDelete,
}: {
  course: Course;
  now: Date;
  isMobile: boolean;
  onEdit: () => void;
  onViewLinks: () => void;
  onDelete: () => void;
}) {
  const showTopics = course.topics.length > 0;
  const visibleTopics = course.topics.slice(0, 3);
  const remainingTopics = Math.max(
    0,
    course.topics.length - visibleTopics.length,
  );
  const hasLinks = Boolean(course.courseLink) || course.links.length > 0;
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
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

              <Link
                href={`/courses/${course.id}`}
                className="min-w-0 flex-1"
              >
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
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
            </div>
          </div>

          <div className="-mb-2 flex shrink-0 items-center justify-between gap-2">
            <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
              {showTopics ? (
                <>
                  {visibleTopics.map((t) => (
                    <Badge key={t} variant="outline" className="shrink-0">
                      {t}
                    </Badge>
                  ))}
                  {remainingTopics > 0 ? (
                    <TopicsOverflowBadge
                      topics={course.topics}
                      remainingTopics={remainingTopics}
                      isMobile={isMobile}
                    />
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="-mr-2 flex shrink-0 items-center gap-1">
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
                    <DropdownMenuItem
                      variant="destructive"
                      closeOnClick
                      onClick={() => setDeleteOpen(true)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={18} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
          </div>
        </Card>
      </div>
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={onDelete}
      />
    </>
  );
}

function TopicsOverflowBadge({
  topics,
  remainingTopics,
  isMobile,
}: {
  topics: string[];
  remainingTopics: number;
  isMobile: boolean;
}) {
  const content = (
    <div className="flex flex-wrap gap-1.5">
      {topics.map((topic) => (
        <Badge key={topic} variant="outline">
          {topic}
        </Badge>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger
          render={
            <Badge variant="outline" className="shrink-0 cursor-pointer" />
          }
        >
          +{remainingTopics} more
        </PopoverTrigger>
        <PopoverPopup align="start" className="w-64">
          {content}
        </PopoverPopup>
      </Popover>
    );
  }

  return (
    <PreviewCard>
      <PreviewCardTrigger
        render={<Badge variant="outline" className="shrink-0 cursor-pointer" />}
      >
        +{remainingTopics} more
      </PreviewCardTrigger>
      <PreviewCardPopup>{content}</PreviewCardPopup>
    </PreviewCard>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onDelete();
            }}
          >
            Delete Course
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function FilterSheet({
  title,
  open,
  onOpenChange,
  value,
  options,
  onValueChange,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
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
                    onValueChange(o.value);
                    onOpenChange(false);
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
  );
}

export function LinksViewerSheet({
  course,
  open,
  onOpenChange,
  isMobile,
  onEditCourse,
}: {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  onEditCourse: () => void;
}) {
  const side = isMobile ? "bottom" : "right";

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
  );
}
