---
name: wireframe-courses
description: Detailed wireframe and layout specification for the Rootly Courses list page and Course Detail page, covering both desktop and mobile. Written for LLM agents to implement using Coss UI only.
---

# Rootly — Wireframe Specification: Courses Page

> **Scope:** This document describes the layout, structure, spatial relationships, component hierarchy, and interaction model for the Rootly Courses list screen and Course Detail screen on both desktop and mobile breakpoints.
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
🚫 NEVER grow a card in place to show linked notes, links, or any overflow content.
```

Cards in a grid must maintain a fixed, uniform height at all times. Any overflow content (e.g. extra topics, links list) is revealed via a Sheet or by navigating to the Course Detail page. No exceptions.

---

## Component Rules for This Page

- **Create and Edit operations** → Coss UI **Sheet** (right on desktop, bottom on mobile).
- **Delete operation** → Coss UI **Alert Dialog**.
- **Links viewer** → Coss UI **Sheet**.
- **Overflow menu per card** → Coss UI **Dropdown Menu**.
- **Filter and sort controls** → Coss UI **Select**.
- **Search input** → Coss UI **Input**.
- **Progress bar** → Coss UI **Progress** component.
- **Badges (topics)** → Coss UI **Badge**.
- **Skeleton loading** → Coss UI **Skeleton**.
- **Slider (progress input in form)** → Coss UI **Slider**.

---

## Layout Mental Model

The Courses page lives inside the shared three-zone layout (Top Bar / Content Area / Bottom Dock) defined in `wireframe-overview.md`. This document specifies what lives inside the Content Area for two screens:

1. **Courses List Page** — the main screen shown when navigating to Courses from the bottom dock.
2. **Course Detail Page** — a dedicated page at `/courses/[id]`, shown when a user clicks a course card.

The Top Bar and Bottom Dock are shared layout components. Do not re-implement them.

---

## SCREEN 1: COURSES LIST PAGE

### DESKTOP LAYOUT

#### Page Header Row

**Position:** Top of the Content Area. Sticky — does not scroll.

**Layout:** Single horizontal row, full content width, space-between:

- **Left:** Static page title label: `Courses`
- **Center — Filter Bar:**
  1. **Search Input:** Placeholder: `Search courses...`. Debounced (~300ms). Matches against title and instructor fields.
  2. **Topic Filter (Select):** Label: `Topic`. Options: `All Topics` (default), then every unique topic string across the user's courses, listed alphabetically. Filters to courses containing the selected topic.
  3. **Sort Control (Select):** Label: `Sort by`. Options:
     - `Last Updated` (default)
     - `Date Created`
     - `Progress (Low → High)` — surfaces courses needing most attention first
     - `Progress (High → Low)`
     - `Alphabetical`
- **Right:** `New Course` primary button with plus icon. Clicking opens the Create Course Sheet.

#### Course Grid

**Position:** Below the sticky Page Header Row. Vertically scrollable.

**Layout:** A **2-column CSS Grid** on desktop. All cards in the grid are equal width. All cards maintain a fixed, uniform height — no card ever expands inline.

**Loading state:** Render 4 Skeleton cards (2×2 grid) while data is loading.

**No pagination, no infinite scroll:** All of the user's courses are loaded in a single fetch. Users realistically have a small number of courses. Show all at once.

#### Course Card Anatomy

Each course is rendered as a Card. The card has a fixed height and a defined internal layout:

**Card Top Row:**
- **Left:** Course title — the primary text, largest on the card. Not truncated if it fits within 2 lines; clipped with ellipsis if longer.
- **Right (grouped tightly):**
  - **Overflow Menu Button (`•••`):** Coss UI Dropdown Menu on click.
    - Menu items:
      1. `Edit` → opens Edit Course Sheet
      2. `View links` → opens Links Viewer Sheet (only shown if `links` array is non-empty OR `course_link` is non-null)
      3. A visual separator
      4. `Delete` → opens Delete Alert Dialog (destructive)

**Card Second Row:**
- Instructor name — muted text. Only rendered if `instructor` is non-null and non-empty. If null, this row is omitted and the card layout adjusts upward.

**Card Progress Row:**
- Label: `Progress` — small muted text above the bar.
- A full-width Coss UI Progress bar showing the `progress` value (0–100).
- The numeric percentage is displayed to the right of the bar: e.g. `60%`.
- Progress is manually set by the user — it is not computed automatically.

**Card Topics Row:**
- A horizontal row of Coss UI Badge components, one per topic in the `topics` array.
- If the topics array has more than 3 items, show the first 3 badges and a `+N more` badge (e.g. `+2 more`) for the remainder.
- The `+N more` badge is not interactive — it does not expand or open anything. It is a read-only overflow indicator.
- If the `topics` array is empty, this row is omitted entirely.

**Card Bottom Row:**
- **Left:** If `links` array is non-empty or `course_link` is non-null: a link icon followed by the total count of all links (course_link counts as 1 if present, plus the length of the links array). Example: `🔗 3`. Clicking this area opens the Links Viewer Sheet.
- **Right:** Last updated timestamp — muted text. Relative format within 7 days, absolute date beyond that.

**Card click behavior:** Clicking anywhere on the card body (not on the `•••` button or the link count) navigates to the Course Detail Page at `/courses/[id]`.

#### Empty States

1. **No courses exist:**
   - Heading: `No courses yet`
   - Subtext: `Add your first course to start organizing your notes.`
   - Primary button: `New Course` — opens Create Course Sheet.

2. **Courses exist but none match filters:**
   - Heading: `No courses match your filters`
   - Subtext: `Try adjusting your search or topic filter.`
   - Ghost button: `Clear filters` — resets all filters.

---

### Create Course Sheet

**Trigger:** `New Course` button in Page Header Row, or FAB on mobile.

**Component:** Coss UI Sheet, sliding in from the right on desktop.

**Sheet title:** `New Course`

#### Form Fields

1. **Title (Input — required):**
   - Label: `Course Title` | Placeholder: `e.g. Machine Learning Fundamentals`
   - Cannot be empty or whitespace-only.

2. **Instructor (Input — optional):**
   - Label: `Instructor` | Placeholder: `e.g. Andrew Ng`

3. **Course Link (Input — optional):**
   - Label: `Main Course URL` | Placeholder: `https://...`
   - Validated as a URL format on blur. Show inline error if invalid.

