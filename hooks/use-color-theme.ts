"use client"

import * as React from "react"

import { useTheme } from "next-themes"

import {
  COLOR_THEME_COOKIE_NAME,
  COSS_UI_THEME_ID,
  DASHBOARD_COLOR_THEME_STYLE_ID,
  normalizeColorThemeId,
  type ColorThemeId,
} from "@/lib/color-theme"
import { getThemeById, THEMES, type ThemeColors } from "@/lib/themes"

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const listeners = new Set<() => void>()
let currentThemeId: ColorThemeId = COSS_UI_THEME_ID
let hasLoadedThemePreference = false

function readPreferenceCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COLOR_THEME_COOKIE_NAME}=`))

  if (!match) return null
  return decodeURIComponent(match.split("=").slice(1).join("="))
}

function setPreferenceCookie(value: string) {
  if (typeof document === "undefined") return
  const secureFlag = IS_PRODUCTION ? "; secure" : ""
  document.cookie = `${COLOR_THEME_COOKIE_NAME}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secureFlag}`
}

function clearPreferenceCookie() {
  if (typeof document === "undefined") return
  const secureFlag = IS_PRODUCTION ? "; secure" : ""
  document.cookie = `${COLOR_THEME_COOKIE_NAME}=; path=/; max-age=0; samesite=lax${secureFlag}`
}

function applyColors(colors: ThemeColors) {
  for (const [key, value] of Object.entries(colors)) {
    document.documentElement.style.setProperty(`--${key}`, value)
  }
}

function clearColors() {
  const theme = THEMES[0]
  if (!theme) return
  for (const key of Object.keys(theme.light)) {
    document.documentElement.style.removeProperty(`--${key}`)
  }
}

function removeServerThemeStyle() {
  if (typeof document === "undefined") return
  document.getElementById(DASHBOARD_COLOR_THEME_STYLE_ID)?.remove()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentThemeId
}

function getServerSnapshot() {
  return COSS_UI_THEME_ID
}

function updateSnapshot(nextThemeId: ColorThemeId) {
  if (currentThemeId === nextThemeId) return
  currentThemeId = nextThemeId
  for (const listener of listeners) listener()
}

function loadThemePreferenceFromCookie() {
  if (hasLoadedThemePreference) return
  hasLoadedThemePreference = true
  const rawThemeId = readPreferenceCookie()
  const nextThemeId = normalizeColorThemeId(rawThemeId)

  if (rawThemeId && nextThemeId === COSS_UI_THEME_ID) {
    clearPreferenceCookie()
  }

  updateSnapshot(nextThemeId)
}

export function useColorTheme(): {
  themeId: string
  setThemeId: (id: string) => void
} {
  const { resolvedTheme } = useTheme()
  const themeId = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  React.useEffect(() => {
    loadThemePreferenceFromCookie()
  }, [])

  const setThemeId = React.useCallback((id: string) => {
    const nextThemeId = normalizeColorThemeId(id)
    updateSnapshot(nextThemeId)

    if (nextThemeId === COSS_UI_THEME_ID) {
      clearPreferenceCookie()
      return
    }
    setPreferenceCookie(nextThemeId)
  }, [])

  React.useEffect(() => {
    if (themeId === COSS_UI_THEME_ID) {
      clearColors()
      removeServerThemeStyle()
      return
    }

    const theme = getThemeById(themeId)
    if (!theme) {
      clearColors()
      removeServerThemeStyle()
      return
    }

    const variant = resolvedTheme === "dark" ? theme.dark : theme.light
    applyColors(variant)
  }, [resolvedTheme, themeId])

  return { themeId, setThemeId }
}
