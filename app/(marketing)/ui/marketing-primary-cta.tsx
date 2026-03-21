"use client"

import Link from "next/link"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MarketingPrimaryCta({
  className,
  label = "Get started",
}: {
  className?: string
  label?: string
}) {
  return (
    <Button
      render={<Link href="/login" />}
      className={cn("group w-full sm:w-auto", className)}
    >
      <span className="inline-flex items-center gap-2">
        {label}
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          size={18}
          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </Button>
  )
}
