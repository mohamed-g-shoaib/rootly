"use client"

import * as React from "react"

import { useTheme } from "next-themes"

import { DEFAULT_THEME_ID, THEMES, type ThemeColors } from "@/lib/themes"

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const COOKIE_NAME = "reway.dashboard.paletteTheme"

function readPreferenceCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))

  if (!match) return null
  return decodeURIComponent(match.split("=").slice(1).join("="))
}

function setPreferenceCookie(value: string) {
  if (typeof document === "undefined") return
  const secureFlag = IS_PRODUCTION ? "; secure" : ""
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    value
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secureFlag}`
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

export function useColorTheme(): {
  themeId: string
  setThemeId: (id: string) => void
} {
  const { resolvedTheme } = useTheme()

  const [themeId, setThemeIdState] = React.useState<string>(
    readPreferenceCookie() || "default"
  )

  React.useEffect(() => {
    const value = readPreferenceCookie()
    if (value) setThemeIdState(value)
  }, [])

  const setThemeId = React.useCallback((id: string) => {
    setThemeIdState(id)
    setPreferenceCookie(id)
  }, [])

  React.useEffect(() => {
    if (themeId === "default") {
      clearColors()
      return
    }

    const theme =
      THEMES.find((t) => t.id === themeId) ??
      THEMES.find((t) => t.id === DEFAULT_THEME_ID) ??
      THEMES[0]

    const variant = resolvedTheme === "dark" ? theme.dark : theme.light
    applyColors(variant)
  }, [resolvedTheme, themeId])

  return { themeId, setThemeId }
}
