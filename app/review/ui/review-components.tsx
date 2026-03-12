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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu"
import { Skeleton } from "@/components/ui/skeleton"

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

export function ReviewSessionSkeletonList() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-48" />
              <div className="pt-2">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </Card>
      ))}
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
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={onView}
        >
          <div className="truncate font-medium">{session.name}</div>
          <div className="pt-1 text-sm text-muted-foreground">
            {formattedDate}
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" aria-label="More" />}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              <HugeiconsIcon icon={Target01Icon} size={18} />
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteSessionDialog sessionName={session.name} onDelete={onDelete}>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Delete01Icon} size={18} />
                Delete
              </DropdownMenuItem>
            </DeleteSessionDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Target01Icon} size={18} />
            <span className="tabular-nums">{session.accuracy}%</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Clock01Icon} size={18} />
            <span className="tabular-nums">
              {formatMinutes(session.timeSpentMinutes)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckListIcon} size={18} />
            <span className="tabular-nums">
              {session.questionCount} questions
            </span>
          </div>

          {session.shuffled ? <Badge variant="outline">Shuffled</Badge> : null}
          {session.flaggedOnly ? (
            <Badge variant="outline">Flagged</Badge>
          ) : null}
        </div>

        <div className="pt-4">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-muted-foreground">
                Weakest course
              </div>
              <div
                className={cn(
                  "pt-1 font-normal",
                  weakestCourseTitle === "—" && "text-muted-foreground"
                )}
              >
                <div className="truncate">{weakestCourseTitle}</div>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-right">
              <div className="text-sm text-muted-foreground">
                Strongest course
              </div>
              <div
                className={cn(
                  "pt-1 font-normal",
                  strongestCourseTitle === "—" && "text-muted-foreground"
                )}
              >
                <div className="truncate">{strongestCourseTitle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function DeleteSessionDialog({
  children,
  sessionName,
  onDelete,
}: {
  children: React.ReactNode
  sessionName: string
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
          <Button variant="destructive" type="button" onClick={onDelete}>
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
