# Frontend Development Cycle (Next.js)

**Project:** Rootly (v2)

This document is an always-up-to-date reference for what has been implemented on the frontend (application/UI layer) and how it is structured today.

---

## Scope

Frontend scope in this project (so far) is the Next.js App Router application that renders:

- Overview dashboard
- Courses list + course detail
- Notes list + note viewer/editor/code viewer sheets
- Daily entries list + editor flows
- Review sessions list + session flow + summary

Non-goals of this document:

- Database schema details (see `spec/backend-development-cycle.md`)
- Production backend wiring (most screens are currently mocked)

---

## Tech Stack

This list is derived from `package.json` and verified imports in the codebase.

### Core Framework

- `next` — App Router pages and routing.
- `react`, `react-dom` — UI runtime.
- `typescript` — typechecking (`pnpm typecheck` uses `tsc --noEmit`).

### Styling / Utilities

- `tailwindcss` — utility classes used throughout.
- `clsx` — class list composition (used by `lib/utils.ts`).
- `tailwind-merge` — merges Tailwind classes (used by `lib/utils.ts` via `cn`).

### UI Primitives / Components

- `@base-ui/react` — underlying UI primitives used by components in `components/ui/*` (consumed indirectly through the local UI components).
- `class-variance-authority` — variant utilities used by some local UI components in `components/ui/*`.
- `next-themes` — theme management (`ThemeProvider`, `useTheme`).

### Data Visualization

- `recharts` — charts on Overview page (`BarChart`, `LineChart`, etc.).

### Notes Code Rendering / Editing

- `shiki` — syntax highlighting for read-only code rendering in `components/ui/code-block.tsx`.
- `@uiw/react-codemirror` — CodeMirror wrapper used in `components/ui/code-editor.tsx`.
- `@uiw/codemirror-theme-github` — light/dark editor theme.
- `@codemirror/lang-*` — per-language syntax extensions used by `CodeEditor`.

### Export

- `@react-pdf/renderer` — PDF export for Notes (`app/notes/ui/notes-pdf.tsx`).

### Date UI

- `react-day-picker` — calendar selection types used by Daily Entries header.

### Other dependencies present but not verified by import in the files reviewed

The following dependencies exist in `package.json` but were not observed in the frontend files read for this document:

- `driver.js`
- `lucide-react`
- `motion`
- `zod`
- `@supabase/ssr`, `@supabase/supabase-js`

---

## Project Structure

### `app/`

App Router route segments. Pages are typically split into:

- `app/<feature>/page.tsx` — route entry that renders a UI module.
- `app/<feature>/ui/*` — feature UI modules: `*-page.tsx`, `*-header.tsx`, `*-components.tsx`, `*-model.ts`, `*-mock-data.ts`, and `*-sheets.tsx` (when applicable).

#### `app/ui/`

- `dashboard-shell.tsx` — shared shell layout for most pages.

#### `app/overview/`

- `page.tsx` — route entry.
- `ui/overview-page.tsx` — full Overview page implementation.
- `ui/charts/*` — 4 client-side chart components rendered via `next/dynamic`.

#### `app/courses/`

- `page.tsx` — route entry.
- `[id]/page.tsx` — course detail route entry.
- `ui/*` — Courses list, detail page, header, components, model, mock data.

#### `app/notes/`

- `page.tsx` — route entry.
- `ui/*` — Notes page, header, components, model, mock data, sheets, export helpers.

#### `app/daily-entries/`

- `page.tsx` — route entry.
- `ui/*` — Daily entries page, header, components, model, emojis, mock data.

#### `app/review/`

- `page.tsx` — route entry.
- `ui/*` — Review page, session flow components, summary, model, mock data.

### `components/`

- `rootly-logo.tsx` — SVG logomark component.
- `theme-provider.tsx` — wrapper around `next-themes` provider + theme hotkey.
- `ui/` — shared component library (buttons, sheets, dialogs, combobox/select, etc.).

### `hooks/`

- `use-media-query.ts` — media query utilities (`useMediaQuery`, `useIsMobile`).

### `lib/`

- `utils.ts` — `cn(...inputs)` helper built on `clsx` + `tailwind-merge`.

### `spec/`

- Documentation/specs. Includes design wireframes under `spec/design/`.

---

## File Naming Convention

Observed naming patterns (feature-local, in `app/<feature>/ui/`):

