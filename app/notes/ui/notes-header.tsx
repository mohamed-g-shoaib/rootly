"use client"

import * as React from "react"

import { AddCircleIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { PageContainer } from "@/components/ui/page-container"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { CourseFilter, SortKey, TypeFilter } from "./notes-model"

export function NotesHeader({
  isMobile,
  courses,
  filteredCount,
  hasQa,
  filtersActive,
  searchInput,
  typeFilter,
  courseFilter,
  flaggedOnly,
  sortKey,
  globalShowAnswers,
  onSearchInputChange,
  onTypeChange,
  onCourseChange,
  onToggleFlaggedOnly,
  onSortChange,
  onToggleGlobalAnswers,
  onNewNote,
  onOpenMobileType,
  onOpenMobileCourse,
  onOpenMobileSort,
}: {
  isMobile: boolean
  courses: { id: string; title: string }[]
  filteredCount: number
  hasQa: boolean
  filtersActive: boolean
  searchInput: string
  typeFilter: TypeFilter
  courseFilter: CourseFilter
  flaggedOnly: boolean
  sortKey: SortKey
  globalShowAnswers: boolean
  onSearchInputChange: (value: string) => void
  onTypeChange: (value: TypeFilter) => void
  onCourseChange: (value: CourseFilter) => void
  onToggleFlaggedOnly: () => void
  onSortChange: (value: SortKey) => void
  onToggleGlobalAnswers: () => void
  onNewNote: () => void
  onOpenMobileType: () => void
  onOpenMobileCourse: () => void
  onOpenMobileSort: () => void
}) {
  return (
    <div className="sticky top-0 z-10 border-b bg-background">
      <PageContainer>
        {!isMobile ? (
          <div className="flex items-center gap-3 py-4">
            <div className="text-lg font-medium">Notes</div>

            <div className="flex flex-1 items-center gap-2">
              <Input
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Search notes..."
                className="flex-1"
              />

              <Select
                value={typeFilter}
                onValueChange={(v) => onTypeChange(v as TypeFilter)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="qa">Q&A</SelectItem>
                  <SelectItem value="freeform">Freeform</SelectItem>
                </SelectPopup>
              </Select>

              <Select
                value={courseFilter}
                onValueChange={(v) => onCourseChange(v as CourseFilter)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="none">No course</SelectItem>
                  {courses
                    .toSorted((a, b) => a.title.localeCompare(b.title))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                </SelectPopup>
              </Select>

              <Button
                variant={flaggedOnly ? "secondary" : "outline"}
                onClick={onToggleFlaggedOnly}
              >
                Flagged only
              </Button>

              <Select
                value={sortKey}
                onValueChange={(v) => onSortChange(v as SortKey)}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="last_updated">Last Updated</SelectItem>
                  <SelectItem value="date_created">Date Created</SelectItem>
                  <SelectItem value="understanding_low">
                    Understanding Level (Low → High)
                  </SelectItem>
                  <SelectItem value="understanding_high">
                    Understanding Level (High → Low)
                  </SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                </SelectPopup>
              </Select>
            </div>

            {hasQa ? (
              <Button variant="outline" onClick={onToggleGlobalAnswers}>
                {globalShowAnswers ? "Hide All Answers" : "Show All Answers"}
              </Button>
            ) : null}

            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="ghost" className="gap-2" aria-label="Export">
                    <HugeiconsIcon icon={Download01Icon} size={18} />
                    Export
                  </Button>
                }
              />
              <PopoverContent align="end" className="w-56">
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-muted-foreground">
                    {filtersActive
                      ? `Exporting ${filteredCount} filtered notes`
                      : `Exporting all ${filteredCount} notes`}
                  </div>
                  <Button variant="outline">Export as PDF</Button>
                  <Button variant="outline">Export as Markdown</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button className="gap-2" onClick={onNewNote}>
              <HugeiconsIcon icon={AddCircleIcon} size={18} />
              New Note
            </Button>
          </div>
        ) : (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Notes</div>
              <div className="flex items-center gap-2">
                <Button size="icon" aria-label="New note" onClick={onNewNote}>
                  <HugeiconsIcon icon={AddCircleIcon} size={18} />
                </Button>

                <Popover>
                  <PopoverTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label="Export">
                        <HugeiconsIcon icon={Download01Icon} size={18} />
                      </Button>
                    }
                  />
                  <PopoverContent align="end" className="w-56">
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-muted-foreground">
                        {filtersActive
                          ? `Exporting ${filteredCount} filtered notes`
                          : `Exporting all ${filteredCount} notes`}
                      </div>
                      <Button variant="outline">Export as PDF</Button>
                      <Button variant="outline">Export as Markdown</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="pt-3">
              <Input
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Search notes..."
              />
            </div>

            <div className="pt-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                  variant="outline"
                  className={cn(typeFilter !== "all" && "bg-muted")}
                  onClick={onOpenMobileType}
                >
                  Type
                </Button>
                <Button
                  variant="outline"
                  className={cn(courseFilter !== "all" && "bg-muted")}
                  onClick={onOpenMobileCourse}
                >
                  Course
                </Button>
                <Button
                  variant={flaggedOnly ? "secondary" : "outline"}
                  onClick={onToggleFlaggedOnly}
                >
                  Flagged only
                </Button>
                <Button
                  variant="outline"
                  className={cn(sortKey !== "last_updated" && "bg-muted")}
                  onClick={onOpenMobileSort}
                >
                  Sort by
                </Button>
              </div>
            </div>

            {hasQa ? (
              <div className="pt-3">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={onToggleGlobalAnswers}
                >
                  {globalShowAnswers ? "Hide All Answers" : "Show All Answers"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </PageContainer>
    </div>
  )
}
