"use client"

import {
  CheckmarkCircle01Icon,
  CodeIcon,
  Delete01Icon,
  Edit01Icon,
  Flag01Icon,
  MoreVerticalIcon,
  Note01Icon,
  Pdf01Icon,
  Search01Icon,
  TextSquareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"

import { understandingLabel, type Note, toCodeBadgeLabel } from "./notes-model"

export function EmptyState({
  hasAnyNotes,
  hasFilters,
  onNewNote,
  onClearFilters,
}: {
  hasAnyNotes: boolean
  hasFilters: boolean
  onNewNote: () => void
  onClearFilters: () => void
}) {
  if (!hasAnyNotes) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={Note01Icon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No notes yet</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Create your first note to start building your knowledge base.
        </div>
        <Button onClick={onNewNote} type="button" className="mt-2">
          New Note
        </Button>
      </div>
    )
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={Search01Icon}
            size={24}
            className="text-muted-foreground"
          />
        </div>
        <div className="text-lg font-medium">No notes match your filters</div>
        <div className="max-w-[280px] text-sm text-muted-foreground">
          Try adjusting your search query or clearing the active filters.
        </div>
        <Button
          variant="ghost"
          type="button"
          onClick={onClearFilters}
          className="mt-2"
        >
          Clear filters
        </Button>
      </div>
    )
  }

  return null
}

export function NoteCard({
  note,
  now: _now,
  isMobile,
  globalShowAnswers,
  overrideShow,
  onOverrideChange,
  onToggleFlag,
  onEdit,
  onViewFull,
  onViewCode,
  onDelete,
  readOnly = false,
  shouldReduceMotion = false,
}: {
  note: Note
  now: Date
  isMobile: boolean
  globalShowAnswers: boolean
  overrideShow: boolean | undefined
  onOverrideChange: (value: boolean) => void
  onToggleFlag: () => void
  onEdit: () => void
  onViewFull: () => void
  onViewCode: () => void
  onDelete: () => void
  readOnly?: boolean
  shouldReduceMotion?: boolean
}) {
  const isQa = note.type === "qa"
  const showAnswer = overrideShow ?? globalShowAnswers

  const _initial = shouldReduceMotion ? undefined : { opacity: 0, y: 10 }
  const _animate = shouldReduceMotion ? undefined : { opacity: 1, y: 0 }

  return (
    <motion.div
      initial={_initial}
      animate={_animate}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {note.courseTitle ? (
              <div className="text-sm text-muted-foreground">
                {note.courseTitle}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={note.flag ? "Remove flag" : "Flag for review"}
              onClick={onToggleFlag}
            >
              <HugeiconsIcon
                icon={Flag01Icon}
                size={18}
                className={cn(
                  "cursor-pointer",
                  note.flag ? "text-destructive" : "text-muted-foreground"
                )}
              />
            </Button>

            {!readOnly ? (
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
                  <DropdownMenuItem onClick={onViewFull}>
                    <HugeiconsIcon icon={Note01Icon} size={18} />
                    View full note
                  </DropdownMenuItem>
                  {note.codeSnippet ? (
                    <DropdownMenuItem onClick={onViewCode}>
                      <HugeiconsIcon icon={CodeIcon} size={18} />
                      View code
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Pdf01Icon} size={18} />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={TextSquareIcon} size={18} />
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteDialog onDelete={onDelete}>
                    <DropdownMenuItem variant="destructive">
                      <HugeiconsIcon icon={Delete01Icon} size={18} />
                      Delete
                    </DropdownMenuItem>
                  </DeleteDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        <div className="pt-4">
          {isQa ? (
            <div className="flex flex-col gap-3">
              <div className="font-medium">{note.question}</div>

              {!showAnswer ? (
                isMobile ? (
                  <Button
                    variant="outline"
                    onClick={() => onOverrideChange(true)}
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <PreviewCard>
                      <PreviewCardTrigger
                        render={<Button variant="ghost" size="sm" />}
                      >
                        Peek answer
                      </PreviewCardTrigger>
                      <PreviewCardPopup>
                        <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                          {note.answer}
                        </div>
                      </PreviewCardPopup>
                    </PreviewCard>
                  </div>
                )
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    {note.answer}
                  </div>
                  {isMobile ? (
                    <Button
                      variant="outline"
                      onClick={() => onOverrideChange(false)}
                    >
                      Hide Answer
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="line-clamp-4 text-sm text-muted-foreground">
                {note.body}
              </div>
              {!readOnly && note.body && note.body.split(" ").length > 24 ? (
                <Button
                  variant="link"
                  type="button"
                  className="px-0"
                  onClick={onViewFull}
                >
                  View full note
                </Button>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            {!readOnly && note.codeSnippet ? (
              <Button
                variant="outline"
                size="sm"
                aria-label="View code"
                onClick={onViewCode}
                className="gap-2"
              >
                <HugeiconsIcon icon={CodeIcon} size={18} />
                {toCodeBadgeLabel(note.codeLanguage)}
              </Button>
            ) : null}
          </div>

          {note.type === "qa" && note.understandingLevel ? (
            <Badge variant="outline">
              {understandingLabel(note.understandingLevel)}
            </Badge>
          ) : null}
        </div>
      </Card>
    </motion.div>
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
          <AlertDialogTitle>Delete note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The note will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" type="button" />}>
            Cancel
          </AlertDialogClose>
          <Button variant="destructive" type="button" onClick={onDelete}>
            Delete
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
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors hover:bg-muted",
                    value === opt.value
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground"
                  )}
                  onClick={() => {
                    onValueChange(opt.value)
                    onOpenChange(false)
                  }}
                >
                  {opt.label}
                  {value === opt.value ? (
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                  ) : null}
                </button>
              ))}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" type="button" />}>
              Close
            </SheetClose>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  )
}
