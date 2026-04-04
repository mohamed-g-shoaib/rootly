"use client"

import * as React from "react"

import {
  CheckListIcon,
  Clock01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

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
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"

import type { ReviewSession } from "./review-model"

export function ReviewEmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={Target01Icon}
          size={24}
          className="text-muted-foreground"
        />
      </div>
      <div className="text-lg font-medium">No sessions yet</div>
      <div className="max-w-[280px] text-sm text-muted-foreground">
        Complete your first review session to see your history and performance
        stats here.
      </div>
      <Button onClick={onStart} type="button" className="mt-2 gap-2">
        <HugeiconsIcon icon={Target01Icon} size={18} />
        Start Review
      </Button>
    </div>
  )
}

export function SessionCard({
  session,
  formattedDate,
  weakestCourseTitle,
  strongestCourseTitle,
  onView,
  onDelete,
}: {
  session: ReviewSession
  formattedDate: string
  weakestCourseTitle: string
  strongestCourseTitle: string
  onView: () => void
  onDelete: () => void
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  return (
    <>
      <div className="h-[220px]">
        <Card className="h-full p-4">
          <div className="flex h-full flex-col gap-3">
            <div className="flex shrink-0 items-start justify-between gap-3">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={onView}
              >
                <div className="line-clamp-2 font-medium decoration-muted-foreground/50 decoration-dotted underline-offset-2 hover:underline">
                  {session.name}
                </div>
              </button>
              <div className="shrink-0 pt-0.5 text-xs text-muted-foreground">
                {formattedDate}
              </div>
            </div>

            <div className="flex min-h-0 w-full flex-1 items-center justify-between gap-4 overflow-hidden">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">
                  Weakest course
                </div>
                <div
                  className={cn(
                    "truncate pt-1 text-sm font-normal",
                    weakestCourseTitle === "—" && "text-muted-foreground"
                  )}
                >
                  {weakestCourseTitle}
                </div>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <div className="text-xs text-muted-foreground">
                  Strongest course
                </div>
                <div
                  className={cn(
                    "truncate pt-1 text-sm font-normal",
                    strongestCourseTitle === "—" && "text-muted-foreground"
                  )}
                >
                  {strongestCourseTitle}
                </div>
              </div>
            </div>

            <div className="-mb-2 flex shrink-0 items-center justify-between gap-2">
              <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                <Badge variant="outline" className="shrink-0">
                  <span className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={Target01Icon} size={14} />
                    {session.accuracy}%
                  </span>
                </Badge>
                <Badge variant="outline" className="shrink-0">
                  <span className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    {formatMinutes(session.timeSpentMinutes)}
                  </span>
                </Badge>
                <Badge variant="outline" className="shrink-0">
                  <span className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={CheckListIcon} size={14} />
                    {session.questionCount}q
                  </span>
                </Badge>
                {session.shuffled ? (
                  <Badge variant="outline" className="shrink-0">
                    Shuffled
                  </Badge>
                ) : null}
                {session.flaggedOnly ? (
                  <Badge variant="outline" className="shrink-0">
                    Flagged
                  </Badge>
                ) : null}
              </div>

              <div className="-mr-2 flex shrink-0 items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label="More" />
                    }
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onView}>
                      <HugeiconsIcon icon={Target01Icon} size={18} />
                      View details
                    </DropdownMenuItem>
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
      <DeleteSessionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        sessionName={session.name}
        onDelete={onDelete}
      />
    </>
  )
}

function DeleteSessionDialog({
  open,
  onOpenChange,
  sessionName,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionName: string
  onDelete: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete session?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{sessionName}". This action cannot be
            undone.
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

export function formatMinutes(totalMinutes: number): string {
  const safe = Number.isFinite(totalMinutes) ? totalMinutes : 0
  const minutes = Math.max(0, Math.round(safe))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h <= 0) return `${m}m`
  if (m <= 0) return `${h}h`
  return `${h}h ${m}m`
}
