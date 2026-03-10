---
name: wireframe-daily-entries
description: Detailed wireframe and layout specification for the Rootly Daily Entries page, covering both desktop and mobile. Written for LLM agents to implement using Coss UI only.
---

# Rootly — Wireframe Specification: Daily Entries Page

> **Scope:** This document describes the layout, structure, spatial relationships, component hierarchy, and interaction model for the Rootly Daily Entries screen on both desktop and mobile breakpoints.
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

This rule is non-negotiable. Every UI element must be built using Coss UI primitives and compositions. No exceptions.

---

## ⚠️ ANTI-PATTERN: No Inline Card Expansion

```
🚫 NEVER expand a card's height inline to reveal more content.
```

Cards always maintain a fixed height. All editing or detailed viewing happens through a Sheet. No exceptions.

---

## Component Rules for This Page

- **Create and Edit operations** → Coss UI **Sheet** (right on desktop, bottom on mobile).
- **Delete operation** → Coss UI **Alert Dialog**.
- **Overflow menu per card** → Coss UI **Dropdown Menu**.
- **Filter controls** → Coss UI **Select** and date range inputs.
- **Mood selector in form** → Three large Coss UI **Toggle** or selectable button components. Never a dropdown.
- **Study time input** → Two Coss UI **Input** components (hours + minutes) side by side.
- **Date picker** → Coss UI **Calendar** or **DatePicker** component.
- **Skeleton loading** → Coss UI **Skeleton** component.

---

## Layout Mental Model

The Daily Entries page lives inside the shared three-zone layout (Top Bar / Content Area / Bottom Dock) defined in `wireframe-overview.md`. This document only specifies what lives inside the Content Area, plus mobile-specific adjustments.

The Top Bar and Bottom Dock are shared layout components. Do not re-implement them.

---

## Data Model Reference

```typescript
{
  id: string
  user_id: string
  date: string           // stored as YYYY-MM-DD
  study_time: number     // stored as total minutes
  mood: 1 | 2 | 3
  notes: string | null
  created_at: string
  updated_at: string
}
```

**Display rules:**
- `date` → displayed as `Monday, Dec 1` (full weekday name, abbreviated month, day number — no year unless the entry is from a prior year, in which case append the year: `Monday, Dec 1, 2025`).
- `study_time` → displayed as `Xh Ym` (e.g. `2h 30m`). If under 60 minutes, display as `Ym` only (e.g. `45m`). Never display raw minutes.
- `mood` → displayed as an icon + label. `1` = 😔 Low, `2` = 😐 Neutral, `3` = 😊 Good.

---

## DESKTOP LAYOUT

### Page Header Row

**Position:** Top of the Content Area. Sticky — does not scroll.

**Layout:** Single horizontal row, full content width:

- **Left:** Static page title label: `Daily Entries`

- **Center — Filter Bar:**
  1. **Date Range — From (DatePicker):** Label: `From`. Defaults to empty (no filter). When set, shows only entries on or after this date.
  2. **Date Range — To (DatePicker):** Label: `To`. Defaults to empty. When set, shows only entries on or before this date.
  3. **Mood Filter (Select):** Label: `Mood`. Options: `All Moods` (default), `😊 Good`, `😐 Neutral`, `😔 Low`. Filters the list to entries matching the selected mood.

- **Right — Primary Action Button:**
  - **If today has no entry yet:** A primary button labeled `Log Today` with a plus icon.
    - Clicking opens the Create Entry Sheet with the date pre-set to today and the date field disabled (user cannot change the date from this entry point).
  - **If today already has an entry:** The button changes to `Edit Today's Entry` (secondary/ghost style).
    - Clicking opens the Edit Entry Sheet pre-populated with today's entry.
  - This button's state is determined on page load by checking if an entry with `date = today` exists for the current user.

---

### Entry List

**Position:** Below the sticky Page Header Row. Fills remaining Content Area height. Vertically scrollable.

