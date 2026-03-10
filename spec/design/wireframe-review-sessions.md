---
name: wireframe-review-sessions
description: Detailed wireframe and layout specification for the Rootly Review Sessions page, session setup, review screen, and summary screen — covering both desktop and mobile. Written for LLM agents to implement using Coss UI only.
---

# Rootly — Wireframe Specification: Review Sessions

> **Scope:** This document describes the layout, structure, spatial relationships, component hierarchy, and interaction model for the Rootly Review experience across four distinct screens: the Sessions List, the Session Setup Sheet, the Review Screen, and the Summary Screen — on both desktop and mobile breakpoints.
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

Cards always maintain a fixed height. All detail viewing happens via a Sheet. No exceptions.

---

## Component Rules for This Page

- **Session setup** → Coss UI **Sheet** (right on desktop, bottom on mobile).
- **Session detail view** → Coss UI **Sheet** (right on desktop, bottom on mobile).
- **Delete operation** → Coss UI **Alert Dialog**.
- **Overflow menu per card** → Coss UI **Dropdown Menu**.
- **Save session name input** → Coss UI **Popover** with an Input inside.
- **Skeleton loading** → Coss UI **Skeleton**.
- **Progress indicator during review** → Coss UI **Progress** component.
- **Rating buttons during review** → Three Coss UI **Button** components (not a dropdown, not a select).

---

## Layout Mental Model

The Review Sessions page lives inside the shared three-zone layout (Top Bar / Content Area / Bottom Dock) defined in `wireframe-overview.md`. This document specifies four distinct screens that together make up the full review experience. The Top Bar and Bottom Dock are shared layout components — do not re-implement them.

---

## Data Model Reference

```typescript
{
  id: string
  user_id: string
  name: string                      // user-defined session name
  date: string                      // YYYY-MM-DD
  question_count: number            // how many notes were reviewed
  shuffled: boolean
  flagged_only: boolean
  accuracy: number                  // 0–100
  time_spent: number                // stored as total minutes
  notes_leveled_up: string[]        // note IDs
  notes_leveled_down: string[]      // note IDs
  weakest_course_id: string | null  // null if all reviewed notes are uncategorized
  strongest_course_id: string | null
  created_at: string
}
```

**Display rules:**

- `time_spent` → `Xh Ym` (e.g. `1h 4m`). If under 60 minutes: `Ym` only (e.g. `17m`).
- `accuracy` → `X%` (e.g. `85%`).
- `date` → `Monday, March 10`. Append year if prior year: `Monday, Dec 1, 2025`.
- `weakest_course_id` / `strongest_course_id` → resolve to course title via a join or client-side lookup. If null, display `—`.

---

## SCREEN 1: REVIEW SESSIONS LIST PAGE

**Route:** `/review`

This is the landing page when the user navigates to Review from the bottom dock. It shows the history of saved sessions and provides the entry point to start a new session.

### DESKTOP LAYOUT

#### Page Header Row

**Position:** Top of Content Area. Sticky.

**Layout:** Single horizontal row, full width:

- **Left:** Static page title: `Review Sessions`
- **Right:** `Start Review` primary button with a play icon. Clicking opens the **Session Setup Sheet**.

#### Sessions List

**Position:** Below the sticky header. Vertically scrollable.

**Layout:** Single-column vertical list of Session Cards, ordered by `date DESC` (most recent first). No sorting or filtering controls — the list is always chronological.

**Loading state:** Render 4 Skeleton cards while data loads.

**All sessions loaded at once** — no pagination, no infinite scroll. The total number of review sessions per user is naturally bounded.

#### Session Card Anatomy

Each saved session is rendered as a Card with a fixed height.

**Card Left Section:**

- Session name — primary text, largest on the card. Truncated with ellipsis if it overflows one line.
- Date — muted text below the name. Formatted as described above.

**Card Center Section — Stats Row:**
A horizontal row of data points:

1. Accuracy: `85%` with a target/accuracy icon
2. Time spent: `17m` or `1h 4m` with a clock icon
3. Question count: `20 questions` with a list icon
4. Indicator badges (small, muted):
   - `Shuffled` badge — only shown if `shuffled = true`
   - `Flagged Only` badge — only shown if `flagged_only = true`

**Card Right Section:**

