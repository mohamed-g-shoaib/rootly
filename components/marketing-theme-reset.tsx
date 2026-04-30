"use client"

import * as React from "react"

import { applyThemeColors } from "@/lib/color-theme-dom"
import { getThemeById } from "@/lib/themes"

const MARKETING_THEME_ID = "rootly"

function applyMarketingTheme() {
  document.documentElement.classList.remove("dark")
  document.documentElement.style.colorScheme = "light"

  const theme = getThemeById(MARKETING_THEME_ID)
  if (!theme) return

  applyThemeColors(theme.light)
}

export function MarketingThemeReset() {
  React.useLayoutEffect(() => {
    applyMarketingTheme()
  }, [])

  return null
}
