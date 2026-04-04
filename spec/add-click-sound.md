# Sound-on-Click System — Implementation Guide

This document describes the complete sound system used in this portfolio and gives a coding agent exact steps to implement it from scratch.

---

## Overview

The system is a lightweight, **no-dependency** Web Audio API wrapper. Audio data is embedded directly in TypeScript files as base64 data URIs — no audio files need to be fetched at runtime. The system supports:

- A **global click sound** that fires on every interactive element across the entire page.
- **Specific sounds** for individual actions (e.g. theme toggle: switch-on / switch-off).
- A **mute toggle** with preference persisted in `localStorage`.
- A way to **opt individual elements out** of the global click sound via a `data-click-sound="off"` attribute.

---

## File Structure

Assume the user has already copied the `lib/audio/` folder into the codebase. The files are:

```
lib/audio/
  sound-types.ts      — TypeScript interfaces and types
  sound-engine.ts     — Core Web Audio API engine (singleton context + buffer cache)
  click-soft.ts       — Sound asset: short soft click (duration: 0.007s)
  switch-on.ts        — Sound asset: switch-on tone (duration: 0.364s)
  switch-off.ts       — Sound asset: switch-off tone (duration: 0.213s)
```

And one hook the agent must create:

```
hooks/
  use-sound.ts        — React hook wrapping the engine for component-level use
```

The hook must also be wired into these two existing components:

```
components/
  theme-provider.tsx  — Where global click sound + mute state live
  floating-dock.tsx   — Where theme toggle sounds + mute button live
```

---

## Step 1 — Understand the Sound Asset Format (`sound-types.ts`)

Each sound asset is a `SoundAsset` object:

```ts
export interface SoundAsset {
  name: string
  dataUri: string // "data:audio/mpeg;base64,..."
  duration: number // seconds
  format: "mp3" | "wav" | "ogg"
  license: "CC0" | "OGA-BY" | "MIT"
  author: string
}
```

The `click-soft.ts`, `switch-on.ts`, and `switch-off.ts` files each export one `SoundAsset` constant conforming to this interface.

---

## Step 2 — Understand the Engine (`sound-engine.ts`)

The engine exposes three functions:

### `getAudioContext(): AudioContext`

Returns a lazily created singleton `AudioContext`. Browsers require an `AudioContext` to be created after a user gesture; this lazy pattern handles that safely.

### `decodeAudioData(dataUri: string): Promise<AudioBuffer>`

Decodes a base64 data URI into an `AudioBuffer`. Uses two caches:

- `bufferCache` — stores the resolved `AudioBuffer` keyed by `dataUri`.
- `bufferPromiseCache` — deduplicates in-flight decoding promises.

This means the same sound is only ever decoded once across the entire session.

### `playSound(dataUri: string, options?): Promise<{ stop: () => void }>`

Fire-and-forget playback. Resumes a suspended `AudioContext` first. Sets up a `BufferSource → GainNode → destination` graph, then calls `source.start(0)`. Returns a `stop()` handle.

**This is used for one-off playback where you don't need React state** (e.g. theme toggle sounds in event handlers).

---

## Step 3 — Create the `useSound` Hook (`hooks/use-sound.ts`)

This hook wraps the engine for use inside React components. It returns `[play, controls]`.

```ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getAudioContext, decodeAudioData } from "@/lib/audio/sound-engine"
import type {
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/audio/sound-types"

export function useSound(
  sound: SoundAsset,
  options: UseSoundOptions = {}
): UseSoundReturn {
  const {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    onPlay,
    onEnd,
    onPause,
    onStop,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(
    sound.duration ?? null
  )
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const loadingRef = useRef<Promise<AudioBuffer> | null>(null)

  const ensureBuffer = useCallback(async () => {
    if (bufferRef.current) return bufferRef.current

    const pendingLoad =
      loadingRef.current ??
      decodeAudioData(sound.dataUri).then((buffer) => {
        bufferRef.current = buffer
        setDuration(buffer.duration)
        loadingRef.current = null
        return buffer
      })

    loadingRef.current = pendingLoad
    return pendingLoad
  }, [sound.dataUri])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        /* already stopped */
      }
      sourceRef.current = null
    }
    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const play = useCallback(
    (overrides?: { volume?: number; playbackRate?: number }) => {
      if (!soundEnabled) return

      void (async () => {
        const buffer = await ensureBuffer()
        const ctx = getAudioContext()

        if (ctx.state === "suspended") await ctx.resume()
        if (interrupt && sourceRef.current) stop()

        const source = ctx.createBufferSource()
        const gain = ctx.createGain()

        source.buffer = buffer
        source.playbackRate.value = overrides?.playbackRate ?? playbackRate
        gain.gain.value = overrides?.volume ?? volume

        source.connect(gain)
        gain.connect(ctx.destination)

        source.onended = () => {
          setIsPlaying(false)
          onEnd?.()
        }

        source.start(0)
        sourceRef.current = source
        gainRef.current = gain
        setIsPlaying(true)
        onPlay?.()
      })()
    },
    [
      soundEnabled,
      ensureBuffer,
      playbackRate,
      volume,
      interrupt,
      stop,
      onPlay,
      onEnd,
    ]
  )

  const pause = useCallback(() => {
    stop()
    onPause?.()
  }, [stop, onPause])

  // Keep live volume in sync if it changes
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop()
        } catch {
          /* already stopped */
        }
      }
    }
  }, [])

  return [play, { stop, pause, isPlaying, duration, sound }] as const
}
```

