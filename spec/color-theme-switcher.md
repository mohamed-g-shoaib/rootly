# Spec: Color Theme Switcher

## Overview

Add the ability for users to switch between 19 curated color themes. The entry point lives in the **avatar dropdown menu** in the dashboard layout. Each theme row shows **three color preview dots** (primary, background, accent) beside the theme name, plus a checkmark on the active theme.

The active theme's color tokens are applied live to `document.documentElement` via inline CSS custom properties using `style.setProperty()`.

**Critical constraint:** Only color tokens are swapped. `--radius`, `--font-*`, `--shadow-*`, `--tracking-normal`, and `--spacing` are **never touched** — these remain under coss/ui's control at all times.

---

## Existing Files to Be Aware Of

- `components/theme-provider.tsx` — already wraps `next-themes` for dark/light mode. **Do not break or replace this.**
- `app/layout.tsx` — root layout, add `<ColorThemeApplicator />` here.
- `app/globals.css` — coss/ui token definitions. **Do not add any theme CSS blocks here.**
- `hooks/` — place new hooks here.
- `lib/` — place new theme registry here.
- `spec/` — this file lives here.

The avatar dropdown location must be found by reading the actual dashboard layout files under `app/`. Search for where `DropdownMenu` with user avatar/name is rendered and modify that file.

---

## Theme Source Data

The color values for all 19 themes come from the `reway` reference repo:
- `https://github.com/mohamed-g-shoaib/reway/blob/main/docs/themes.md` — themes 1–11
- `https://github.com/mohamed-g-shoaib/reway/blob/main/docs/themes-2.md` — themes 12–19

From each theme block, extract **only** the color variables inside `:root { }` and `.dark { }`. Ignore `--radius`, `--font-*`, `--shadow-*`, `--tracking-normal`, `--spacing` entirely.

> Note: In `themes-2.md`, the theme titled "Theme to replace Dark Forge theme, number 10" is `sunset-horizon` and occupies slot #10 in the ordered list.

---

## Files to Create

### `lib/themes.ts`

Typed registry of all 19 themes. Each entry contains **only color tokens** — no radius, no font, no shadow keys.

```ts
export type ThemeColors = {
  background: string
  foreground: string
  card: string
  "card-foreground": string
  popover: string
  "popover-foreground": string
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  muted: string
  "muted-foreground": string
  accent: string
  "accent-foreground": string
  destructive: string
  "destructive-foreground": string
  border: string
  input: string
  ring: string
  "chart-1": string
  "chart-2": string
  "chart-3": string
  "chart-4": string
  "chart-5": string
  sidebar: string
  "sidebar-foreground": string
  "sidebar-primary": string
  "sidebar-primary-foreground": string
  "sidebar-accent": string
  "sidebar-accent-foreground": string
  "sidebar-border": string
  "sidebar-ring": string
}

export type Theme = {
  id: string
  label: string
  light: ThemeColors
  dark: ThemeColors
}

export const THEMES: Theme[] = [ /* all 19 themes populated from reference URLs above */ ]

export const DEFAULT_THEME_ID = "amber-minimal"
```

The 19 theme IDs (in order):
1. `amber-minimal`
2. `amethyst-haze`
3. `claude`
4. `modern-minimal`
5. `notebook`
6. `supabase`
7. `t3-chat`
8. `perplexity`
9. `sage-green`
10. `sunset-horizon`
11. `cyberpunk`
12. `kodama-grove`
13. `crimson`
14. `retro`
15. `tangerine`
16. `vercel`
17. `vintage-paper`
18. `bubblegum`
19. *(last theme in themes-2.md)*

---

### `hooks/use-color-theme.ts`

Manages active color theme ID. Persists to `localStorage` under key `"rootly-color-theme"`. On mount, reads saved value (defaults to `"amber-minimal"`). Re-applies color tokens whenever the theme ID or dark/light mode changes.

```ts
"use client"

export function useColorTheme(): {
  themeId: string
  setThemeId: (id: string) => void
}
```

**Application logic inside the hook:**
1. Find the `Theme` object from `THEMES` by ID.
2. Read `resolvedTheme` from `next-themes`'s `useTheme()` to determine dark or light.
3. Pick `theme.dark` or `theme.light` accordingly.
4. For each key in `ThemeColors`, call:
   ```ts
   document.documentElement.style.setProperty(`--${key}`, value)
   ```
5. **Never set** `--radius`, `--font-*`, `--shadow-*`, `--tracking-normal`, or `--spacing`.

---

### `components/color-theme-applicator.tsx`

A tiny `"use client"` component that calls `useColorTheme()` purely for its side effect. Renders `null`. Must be placed once in `app/layout.tsx`.

```tsx
"use client"
import { useColorTheme } from "@/hooks/use-color-theme"

export function ColorThemeApplicator() {
  useColorTheme()
  return null
}
```

---

### `components/theme-switcher.tsx`

The theme picker UI rendered as a `DropdownMenuSub` inside the avatar dropdown.

**Each theme row layout:**
```
● ● ●  Theme Name                    ✓
```
- Three small dots: `w-3 h-3 rounded-full` with inline `style={{ backgroundColor: theme.light.primary/background/accent }}`
  - Dot 1: `theme.light.primary`
  - Dot 2: `theme.light.background`
  - Dot 3: `theme.light.accent`
  - Always use **light** variant values for dots regardless of active dark/light mode — gives better visual distinction between themes
- Theme label text
- `Check` icon (lucide-react) on the currently active theme row, invisible otherwise
- Clicking a row calls `setThemeId(theme.id)`
- List is scrollable: `max-h-80 overflow-y-auto`
- Component is `"use client"`

---

## Files to Modify

### `app/layout.tsx`

Add `<ColorThemeApplicator />` as a direct child inside `<body>`, alongside the existing `<ThemeProvider>`.

### Avatar Dropdown File *(locate it first)*

Search the codebase for the avatar `DropdownMenu` (look for user name/email + sign out pattern). Add an **"Appearance"** `DropdownMenuSub` with a `Palette` icon (lucide-react) that renders `<ThemeSwitcher />`.

Target dropdown structure:

```
Avatar dropdown
├── [user name / email]
├── ─────────────────
├── Appearance  ›
│     └── [19 theme rows with color dots + checkmark]
├── Dark mode toggle   ← existing, do not remove
├── ─────────────────
└── Sign out
```

---

## Hard Rules — Do Not Violate

- **No CSS blocks in `globals.css`** for these themes.
- **Never set** `--radius`, `--font-sans`, `--font-serif`, `--font-mono`, any `--shadow-*` variable, `--tracking-normal`, or `--spacing` from the theme switcher code.
- **No `data-theme` attribute or CSS selectors** — use `element.style.setProperty` only.
- **Do not add a new ThemeProvider** — reuse the existing `next-themes` one.
- **Do not modify `globals.css` `@theme inline` block.**
- **No new dependencies** — use only what is already in `package.json`.
