# Spec: Color Theme Switcher

## Overview

The dashboard supports a color theme selector with **13 curated color themes** plus **Coss UI** as the first selectable option.

- `Coss UI` means "use the base coss/ui tokens exactly as shipped"
- `Zen` is the default custom dashboard theme for fresh users and invalid/stale cookies
- Custom color themes override only dashboard color tokens
- The active custom theme is applied live to `document.documentElement` via inline CSS custom properties
- The selected custom theme is stored in a cookie so dashboard pages can render the correct colors on first paint without a flash

**Critical constraint:** Only color tokens are swapped. `--radius`, `--font-*`, `--shadow-*`, `--tracking-normal`, and `--spacing` are never touched.

---

## Project Context

- **Framework:** Next.js (App Router) with TypeScript
- **UI library:** coss/ui
- **Dark mode:** handled by `next-themes` via the existing theme provider and `.dark` on `<html>`
- **Styling:** Tailwind CSS v4
- **Package manager:** pnpm

---

## Existing Files to Be Aware Of

- `app/ui/dashboard-shell.tsx` - mounts the client applicator and renders the dashboard theme selector UI
- `components/theme-provider.tsx` - existing dark/light mode provider
- `components/color-theme-applicator.tsx` - client-only applicator that subscribes to the shared color-theme state
- `components/dashboard-color-theme-style.tsx` - server-side first-paint style injector for dashboard pages
- `components/theme-switcher.tsx` - dashboard theme picker UI
- `components/theme-icons/` - branded SVG icon components used by the dashboard theme picker
- `components/ui/combobox.tsx` - shared combobox wrapper; theme switcher disables the built-in left selection indicator
- `hooks/use-color-theme.ts` - shared client theme state, cookie sync, and token application logic
- `lib/themes.ts` - typed registry of the available custom themes
- `lib/color-theme.ts` - cookie key, theme normalization, and SSR CSS builder helpers
- `app/globals.css` - base coss/ui token definitions; do not add theme blocks here

---

## Theme Source Data

The source palette docs live in `docs/themes/`:

- `docs/themes/themes.md` - themes 1-6
- `docs/themes/themes-2.md` - themes 7-9

Only the color variables from `:root {}` and `.dark {}` belong in `lib/themes.ts`. Font, radius, shadow, tracking, and spacing variables stay out of the runtime theme registry.

---

## Files to Create

### `lib/themes.ts`

Typed registry of the 13 custom dashboard themes. Each entry contains color tokens only.

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

export const THEMES: Theme[] = [
  /* 9 custom themes populated from docs/themes */
]
```

The custom theme IDs in order:

1. `amethyst-haze`
2. `claude`
3. `twitter`
4. `supabase`
5. `sakura`
6. `perplexity`
7. `vercel`
8. `zen`
9. `zed`
10. `ibm`
11. `snapchat`
12. `twitch`
13. `discord`

---

### `lib/color-theme.ts`

Shared dashboard color-theme helpers.

```ts
export const COSS_UI_THEME_ID = "default"
export const COLOR_THEME_COOKIE_NAME = "reway.dashboard.paletteTheme"
export const DASHBOARD_COLOR_THEME_STYLE_ID = "dashboard-color-theme-ssr"
```

Responsibilities:

1. Normalize any stored theme ID to either a valid custom theme ID or `default` (`Coss UI`)
2. Treat invalid or stale cookie values as the default custom theme (`zen`)
3. Build the server-rendered first-paint CSS for valid custom themes only

---

### `hooks/use-color-theme.ts`

Shared client hook for the dashboard color theme.

```ts
"use client"

export function useColorTheme(): {
  themeId: string
  setThemeId: (id: string) => void
}
```

Responsibilities:

1. Keep a single shared client-side color-theme state across all hook consumers
2. Read the dashboard theme cookie on first client load
3. Re-apply the active theme whenever the selected color theme or `resolvedTheme` changes
4. Persist custom themes back to the cookie
5. Clear the cookie and remove all inline token overrides when `default` is selected

---

### `components/color-theme-applicator.tsx`

Tiny client component that subscribes to `useColorTheme()` for its side effects and renders `null`.

---

### `components/dashboard-color-theme-style.tsx`

Server component used on dashboard pages to inject a first-paint `<style>` tag from the theme cookie.

Rules:

1. Read the cookie on the server
2. Normalize it through `lib/color-theme.ts`
3. Render no `<style>` tag for `default`
4. Render a single style tag with `id="dashboard-color-theme-ssr"` for valid custom themes

---

### `components/theme-switcher.tsx`

Dashboard theme picker UI.

Current behavior:

- `Coss UI` is the first selectable option
- Custom themes are listed after it in the order defined by `THEMES`
- The picker uses the coss/ui `Combobox` with `SelectButton` styling so theme search remains available
- Each option renders a branded icon from `components/theme-icons/` plus the theme label
- The `zen` option is labeled `Zen (Default)` in the picker because it is the default custom theme
- The active option shows a single right-side `CheckmarkCircle02Icon`
- The shared left combobox item indicator is intentionally disabled for this picker so the icon remains the leading visual
- Selected theme names must truncate cleanly inside the avatar dropdown without causing horizontal scroll
- Selecting `default` restores the base coss/ui tokens immediately

---

## Files to Modify

### `app/ui/dashboard-shell.tsx`

- Mount `<ColorThemeApplicator />` once near the top of the dashboard shell
- Render `<ThemeSwitcher />` in both the desktop account menu and the mobile account sheet

### Dashboard pages

Render `<DashboardColorThemeStyle />` from each dashboard page that needs first-paint theme parity:

- `app/overview/page.tsx`
- `app/review/page.tsx`
- `app/notes/page.tsx`
- `app/courses/page.tsx`
- `app/courses/[id]/page.tsx`
- `app/daily-entries/page.tsx`

---

## Hard Rules — Do Not Violate

- `Coss UI` must remain the first selectable option
- Selecting `default` must remove custom dashboard token overrides immediately, not only after reload
- Persist dashboard color theme in the cookie `reway.dashboard.paletteTheme`, not `localStorage`
- Invalid or stale cookie values must normalize to the default custom theme (`zen`)
- SSR first-paint theme CSS must only be rendered for valid custom themes
- No CSS theme blocks in `app/globals.css`
- Never set `--radius`, `--font-*`, `--shadow-*`, `--tracking-normal`, or `--spacing`
- Do not add another dark/light theme provider
- Do not introduce a parallel theming system such as `data-theme`