**Layout:** Single-column vertical list of Entry Cards. Cards are stacked with consistent vertical spacing.

**Ordering:** Always descending by `date` — most recent entry at the top. This order is fixed and cannot be changed by the user. There is no sort control.

**Loading state:** Render 5 Skeleton cards while data is loading.

**Pagination:** All entries are loaded in a single fetch. Daily Entries is a personal log — the total number of entries per user is bounded and manageable. No infinite scroll, no pagination controls.

---

### Entry Card Anatomy

Each entry is rendered as a Card with a fixed height. Cards never expand inline.

#### Card Left Section
A vertical stack, left-anchored:

1. **Date label:** Human-readable date in the format described above (e.g. `Monday, March 10`). This is the primary text of the card — largest and most prominent.
2. **"Today" badge:** Rendered immediately to the right of the date label (inline, not below) using a Coss UI Badge. Only shown when the entry's `date` equals today's date. Helps the user instantly locate today's log.

#### Card Center Section
A horizontal row of three data points, visually grouped:

1. **Study Time:**
   - Icon: clock icon
   - Value: formatted study time (e.g. `2h 30m`)

2. **Mood:**
   - Icon: the mood emoji corresponding to the value
   - Label: `Low`, `Neutral`, or `Good`

3. **Notes indicator (conditional):**
   - Only rendered if `notes` is non-null and non-empty.
   - A muted text snippet showing the first ~60 characters of the notes field, truncated with ellipsis if longer.
   - If `notes` is null or empty, this slot is omitted — no placeholder is shown.

#### Card Right Section
Right-anchored:
- **Overflow Menu Button (`•••`):** Coss UI Dropdown Menu on click.
  - Menu items:
    1. `Edit` → opens Edit Entry Sheet
    2. A visual separator
    3. `Delete` → opens Delete Alert Dialog (destructive)

---

### Empty States

1. **No entries exist at all:**
   - Heading: `No entries yet`
   - Subtext: `Start logging your study sessions to track your progress.`
   - Primary button: `Log Today` — opens Create Entry Sheet with today's date pre-set.

2. **Entries exist but none match current filters:**
   - Heading: `No entries match your filters`
   - Subtext: `Try adjusting the date range or mood filter.`
   - Ghost button: `Clear filters` — resets all filters to default.

---

### Create Entry Sheet

**Trigger:** `Log Today` button in the Page Header Row, FAB on mobile, or `Log Today` button in the empty state.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Log Today`

#### Form Fields

1. **Date (DatePicker — contextually disabled):**
   - Label: `Date`
   - When triggered from the `Log Today` button or FAB: pre-set to today's date and **disabled** — the user cannot change it.
   - Already-logged dates are **blocked** in the date picker — they cannot be selected. The picker visually greys them out. This prevents duplicate entries. If a user wants to update a past entry, they must use the Edit flow via that entry's overflow menu.
   - The date picker shows only dates up to and including today. Future dates cannot be selected — a user cannot pre-log a future session.

2. **Study Time (dual Input — required):**
   - Label: `Study Time`
   - Two number inputs side by side:
     - First input: label `Hours`, min 0, max 23.
     - Second input: label `Minutes`, min 0, max 59.
   - Both default to `0`. At least one must be non-zero to be valid — a study time of 0h 0m is not allowed.
   - These two values are combined on save: `(hours × 60) + minutes` → stored as `study_time` in minutes.

3. **Mood (segmented toggle — required):**
   - Label: `Mood`
   - Three large equally-sized selectable buttons in a horizontal row:
     - `😔 Low` (value: 1)
     - `😐 Neutral` (value: 2)
     - `😊 Good` (value: 3)
   - No default — user must select one. Cannot submit without a selection.
   - Exactly one option is active at a time.

4. **Notes (Textarea — optional):**
   - Label: `Notes`
   - Placeholder: `How did your study session go?`
   - No character limit enforced in UI.

#### Sheet Footer
- `Cancel` — ghost button. If any field has been touched, show discard Alert Dialog before closing: `Discard entry? Your log will not be saved.` with `Discard` (destructive) and `Keep editing`.
- `Save Entry` — primary button. Disabled until Study Time is valid (> 0) and Mood is selected. On success: closes sheet, prepends card to list.

---

### Edit Entry Sheet

**Trigger:** `Edit` in the entry card overflow menu, or `Edit Today's Entry` button in the page header.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Edit Entry — [formatted date]` (e.g. `Edit Entry — Monday, March 10`)