- `*-page.tsx` — feature root UI and state.
- `*-header.tsx` — sticky header UI for the page.
- `*-components.tsx` — cards, sheets, dialogs, and helper components.
- `*-sheets.tsx` — sheets related to the feature (viewer/editor/code viewer).
- `*-model.ts` — TypeScript data types and formatting helpers.
- `*-mock-data.ts` — mocked data builders/constants.

Route entries are thin:

- `app/<feature>/page.tsx` imports and returns the feature page component.

---

## Shared Layout (`DashboardShell`)

**File:** `app/ui/dashboard-shell.tsx`

### Props

- `children: React.ReactNode`
- `streakDays?: number`
- `fab?: { ariaLabel: string; icon: React.ReactNode; onClick: () => void }`

### Composition / Sub-components

- **Top Bar**
  - Left: `RootlyLogo` wrapped with `next/link` to `/`.
  - Middle (desktop only): streak display when `streakDays` is provided (`🔥 {streakDays} day streak`).
  - Right:
    - Command palette trigger:
      - Desktop: outline button with label `Search or jump to...` and OS-aware shortcut (`⌘K` or `Ctrl K`).
      - Mobile: icon button.
    - User menu:
      - Desktop: `UserAvatarPopover` using `Popover`.
      - Mobile: avatar button opens `MobileAvatarSheet`.

- **Main content**
  - Rendered inside `main` with `pt-14` and `pb-28`.

- **Bottom navigation**
  - `FloatingDock` receives `navigationItems` for:
    - `/` (Overview)
    - `/courses`
    - `/notes`
    - `/daily-entries`
    - `/review`

- **Mobile FAB**
  - Rendered only when `isMobile && fab`.
  - Fixed positioned button above the dock.

- **Command Palette**
  - `CommandPalette` is opened via Ctrl/Cmd+K and via the trigger button.
  - Desktop uses `CommandDialog`.
  - Mobile uses a `Sheet`.
  - Contents are currently a static grouped list of suggested items.

- **Theme toggle**
  - `ThemeToggle` is a `Switch` with sun/moon icons.
  - Controlled by `next-themes` via `resolvedTheme` + `setTheme`.

### Behavior

- Global keyboard handler for Ctrl/Cmd+K opens the command palette.
- `ThemeProvider` also installs a theme hotkey (`d`) globally (see `components/theme-provider.tsx`).

---

## Implemented Pages

### Overview

- **Route:** `/`
- **Entry:** `app/overview/page.tsx` → renders `app/overview/ui/overview-page.tsx`.
- **UI files:**
  - `app/overview/ui/overview-page.tsx`
  - `app/overview/ui/charts/daily-study-time-chart.tsx`
  - `app/overview/ui/charts/daily-mood-chart.tsx`
  - `app/overview/ui/charts/understanding-progress-chart.tsx`
  - `app/overview/ui/charts/course-mastery-list.tsx`
- **Key state:**
  - `range: "7" | "30" | "90"`.
- **Data:**
  - `buildMockOverview(range)` builds:
    - streak days
    - summary stats
    - chart series
    - empty state flags
- **Key interactions:**
  - Range toggle updates all chart data.
  - Charts are rendered with `next/dynamic` (`ssr: false`) and show skeleton fallbacks.

### Courses List

- **Route:** `/courses`
- **Entry:** `app/courses/page.tsx` → renders `app/courses/ui/courses-page.tsx`.
- **UI files:**
  - `app/courses/ui/courses-page.tsx`
  - `app/courses/ui/courses-header.tsx`
  - `app/courses/ui/courses-components.tsx`
  - `app/courses/ui/courses-model.ts`
  - `app/courses/ui/courses-mock-data.ts`
- **Model:** `Course`, `SortKey`, `TopicFilter`.
- **Mock data:** `buildMockCourses(): Course[]`.
- **Key interactions/state:**
  - Topic filter derived from course topics.
  - Sorting: last updated / created / progress / alphabetical.
  - Sheets:
    - `CourseEditorSheet` (create/edit)
    - `LinksViewerSheet`
    - Mobile `FilterSheet` (topic / sort)
  - Delete flow uses `AlertDialog`.

### Course Detail

- **Route:** `/courses/[id]`
- **Entry:** `app/courses/[id]/page.tsx` → renders `app/courses/ui/course-detail-page.tsx`.
- **UI files:**
  - `app/courses/ui/course-detail-page.tsx`
  - Reuses notes UI from `app/notes/ui/*`.
