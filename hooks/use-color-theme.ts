"use client"

import * as React from "react"

import { useTheme } from "@/components/theme-provider"
import {
  COLOR_THEME_COOKIE_NAME,
  CALCOM_THEME_ID,
  DASHBOARD_DEFAULT_CUSTOM_THEME_ID,
  normalizeColorThemeId,
  type ColorThemeId,
} from "@/lib/color-theme"
import {
  applyThemeColors,
  clearThemeColors,
  syncDashboardThemeStyle,
} from "@/lib/color-theme-dom"
import { getThemeById } from "@/lib/themes"

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const listeners = new Set<() => void>()
let currentThemeId: ColorThemeId = DASHBOARD_DEFAULT_CUSTOM_THEME_ID
let hasLoadedThemePreference = false
let activeColorThemeConsumers = 0

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

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentThemeId
}

function getServerSnapshot() {
  return DASHBOARD_DEFAULT_CUSTOM_THEME_ID
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

  if (rawThemeId && nextThemeId === CALCOM_THEME_ID) {
    clearPreferenceCookie()
  }
  if (
    rawThemeId &&
    nextThemeId === DASHBOARD_DEFAULT_CUSTOM_THEME_ID &&
    rawThemeId !== DASHBOARD_DEFAULT_CUSTOM_THEME_ID
  ) {
    setPreferenceCookie(DASHBOARD_DEFAULT_CUSTOM_THEME_ID)
  }
  if (!rawThemeId && nextThemeId === DASHBOARD_DEFAULT_CUSTOM_THEME_ID) {
    setPreferenceCookie(DASHBOARD_DEFAULT_CUSTOM_THEME_ID)
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
    activeColorThemeConsumers += 1

    return () => {
      activeColorThemeConsumers -= 1

      if (activeColorThemeConsumers > 0) {
        return
      }

      clearThemeColors()
      syncDashboardThemeStyle(DASHBOARD_DEFAULT_CUSTOM_THEME_ID)
    }
  }, [])

  React.useEffect(() => {
    loadThemePreferenceFromCookie()
  }, [])

  const setThemeId = React.useCallback((id: string) => {
    const nextThemeId = normalizeColorThemeId(id)
    updateSnapshot(nextThemeId)

    if (nextThemeId === CALCOM_THEME_ID) {
      clearPreferenceCookie()
      return
    }
    setPreferenceCookie(nextThemeId)
  }, [])

  React.useEffect(() => {
    if (themeId === CALCOM_THEME_ID) {
      clearThemeColors()
      syncDashboardThemeStyle(themeId)
      return
    }

    const theme = getThemeById(themeId)
    if (!theme) {
      clearThemeColors()
      syncDashboardThemeStyle(DASHBOARD_DEFAULT_CUSTOM_THEME_ID)
      return
    }

    const variant = resolvedTheme === "dark" ? theme.dark : theme.light
    applyThemeColors(variant)
    syncDashboardThemeStyle(themeId)
  }, [resolvedTheme, themeId])

  return { themeId, setThemeId }
}
