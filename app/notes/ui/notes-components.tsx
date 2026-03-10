"use client"

import * as React from "react"

import {
  CodeIcon,
  Delete01Icon,
  Edit01Icon,
  Flag01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { Radio, RadioGroup } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPanel,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  formatUpdatedLabel,
  understandingLabel,
  toCodeBadgeLabel,
  type Note,
} from "./notes-model"

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
        <div className="text-lg font-medium">No notes yet</div>
        <div className="text-sm text-muted-foreground">
          Create your first note to get started.
        </div>
        <Button onClick={onNewNote}>New Note</Button>
      </div>
    )
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="text-lg font-medium">No notes match your filters</div>
        <div className="text-sm text-muted-foreground">
          Try adjusting your search or clearing the filters.
        </div>
        <Button variant="ghost" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    )
  }

  return null
}

export function NoteCard({
  note,
  now,
  globalShowAnswers,
  overrideShow,
  onOverrideChange,
  onToggleFlag,
  onEdit,
  onViewFull,
  onViewCode,
}: {
  note: Note
  now: Date
  globalShowAnswers: boolean
  overrideShow: boolean | undefined
  onOverrideChange: (value: boolean) => void
  onToggleFlag: () => void
  onEdit: () => void
  onViewFull: () => void
  onViewCode: () => void
}) {
  const isQa = note.type === "qa"
  const showAnswer = overrideShow ?? globalShowAnswers

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Badge>{isQa ? "Q&A" : "Freeform"}</Badge>
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
            <HugeiconsIcon icon={Flag01Icon} size={18} />
          </Button>

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
              <DropdownMenuItem onClick={onViewFull}>
                View full note
              </DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog onDelete={() => void 0}>
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
        {isQa ? (
          <div className="flex flex-col gap-3">
            <div className="font-medium">{note.question}</div>

            {!showAnswer ? (
              <Button variant="outline" onClick={() => onOverrideChange(true)}>
                Show Answer
              </Button>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  {note.answer}
                </div>
                <Button
                  variant="outline"
                  onClick={() => onOverrideChange(false)}
                >
                  Hide Answer
                </Button>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="line-clamp-4 text-sm text-muted-foreground">
              {note.body}
            </div>
            {note.body && note.body.split(" ").length > 24 ? (
              <Button variant="link" className="px-0" onClick={onViewFull}>
                View full note
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-2">
          {note.codeSnippet ? (
            <Button variant="outline" size="sm" onClick={onViewCode}>
              <HugeiconsIcon icon={CodeIcon} size={18} />
              {toCodeBadgeLabel(note.codeLanguage)}
            </Button>
          ) : null}

          {note.type === "qa" && note.understandingLevel ? (
            <Badge variant="outline">
              {understandingLabel(note.understandingLevel)}
            </Badge>
          ) : null}

          {note.flag ? <Badge variant="secondary">Flagged</Badge> : null}
        </div>

        <div className="text-xs text-muted-foreground">
          {formatUpdatedLabel(now, note.updatedAt)}
        </div>
      </div>
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
      <AlertDialogTrigger render={children as React.ReactElement} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The note will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <Button variant="destructive" onClick={onDelete}>
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
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetPanel className="px-4 pb-5">
          <RadioGroup value={value} onValueChange={onValueChange}>
            {options.map((o) => (
              <label key={o.value} className="flex items-center gap-3">
                <Radio value={o.value} />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </RadioGroup>
        </SheetPanel>
      </SheetContent>
    </Sheet>
  )
}