**Form:** Identical to Create Entry Sheet, pre-populated with the entry's current values.

**Date field behavior in edit:** The date field is always **disabled** in the Edit sheet. A logged entry's date is immutable — dates cannot be reassigned. If the user needs a different date, they delete this entry and create a new one.

**Sheet Footer:**
- `Cancel` — same discard confirmation as Create.
- `Save Changes` — primary button. Disabled until at least one field has changed. On success: closes sheet, updates card in place.

---

### Delete Alert Dialog

**Trigger:** `Delete` in the entry card overflow menu.

**Component:** Coss UI Alert Dialog.

**Title:** `Delete entry?`

**Body:** `This will remove your log for [formatted date]. This action cannot be undone.` (e.g. `This will remove your log for Monday, March 10. This action cannot be undone.`)

**Buttons:**
- `Cancel` — ghost button.
- `Delete` — destructive button. On success: removes card from list. On failure: shows Coss UI Toast error.

---

## MOBILE LAYOUT

### Page Header Row (Mobile)

**Row 1:**
- Left: `Daily Entries` title
- Right: `Log Today` icon-only primary button (plus icon) — or `Edit Today` icon-only ghost button if today already has an entry. Opens the appropriate Sheet as a bottom sheet.

**Row 2 — Filter Bar:**
Horizontally scrollable chip row:
- `From` date chip — tapping opens a Coss UI bottom sheet with the date picker.
- `To` date chip — same.
- `Mood` filter chip — tapping opens a Coss UI bottom sheet with radio options: All Moods, Good, Neutral, Low.
- Active filters show a visual indicator on their chip.

---

### Entry List (Mobile)

Identical to desktop layout. Single-column list, same card anatomy. Fixed card heights — no inline expansion.

---

### Sheets on Mobile

All Sheets open as **bottom sheets** on mobile (slide up from bottom). Coss UI Sheet `side` prop set to `bottom` on mobile breakpoints. Height: ~90% viewport with drag handle. Form content is vertically scrollable inside the sheet.

---

### FAB (Mobile)

**Position:** Bottom-right, floating above the bottom dock.
**Context-aware behavior:**
- If today has no entry: plus icon. Tapping opens Create Entry Sheet with today's date pre-set and locked.
- If today already has an entry: pencil/edit icon. Tapping opens Edit Entry Sheet for today's entry.

---

## Data Dependencies

- **Entry list:** `public.daily_entries` via RLS. Filtered and ordered server-side by `date DESC`.
- **Today's entry check:** On page load, query for an entry where `date = today` and `user_id = current user`. Result determines the primary button state and FAB icon.
- **Already-logged dates (for date picker blocking):** Fetch all `date` values from `public.daily_entries` for the current user. Used client-side to disable those dates in the date picker.
- **Create:** INSERT into `public.daily_entries`.
- **Edit:** UPDATE on the corresponding row.
- **Delete:** DELETE on the corresponding row.

---

## Interaction States Summary

| Action | Component | Side Effect |
|---|---|---|
| Log today | Sheet | Prepend card to list; header button changes to Edit Today |
| Edit entry | Sheet | Update card in place |
| Delete entry | Alert Dialog | Remove card from list |
| Apply date range filter | DatePicker chips | Re-filter list |
| Apply mood filter | Select / chip | Re-filter list |
| Clear filters | Ghost button | Reset all filters, show full list |
