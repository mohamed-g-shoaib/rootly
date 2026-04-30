import { cookies } from "next/headers"

import {
  buildColorThemeCss,
  COLOR_THEME_COOKIE_NAME,
  DASHBOARD_COLOR_THEME_STYLE_ID,
  normalizeColorThemeId,
} from "@/lib/color-theme"

export async function DashboardColorThemeStyle() {
  const cookieStore = await cookies()
  const themeId = normalizeColorThemeId(
    cookieStore.get(COLOR_THEME_COOKIE_NAME)?.value
  )
  const css = buildColorThemeCss(themeId)

  if (!css) return null

  return (
    <style
      id={DASHBOARD_COLOR_THEME_STYLE_ID}
      data-color-theme-id={themeId}
      suppressHydrationWarning
    >
      {css}
    </style>
  )
}
