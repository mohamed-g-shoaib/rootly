---
name: wireframe-overview
description: Detailed wireframe and layout specification for the Rootly dashboard (Overview page), covering both desktop and mobile. Written for LLM agents to implement pixel-accurately using Coss UI only.
---

# Rootly — Wireframe Specification: Overview Page

> **Scope:** This document describes the layout, structure, spatial relationships, component hierarchy, and interaction model for the Rootly Overview (dashboard) screen on both desktop and mobile breakpoints.
>
> This is a wireframe spec — it describes WHAT exists, WHERE it lives, HOW it behaves, and WHAT data it shows. It does NOT prescribe colors, fonts, shadows, border radii, or any visual styling. All visual styling is exclusively handled by Coss UI.

---

## ⚠️ STRICT RULE: Coss UI Only

```
🚫 NEVER write custom CSS classes for colors, typography, spacing scales, shadows, or borders.
🚫 NEVER override, extend, or modify any Coss UI token, class, or component style.
🚫 NEVER use arbitrary Tailwind values (e.g. w-[543px], text-[13px]) for styling purposes.
🚫 NEVER import or use any UI library other than Coss UI (no shadcn, no radix standalone, no MUI, no Chakra).
✅ ALWAYS use Coss UI components exactly as documented.
✅ ALWAYS use Coss UI design tokens for spacing, color, and typography.
✅ If a needed component does not exist in Coss UI, ask before inventing a custom one.
```

This rule is non-negotiable. Every UI element in Rootly must be built using Coss UI primitives and compositions. No exceptions.

---

## Layout Mental Model

Think of the Rootly layout as three fixed zones:

1. **Top Bar** — always visible, never scrolls, full viewport width, slim height
2. **Content Area** — scrollable, sits between the top bar and the bottom dock
3. **Bottom Dock** — always visible, never scrolls, full viewport width, fixed to the bottom

There is NO sidebar. There is NO left rail. There is NO right panel. The layout is intentionally full-width and vertical.

---

## DESKTOP LAYOUT

### Breakpoint Definition
Desktop applies at viewport widths ≥ 1024px.

---

### Zone 1: Top Bar (Desktop)

**Position:** Fixed to the top of the viewport. Full viewport width. Does not scroll with content.

**Height:** Slim — equivalent to one line of text plus comfortable vertical padding. Not tall.

**Internal layout:** Three sections arranged in a single horizontal row using space-between alignment:

#### Left Section — Logo
- The Rootly wordmark or logo mark sits flush to the left edge with standard horizontal padding.
- It is not a navigation element. It does not link anywhere. It is purely a brand anchor.

#### Center-Left Section — Study Streak
- Displays the user's current consecutive study streak as a number followed by the word "day streak" and a flame emoji (🔥) before the number.
- Example render: `🔥 12 day streak`
- This is a read-only display element. It is not clickable.
- It sits slightly left of center to avoid competing with the right-side controls.

#### Right Section — Command Trigger + Avatar
Two elements grouped tightly together, flush to the right edge:

1. **Command Palette Trigger:**
   - Rendered as a slim ghost/outline pill button.
   - Label inside: `Search or jump to...` followed by a keyboard shortcut hint: `⌘K` on Mac, `Ctrl K` on Windows/Linux. Detect OS and show accordingly.
   - Width: wide enough to show the full label. Not an icon-only button on desktop.
   - Clicking this button opens the Command Palette (same as pressing Ctrl+K / ⌘K).
   - This is the ONLY search entry point on desktop. There is no separate search input field.

2. **User Avatar Button:**
   - Rendered as a circular avatar showing the user's profile photo, or initials if no photo is set.
   - Clicking opens a Popover (not a dropdown menu, not a modal) anchored to the avatar.
   - Popover contains three items vertically stacked:
     a. User display name and email — read-only, non-interactive
     b. Theme toggle — switches between light and dark mode using Coss UI's theme system
     c. Logout button — signs the user out and redirects to the auth screen

---

### Zone 2: Content Area (Desktop — Overview Page)

**Position:** Begins immediately below the top bar. Ends immediately above the bottom dock. Fills all remaining viewport height. Vertically scrollable.

**Internal horizontal padding:** Consistent on both sides. Content does not touch the viewport edges.

**Max content width:** The content area has a maximum width to prevent over-stretching on ultra-wide monitors. It is centered horizontally when the viewport exceeds this max width.

#### Section A: Hero Block

The first visible section when the page loads. No scroll required to see it.

**Layout:** Two columns, horizontally side by side.

- **Left column (wider):**
  - A large typographic display of today's total study time in minutes.
  - Label above the number: `Today's Study Time`
  - The number itself is the largest text on the page — it is the visual anchor and primary metric.
  - Below the number: a short secondary label showing the date in human-readable format (e.g. `Tuesday, March 10`).

- **Right column (narrower):**
  - Three summary stat items stacked vertically:
    1. `Total Courses` — count of all user courses
    2. `Total Notes` — count of all user notes
    3. `Avg. Understanding` — average understanding level across all Q&A notes, displayed as X.X / 3
  - Each stat item shows a small label and a bold value. They are read-only.

