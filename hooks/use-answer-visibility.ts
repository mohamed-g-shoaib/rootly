"use client"

import * as React from "react"

export function useAnswerVisibility(initialShown = false) {
  const [defaultShown, setDefaultShown] = React.useState(initialShown)
  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({})

  const isShown = React.useCallback(
    (id: string) => overrides[id] ?? defaultShown,
    [defaultShown, overrides]
  )

  const setShown = React.useCallback(
    (id: string, shown: boolean) => {
      setOverrides((current) => {
        if (shown === defaultShown) {
          if (!(id in current)) return current
          const next = { ...current }
          delete next[id]
          return next
        }

        return {
          ...current,
          [id]: shown,
        }
      })
    },
    [defaultShown]
  )

  const setAllShown = React.useCallback((shown: boolean) => {
    setDefaultShown(shown)
    setOverrides({})
  }, [])

  const clearForId = React.useCallback((id: string) => {
    setOverrides((current) => {
      if (!(id in current)) return current
      const next = { ...current }
      delete next[id]
      return next
    })
  }, [])

  return {
    clearForId,
    defaultShown,
    isShown,
    overrides,
    setAllShown,
    setShown,
  }
}
