"use client"

import * as React from "react"

import {
  Clock01Icon,
  Target01Icon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover"
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

import { formatMinutes } from "./review-components"
import type { ReviewCourse, ReviewSession } from "./review-model"

export type ReviewSummaryData = {
  answeredCount: number
  totalPlanned: number
  endedEarly: boolean
  accuracy: number
  timeSpentMinutes: number
  notesLeveledUp: { id: string; question: string }[]
  notesLeveledDown: { id: string; question: string }[]
  weakestCourseId: string | null
  strongestCourseId: string | null
}

export function ReviewSummary({
  data,
  courses,
  onSave,
  onDiscard,
}: {
  data: ReviewSummaryData
  courses: ReviewCourse[]
  onSave: (sessionName: string) => void
  onDiscard: () => void
}) {
  const [saveOpen, setSaveOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  const weakestTitle = React.useMemo(() => {
    if (!data.weakestCourseId) return "—"
    return courses.find((c) => c.id === data.weakestCourseId)?.title ?? "—"
  }, [courses, data.weakestCourseId])

  const strongestTitle = React.useMemo(() => {
    if (!data.strongestCourseId) return "—"
    return courses.find((c) => c.id === data.strongestCourseId)?.title ?? "—"
  }, [courses, data.strongestCourseId])

  const noCourseData =
    data.weakestCourseId == null && data.strongestCourseId == null

  const status = React.useMemo(() => {
    const a = data.accuracy

    if (a >= 85) {
      return { label: "Excellent", badgeVariant: "success" as const }
    }
    if (a >= 70) {
      return { label: "Good", badgeVariant: "secondary" as const }
    }
    if (a >= 50) {
      return { label: "Needs Review", badgeVariant: "warning" as const }
    }
    return { label: "Needs Study", badgeVariant: "destructive" as const }
  }, [data.accuracy])

  return (
    <div className="flex flex-col gap-4 py-6">
      {data.endedEarly ? (
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">
            Session ended early — you answered {data.answeredCount} of{" "}
            {data.totalPlanned} questions.
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<HugeiconsIcon icon={Target01Icon} size={18} />}
          label="Accuracy"
          value={`${data.accuracy}%`}
        />
        <StatCard
          icon={<HugeiconsIcon icon={Clock01Icon} size={18} />}
          label="Time Spent"
          value={formatMinutes(data.timeSpentMinutes)}
        />
        <StatCard
          label="Questions Answered"
          value={String(data.answeredCount)}
        />
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">Review Status</div>
          </div>
          <div className="pt-2">
            <Badge variant={status.badgeVariant} size="lg">
              {status.label}
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        {noCourseData ? (
          <div className="text-sm text-muted-foreground">
            No course data — all reviewed notes were uncategorized.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">
                Weakest Course
              </div>
              <div
                className={cn(!data.weakestCourseId && "text-muted-foreground")}
              >
                {weakestTitle}
              </div>
              <div className="text-sm text-muted-foreground">
                Needs more attention
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">
                Strongest Course
              </div>
              <div
                className={cn(
                  !data.strongestCourseId && "text-muted-foreground"
                )}
              >
                {strongestTitle}
              </div>
              <div className="text-sm text-muted-foreground">
                Best understood
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 font-medium">
              <HugeiconsIcon icon={TradeUpIcon} size={18} />
              Leveled Up
            </div>
            <div className="pt-3">
              {data.notesLeveledUp.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">None</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.notesLeveledUp.map((n) => (
                    <div key={n.id} className="text-sm">
                      {n.question}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium">
              <HugeiconsIcon icon={TradeDownIcon} size={18} />
              Leveled Down
            </div>
            <div className="pt-3">
              {data.notesLeveledDown.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">None</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.notesLeveledDown.map((n) => (
                    <div key={n.id} className="text-sm">
                      {n.question}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <DiscardDialog onDiscard={onDiscard}>
          <Button variant="ghost">Discard</Button>
        </DiscardDialog>

        <Popover open={saveOpen} onOpenChange={setSaveOpen}>
          <PopoverTrigger render={<Button />}>Save Session</PopoverTrigger>
          <PopoverPopup align="end" className="w-80">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium">Session name</div>
              <Input
                value={name}
                placeholder="e.g. React Hooks Deep Dive"
                onValueChange={(v) => setName(v)}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSaveOpen(false)
                    setName("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!name.trim()) return
                    onSave(name.trim())
                    setSaveOpen(false)
                    setName("")
                  }}
                  disabled={!name.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverPopup>
        </Popover>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{label}</div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="pt-2 text-xl font-medium tabular-nums">{value}</div>
    </Card>
  )
}

function DiscardDialog({
  children,
  onDiscard,
}: {
  children: React.ReactNode
  onDiscard: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        nativeButton={false}
        render={children as React.ReactElement}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard session?</AlertDialogTitle>
          <AlertDialogDescription>
            This summary will not be saved. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Keep
          </AlertDialogClose>
          <Button variant="destructive" onClick={onDiscard}>
            Discard
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function buildSessionFromSummary({
  data,
  id,
  createdAt,
  date,
  name,
  userId,
  config,
}: {
  data: ReviewSummaryData
  id: string
  createdAt: string
  date: string
  name: string
  userId: string
  config: { shuffled: boolean; flaggedOnly: boolean }
}): ReviewSession {
  return {
    id,
    userId,
    name,
    date,
    questionCount: data.answeredCount,
    shuffled: config.shuffled,
    flaggedOnly: config.flaggedOnly,
    accuracy: data.accuracy,
    timeSpentMinutes: data.timeSpentMinutes,
    notesLeveledUp: data.notesLeveledUp.map((n) => n.id),
    notesLeveledDown: data.notesLeveledDown.map((n) => n.id),
    weakestCourseId: data.weakestCourseId,
    strongestCourseId: data.strongestCourseId,
    createdAt,
  }
}

export function sessionDateLabel(date: string, now: Date): string {
  const d = new Date(`${date}T00:00:00`)
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  if (d.getFullYear() !== now.getFullYear()) {
    const withYear = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    return withYear.format(d)
  }

  return formatter.format(d)
}