- **Data:**
  - Courses and notes are currently mocked via `buildMockCourses()` and `buildMockNotes()`.
- **Key interactions/state:**
  - Sticky header with back button.
  - Notes list scoped to `courseId`.
  - Shares Notes list filters (type/flagged/sort) but does not show a course filter.
  - Uses `NoteViewerSheet`, `CodeViewerSheet`, `NoteEditorSheet`.

### Notes

- **Route:** `/notes`
- **Entry:** `app/notes/page.tsx` → renders `app/notes/ui/notes-page.tsx`.
- **UI files:**
  - `app/notes/ui/notes-page.tsx`
  - `app/notes/ui/notes-header.tsx`
  - `app/notes/ui/notes-components.tsx`
  - `app/notes/ui/notes-sheets.tsx`
  - `app/notes/ui/notes-model.ts`
  - `app/notes/ui/notes-mock-data.ts`
  - `app/notes/ui/notes-export.ts`
  - `app/notes/ui/notes-pdf.tsx`
- **Model:** `Note`, `NoteType`, `UnderstandingLevel`, filters, formatting helpers.
- **Mock data:** `buildMockCourses()` returns `{id,title}[]`, `buildMockNotes()` returns `Note[]`.
- **Key interactions/state:**
  - Filters: type, course, flagged-only, sort.
  - Global show/hide answers:
    - `globalShowAnswers` boolean in the page.
    - Per-card override via `answerOverrides: Record<noteId, boolean>`.
  - Infinite-load behavior implemented via `IntersectionObserver` and `visibleCount` increments.
  - Viewer sheets:
    - `NoteViewerSheet` renders full text and optional `CodeBlock`.
    - `CodeViewerSheet` renders `CodeBlock` inside `ScrollArea`.
    - `NoteEditorSheet` shows create/edit form UI; Save is currently disabled.
  - Export:
    - Markdown export downloads a `.md` built from the currently filtered notes list.
    - PDF export uses `@react-pdf/renderer` to generate and download a PDF.

### Daily Entries

- **Route:** `/daily-entries`
- **Entry:** `app/daily-entries/page.tsx` → renders `app/daily-entries/ui/daily-entries-page.tsx`.
- **UI files:**
  - `app/daily-entries/ui/daily-entries-page.tsx`
  - `app/daily-entries/ui/daily-entries-header.tsx`
  - `app/daily-entries/ui/daily-entries-components.tsx`
  - `app/daily-entries/ui/daily-entries-model.ts`
  - `app/daily-entries/ui/daily-entries-emojis.tsx`
  - `app/daily-entries/ui/daily-entries-mock-data.ts`
- **Model:** `DailyEntry`, `MoodValue`, `MoodFilter`, formatting helpers.
- **Mock data:** `DAILY_ENTRIES_MOCK`.
- **Key interactions/state:**
  - Filters: from date, to date, mood.
  - `openPrimaryAction()` logs today or edits today if entry exists.
  - Editor uses `EntryEditorSheet` with:
    - date selection via `Calendar` in a `Popover` (disabled for edit and when locked).
    - study time via `NumberField` hours/minutes.
    - mood selection via 3 buttons.

### Review Sessions

- **Route:** `/review`
- **Entry:** `app/review/page.tsx` → renders `app/review/ui/review-page.tsx`.
- **UI files:**
  - `app/review/ui/review-page.tsx`
  - `app/review/ui/review-components.tsx`
  - `app/review/ui/review-session.tsx`
  - `app/review/ui/review-summary.tsx`
  - `app/review/ui/review-model.ts`
  - `app/review/ui/review-mock-data.ts`
- **Model:** `ReviewNote`, `ReviewSession`, `ReviewSessionConfig`.
- **Mock data:** `REVIEW_MOCK_COURSES`, `REVIEW_MOCK_NOTES_POOL`, `REVIEW_MOCK_SESSIONS`.
- **Key interactions/state:**
  - View is controlled by an internal union state (`list` | `active` | `summary`).
  - Setup sheet configures:
    - question count mode (10/20/all/custom)
    - shuffle
    - flagged-only
  - Session flow:
    - reveal answer
    - rate question (nailed/sort_of/forgot)
    - increments/decrements `understandingLevel` in memory
    - computes summary and optionally saves session
  - Detail sheet shows session info and leveled up/down questions.

---

## Custom Shared Components