**Key behaviours:**

- `interrupt: true` stops the current playback before restarting. Set this for click sounds so rapid clicks don't stack.
- `soundEnabled: false` makes `play()` a no-op — used to wire the mute toggle.
- Buffer decoded lazily on first `play()` call, then cached forever.

---

## Step 4 — Wire into `ThemeProvider` (`components/theme-provider.tsx`)

This is the most important integration. `ThemeProvider` does two things for audio:

### 4a — `AudioPreferencesContext`

Manages the global `muted` boolean, persisted in `localStorage` under the key `"portfolio-audio-muted"`.

```ts
const AUDIO_MUTED_STORAGE_KEY = "portfolio-audio-muted"

type AudioPreferencesContextValue = {
  muted: boolean
  setMuted: React.Dispatch<React.SetStateAction<boolean>>
}

const AudioPreferencesContext =
  React.createContext<AudioPreferencesContextValue | null>(null)

export function useAudioPreferences() {
  const context = React.useContext(AudioPreferencesContext)
  if (!context)
    throw new Error("useAudioPreferences must be used within ThemeProvider")
  return context
}
```

Inside `ThemeProvider`:

```tsx
const [muted, setMuted] = React.useState(false)

// Hydrate from localStorage on mount
React.useEffect(() => {
  const stored = window.localStorage.getItem(AUDIO_MUTED_STORAGE_KEY)
  if (stored === "true") setMuted(true)
}, [])

// Persist on change
React.useEffect(() => {
  window.localStorage.setItem(AUDIO_MUTED_STORAGE_KEY, String(muted))
}, [muted])
```

### 4b — `<ClickSound />` — The Global Click Handler

A render-null component mounted inside `ThemeProvider`. It listens to `document` click events in the **capture phase**, checks if the target is a known interactive element, and plays the soft click.

**The target selector list** (covers all standard and ARIA interactive elements):

```ts
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
```

**Opt-out mechanism:** adding `data-click-sound="off"` to an element prevents the click sound from playing for it. This is used on the mute toggle and theme toggle buttons themselves, since they play their own distinct sounds.

**Disabled-element guard:** also skips `:disabled`, `[aria-disabled='true']`, `[data-disabled]`.

```tsx
function isDisabledTarget(target: HTMLElement) {
  return (
    target.dataset.clickSound === "off" ||
    target.matches(":disabled, [aria-disabled='true'], [data-disabled]")
  )
}

function getClickableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const clickable = target.closest(CLICKABLE_SELECTOR)
  if (!(clickable instanceof HTMLElement) || isDisabledTarget(clickable))
    return null
  return clickable
}

function ClickSound() {
  const { muted } = useAudioPreferences()
  const [playClickSound] = useSound(clickSoftSound, {
    interrupt: true,
    soundEnabled: !muted,
  })

  const onClick = React.useEffectEvent((event: MouseEvent) => {
    if (!getClickableTarget(event.target)) return
    playClickSound()
  })

  React.useEffect(() => {
    document.addEventListener("click", onClick, true) // capture phase
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
```

> **Note:** `React.useEffectEvent` is used so the `onClick` callback always reads the latest `muted` value without needing `muted` in the `useEffect` dependency array. This avoids re-registering the listener on every mute toggle.

### 4c — `<ThemeHotkey />` — Keyboard Theme Toggle with Sound

A second render-null component that listens for the `D` key to toggle theme, playing the correct switch sound:

- Dark → Light: plays `switchOnSound`
- Light → Dark: plays `switchOffSound`

```tsx
function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()
  const { muted } = useAudioPreferences()

  const toggleTheme = React.useEffectEvent(() => {
    if (resolvedTheme === "dark") {
      if (!muted) void playSound(switchOnSound.dataUri)
      setTheme("light")
      return
    }
    if (!muted) void playSound(switchOffSound.dataUri)
    setTheme("dark")
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return
      toggleTheme()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return null
}
```