4. **Additional Links (Dynamic list — optional):**
   - Label: `Additional Links`
   - Rendered as a vertical list of URL input fields.
   - Below the list: an `+ Add link` ghost button that appends a new empty URL input field.
   - Each link field has a remove button (× icon) on its right. Clicking removes that field.
   - Each field validated as a URL on blur.
   - There is no enforced maximum number of links.

5. **Topics (Tag input — optional):**
   - Label: `Topics`
   - A tag/chip input: the user types a topic and presses Enter or comma to add it as a badge.
   - Each added topic appears as a removable Badge inside the input area.
   - Clicking the × on a badge removes that topic.
   - Placeholder (when empty): `Type a topic and press Enter...`

6. **Progress (Slider — optional):**
   - Label: `Progress` with the current value displayed as a percentage to the right: e.g. `Progress — 40%`
   - A Coss UI Slider ranging from 0 to 100, stepping by 1.
   - Default value: `0`
   - This is manually set by the user. There is no auto-computation.

#### Sheet Footer
- `Cancel` — ghost button. If any field has been filled, show discard Alert Dialog before closing.
- `Save Course` — primary button. Disabled until Title field is valid. On success: closes sheet, prepends card to grid.

---

### Edit Course Sheet

**Trigger:** `Edit` in the course card overflow menu, or `Edit Course` button on the Course Detail Page header.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Edit Course`

**Form:** Identical to Create Course Sheet, pre-populated with current course values.

**Sheet Footer:**
- `Cancel` — same discard confirmation as Create.
- `Save Changes` — primary button. Disabled until at least one field has changed. On success: updates card in place on the list, and updates the detail page header if navigated from there.

---

### Links Viewer Sheet

**Trigger:** Clicking the link count area on a course card, or `View links` in the overflow menu.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Course Links`

**Content:** A vertical list of all links for this course:
- If `course_link` is non-null, it appears first with a label: `Main Course URL`
- Then each item in the `links` array, labeled `Link 1`, `Link 2`, etc.
- Each link is rendered as a clickable external link (opens in a new tab) with an external link icon.

**Sheet Footer:**
- `Close` — ghost button.
- `Edit Course` — secondary button. Opens Edit Course Sheet.

---

### Delete Course Alert Dialog

**Trigger:** `Delete` in the course card overflow menu, or `Delete Course` on the Course Detail Page.

**Component:** Coss UI Alert Dialog.

**Title:** `Delete course?`

**Body:** `This will permanently delete the course. Your notes linked to this course will not be deleted — they will simply be unlinked from it.`

This message is important: it reassures the user their notes are safe, matching the database's `ON DELETE SET NULL` behavior on `notes.course_id`.

**Buttons:**
- `Cancel` — ghost button.
- `Delete Course` — destructive button. On success: removes card from grid (or navigates back to list if triggered from detail page). On failure: shows Coss UI Toast error.

---

### MOBILE LAYOUT — Courses List Page

#### Page Header Row (Mobile)

**Row 1:**
- Left: `Courses` title
- Right: `New Course` icon-only primary button (plus icon)

**Row 2:** Full-width search input. Placeholder: `Search courses...`

**Row 3:** Horizontally scrollable chip row:
- Topic Filter chip
- Sort By chip
- Each chip opens a Coss UI bottom sheet with radio list options on tap.

#### Course Grid (Mobile)