- `•••` overflow menu button. Coss UI Dropdown Menu:
  1. `View Details` → opens Session Detail Sheet
  2. A visual separator
  3. `Delete` → opens Delete Alert Dialog (destructive)

**Card click behavior:** Clicking anywhere on the card body (not the `•••` button) opens the **Session Detail Sheet**.

#### Empty State

- Heading: `No sessions yet`
- Subtext: `Complete your first review session to see your history here.`
- Primary button: `Start Review` — opens Session Setup Sheet.

---

### Session Detail Sheet

**Trigger:** Clicking a session card or `View Details` in the overflow menu.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** The session name.

**Content — four sections stacked vertically:**

**Section 1 — Top Stats:**
A horizontal row: accuracy (`85%`), time spent, question count, date. Same icons as the card.

**Section 2 — Session Config:**
Muted badges: `Shuffled` (if true), `Flagged Only` (if true). If both false, this section is omitted.

**Section 3 — Notes Leveled Up / Down:**
Two sub-sections side by side (or stacked on narrow screens):

- **Leveled Up (↑):** A vertical list of the actual note questions resolved from `notes_leveled_up` IDs. If the array is empty: show `None` in muted italic text.
- **Leveled Down (↓):** Same pattern using `notes_leveled_down` IDs.

**Section 4 — Course Insights:**

- `Weakest Course:` label + course title (or `—` if null)
- `Strongest Course:` label + course title (or `—` if null)

**Sheet Footer:**

- `Close` — ghost button.

---

### Delete Alert Dialog

**Trigger:** `Delete` in the session card overflow menu.

**Title:** `Delete session?`

**Body:** `This will permanently delete "${session name}". This action cannot be undone.`

**Buttons:**

- `Cancel` — ghost button.
- `Delete` — destructive button. On success: removes card from list. On failure: shows Coss UI Toast error.

---

### MOBILE LAYOUT — Sessions List Page

#### Page Header Row (Mobile)

- Left: `Review Sessions` title
- Right: `Start Review` icon-only primary button (play icon). Opens Session Setup Sheet as bottom sheet.

#### Sessions List (Mobile)

Single column. Same card anatomy as desktop. Fixed card heights.

#### FAB (Mobile)

**Position:** Bottom-right, above bottom dock.
**Icon:** Play icon.
**Action:** Opens Session Setup Sheet (bottom sheet).

#### Sheets on Mobile

All Sheets open as bottom sheets. Height: ~90% viewport with drag handle. Content scrollable.

---

## SCREEN 2: SESSION SETUP SHEET

**Trigger:** `Start Review` button or FAB.

**Component:** Coss UI Sheet, sliding in from the right on desktop / bottom sheet on mobile.

**Sheet title:** `New Review Session`

### Form Fields

1. **Question Count (Segmented control — required):**
   - Label: `Questions`
   - Four options as equally-sized selectable buttons in a horizontal row:
     - `10`, `20`, `All`, `Custom`
   - Default: `20`
   - When `Custom` is selected, a number Input appears below the buttons. Placeholder: `Enter number...`. Min: 1. Must not exceed the total number of available Q&A notes. If the user types a value exceeding available notes, show an inline error: `You only have [N] Q&A notes available.`

2. **Shuffle (Switch):**
   - Label: `Shuffle questions`
   - Default: off.
   - When on: questions are served in random order during the session.

3. **Flagged Only (Switch):**
   - Label: `Flagged notes only`
   - Default: off.
   - When on: only Q&A notes where `flag = true` are included in the session.
   - If `flagged_only` is on and the user has fewer flagged notes than the selected question count, show an inline warning (not an error — still allow starting): `You have [N] flagged notes. The session will include all of them.`

### Sheet Footer

- `Cancel` — ghost button. Closes the sheet with no action.
- `Start Session` — primary button with play icon. Always enabled as long as question count is valid. Clicking closes the sheet and navigates to the **Review Screen** at `/review/session`, passing the configuration as route state (not URL params — config should not be bookmarkable).

---

## SCREEN 3: THE REVIEW SCREEN

**Route:** `/review/session`

**Entry:** Navigated to from the Session Setup Sheet after clicking `Start Session`. If a user navigates directly to this route without a valid session config in state, redirect to `/review`.