The helper `isTypingTarget` prevents the hotkey from firing when the user is typing:

```ts
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}
```

### 4d — Complete `ThemeProvider` render

Render order inside the provider:

```tsx
return (
  <AudioPreferencesContext.Provider value={value}>
    <NextThemesProvider ...>
      <ClickSound />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  </AudioPreferencesContext.Provider>
)
```

Export both `ThemeProvider` and `useAudioPreferences`.

---

## Step 5 — Wire into `FloatingDock` (`components/floating-dock.tsx`)

The dock consumes `useAudioPreferences` and plays sounds directly for two buttons.

### Theme toggle button

```tsx
function handleThemeToggle() {
  if (muted) {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    return
  }
  if (resolvedTheme === "dark") {
    void playSound(switchOnSound.dataUri)
    setTheme("light")
    return
  }
  void playSound(switchOffSound.dataUri)
  setTheme("dark")
}
```

The button element must include `data-click-sound="off"` to prevent the global `ClickSound` handler from also firing a click sound on top of the switch sound:

```tsx
<button
  type="button"
  data-click-sound="off"
  onClick={handleThemeToggle}
  ...
>
```

### Mute toggle button

```tsx
function handleMuteToggle() {
  setMuted((previous) => !previous)
}
```

Also needs `data-click-sound="off"`:

```tsx
<button
  type="button"
  data-click-sound="off"
  onClick={handleMuteToggle}
  ...
>
```

---

## Step 6 — Imports Reference

| What                                              | Import from                   |
| ------------------------------------------------- | ----------------------------- |
| `SoundAsset`, `UseSoundOptions`, etc.             | `@/lib/audio/sound-types`     |
| `getAudioContext`, `decodeAudioData`, `playSound` | `@/lib/audio/sound-engine`    |
| `clickSoftSound`                                  | `@/lib/audio/click-soft`      |
| `switchOnSound`                                   | `@/lib/audio/switch-on`       |
| `switchOffSound`                                  | `@/lib/audio/switch-off`      |
| `useSound`                                        | `@/hooks/use-sound`           |
| `useAudioPreferences`                             | `@/components/theme-provider` |

---

## Checklist for the Agent

- [x] `lib/audio/` folder is present (user copies it in)
- [x] `hooks/use-sound.ts` created with the full implementation above
- [x] `ThemeProvider` exports `useAudioPreferences` and mounts `<ClickSound />` and `<ThemeHotkey />`
- [x] `FloatingDock` theme button has `data-click-sound="off"` and calls `playSound` directly
- [x] `FloatingDock` mute button has `data-click-sound="off"` and toggles `setMuted`
- [x] No `<audio>` elements, no `howler`, no external audio library - everything goes through the Web Audio API engine in `sound-engine.ts`

### Implementation status (2026-04-03)

- Completed end-to-end implementation in the active codebase.
- Wired global click sound, route-level theme-switch sounds, and shared mute preferences.
- Added avatar-menu mute controls for both desktop popover and mobile sheet surfaces.
- Confirmed lint compatibility after switching audio end callbacks to event-listener style.

Touched files:

- `components/theme-provider.tsx`
- `components/ui/floating-dock.tsx`
- `app/ui/dashboard-shell.tsx`
- `hooks/use-sound.ts`
- `lib/audio/sound-engine.ts`
- `lib/audio/click-soft.ts`
- `lib/audio/switch-on.ts`
- `lib/audio/switch-off.ts`
- `lib/audio/sound-types.ts`

---

## Gotchas

- **SSR / `"use client"`**: the engine, hook, and all components that use them must be Client Components. `sound-engine.ts` itself has no directive but uses `AudioContext` (browser-only), so it must only ever be imported from client code.
- **AudioContext autoplay policy**: the lazy singleton in `getAudioContext()` means the context is only created after a real user click, satisfying browser autoplay policies automatically.
- **`useEffectEvent`**: this is a React 19 API (stable in this codebase). On React 18 it must be replaced with a `useRef`-based stable callback pattern.
- **`interrupt: true` on click sound**: without this, very fast clicking stacks many audio sources. `interrupt` stops and replaces the previous source node before starting a new one.
- **`data-click-sound="off"`**: this opt-out attribute is critical to prevent the global click sound from firing on elements that have their own specific sounds (e.g. theme toggle, mute toggle). Don't forget to add it to those buttons!
- **Mute toggle**: add a mute option in avatar menu that sets `muted` to `true`, and ensure the mute state is respected in all sound-playing code paths, use "VolumeHighIcon" and "VolumeOffIcon" for the toggle.
