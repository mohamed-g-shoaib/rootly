import { getThemeById, THEME_IDS } from "@/lib/themes"

export const COSS_UI_THEME_ID = "default"
// Which custom theme should be used when there is no cookie (or it is invalid/stale).
export const DASHBOARD_DEFAULT_CUSTOM_THEME_ID = "claude-blue"
export const COLOR_THEME_COOKIE_NAME = "reway.dashboard.paletteTheme"
export const DASHBOARD_COLOR_THEME_STYLE_ID = "dashboard-color-theme-ssr"

export type StoredColorThemeId = (typeof THEME_IDS)[number]
export type ColorThemeId = StoredColorThemeId | typeof COSS_UI_THEME_ID

function isStoredColorThemeId(
  value: string | null | undefined
): value is StoredColorThemeId {
  if (!value) return false
  return THEME_IDS.includes(value as StoredColorThemeId)
}

export function normalizeColorThemeId(
  value: string | null | undefined
): ColorThemeId {
  // "default" always means: no custom dashboard token overrides.
  if (value === COSS_UI_THEME_ID) return COSS_UI_THEME_ID

  // No cookie (fresh user) or invalid/stale cookie: fall back to the default custom theme.
  if (!value) return DASHBOARD_DEFAULT_CUSTOM_THEME_ID

  return isStoredColorThemeId(value) ? value : DASHBOARD_DEFAULT_CUSTOM_THEME_ID
}

export function buildColorThemeCss(themeId: ColorThemeId): string {
  if (themeId === COSS_UI_THEME_ID) return ""

  const theme = getThemeById(themeId)
  if (!theme) return ""

  const light = Object.entries(theme.light)
    .map(([key, value]) => `--${key}:${value};`)
    .join("")
  const dark = Object.entries(theme.dark)
    .map(([key, value]) => `--${key}:${value};`)
    .join("")

  return `:root{${light}}.dark{${dark}}`
}
