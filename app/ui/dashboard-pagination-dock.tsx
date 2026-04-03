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
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+var(--dashboard-floating-gap-mobile)+var(--dashboard-dock-height-mobile)+var(--dashboard-floating-gap-mobile))] z-50 md:bottom-[calc(var(--dashboard-floating-gap-desktop)+var(--dashboard-dock-height-desktop)+var(--dashboard-floating-gap-desktop))]">
      <div className="pointer-events-auto mx-auto w-fit rounded-[calc(var(--radius)+4px)] border border-border/60 bg-background/82 px-1 py-1 shadow-sm backdrop-blur-md">
        <Pagination className="w-auto">
          <PaginationContent className="gap-0.5">
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 rounded-lg px-3 text-xs"
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
                className="h-10 rounded-lg px-3 text-xs"
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
