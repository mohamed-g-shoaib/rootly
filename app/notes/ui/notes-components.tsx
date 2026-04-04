"use client"

import {
  AddCircleIcon,
  CheckmarkCircle01Icon,
  CodeIcon,
  Delete01Icon,
  Edit01Icon,
  EyeIcon,
  Flag01Icon,
  MoreVerticalIcon,
  Note01Icon,
  Search01Icon,
  ViewOffIcon,
  Loading01Icon,
  Pdf01Icon,
  TextSquareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"

import {
  understandingColor,
  understandingIcon,
  understandingLabel,
  type Note,
  toCodeBadgeLabel,
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
        <Button onClick={onNewNote} type="button" className="mt-2 gap-2">
          <HugeiconsIcon icon={AddCircleIcon} size={18} />
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
  showAnswer,
  onShowAnswerChange,
  onEdit,
  onViewFull,
  onViewCode,
  onDelete,
  readOnly = false,
}: {
  note: Note
  now: Date
  showAnswer: boolean
  onShowAnswerChange: (value: boolean) => void
  onEdit: () => void
  onViewFull: () => void
  onViewCode: () => void
  onDelete: () => void
  readOnly?: boolean
}) {
  const isQa = note.type === "qa"
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  return (
    <>
      <div className="h-[220px]">
        <Card className="h-full p-4">
          <div className="flex h-full flex-col gap-3">
            <div className="shrink-0">
              <div className="flex flex-col gap-1">
                {note.courseTitle ? (
                  <div className="truncate text-xs text-muted-foreground">
                    {note.courseTitle}
                  </div>
                ) : null}

                {isQa ? (
                  <div className="line-clamp-2 font-medium">{note.question}</div>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1">
              {isQa ? (
                showAnswer ? (
                  <div className="line-clamp-3 text-sm text-muted-foreground">
                    {note.previewText}
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground">
                    Answer hidden
                  </div>
                )
              ) : (
                <div className="line-clamp-3 text-sm text-muted-foreground">
                  {note.previewText}
                </div>
              )}
            </div>

            <div className="-mb-2 flex shrink-0 items-center justify-between gap-2">
              <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                {!readOnly && note.hasCodeSnippet ? (
                  <Badge
                    variant="outline"
                    className="shrink-0 cursor-pointer"
                    onClick={onViewCode}
                  >
                    <span className="inline-flex items-center gap-2">
                      <HugeiconsIcon icon={CodeIcon} size={14} />
                      {toCodeBadgeLabel(note.codeLanguage)}
                    </span>
                  </Badge>
                ) : null}

                {note.type === "qa" && note.understandingLevel ? (
                  <Badge variant="outline" className="shrink-0">
                    <HugeiconsIcon
                      icon={understandingIcon(note.understandingLevel)}
                      size={14}
                      color={understandingColor(note.understandingLevel)}
                    />
                    {understandingLabel(note.understandingLevel)}
                  </Badge>
                ) : null}

                {!readOnly ? (
                  <Badge
                    variant="outline"
                    className="shrink-0 cursor-pointer"
                    onClick={onViewFull}
                  >
                    Open full
                  </Badge>
                ) : null}
              </div>

              <div className="-mr-2 flex shrink-0 items-center gap-1">
                {note.flag ? (
                  <div
                    aria-label="Flagged for review"
                    className="flex size-8 items-center justify-center text-destructive"
                    title="Flagged for review"
                  >
                    <HugeiconsIcon icon={Flag01Icon} size={18} />
                  </div>
                ) : null}
                {isQa ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={showAnswer ? "Hide answer" : "Show answer"}
                    onClick={() => onShowAnswerChange(!showAnswer)}
                  >
                    <HugeiconsIcon
                      icon={showAnswer ? ViewOffIcon : EyeIcon}
                      size={18}
                      color={showAnswer ? "var(--info)" : "currentColor"}
                    />
                  </Button>
                ) : null}

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
                      {note.hasCodeSnippet ? (
                        <DropdownMenuItem onClick={onViewCode}>
                          <HugeiconsIcon icon={CodeIcon} size={18} />
                          View code
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
                ) : null}
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
  )
}

export function ExportSheet({
  open,
  onOpenChange,
  exporting,
  onExportPdf,
  onExportMarkdown,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  exporting: boolean
  onExportPdf: () => void | Promise<void>
  onExportMarkdown: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side="bottom" variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>Export</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={() => void onExportPdf()}
                disabled={exporting}
              >
                <HugeiconsIcon
                  icon={exporting ? Loading01Icon : Pdf01Icon}
                  size={18}
                  className={exporting ? "animate-spin" : undefined}
                />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={onExportMarkdown}
              >
                <HugeiconsIcon icon={TextSquareIcon} size={18} />
                Export as Markdown
              </Button>
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

function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              onOpenChange(false)
              onDelete()
            }}
          >
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
