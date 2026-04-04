"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

import { clickSoftSound } from "@/lib/audio/click-soft"
import { playSound } from "@/lib/audio/sound-engine"
import { switchOffSound } from "@/lib/audio/switch-off"
import { switchOnSound } from "@/lib/audio/switch-on"
import { useSound } from "@/hooks/use-sound"

const AUDIO_MUTED_STORAGE_KEY = "portfolio-audio-muted"

type AudioPreferencesContextValue = {
  muted: boolean
  setMuted: React.Dispatch<React.SetStateAction<boolean>>
}

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
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
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
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        <ClickSound />
        <ThemeHotkey />
        {children}
      </NextThemesProvider>
    </AudioPreferencesContext.Provider>
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

export { ThemeProvider }
