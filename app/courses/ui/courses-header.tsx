"use client"

import * as React from "react"

import { AddCircleIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { PageContainer } from "@/components/ui/page-container"
import { Button } from "@/components/ui/button"
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
  SelectValue,
} from "@/components/ui/select"

import type { SortKey, TopicFilter } from "./courses-model"

export function CoursesHeader({
  isMobile,
  topicItems,
  topicFilter,
  sortKey,
  filtersActive,
  onTopicChange,
  onSortChange,
  onNewCourse,
  onClearFilters,
  onOpenMobileTopic,
  onOpenMobileSort,
}: {
  isMobile: boolean
  topicItems: { value: TopicFilter; label: string }[]
  topicFilter: TopicFilter
  sortKey: SortKey
  filtersActive: boolean
  onTopicChange: (value: TopicFilter) => void
  onSortChange: (value: SortKey) => void
  onNewCourse: () => void
  onClearFilters: () => void
  onOpenMobileTopic: () => void
  onOpenMobileSort: () => void
}) {
  const selectedTopic = React.useMemo(
    () => topicItems.find((t) => t.value === topicFilter) ?? topicItems[0],
    [topicFilter, topicItems]
  )

  return (
    <div className="sticky top-0 z-10 border-b bg-background">
      <PageContainer>
        {!isMobile ? (
          <div className="flex items-center gap-3 py-4">
            <div className="text-lg font-medium">Courses</div>

            <div className="flex flex-1 items-center gap-2">
              <div className="w-56">
                <Combobox
                  items={topicItems}
                  value={selectedTopic}
                  onValueChange={(v) =>
                    onTopicChange((v?.value ?? "all") as TopicFilter)
                  }
                >
                  <ComboboxInput
                    placeholder="All Topics"
                    aria-label="Topic"
                    showClear={topicFilter !== "all"}
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
                    <span className="min-w-0 truncate">
                      <SelectValue placeholder="Sort" />
                    </span>
                    <HugeiconsIcon icon={UnfoldMoreIcon} size={18} />
                  </span>
                </SelectTrigger>
                <SelectPopup alignItemWithTrigger={false}>
                  <SelectItem value="last_updated">Last Updated</SelectItem>
                  <SelectItem value="date_created">Date Created</SelectItem>
                  <SelectItem value="progress_low">
                    Progress (Low → High)
                  </SelectItem>
                  <SelectItem value="progress_high">
                    Progress (High → Low)
                  </SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectPopup>
              </Select>

              {filtersActive ? (
                <Button variant="ghost" onClick={onClearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>

            <Button className="gap-2" onClick={onNewCourse}>
              <HugeiconsIcon icon={AddCircleIcon} size={18} />
              New Course
            </Button>
          </div>
        ) : (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Courses</div>
              <Button size="icon" aria-label="New course" onClick={onNewCourse}>
                <HugeiconsIcon icon={AddCircleIcon} size={18} />
              </Button>
            </div>

            <div className="pt-3">
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  className={cn(topicFilter !== "all" && "bg-muted")}
                  onClick={onOpenMobileTopic}
                >
                  Topic
                </Button>
                <Button
                  variant="outline"
                  className={cn(sortKey !== "last_updated" && "bg-muted")}
                  onClick={onOpenMobileSort}
                >
                  Sort by
                </Button>

                {filtersActive ? (
                  <Button variant="ghost" onClick={onClearFilters}>
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
