"use client"

import { CourseIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo } from "react"

import { Progress } from "@/components/ui/progress"

type Row = {
  title: string
  avg: number
}

export default function CourseMasteryList({
  rows,
  emptyLabel,
}: {
  rows: Row[]
  emptyLabel: string
}) {
  const sorted = useMemo(
    () =>
      rows.toSorted((a, b) => a.avg - b.avg || a.title.localeCompare(b.title)),
    [rows]
  )

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
        <HugeiconsIcon icon={CourseIcon} size={24} className="opacity-50" />
        <div className="text-sm">{emptyLabel}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((row) => (
        <div
          key={row.title}
          className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_2fr_auto] lg:items-center"
        >
          <div className="min-w-0 truncate font-medium">{row.title}</div>
          <Progress value={(row.avg / 3) * 100} />
          <div className="text-sm text-muted-foreground">
            {row.avg.toFixed(1)} / 3
          </div>
        </div>
      ))}
    </div>
  )
}
