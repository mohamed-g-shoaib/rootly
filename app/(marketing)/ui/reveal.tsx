"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RevealTag = "div" | "h1" | "h2" | "p"
type RevealMode = "mount" | "in-view"

type RevealProps = {
  as?: RevealTag
  mode?: RevealMode
  children: React.ReactNode
  className?: string
  y?: number
  delay?: number
  amount?: number
}

const REVEAL_DELAY_CLASS = {
  0: "motion-safe:delay-0",
  0.05: "motion-safe:delay-75",
  0.1: "motion-safe:delay-100",
  0.15: "motion-safe:delay-150",
  0.2: "motion-safe:delay-200",
} as const

const REVEAL_OFFSET_CLASS = {
  12: "motion-safe:translate-y-3",
  16: "motion-safe:translate-y-4",
} as const

const REVEAL_BASE_CLASS =
  "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)]"

export function Reveal({
  as = "div",
  mode = "in-view",
  children,
  className,
  y = 12,
  delay = 0,
  amount = 0.25,
}: RevealProps) {
  const [isShown, setIsShown] = React.useState(false)
  const [node, setNode] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (mode !== "mount") return

    const frame = window.requestAnimationFrame(() => {
      setIsShown(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [mode])

  React.useEffect(() => {
    if (mode !== "in-view") return
    if (!node || isShown) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        setIsShown(true)
      },
      { threshold: amount }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [amount, isShown, mode, node])

  return React.createElement(
    as,
    {
      ref: setNode,
      className: cn(
        className,
        REVEAL_BASE_CLASS,
        REVEAL_DELAY_CLASS[delay as keyof typeof REVEAL_DELAY_CLASS] ??
          "motion-safe:delay-0",
        isShown
          ? "motion-safe:opacity-100 motion-safe:translate-y-0"
          : cn(
              "motion-safe:opacity-0",
              REVEAL_OFFSET_CLASS[y as keyof typeof REVEAL_OFFSET_CLASS] ??
                "motion-safe:translate-y-3"
            )
      ),
      "data-reveal-state": isShown ? "shown" : "hidden",
    },
    children
  )
}