#### Section B: Time Range Toggle

**Position:** Immediately below the Hero Block. Full width of the content area.

**Layout:** A segmented control / tab group with three options:
- `7 Days`
- `30 Days`
- `90 Days`

**Behavior:**
- Default selection is `7 Days` on first load.
- Selecting a range updates all four charts below simultaneously.
- The selected state is visually distinct (handled by Coss UI's segmented control styling).
- The toggle is LEFT-aligned within the content area, not centered.

#### Section C: Study Time Chart (Full Width)

**Position:** Immediately below the Time Range Toggle.

**Width:** Full width of the content area.

**Chart type:** Bar chart or area chart (whichever Coss UI's chart primitive supports natively — do not build a custom chart renderer).

**Data:** One bar/point per day within the selected range. X-axis is dates. Y-axis is study time in minutes.

**Zero-filling:** Days with no study entry must still appear on the X-axis with a value of 0. No gaps.

**Labels:**
- Chart title above the chart, left-aligned: `Daily Study Time`
- X-axis: date labels, abbreviated (e.g. `Mar 3`, `Mar 4`)
- Y-axis: minute values

**Interaction:** Hovering a bar shows a tooltip with the exact date and study time in minutes.

#### Section D: Two-Column Chart Row

**Position:** Immediately below the Study Time Chart.

**Layout:** Two equal-width columns side by side.

- **Left column: Mood Series Chart**
  - Chart type: Line chart or dot plot — one point per day.
  - Data: Y-axis values are mood levels 1, 2, or 3. X-axis is dates.
  - Days with no entry: render as a gap in the line (do NOT zero-fill mood — a missing mood is not mood level 0).
  - Chart title above, left-aligned: `Daily Mood`
  - Y-axis labels: `1` = Low, `2` = Neutral, `3` = Good (show these as text labels on the Y-axis, not numbers)
  - Tooltip on hover: shows date and mood label.

- **Right column: Understanding Progress Chart**
  - Chart type: Line chart — one point per day.
  - Data: Y-axis is average understanding level (1.0–3.0) across all Q&A notes updated on that day. X-axis is dates.
  - Days with no updated notes: render as a gap in the line.
  - Chart title above, left-aligned: `Understanding Progress`
  - Y-axis range: 1 to 3.
  - Tooltip on hover: shows date and average understanding level to one decimal place.

#### Section E: Course Mastery Block (Full Width)

**Position:** Immediately below the two-column chart row. Last section before the bottom of the content area.

**Layout:** Full width of the content area.

**Title:** `Course Mastery` — left-aligned above the list.

**Content:** A vertically stacked list of courses. Each course row contains:
- Left: Course title (text)
- Center: A horizontal progress bar showing the average understanding level of that course's Q&A notes as a proportion of 3. The bar fills from left to right.
- Right: The numeric average displayed as `X.X / 3`

**Ordering:** Courses sorted by average understanding level, ascending (weakest courses first) — so the user sees what needs the most attention at the top.

**Empty state:** If the user has no courses with Q&A notes in the selected range, show a single centered message: `No course data for this period.`

---

### Zone 3: Bottom Dock (Desktop)

**Position:** Fixed to the bottom of the viewport. Full viewport width. Does not scroll.

**Height:** Slim. Enough to comfortably fit an icon and a text label beneath it.

**Layout:** Five navigation items arranged in a horizontal row, evenly spaced and centered within the dock.

**Navigation items (in order, left to right):**
1. Overview — icon: a grid or home symbol
2. Courses — icon: a book or stack symbol
3. Notes — icon: a document or pen symbol
4. Daily — icon: a calendar symbol
5. Review — icon: a lightning bolt or cards symbol

**Each item:** An icon centered above a short text label. The active item has a visually distinct active state (handled by Coss UI). Inactive items are muted.

**Behavior:** Clicking a nav item navigates to the corresponding page. The current page's item is always in the active state.

**No FAB on desktop.** The floating action button is a mobile-only element.

---

## MOBILE LAYOUT

### Breakpoint Definition
Mobile applies at viewport widths < 768px. Tablet (768px–1023px) follows mobile layout unless specified otherwise.

---

### Zone 1: Top Bar (Mobile)

**Position:** Fixed to the top. Full viewport width. Does not scroll.

**Height:** Same slim height as desktop.

**Internal layout:** Two sections, space-between:

#### Left — Logo
- Same as desktop. Wordmark or logomark, left-aligned with standard padding.

#### Right — Search Icon + Avatar
- Two elements grouped tightly:
  1. **Search Icon Button:** A single icon button (magnifying glass). No label. No pill. Tapping opens the Command/Search sheet from the bottom of the screen (a bottom sheet, NOT a top modal or full-screen overlay).
  2. **User Avatar Button:** Same as desktop — circular avatar, opens a bottom sheet (not a popover on mobile) with the same three items: user info, theme toggle, logout.

**The streak is NOT in the top bar on mobile.** It moves into the content area (Hero Block).

---

### Zone 2: Content Area (Mobile — Overview Page)

**Position:** Below the top bar, above the bottom dock. Vertically scrollable.

**Internal horizontal padding:** Consistent on both sides, slightly narrower than desktop.

#### Sticky Sub-Header: Time Range Toggle

**Position:** Sticks to the top of the content area (just below the top bar) as the user scrolls. It does NOT scroll away.

**Layout:** Same three-option segmented control as desktop (`7 Days` / `30 Days` / `90 Days`). Full width of the content area on mobile.

**Behavior:** Same as desktop — selecting a range updates all charts below.

#### Section A: Hero Block (Mobile)

**Layout:** Single column. Stacked vertically.

- **Streak display:** At the very top of the hero block. `🔥 12 day streak` — prominent but not the largest text on screen.
- **Today's Study Time:** Large typographic number with label `Today's Study Time` above it. Same visual weight as desktop.
- **Three summary stats:** Displayed in a single horizontal row of three equal-width cells below the study time number:
  - `Total Courses` / count
  - `Total Notes` / count
  - `Avg. Understanding` / X.X / 3
  Each cell shows a small label above a bold value.

#### Section B: Study Time Chart (Mobile)

**Width:** Full width of the content area.

**Everything else:** Identical to desktop — bar/area chart, zero-filled, date X-axis, tooltip on tap.

**Note on touch:** On mobile, hover tooltips become tap tooltips. Tapping a data point shows the tooltip.

#### Section C: Mood Series Chart (Mobile)

**Width:** Full width of the content area. (The two-column layout from desktop collapses to single column on mobile.)

**Everything else:** Identical to desktop.

#### Section D: Understanding Progress Chart (Mobile)

**Width:** Full width of the content area.

**Everything else:** Identical to desktop.

#### Section E: Course Mastery Block (Mobile)

**Width:** Full width of the content area.

**Everything else:** Identical to desktop — stacked list, progress bars, ascending sort.

---

### Zone 3: Bottom Dock (Mobile)

**Position:** Fixed to the bottom of the viewport. Full viewport width.

**Height:** Slightly taller than desktop to accommodate thumb comfort. Respects device safe area insets (e.g. iPhone home indicator area).

**Layout:** Same five navigation items as desktop, evenly spaced.

**Behavior:** Identical to desktop.

---

### FAB — Floating Action Button (Mobile Only)

**Position:** Floats above the bottom dock, anchored to the bottom-right of the viewport. It sits just above the dock with a comfortable gap between them.

**Shape:** Circular button with an icon inside.

**Icon:** Context-aware based on the current screen:
- Overview → Plus icon (shortcut to log today's daily entry)
- Courses → Plus icon (create new course)
- Notes → Plus icon (create new note)
- Daily → Plus icon (log daily entry)
- Review → Play/lightning icon (start new review session)

**Behavior:** Tapping the FAB triggers the primary creation action for the current screen. The action opens a bottom sheet — it does NOT navigate to a separate page.

**The FAB does NOT appear on desktop.**

---

## Command Palette (Both Breakpoints)

**Trigger:**
- Desktop: `Ctrl+K` (Windows/Linux) or `⌘K` (Mac), or clicking the ghost pill button in the top bar.
- Mobile: Tapping the search icon in the top bar.

**Appearance:**
- Desktop: Opens as a centered modal overlay with a search input at the top and a scrollable results list below.
- Mobile: Opens as a bottom sheet with a search input at the top and a scrollable results list below.

**Search input:** Auto-focused when the palette opens. Placeholder text: `Search notes, courses, or run a command...`

**Results:** Grouped into sections:
1. Recent / Suggested actions (shown when input is empty)
2. Notes matching the query
3. Courses matching the query
4. Actions (e.g. `Create new note`, `Start review session`, `Log today's entry`)

**Dismissal:**
- Desktop: Press `Escape`, or click outside the modal.
- Mobile: Swipe down on the bottom sheet, or tap outside it.

---

## Data Dependencies

All data on the Overview page is fetched from the following Supabase RPCs:
- `public.get_overview_summary()` → powers the Hero Block summary stats
- `public.get_overview_range(p_days)` → powers all four charts (study time, mood, understanding, course mastery)

The `p_days` parameter maps directly to the Time Range Toggle: 7, 30, or 90.

Data is fetched fresh when:
1. The page first loads
2. The user changes the Time Range Toggle selection

While data is loading, each chart section shows a skeleton loading state (Coss UI skeleton component). The Hero Block stats also show skeleton states while loading.

---

## Empty States

- If the user has no daily entries in the selected range: Study Time chart shows all-zero bars with a message below: `No study sessions logged in this period.`
- If the user has no mood entries in the selected range: Mood chart shows an empty state message: `No mood entries in this period.`
- If the user has no Q&A notes updated in the selected range: Understanding chart shows: `No understanding data in this period.`
- If the user has no courses with Q&A notes: Course Mastery shows: `No course data for this period.`
- Today's study time in the Hero Block defaults to `0 min` if no entry exists for today.