**Layout:** Single column on mobile — one card per row. Same card anatomy as desktop. Cards maintain fixed height — no inline expansion.

#### FAB (Mobile)
**Position:** Bottom-right, above bottom dock.
**Icon:** Plus icon.
**Action:** Opens Create Course Sheet (bottom sheet).

#### Sheets on Mobile
All Sheets open as bottom sheets on mobile. Height: ~90% viewport. Scrollable form content.

---

## SCREEN 2: COURSE DETAIL PAGE

**Route:** `/courses/[id]`

**Entry point:** Clicking a course card on the Courses List Page.

**Mental model:** This page is the Notes page pre-scoped to a single course, with course metadata displayed as a persistent header at the top. The user can view and manage all notes linked to this course without losing course context.

---

### DESKTOP LAYOUT — Course Detail Page

#### Course Header Block

**Position:** Top of the Content Area. Sticky — does not scroll away.

**Layout:** A block spanning the full content width. Contains:

**Row 1 — Navigation + Actions:**
- **Left:** A back button (left arrow icon + label `Courses`) that navigates back to the Courses List Page.
- **Right (grouped):**
  - `Edit Course` — ghost button. Opens Edit Course Sheet.
  - `View Links` — ghost button with link icon. Opens Links Viewer Sheet. Only shown if `course_link` is non-null or `links` array is non-empty.
  - `Delete Course` — destructive ghost button. Opens Delete Alert Dialog.

**Row 2 — Course Identity:**
- **Left:**
  - Course title — large heading text, the dominant element of this row.
  - Instructor name — muted text below the title. Only shown if non-null.
- **Right:**
  - Progress display: Coss UI Progress bar with percentage label. Same visual as the card but slightly larger.

**Row 3 — Topics:**
- A horizontal row of Badge components, one per topic. All topics shown — no truncation (this is the detail page, not a card).
- If `topics` is empty, this row is omitted.

---

#### Notes Section

**Position:** Below the Course Header Block. Fills remaining Content Area height. Vertically scrollable.

**This section is the full Notes page experience, scoped to this course.**

All behavior, components, and rules from `wireframe-notes.md` apply here, with the following differences:

1. **Course filter is pre-applied and locked:** The note list shows only notes where `course_id` matches this course. The Course Filter select is removed from the filter bar — it is not needed since context is already established.

2. **Page title is omitted:** The course name in the header block serves as the page title. Do not render a separate `Notes` label inside the notes section.

3. **New Note defaults:** When creating a note from this page (via the `New Note` button or FAB), the Course field in the Create Note Sheet is pre-selected to this course and cannot be changed. The user cannot unlink a note from this course during creation on this page.

4. **All other notes behavior is identical:** Filters (search, type, flagged, sort), infinite scroll, card anatomy, badges, flag toggle, overflow menu, sheets, alert dialogs — everything works the same as on the main Notes page.

---

### MOBILE LAYOUT — Course Detail Page

#### Course Header Block (Mobile)

**Row 1:**
- Left: Back button (arrow + `Courses` label)
- Right: `•••` overflow menu button. Menu items: `Edit Course`, `View Links` (if applicable), separator, `Delete Course`

**Row 2:**
- Course title — large heading.
- Instructor — muted text below. Only if non-null.

**Row 3:**
- Progress bar — full width, with percentage label on the right.

**Row 4:**
- Topic badges — horizontally scrollable row if they overflow. All topics shown.

#### Notes Section (Mobile)

Identical to the Notes page mobile layout, with the same three differences listed in the desktop Course Detail section above (course filter locked, no page title, new note pre-fills course).

#### FAB (Mobile — Course Detail)
**Icon:** Plus icon.
**Action:** Opens Create Note Sheet with course pre-filled.

---

## Data Dependencies

- **Courses list:** `public.courses` via RLS. Single fetch, all courses loaded at once.
- **Topic filter options:** Derived client-side from the loaded courses' `topics` arrays — no separate fetch needed.
- **Create course:** INSERT into `public.courses`.
- **Edit course:** UPDATE on `public.courses`.
- **Delete course:** DELETE on `public.courses`. Notes are NOT deleted — `notes.course_id` is set to NULL by the database (`ON DELETE SET NULL`).
- **Course detail notes:** Same as Notes page data dependencies, with an additional `course_id = [id]` filter.

---

## Interaction States Summary

| Action | Component | Side Effect |
|---|---|---|
| Create course | Sheet | Prepend card to grid |
| Edit course | Sheet | Update card in place |
| Delete course | Alert Dialog | Remove card from grid; unlinks notes |
| View links | Sheet | No data change |
| Click course card | Navigation | Navigate to `/courses/[id]` |
| Back button on detail | Navigation | Return to Courses list |
| Edit course (from detail) | Sheet | Updates detail header |
| Delete course (from detail) | Alert Dialog | Navigate back to list |
| All notes actions on detail | See wireframe-notes.md | Same as Notes page |