### `CodeBlock`

**File:** `components/ui/code-block.tsx`

- **Props:**
  - `code: string`
  - `language: string`
  - `className?: string`
- **Behavior:**
  - Uses `next-themes` `resolvedTheme` to choose `github-light` vs `github-dark`.
  - Uses Shiki via `getSingletonHighlighter` from `shiki/bundle/web`.
  - Loads only the requested language on demand (calls `loadLanguage`).
  - Renders a fallback `<pre>` while highlighting is pending.

### `CodeEditor`

**File:** `components/ui/code-editor.tsx`

- **Props:**
  - `value: string`
  - `onChange: (val: string) => void`
  - `language: string`
  - `className?: string`
- **Behavior:**
  - Uses CodeMirror via `@uiw/react-codemirror`.
  - Theme is `githubDark`/`githubLight` based on `resolvedTheme`.
  - Language extension is selected via `getLanguageExtension(language)`.
  - Enables line wrapping (`EditorView.lineWrapping`).
  - Trims `basicSetup` to disable features not used by the product:
    - `highlightSelectionMatches: false`
    - `autocompletion: false`
    - `bracketMatching: false`
- **Performance decision:**
  - Imported lazily on the Notes editor sheet via `next/dynamic` in `app/notes/ui/notes-sheets.tsx` (`ssr: false`).

---

## Design System Rules

The wireframe specifications contain global rules. The strict rule block appears verbatim at the top of each wireframe:

```
🚫 NEVER write custom CSS classes for colors, typography, spacing scales, shadows, or borders.
🚫 NEVER override, extend, or modify any Coss UI token, class, or component style.
🚫 NEVER use arbitrary Tailwind values (e.g. w-[543px], text-[13px]) for styling purposes.
🚫 NEVER import or use any UI library other than Coss UI (no shadcn, no radix standalone, no MUI, no Chakra).
✅ ALWAYS use Coss UI components exactly as documented.
✅ ALWAYS use Coss UI design tokens for spacing, color, and typography.
✅ If a needed component does not exist in Coss UI, ask before inventing a custom one.
```

---

## Active State / Color Convention

Observed patterns in current code:

- **Icon-only toggle buttons in headers** often set icon color via `HugeiconsIcon` `color` prop when active.
  - Notes header flagged-only: `color={flaggedOnly ? "var(--destructive)" : "currentColor"}`.
  - Notes header global answers: `color={globalShowAnswers ? "var(--info)" : "currentColor"}`.
  - Note editor understanding buttons: icon colors use `var(--warning)`, `var(--info)`, `var(--success)` when selected.
- **Per-card flag icon** in Notes uses class-based active state:
  - `note.flag ? "text-destructive" : "text-muted-foreground"`.

---

## Frontend Development Rules (for agents)

Observed conventions and guardrails in this repo:

- Prefer feature folders under `app/<feature>/ui/` with co-located header/components/model/mock files.
- Most interactive UI modules are client components (`"use client"`).
- Use `useIsMobile()` (from `hooks/use-media-query.ts`) to decide desktop vs mobile layouts and sheet side.
- Use `next/dynamic` with `ssr: false` for browser-only heavy modules:
  - Overview charts
  - CodeMirror editor
- Use `lib/utils.ts` `cn()` for class composition.
- Lint and typecheck commands:
  - `pnpm lint` runs `oxlint --deny-warnings`.
  - `pnpm typecheck` runs `tsc --noEmit`.

---

## Current Frontend Status

All currently implemented feature areas are mocked (in-memory state + mock builders/constants). Backend wiring is the next layer.

| Area          | Route(s)                    | Status (UI)                 | Data                 | Notes                                                               |
| ------------- | --------------------------- | --------------------------- | -------------------- | ------------------------------------------------------------------- |
| Overview      | `/`                         | Implemented                 | Mocked               | Charts are client-only via dynamic import.                          |
| Courses       | `/courses`, `/courses/[id]` | Implemented                 | Mocked               | Detail page reuses Notes UI.                                        |
| Notes         | `/notes`                    | Implemented (Save disabled) | Mocked               | Includes Markdown and PDF export.                                   |
| Daily Entries | `/daily-entries`            | Implemented                 | Mocked + local state | Create/edit/delete are local-only.                                  |
| Review        | `/review`                   | Implemented                 | Mocked + local state | Session flow + summary exist without navigation to separate routes. |

---
