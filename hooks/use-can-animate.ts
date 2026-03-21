"use client"

import * as React from "react"

import { useReducedMotion } from "motion/react"

export function useCanAnimate() {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted && !shouldReduceMotion
}
