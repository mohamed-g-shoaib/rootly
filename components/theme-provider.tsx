"use client"

import * as React from "react"

import { clickSoftSound } from "@/lib/audio/click-soft"
import {
  DASHBOARD_THEME_COOKIE_NAME,
  DASHBOARD_THEME_ROOT_ID,
  LEGACY_DASHBOARD_THEME_STORAGE_KEY,
  normalizeDashboardTheme,
  type DashboardThemeMode,
} from "@/lib/dashboard-theme"
import { playSound } from "@/lib/audio/sound-engine"
import { switchOffSound } from "@/lib/audio/switch-off"
import { switchOnSound } from "@/lib/audio/switch-on"
import { useSound } from "@/hooks/use-sound"

const AUDIO_MUTED_STORAGE_KEY = "portfolio-audio-muted"

type ThemeContextValue = {
  theme: DashboardThemeMode
  resolvedTheme: DashboardThemeMode
  setTheme: (theme: DashboardThemeMode | "system") => void
}

type AudioPreferencesContextValue = {
  muted: boolean
  setMuted: React.Dispatch<React.SetStateAction<boolean>>
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)
const AudioPreferencesContext =
  React.createContext<AudioPreferencesContextValue | null>(null)

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "summary",
  "textarea",
  "[data-slot='button']",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='radio']",
  "[role='switch']",
  "[role='tab']",
].join(", ")

function applyTheme(theme: DashboardThemeMode) {
  const root = document.getElementById(DASHBOARD_THEME_ROOT_ID)
  const isDark = theme === "dark"

  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = theme

  if (root instanceof HTMLElement) {
    root.classList.toggle("dark", isDark)
    root.style.colorScheme = theme
  }
}

function readThemeCookie(): DashboardThemeMode | null {
  const match = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${DASHBOARD_THEME_COOKIE_NAME}=`))

  if (!match) return null

  return normalizeDashboardTheme(
    decodeURIComponent(match.split("=").slice(1).join("="))
  )
}

function writeThemeCookie(theme: DashboardThemeMode) {
  document.cookie = `${DASHBOARD_THEME_COOKIE_NAME}=${encodeURIComponent(
    theme
  )}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`
}

function readLegacyStoredTheme(): DashboardThemeMode | null {
  const stored = window.localStorage.getItem(LEGACY_DASHBOARD_THEME_STORAGE_KEY)
  if (!stored) return null
  return normalizeDashboardTheme(stored)
}

function AudioPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(AUDIO_MUTED_STORAGE_KEY)
    if (stored === "true") {
      setMuted(true)
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(AUDIO_MUTED_STORAGE_KEY, String(muted))
  }, [muted])

  const value = React.useMemo(() => ({ muted, setMuted }), [muted])

  return (
    <AudioPreferencesContext.Provider value={value}>
      <ClickSound />
      {children}
    </AudioPreferencesContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

export function useAudioPreferences() {
  const context = React.useContext(AudioPreferencesContext)

  if (!context) {
    throw new Error("useAudioPreferences must be used within ThemeProvider")
  }

  return context
}

export function playThemeSwitchSound({
  muted,
  fromTheme,
  toTheme,
}: {
  muted: boolean
  fromTheme: string | undefined
  toTheme: string
}) {
  if (muted) {
    return
  }

  const nextResolvedTheme =
    toTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : toTheme

  if (fromTheme === nextResolvedTheme) {
    return
  }

  void playSound(
    nextResolvedTheme === "dark"
      ? switchOffSound.dataUri
      : switchOnSound.dataUri
  )
}

function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: DashboardThemeMode
}) {
  const [clientTheme, setClientTheme] =
    React.useState<DashboardThemeMode | null>(null)
  const theme = clientTheme ?? initialTheme

  React.useLayoutEffect(() => {
    const cookieTheme = readThemeCookie()
    const legacyTheme = readLegacyStoredTheme()
    const nextTheme = cookieTheme ?? legacyTheme ?? initialTheme

    if (nextTheme !== initialTheme) {
      setClientTheme(nextTheme)
    }

    writeThemeCookie(nextTheme)
    applyTheme(nextTheme)

    return () => {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    }
  }, [initialTheme])

  const setTheme = React.useCallback(
    (nextTheme: DashboardThemeMode | "system") => {
      const resolvedTheme = nextTheme === "system" ? "light" : nextTheme
      setClientTheme(resolvedTheme)
      writeThemeCookie(resolvedTheme)
      window.localStorage.setItem(
        LEGACY_DASHBOARD_THEME_STORAGE_KEY,
        resolvedTheme
      )
      applyTheme(resolvedTheme)
    },
    []
  )

  const themeValue = React.useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [setTheme, theme]
  )

  return (
    <ThemeContext.Provider value={themeValue}>
      <AudioPreferencesProvider>
        <ThemeHotkey />
        {children}
      </AudioPreferencesProvider>
    </ThemeContext.Provider>
  )
}

function isDisabledTarget(target: HTMLElement) {
  return (
    target.dataset.clickSound === "off" ||
    target.matches(":disabled, [aria-disabled='true'], [data-disabled]")
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function getClickableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null
  }

  if (target.closest("[data-click-sound='off']")) {
    return null
  }

  const clickable = target.closest(CLICKABLE_SELECTOR)

  if (!(clickable instanceof HTMLElement) || isDisabledTarget(clickable)) {
    return null
  }

  // Don't play click sound on typing targets (inputs, textareas, selects)
  if (isTypingTarget(clickable)) {
    return null
  }

  return clickable
}

function ClickSound() {
  const { muted } = useAudioPreferences()
  const [playClickSound] = useSound(clickSoftSound, {
    interrupt: true,
    soundEnabled: !muted,
  })

  const onClick = React.useEffectEvent((event: MouseEvent) => {
    if (!getClickableTarget(event.target)) {
      return
    }

    playClickSound()
  })

  React.useEffect(() => {
    document.addEventListener("click", onClick, true)

    return () => {
      document.removeEventListener("click", onClick, true)
    }
  }, [])

  return null
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()
  const { muted } = useAudioPreferences()

  const toggleTheme = React.useEffectEvent(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"

    playThemeSwitchSound({
      muted,
      fromTheme: resolvedTheme,
      toTheme: nextTheme,
    })

    setTheme(nextTheme)
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      toggleTheme()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return null
}

export { AudioPreferencesProvider, ThemeProvider }
