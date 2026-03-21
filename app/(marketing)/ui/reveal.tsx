"use client"

import * as React from "react"

import { motion } from "motion/react"

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
        <motion.h1 className={className} transition={transition} {...motionProps}>
          {children}
        </motion.h1>
      )

    case "h2":
      return (
        <motion.h2 className={className} transition={transition} {...motionProps}>
          {children}
        </motion.h2>
      )

    case "p":
      return (
        <motion.p className={className} transition={transition} {...motionProps}>
          {children}
        </motion.p>
      )

    default:
      return (
        <motion.div
          className={className}
          transition={transition}
          {...motionProps}
        >
          {children}
        </motion.div>
      )
  }
}
