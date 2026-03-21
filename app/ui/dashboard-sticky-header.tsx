"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function DashboardStickyHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "sticky top-14 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className
      )}
    >
      {children}
    </div>
  )
}
