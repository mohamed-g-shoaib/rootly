"use client"

import * as React from "react"

import { AddCircleIcon, Calendar01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { PageContainer } from "@/components/ui/page-container"
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header"
import { DashboardMobileActionRow } from "@/app/ui/dashboard-mobile-action-row"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover"

import { toDateInputValue, type MoodFilter } from "./daily-entries-model"

export function DailyEntriesHeader({
  isMobile,
  fromDate,
  toDate,
  moodFilter,
  filtersActive,
  todayHasEntry,
  onFromDateChange,
  onToDateChange,
  onMoodChange,
  onClearFilters,
  onPrimaryAction,
  onOpenMobileDates,
  onOpenMobileMood,
}: {
  isMobile: boolean
  fromDate: string
  toDate: string
  moodFilter: MoodFilter
  filtersActive: boolean
  todayHasEntry: boolean
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onMoodChange: (value: MoodFilter) => void
  onClearFilters: () => void
  onPrimaryAction: () => void
  onOpenMobileDates: () => void
  onOpenMobileMood: () => void
}) {
  const moodItems = React.useMemo<{ value: MoodFilter; label: string }[]>(
    () => [
      { value: "all", label: "All Moods" },
      { value: 3, label: "Focused" },
      { value: 2, label: "Neutral" },
      { value: 1, label: "Burned Out" },
    ],
    []
  )

  const selectedMood = React.useMemo(
    () => moodItems.find((x) => x.value === moodFilter) ?? moodItems[0],
    [moodFilter, moodItems]
  )

  const selectedRange = React.useMemo<DateRange | undefined>(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : undefined
    const to = toDate ? new Date(`${toDate}T00:00:00`) : undefined
    if (!from && !to) return undefined
    return { from, to }
  }, [fromDate, toDate])

  const rangeLabel = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

    if (!selectedRange?.from) return null
    if (!selectedRange.to) return formatter.format(selectedRange.from)
    return `${formatter.format(selectedRange.from)} - ${formatter.format(
      selectedRange.to
    )}`
  }, [selectedRange?.from, selectedRange?.to])

  return (
    <DashboardStickyHeader>
      <PageContainer>
        {!isMobile ? (
          <div className="flex items-center gap-3 py-4">
            <div className="text-lg font-medium">Daily Entries</div>

            <div className="flex flex-1 items-center gap-2">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      className="w-[260px] justify-start text-left font-normal"
                      variant="outline"
                    />
                  }
                >
                  <HugeiconsIcon icon={Calendar01Icon} size={18} />
                  {rangeLabel ?? <span>Pick a date range</span>}
                </PopoverTrigger>
                <PopoverPopup align="start" className="w-auto p-0">
                  <Calendar
                    defaultMonth={selectedRange?.from}
                    mode="range"
                    onSelect={(range) => {
                      onFromDateChange(
                        range?.from ? toDateInputValue(range.from) : ""
                      )
                      onToDateChange(
                        range?.to ? toDateInputValue(range.to) : ""
                      )
                    }}
                    selected={selectedRange}
                  />
                </PopoverPopup>
              </Popover>

              <div className="w-48">
                <Combobox
                  items={moodItems}
                  value={selectedMood}
                  onValueChange={(value) =>
                    onMoodChange((value?.value ?? "all") as MoodFilter)
                  }
                >
                  <ComboboxInput
                    placeholder="All Moods"
                    aria-label="Mood"
                    showClear={moodFilter !== "all"}
                  />
                  <ComboboxPopup>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={String(item.value)} value={item}>
                          <span className="truncate">{item.label}</span>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxPopup>
                </Combobox>
              </div>

              {filtersActive ? (
                <Button variant="ghost" type="button" onClick={onClearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>

            <Button onClick={onPrimaryAction} type="button" className="gap-2">
              <HugeiconsIcon icon={AddCircleIcon} size={18} />
              {todayHasEntry ? "Today's Entry" : "Log Today"}
            </Button>
          </div>
        ) : (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Daily Entries</div>
              <Button
                size="icon"
                aria-label={todayHasEntry ? "Today's entry" : "Log today"}
                onClick={onPrimaryAction}
              >
                <HugeiconsIcon icon={AddCircleIcon} size={18} />
              </Button>
            </div>

            <div className="pt-3">
              <DashboardMobileActionRow>
                <Button
                  variant="outline"
                  className={cn(
                    (fromDate !== "" || toDate !== "") && "bg-muted"
                  )}
                  onClick={onOpenMobileDates}
                >
                  Dates
                </Button>
                <Button
                  variant="outline"
                  className={cn(moodFilter !== "all" && "bg-muted")}
                  onClick={onOpenMobileMood}
                >
                  Mood
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
              </DashboardMobileActionRow>
            </div>
          </div>
        )}
      </PageContainer>
    </DashboardStickyHeader>
  )
}
