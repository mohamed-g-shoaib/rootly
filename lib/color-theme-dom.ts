"use client"

import {
  buildColorThemeCss,
  DASHBOARD_COLOR_THEME_STYLE_ID,
  type ColorThemeId,
} from "@/lib/color-theme"
import { THEMES, type ThemeColors } from "@/lib/themes"

export function applyThemeColors(colors: ThemeColors) {
  for (const [key, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(`--${key}`, value)
  }
}

export function clearThemeColors() {
  const theme = THEMES[0]
  if (!theme) return

  for (const key of Object.keys(theme.light)) {
    document.documentElement.style.removeProperty(`--${key}`)
  }
}

export function syncDashboardThemeStyle(themeId: ColorThemeId) {
  if (typeof document === "undefined") return

  const style = document.getElementById(DASHBOARD_COLOR_THEME_STYLE_ID)
  if (!(style instanceof HTMLStyleElement)) return

  style.dataset.colorThemeId = themeId
  style.textContent = buildColorThemeCss(themeId)
}
