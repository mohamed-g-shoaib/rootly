"use client"

import * as React from "react"

import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function MarketingPrimaryCta({
  className,
  label = "Get started",
  loadingLabel = "Loading",
}: {
  className?: string
  label?: string
  loadingLabel?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className={cn("group w-full sm:w-auto", className)}
      disabled={isPending}
      aria-busy={isPending}
      onClick={() => {
        startTransition(() => {
          router.push("/login")
        })
      }}
    >
      <span className="inline-flex items-center gap-2">
        {isPending ? <Spinner className="size-4.5 sm:size-4" /> : null}
        <span>{isPending ? loadingLabel : label}</span>
        {!isPending ? (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={18}
            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        ) : null}
      </span>
    </Button>
  )
}
