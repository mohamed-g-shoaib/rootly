"use client"

import * as React from "react"

type OverflowAxis = "vertical" | "horizontal" | "both"

export function useElementOverflow<T extends HTMLElement>({
  axis = "vertical",
  threshold = 1,
  watch,
}: {
  axis?: OverflowAxis
  threshold?: number
  watch?: unknown
} = {}) {
  const targetRef = React.useRef<T | null>(null)
  const contentRef = React.useRef<T | null>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  React.useLayoutEffect(() => {
    const target = targetRef.current
    const content = contentRef.current ?? target
    if (!target || !content) return

    let frame = 0

    const measure = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const targetRect = target.getBoundingClientRect()
        const contentRect = content.getBoundingClientRect()

        const verticalByScroll =
          target.scrollHeight - target.clientHeight > threshold
        const horizontalByScroll =
          target.scrollWidth - target.clientWidth > threshold

        const vertical =
          verticalByScroll || contentRect.height - targetRect.height > threshold
        const horizontal =
          horizontalByScroll || contentRect.width - targetRect.width > threshold

        const next =
          axis === "both"
            ? vertical || horizontal
            : axis === "horizontal"
              ? horizontal
              : vertical

        setIsOverflowing((current) => (current === next ? current : next))
      })
    }

    measure()

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            measure()
          })
        : null

    resizeObserver?.observe(target)
    if (content !== target) {
      resizeObserver?.observe(content)
    }
    window.addEventListener("resize", measure)

    const fontSet = document.fonts
    const handleFontLoad = () => {
      measure()
    }

    if (fontSet?.addEventListener) {
      fontSet.addEventListener("loadingdone", handleFontLoad)
    } else {
      void fontSet?.ready.then(handleFontLoad)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener("resize", measure)
      fontSet?.removeEventListener?.("loadingdone", handleFontLoad)
    }
  }, [axis, threshold, watch])

  return { contentRef, isOverflowing, targetRef }
}