This is a full-page, focused experience. The Bottom Dock is hidden on this screen — there is no navigation away except via the End Session button. The Top Bar is also hidden. The screen is entirely owned by the review session.

### DESKTOP LAYOUT

#### Session Header Bar

**Position:** Top of the screen. Sticky.

**Layout:** Three zones:

- **Left:** Session progress — `Question 7 of 20`. Uses Coss UI Progress component as a thin bar spanning the full header width below the text, showing `7/20` as a percentage fill.
- **Center:** A live session timer in `mm:ss` format (e.g. `04:32`), counting up from `00:00`. This is the source of `time_spent` on save.
- **Right:** `End Session` ghost button with an × icon.

#### Question Area

**Position:** Center of the screen. Vertically and horizontally centered in the remaining space.

**Layout:** A single focused card, wider than tall, centered:

1. **Question text** — large, prominent. The full question of the current Q&A note. Not truncated.
2. **Course name** — small muted label below the question, if the note has a linked course. Omitted if uncategorized.
3. **`Show Answer` button** — a prominent ghost button below the question. Centered.

**After `Show Answer` is clicked:**

- The answer text appears below the question, separated by a subtle divider. Full answer, not truncated.
- The `Show Answer` button is replaced by the three rating buttons.

#### Rating Buttons

**Position:** Below the revealed answer. Three equally-sized buttons in a horizontal row, centered:

1. `✓ Nailed it` — positive style (success/green variant if Coss UI supports it, otherwise default)
2. `~ Sort of` — neutral style (default/ghost)
3. `✗ Forgot it` — destructive style

**Behavior on click:**

- `Nailed it` → increments `understanding_level` by 1, clamped at 3. Records note ID in `notes_leveled_up` if level changed.
- `Sort of` → no change to `understanding_level`. Note is not recorded in either leveled up or down arrays.
- `Forgot it` → decrements `understanding_level` by 1, clamped at 1. Records note ID in `notes_leveled_down` if level changed.

After a rating is selected, the screen immediately transitions to the next question. No confirmation, no animation delay beyond a natural Coss UI transition.

**After the last question is rated:** Navigate automatically to the **Summary Screen**.

#### End Session Early

**Trigger:** Clicking `End Session` in the session header bar.

**Behavior:**

- If **zero questions** have been answered: show an Alert Dialog: `End session? You haven't answered any questions yet. No summary will be shown.` Buttons: `Keep going` (ghost), `End session` (destructive). On confirm: navigate back to `/review` with no summary.
- If **at least one question** has been answered: show an Alert Dialog: `End session early? You've answered X of Y questions.` with subtext: `A partial summary will be shown and you can save your progress.` Buttons: `Keep going` (ghost), `Show summary` (primary). On confirm: navigate to the Summary Screen with the partial data. The summary will display a `Session ended early — X of Y questions answered` notice.

---

### MOBILE LAYOUT — Review Screen

The Bottom Dock and Top Bar are hidden on mobile as well. The screen is fully owned by the session.

#### Session Header Bar (Mobile)

Same three zones but compressed:

- Progress text (`7 of 20`) above the progress bar — no need to show the full `Question 7 of 20` label, just `7 / 20`.
- Timer: same `mm:ss` format, center.
- `End Session` icon-only button (× icon), right.

#### Question Area (Mobile)

Full-width card. Question text slightly smaller than desktop but still large and readable. `Show Answer` button is full width. Rating buttons are stacked vertically (full width each) for easy thumb tapping.

---

## SCREEN 4: SESSION SUMMARY SCREEN

**Route:** `/review/summary`

**Entry:** Navigated to automatically after the last question, or after confirming `Show summary` on early end.

If a user navigates directly to this route without valid summary data in state, redirect to `/review`.

The Bottom Dock and Top Bar are restored on this screen.

### DESKTOP LAYOUT

#### Partial Session Notice (conditional)

If the session was ended early, display a muted banner at the very top of the content area:
`Session ended early — you answered X of Y questions.`

This is informational only. Not an error, not dismissible.

#### Top Stats Block

A horizontal row of four stat cards, spanning full content width:

