"use client"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

type DashboardPaginationDockProps = {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  disabled?: boolean
}

export function DashboardPaginationDock({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  disabled = false,
}: DashboardPaginationDockProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 md:bottom-3">
      <div className="pointer-events-auto mx-auto w-fit rounded-full border border-border/60 bg-background/82 px-1 py-1 shadow-sm backdrop-blur-md">
        <Pagination className="w-auto">
          <PaginationContent className="gap-0.5">
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 rounded-full px-3 text-xs"
                onClick={onPrevious}
                disabled={disabled || currentPage <= 1}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-xs text-muted-foreground tabular-nums">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 rounded-full px-3 text-xs"
                onClick={onNext}
                disabled={disabled || currentPage >= totalPages}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
