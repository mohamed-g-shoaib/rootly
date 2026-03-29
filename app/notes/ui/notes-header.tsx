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
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header"
import { DashboardMobileActionRow } from "@/app/ui/dashboard-mobile-action-row"

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

import type { CourseFilter, SortKey, TypeFilter } from "./notes-model"
export function NotesHeader({
  isMobile,
  courses,
  filteredCount,
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
  onExportPdf,
  onExportMarkdown,
  exporting,
}: {
  isMobile: boolean
  courses: { id: string; title: string }[]
  filteredCount: number
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
  onExportPdf: () => void
  onExportMarkdown: () => void
  exporting: boolean
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

  return (
    <DashboardStickyHeader>
      <PageContainer>
        {isMobile ? (
          <MobileNotesHeader
            typeFilter={typeFilter}
            courseFilter={courseFilter}
            flaggedOnly={flaggedOnly}
            sortKey={sortKey}
            globalShowAnswers={globalShowAnswers}
            hasQa={hasQa}
            filtersActive={filtersActive}
            onToggleFlaggedOnly={onToggleFlaggedOnly}
            onToggleGlobalAnswers={onToggleGlobalAnswers}
            onNewNote={onNewNote}
            onOpenMobileType={onOpenMobileType}
            onOpenMobileCourse={onOpenMobileCourse}
            onOpenMobileSort={onOpenMobileSort}
            onOpenMobileExport={onOpenMobileExport}
            onClearFilters={onClearFilters}
          />
        ) : (
          <DesktopNotesHeader
            typeItems={typeItems}
            selectedType={selectedType}
            typeFilter={typeFilter}
            onTypeChange={onTypeChange}
            courseItems={courseItems}
            selectedCourse={selectedCourse}
            courseFilter={courseFilter}
            onCourseChange={onCourseChange}
            sortKey={sortKey}
            sortLabel={sortLabel}
            onSortChange={onSortChange}
            filtersActive={filtersActive}
            filteredCount={filteredCount}
            exporting={exporting}
            onExportPdf={onExportPdf}
            onExportMarkdown={onExportMarkdown}
            onClearFilters={onClearFilters}
            flaggedOnly={flaggedOnly}
            onToggleFlaggedOnly={onToggleFlaggedOnly}
            hasQa={hasQa}
            globalShowAnswers={globalShowAnswers}
            onToggleGlobalAnswers={onToggleGlobalAnswers}
            onNewNote={onNewNote}
          />
        )}
      </PageContainer>
    </DashboardStickyHeader>
  )
}

function DesktopNotesHeader({
  typeItems,
  selectedType,
  typeFilter,
  onTypeChange,
  courseItems,
  selectedCourse,
  courseFilter,
  onCourseChange,
  sortKey,
  sortLabel,
  onSortChange,
  filtersActive,
  filteredCount,
  exporting,
  onExportPdf,
  onExportMarkdown,
  onClearFilters,
  flaggedOnly,
  onToggleFlaggedOnly,
  hasQa,
  globalShowAnswers,
  onToggleGlobalAnswers,
  onNewNote,
}: {
  typeItems: { value: TypeFilter; label: string }[]
  selectedType: { value: TypeFilter; label: string }
  typeFilter: TypeFilter
  onTypeChange: (value: TypeFilter) => void
  courseItems: { value: CourseFilter; label: string }[]
  selectedCourse: { value: CourseFilter; label: string }
  courseFilter: CourseFilter
  onCourseChange: (value: CourseFilter) => void
  sortKey: SortKey
  sortLabel: string
  onSortChange: (value: SortKey) => void
  filtersActive: boolean
  filteredCount: number
  exporting: boolean
  onExportPdf: () => void
  onExportMarkdown: () => void
  onClearFilters: () => void
  flaggedOnly: boolean
  onToggleFlaggedOnly: () => void
  hasQa: boolean
  globalShowAnswers: boolean
  onToggleGlobalAnswers: () => void
  onNewNote: () => void
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="text-lg font-medium">Notes</div>

      <div className="flex flex-1 items-center gap-2">
        <HeaderFilterCombobox
          ariaLabel="Type"
          placeholder="All Types"
          items={typeItems}
          value={selectedType}
          widthClassName="w-40"
          showClear={typeFilter !== "all"}
          onValueChange={(value) => onTypeChange((value?.value ?? "all") as TypeFilter)}
        />

        <HeaderFilterCombobox
          ariaLabel="Course"
          placeholder="All Courses"
          items={courseItems}
          value={selectedCourse}
          widthClassName="w-56"
          showClear={courseFilter !== "all"}
          onValueChange={(value) =>
            onCourseChange((value?.value ?? "all") as CourseFilter)
          }
        />

        <SortSelect sortKey={sortKey} sortLabel={sortLabel} onSortChange={onSortChange} />

        <NotesExportPopover
          filtersActive={filtersActive}
          filteredCount={filteredCount}
          exporting={exporting}
          onExportPdf={onExportPdf}
          onExportMarkdown={onExportMarkdown}
        />

        {filtersActive ? (
          <Button variant="ghost" type="button" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      <NotesHeaderActions
        flaggedOnly={flaggedOnly}
        hasQa={hasQa}
        globalShowAnswers={globalShowAnswers}
        mobile={false}
        onToggleFlaggedOnly={onToggleFlaggedOnly}
        onToggleGlobalAnswers={onToggleGlobalAnswers}
        onNewNote={onNewNote}
      />
    </div>
  )
}

function MobileNotesHeader({
  typeFilter,
  courseFilter,
  flaggedOnly,
  sortKey,
  globalShowAnswers,
  hasQa,
  filtersActive,
  onToggleFlaggedOnly,
  onToggleGlobalAnswers,
  onNewNote,
  onOpenMobileType,
  onOpenMobileCourse,
  onOpenMobileSort,
  onOpenMobileExport,
  onClearFilters,
}: {
  typeFilter: TypeFilter
  courseFilter: CourseFilter
  flaggedOnly: boolean
  sortKey: SortKey
  globalShowAnswers: boolean
  hasQa: boolean
  filtersActive: boolean
  onToggleFlaggedOnly: () => void
  onToggleGlobalAnswers: () => void
  onNewNote: () => void
  onOpenMobileType: () => void
  onOpenMobileCourse: () => void
  onOpenMobileSort: () => void
  onOpenMobileExport: () => void
  onClearFilters: () => void
}) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Notes</div>
        <NotesHeaderActions
          flaggedOnly={flaggedOnly}
          hasQa={hasQa}
          globalShowAnswers={globalShowAnswers}
          mobile
          onToggleFlaggedOnly={onToggleFlaggedOnly}
          onToggleGlobalAnswers={onToggleGlobalAnswers}
          onNewNote={onNewNote}
        />
      </div>

      <div className="pt-3">
        <DashboardMobileActionRow>
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
          <Button variant="outline" size="icon" aria-label="Export" onClick={onOpenMobileExport}>
            <HugeiconsIcon icon={Download01Icon} size={18} />
          </Button>
          {filtersActive ? (
            <Button variant="ghost" type="button" onClick={onClearFilters}>
              Clear
            </Button>
          ) : null}
        </DashboardMobileActionRow>
      </div>
    </div>
  )
}

function HeaderFilterCombobox<T extends { value: string; label: string }>({
  ariaLabel,
  placeholder,
  items,
  value,
  widthClassName,
  showClear,
  onValueChange,
}: {
  ariaLabel: string
  placeholder: string
  items: T[]
  value: T
  widthClassName: string
  showClear: boolean
  onValueChange: (value: T | null) => void
}) {
  return (
    <div className={widthClassName}>
      <Combobox items={items} value={value} onValueChange={onValueChange}>
        <ComboboxInput placeholder={placeholder} aria-label={ariaLabel} showClear={showClear} />
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
  )
}

function SortSelect({
  sortKey,
  sortLabel,
  onSortChange,
}: {
  sortKey: SortKey
  sortLabel: string
  onSortChange: (value: SortKey) => void
}) {
  return (
    <Select value={sortKey} onValueChange={(v) => onSortChange(v as SortKey)}>
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
  )
}

function NotesExportPopover({
  filtersActive,
  filteredCount,
  exporting,
  onExportPdf,
  onExportMarkdown,
}: {
  filtersActive: boolean
  filteredCount: number
  exporting: boolean
  onExportPdf: () => void
  onExportMarkdown: () => void
}) {
  return (
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
          <Button variant="outline" className="gap-2" onClick={onExportPdf} disabled={exporting}>
            <HugeiconsIcon
              icon={exporting ? Loading01Icon : Pdf01Icon}
              size={18}
              className={exporting ? "animate-spin" : undefined}
            />
            Export as PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={onExportMarkdown}>
            <HugeiconsIcon icon={TextSquareIcon} size={18} />
            Export as Markdown
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotesHeaderActions({
  flaggedOnly,
  hasQa,
  globalShowAnswers,
  mobile,
  onToggleFlaggedOnly,
  onToggleGlobalAnswers,
  onNewNote,
}: {
  flaggedOnly: boolean
  hasQa: boolean
  globalShowAnswers: boolean
  mobile: boolean
  onToggleFlaggedOnly: () => void
  onToggleGlobalAnswers: () => void
  onNewNote: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={mobile ? (flaggedOnly ? "secondary" : "ghost") : flaggedOnly ? "secondary" : "outline"}
        size="icon"
        aria-label={flaggedOnly ? "Show all notes" : "Show flagged notes"}
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
          variant={mobile ? (globalShowAnswers ? "secondary" : "ghost") : globalShowAnswers ? "secondary" : "outline"}
          size="icon"
          aria-label={globalShowAnswers ? "Hide all answers" : "Show all answers"}
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
        onClick={onNewNote}
        type="button"
        className={mobile ? undefined : "gap-2"}
        size={mobile ? "icon" : undefined}
        aria-label="New note"
      >
        <HugeiconsIcon icon={AddCircleIcon} size={18} />
        {mobile ? null : "New Note"}
      </Button>
    </div>
  )
}