1. **Accuracy** — large percentage value (e.g. `85%`) with label `Accuracy` below. This is the dominant visual.
2. **Time Spent** — formatted time (e.g. `17m` or `1h 4m`) with label `Time Spent`.
3. **Questions** — the number of questions actually answered (not the configured count if ended early) with label `Questions Answered`.
4. **Leveled Up** — count of notes in `notes_leveled_up` with label `Leveled Up` and an ↑ icon.

#### Course Insights Block

A two-column layout (or two side-by-side cards):

- **Weakest Course:** Course title (or `—` if null). Label: `Weakest Course`. Muted subtext: `Needs more attention`.
- **Strongest Course:** Course title (or `—` if null). Label: `Strongest Course`. Muted subtext: `Best understood`.

If both are null (all reviewed notes were uncategorized), show a single muted line: `No course data — all reviewed notes were uncategorized.` and omit the two-column layout.

#### Notes Breakdown Block

Two side-by-side sections:

**Leveled Up (↑):**

- Section heading: `Leveled Up`
- A vertical list of the actual question text for each note ID in `notes_leveled_up`, resolved via lookup.
- If empty: `None` in muted italic text.

**Leveled Down (↓):**

- Section heading: `Leveled Down`
- Same pattern using `notes_leveled_down`.
- If empty: `None` in muted italic text.

#### Save / Discard Actions

**Position:** Below the Notes Breakdown Block. Two buttons, right-aligned:

1. `Discard` — ghost button. Opens a Coss UI Alert Dialog:
   - Title: `Discard session?`
   - Body: `This summary will not be saved. This action cannot be undone.`
   - Buttons: `Keep` (ghost), `Discard` (destructive).
   - On confirm: navigate to `/review`.

2. `Save Session` — primary button. Clicking opens a Coss UI **Popover** anchored above the button containing:
   - A single Coss UI Input. Label: `Session name`. Placeholder: `e.g. React Hooks Deep Dive`.
   - A `Save` primary button inside the popover.
   - The input must not be empty to enable the Save button inside the popover.
   - On save: inserts the session record into `public.review_sessions`, closes the popover, navigates to `/review` — the new session card appears at the top of the list.

---

### MOBILE LAYOUT — Summary Screen

#### Layout Adjustments

- Top Stats Block: 2×2 grid instead of a 4-column row.
- Course Insights: stacked vertically.
- Notes Breakdown: stacked vertically (Leveled Up first, Leveled Down below).
- Save / Discard buttons: full width, stacked vertically (Save on top, Discard below).

---

## Data Dependencies

- **Sessions list:** `public.review_sessions` via RLS. Ordered by `date DESC`. Single fetch.
- **Session detail — note resolution:** Fetch note questions for IDs in `notes_leveled_up` and `notes_leveled_down` from `public.notes`.
- **Session detail — course resolution:** Fetch course titles for `weakest_course_id` and `strongest_course_id` from `public.courses`.
- **Session setup — available note count:** Query count of Q&A notes (optionally filtered by `flag = true`) from `public.notes` to validate the Custom question count input and the flagged-only warning.
- **Review screen — notes queue:** Fetch Q&A notes (filtered by `flagged_only` config if set), shuffled client-side if `shuffled = true`, truncated to the configured question count.
- **Rating actions:** UPDATE `understanding_level` on `public.notes` for each rated note immediately on rating (not batched at the end).
- **Save session:** INSERT into `public.review_sessions`.
- **Delete session:** DELETE from `public.review_sessions`.

---

## Interaction States Summary

| Action                    | Component          | Side Effect                                     |
| ------------------------- | ------------------ | ----------------------------------------------- |
| Start review              | Sheet → navigation | Navigate to `/review/session`                   |
| Rate question (Nailed it) | Button             | Update note understanding_level +1              |
| Rate question (Sort of)   | Button             | No data change                                  |
| Rate question (Forgot it) | Button             | Update note understanding_level −1              |
| End session (0 answered)  | Alert Dialog       | Navigate to `/review`, no save                  |
| End session (partial)     | Alert Dialog       | Navigate to `/review/summary` with partial data |
| Complete session          | Automatic          | Navigate to `/review/summary`                   |
| Save session              | Popover → Input    | INSERT review_session, navigate to `/review`    |
| Discard session           | Alert Dialog       | Navigate to `/review`, no insert                |
| View session detail       | Sheet              | No data change                                  |
| Delete session            | Alert Dialog       | Remove card from list                           |
