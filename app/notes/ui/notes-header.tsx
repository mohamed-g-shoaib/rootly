"use client"

import * as React from "react"

import {
  AddCircleIcon,
  Download01Icon,
  EyeIcon,
  Flag01Icon,
  Loading01Icon,
  Pdf01Icon,
  TextSquareIcon,
  UnfoldMoreIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { PageContainer } from "@/components/ui/page-container"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
} from "@/components/ui/select"

import type { CourseFilter, Note, SortKey, TypeFilter } from "./notes-model"
import { exportNotesAsMarkdown } from "./notes-export"
import { useExportPdf } from "./notes-pdf"

export function NotesHeader({
  isMobile,
  courses,
  filteredCount,
  filteredNotes,
  hasQa,
  filtersActive,
  typeFilter,
  courseFilter,
  flaggedOnly,
  sortKey,
  globalShowAnswers,
  onTypeChange,
  onCourseChange,
  onToggleFlaggedOnly,
  onSortChange,
  onToggleGlobalAnswers,
  onNewNote,
  onClearFilters,
  onOpenMobileType,
  onOpenMobileCourse,
  onOpenMobileSort,
  onOpenMobileExport,
}: {
  isMobile: boolean
  courses: { id: string; title: string }[]
  filteredCount: number
  filteredNotes: Note[]
  hasQa: boolean
  filtersActive: boolean
  typeFilter: TypeFilter
  courseFilter: CourseFilter
  flaggedOnly: boolean
  sortKey: SortKey
  globalShowAnswers: boolean
  onTypeChange: (value: TypeFilter) => void
  onCourseChange: (value: CourseFilter) => void
  onToggleFlaggedOnly: () => void
  onSortChange: (value: SortKey) => void
  onToggleGlobalAnswers: () => void
  onNewNote: () => void
  onClearFilters: () => void
  onOpenMobileType: () => void
  onOpenMobileCourse: () => void
  onOpenMobileSort: () => void
  onOpenMobileExport: () => void
}) {
  const typeItems = React.useMemo<{ value: TypeFilter; label: string }[]>(
    () => [
      { value: "all", label: "All Types" },
      { value: "qa", label: "Q&A" },
      { value: "freeform", label: "Freeform" },
    ],
    []
  )

  const courseItems = React.useMemo<{ value: CourseFilter; label: string }[]>(
    () => [
      { value: "all", label: "All Courses" },
      ...courses
        .toSorted((a, b) => a.title.localeCompare(b.title))
        .map((c) => ({ value: c.id, label: c.title })),
    ],
    [courses]
  )

  const selectedType = React.useMemo(
    () => typeItems.find((item) => item.value === typeFilter) ?? typeItems[0],
    [typeFilter, typeItems]
  )

  const selectedCourse = React.useMemo(
    () =>
      courseItems.find((item) => item.value === courseFilter) ?? courseItems[0],
    [courseFilter, courseItems]
  )

  const sortLabel = React.useMemo(() => {
    switch (sortKey) {
      case "date_created":
        return "Date Created"
      case "understanding_low":
        return "Understanding Level (Low → High)"
      case "understanding_high":
        return "Understanding Level (High → Low)"
      case "course":
        return "Course"
      default:
        return "Last Updated"
    }
  }, [sortKey])

  const { exportPdf, exporting } = useExportPdf(filteredNotes)

  return (
    <div className="sticky top-0 z-10 border-b bg-background">
      <PageContainer>
        {!isMobile ? (
          <div className="flex items-center gap-3 py-4">
            <div className="text-lg font-medium">Notes</div>

            <div className="flex flex-1 items-center gap-2">
              <div className="w-40">
                <Combobox
                  items={typeItems}
                  value={selectedType}
                  onValueChange={(value) =>
                    onTypeChange((value?.value ?? "all") as TypeFilter)
                  }
                >
                  <ComboboxInput
                    placeholder="All Types"
                    aria-label="Type"
                    showClear={typeFilter !== "all"}
                  />
                  <ComboboxPopup>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          <span className="truncate">{item.label}</span>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </Combobox>
              </div>

              <div className="w-56">
                <Combobox
                  items={courseItems}
                  value={selectedCourse}
                  onValueChange={(value) =>
                    onCourseChange((value?.value ?? "all") as CourseFilter)
                  }
                >
                  <ComboboxInput
                    placeholder="All Courses"
                    aria-label="Course"
                    showClear={courseFilter !== "all"}
                  />
                  <ComboboxPopup>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          <span className="truncate">{item.label}</span>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </Combobox>
              </div>

              <Select
                value={sortKey}
                onValueChange={(v) => onSortChange(v as SortKey)}
              >
                <SelectTrigger className="w-44 **:data-[slot=select-icon]:hidden">
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="min-w-0 truncate">{sortLabel}</span>
                    <HugeiconsIcon icon={UnfoldMoreIcon} size={18} />
                  </span>
                </SelectTrigger>
                <SelectPopup alignItemWithTrigger={false}>
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

              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" size="icon" aria-label="Export">
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
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => void exportPdf()}
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
                      className="gap-2"
                      onClick={() => exportNotesAsMarkdown(filteredNotes)}
                    >
                      <HugeiconsIcon icon={TextSquareIcon} size={18} />
                      Export as Markdown
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {filtersActive ? (
                <Button variant="ghost" type="button" onClick={onClearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={flaggedOnly ? "secondary" : "outline"}
                size="icon"
                aria-label={
                  flaggedOnly ? "Show all notes" : "Show flagged notes"
                }
                onClick={onToggleFlaggedOnly}
              >
                <HugeiconsIcon
                  icon={Flag01Icon}
                  size={18}
                  color={flaggedOnly ? "var(--destructive)" : "currentColor"}
                />
              </Button>

              {hasQa ? (
                <Button
                  variant={globalShowAnswers ? "secondary" : "outline"}
                  size="icon"
                  aria-label={
                    globalShowAnswers ? "Hide all answers" : "Show all answers"
                  }
                  onClick={onToggleGlobalAnswers}
                >
                  <HugeiconsIcon
                    icon={globalShowAnswers ? ViewOffIcon : EyeIcon}
                    size={18}
                    color={globalShowAnswers ? "var(--info)" : "currentColor"}
                  />
                </Button>
              ) : null}

              <Button onClick={onNewNote} type="button" className="gap-2">
                <HugeiconsIcon icon={AddCircleIcon} size={18} />
                New Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Notes</div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  aria-label={
                    flaggedOnly ? "Show all notes" : "Show flagged notes"
                  }
                  variant={flaggedOnly ? "secondary" : "ghost"}
                  onClick={onToggleFlaggedOnly}
                >
                  <HugeiconsIcon
                    icon={Flag01Icon}
                    size={18}
                    color={flaggedOnly ? "var(--destructive)" : "currentColor"}
                  />
                </Button>

                {hasQa ? (
                  <Button
                    size="icon"
                    aria-label={
                      globalShowAnswers
                        ? "Hide all answers"
                        : "Show all answers"
                    }
                    variant={globalShowAnswers ? "secondary" : "ghost"}
                    onClick={onToggleGlobalAnswers}
                  >
                    <HugeiconsIcon
                      icon={globalShowAnswers ? ViewOffIcon : EyeIcon}
                      size={18}
                      color={globalShowAnswers ? "var(--info)" : "currentColor"}
                    />
                  </Button>
                ) : null}

                <Button
                  size="icon"
                  type="button"
                  aria-label="New note"
                  onClick={onNewNote}
                >
                  <HugeiconsIcon icon={AddCircleIcon} size={18} />
                </Button>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex flex-wrap justify-center gap-2">
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
                  variant="outline"
                  className={cn(sortKey !== "last_updated" && "bg-muted")}
                  onClick={onOpenMobileSort}
                >
                  Sort by
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Export"
                  onClick={onOpenMobileExport}
                >
                  <HugeiconsIcon icon={Download01Icon} size={18} />
                </Button>

                {filtersActive ? (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={onClearFilters}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  )
}
