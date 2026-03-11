"use client"

import * as React from "react"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
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

import type { ReviewNote } from "./review-model"

export type ReviewSessionState = {
  notes: ReviewNote[]
  totalPlanned: number
  currentIndex: number
  revealed: boolean
  answeredCount: number
  leveledUp: string[]
  leveledDown: string[]
  endedEarly: boolean
  startMs: number
  elapsedMs: number
  finished: boolean
}

export function ReviewSession({
  state,
  onReveal,
  onRate,
  onTick,
  onEndEarly,
}: {
  state: ReviewSessionState
  onReveal: () => void
  onRate: (rating: "nailed" | "sort_of" | "forgot") => void
  onTick: (elapsedMs: number) => void
  onEndEarly: () => void
}) {
  const current = state.notes[state.currentIndex] ?? null

  React.useEffect(() => {
    if (state.finished) return
    const interval = window.setInterval(() => {
      onTick(Date.now() - state.startMs)
    }, 250)
    return () => window.clearInterval(interval)
  }, [onTick, state.finished, state.startMs])

  if (!current) return null

  const progressLabel = `Question ${Math.min(
    state.currentIndex + 1,
    state.notes.length
  )} of ${state.notes.length}`
  const progressValue =
    state.notes.length > 0
      ? Math.round(((state.currentIndex + 1) / state.notes.length) * 100)
      : 0

  const minutes = Math.floor(state.elapsedMs / 60000)
  const seconds = Math.floor((state.elapsedMs % 60000) / 1000)
  const timerLabel = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">{progressLabel}</div>
            <div className="pt-2">
              <Progress value={progressValue}>
                <ProgressTrack>
                  <ProgressIndicator style={{ width: `${progressValue}%` }} />
                </ProgressTrack>
              </Progress>
            </div>
          </div>

          <div className="px-4 font-medium tabular-nums">{timerLabel}</div>

          <EndSessionDialog
            answeredCount={state.answeredCount}
            totalCount={state.notes.length}
            onConfirm={onEndEarly}
          >
            <Button variant="ghost" size="icon" aria-label="End session">
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </EndSessionDialog>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center px-4 py-8 lg:px-6">
        <Card className="p-5">
          <div className="flex flex-col gap-4">
            <div className="text-lg font-medium">{current.question}</div>

            {current.courseTitle ? (
              <div className="text-sm text-muted-foreground">
                {current.courseTitle}
              </div>
            ) : null}

            {!state.revealed ? (
              <Button variant="ghost" onClick={onReveal}>
                Reveal Answer
              </Button>
            ) : (
              <>
                <div className="border-t pt-4 text-sm whitespace-pre-wrap text-muted-foreground">
                  {current.answer}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button onClick={() => onRate("nailed")}>Nailed it</Button>
                  <Button variant="outline" onClick={() => onRate("sort_of")}>
                    Sort of
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onRate("forgot")}
                  >
                    Forgot it
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function EndSessionDialog({
  children,
  answeredCount,
  totalCount,
  onConfirm,
}: {
  children: React.ReactNode
  answeredCount: number
  totalCount: number
  onConfirm: () => void
}) {
  const isEmpty = answeredCount === 0

  return (
    <AlertDialog>
      <AlertDialogTrigger
        nativeButton={true}
        render={children as React.ReactElement}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEmpty ? "End session?" : "End session early?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEmpty
              ? "You haven't answered any questions yet. No summary will be shown."
              : `You've answered ${answeredCount} of ${totalCount} questions.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Keep going
          </AlertDialogClose>
          {isEmpty ? (
            <Button variant="destructive" onClick={onConfirm}>
              End session
            </Button>
          ) : (
            <Button onClick={onConfirm}>Show summary</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
