"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function DashboardMobileActionRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="flex min-w-max items-center gap-2">{children}</div>
    </div>
  )
}
