"use client"

import * as React from "react"

import { resetDashboardTheme } from "@/lib/color-theme-dom"

export function ColorThemeReset() {
  React.useEffect(() => {
    resetDashboardTheme()
  }, [])

  return null
}
