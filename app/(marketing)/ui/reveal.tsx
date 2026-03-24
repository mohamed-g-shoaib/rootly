"use client"

import * as React from "react"

import { domAnimation, LazyMotion, m } from "motion/react"

import { useCanAnimate } from "@/hooks/use-can-animate"

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

const easeOut = [0.32, 0.72, 0, 1] as const

export function Reveal({
  as = "div",
  mode = "in-view",
  children,
  className,
  y = 12,
  delay = 0,
  amount = 0.25,
}: RevealProps) {
  const canAnimate = useCanAnimate()

  if (!canAnimate) {
    return React.createElement(as, { className }, children)
  }

  const motionProps =
    mode === "mount"
      ? {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
        }
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount },
        }

  const transition = delay
    ? { duration: 0.3, ease: easeOut, delay }
    : { duration: 0.3, ease: easeOut }

  switch (as) {
    case "h1":
      return (
        <LazyMotion features={domAnimation}>
          <m.h1 className={className} transition={transition} {...motionProps}>
            {children}
          </m.h1>
        </LazyMotion>
      )

    case "h2":
      return (
        <LazyMotion features={domAnimation}>
          <m.h2 className={className} transition={transition} {...motionProps}>
            {children}
          </m.h2>
        </LazyMotion>
      )

    case "p":
      return (
        <LazyMotion features={domAnimation}>
          <m.p className={className} transition={transition} {...motionProps}>
            {children}
          </m.p>
        </LazyMotion>
      )

    default:
      return (
        <LazyMotion features={domAnimation}>
          <m.div className={className} transition={transition} {...motionProps}>
            {children}
          </m.div>
        </LazyMotion>
      )
  }
}
