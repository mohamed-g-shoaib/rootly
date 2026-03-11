---
name: wireframe-notes
description: Detailed wireframe and layout specification for the Rootly Notes page, covering both desktop and mobile. Written for LLM agents to implement using Coss UI only.
---

# Rootly — Wireframe Specification: Notes Page

> **Scope:** This document describes the layout, structure, spatial relationships, component hierarchy, and interaction model for the Rootly Notes screen on both desktop and mobile breakpoints.
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
🚫 NEVER use "Show more" / "Show less" toggles that grow a card in place.
```

Expanding a card inline breaks grid and list layout rhythm, causes neighboring cards to shift,
and produces dead whitespace in grid siblings. ALL "see more" interactions must open a separate
surface (Sheet, Popover, or dedicated page). Cards always maintain a fixed, consistent height.

---

## Component Rules for This Page

- **Create and Edit operations** → always use the Coss UI **Sheet** component. Never a modal, never a separate page.
- **Delete operation** → always use the Coss UI **Alert Dialog** component. Never a simple confirm(), never a toast-only action.
- **Full body view (Freeform)** → use the Coss UI **Sheet** component. Never expand the card inline.
- **Export scope popover** → use the Coss UI **Popover** component.
- **Overflow menu per card** → use the Coss UI **Dropdown Menu** component.
- **Filter selects (implemented)** → desktop filters use `Combobox` for Type/Course and `Select` for Sort.
- **Search input (implemented)** → no page-level search input is implemented on the Notes page.
- **Badges** → use the Coss UI **Badge** component.
- **Skeleton loading** → use the Coss UI **Skeleton** component.

---

## Layout Mental Model

The Notes page lives inside the shared three-zone layout (Top Bar / Content Area / Bottom Dock) defined in `wireframe-overview.md`. This document only specifies what lives inside the **Content Area** for the Notes page, plus any mobile-specific adjustments.

The Top Bar and Bottom Dock are identical to the Overview page. Do not re-implement them — they are shared layout components.

---

## DESKTOP LAYOUT

### Page Header Row

**Position:** First element inside the Content Area, at the very top. Does not scroll — it is sticky and remains visible as the user scrolls the note list below it.

**Layout:** A single horizontal row spanning the full content width. Contains four groups arranged left to right:

#### Group 1 — Page Title (Left-anchored)

- A static text label: `Notes`
- This is the page heading. It is not interactive.

#### Group 2 — Filter Bar (Center, takes majority of width)

A horizontal row of controls grouped tightly together:

1. **Search Input:**
   - **Not implemented:** the Notes page currently has no search input.

2. **Type Filter (implemented):**
   - Label: `Type`
   - Options: `All Types` (default), `Q&A`, `Freeform`
   - Filters note list to show only the selected type.

3. **Course Filter (implemented):**
   - Label: `Course`
   - Options: `All Courses` (default), then one option per course the user has created, listed alphabetically.
   - Filters note list to show only notes linked to the selected course.

4. **Flagged Filter (implemented):**
   - Label: `Flagged`
   - A toggle button — inactive by default. When active, the note list shows only notes where `flag = true`.

5. **Sort Control (Select):**
   - Label: `Sort by`
   - Options:
     - `Last Updated` (default)
     - `Date Created`
     - `Understanding Level (Low → High)`
     - `Understanding Level (High → Low)`
     - `Course`
   - Applies to the current filtered set.

#### Group 3 — Hide/Show All Answers Toggle (Right of filter bar)

- A single icon-only button.
- **Implemented behavior:** Toggles a page-level boolean (`globalShowAnswers`) and changes icon (`Eye` vs `ViewOff`).
- **Visibility rule:** This button is only visible when the current note list contains at least one Q&A note. If the list shows only Freeform notes (due to filtering), this button is hidden entirely.
- State is local to the page session — it resets on page reload.

#### Group 4 — Action Buttons (Right-anchored)

Two buttons, grouped tightly:

1. **Export Button:**
   - Style: secondary / ghost button.
   - Label: `Export`
   - Icon: download or export icon, left of label.
   - Clicking opens a Coss UI **Popover** anchored below the button.
   - Popover contents:
     - A scope label (not interactive, small muted text):
       - If no filters are active: `Exporting all [N] notes`
       - If any filter is active: `Exporting [N] filtered notes`
     - Two action buttons stacked vertically (implemented):
       - `Export as PDF` (uses `@react-pdf/renderer` to generate a PDF in the browser)
       - `Export as Markdown` (downloads a `.md` file)
   - Clicking either export option triggers the export and closes the popover.

2. **Create Note Button:**
   - Style: primary button.
   - Label: `New Note`
   - Icon: plus icon, left of label.
   - Clicking opens the **Create Note Sheet** (defined below).

---

### Note List

**Position:** Below the sticky Page Header Row. Fills the remaining content area height. Vertically scrollable.

**Layout:** A single-column vertical list of Note Cards. Cards are stacked with consistent vertical spacing between them.

**Loading state:** While data is being fetched, render 5 Skeleton cards in place of real cards. Each skeleton card matches the approximate height of a real card.

**Infinite scroll:** As the user scrolls toward the bottom of the list, the next batch of notes is fetched automatically. A loading spinner appears at the bottom of the list while the next batch loads. There is no "Load more" button — loading is automatic.

**Default page size:** 20 notes per batch.

---

### Note Card Anatomy

Each note in the list is rendered as a Card component. **Cards have a fixed height — they never expand inline.** All additional content is revealed via Sheets.

#### Card Top Row

A horizontal row spanning the full card width:

- **Left side (implemented):**
  - Course name (if present) is shown as muted text.
  - Note type badge is not rendered on the card.

- **Right side (grouped tightly):**
  - **Flag Toggle Button:** An icon-only button showing a flag icon.
    - If `flag = false`: icon is in its default/muted state. Tooltip: `Flag for review`
    - If `flag = true`: icon is in its active/highlighted state. Tooltip: `Remove flag`
    - Clicking immediately toggles the flag value via an optimistic update (update UI instantly, sync to DB in background).

    **Implemented note:** the list is currently mocked/static; the flag toggle builds a `next` array but does not persist it.

  - **Overflow Menu Button (`•••`):** An icon-only button (three dots / ellipsis icon).
    - Clicking opens a Coss UI Dropdown Menu anchored below-left of the button.
    - Menu items:
      1. `Edit` → opens the Edit Note Sheet
      2. `View full note` → opens the Full Note Viewer Sheet (see below)
      3. `Export as PDF` → present in the menu UI but not wired to export per-note
      4. `Export as Markdown` → present in the menu UI but not wired to export per-note
      5. A visual separator line
      6. `Delete` → opens the Delete Alert Dialog

#### Card Main Content Area

**For Q&A notes:**

- **Question:** Displayed in full, not truncated. Uses a slightly bolder text style than the answer (handled by Coss UI typography tokens).
- **Answer section (implemented):**
  - **Default state:** Hidden.
  - **Desktop:** shows a `Peek answer` control that opens a preview surface.
  - **Mobile:** shows a `Show Answer` button.
  - **When revealed:** The answer text is shown in full; on mobile a `Hide Answer` button is shown.
  - **Global toggle interaction:** If the page-level "Hide All Answers" / "Show All Answers" button is clicked, this card's answer state updates to match. If the user then manually toggles this specific card, it overrides the global state for this card only.
  - **Card height:** The card height adjusts between the hidden and revealed answer states only. This is acceptable because it is a single-column list, not a grid — there are no sibling cards in the same row to be affected.

**For Freeform notes:**

- **Body preview:** The body text is truncated to a maximum of 4 lines using CSS line-clamp. The card height is always fixed at this truncated height.
- If the body exceeds 4 lines, a `View full note` text link appears below the preview. Clicking this opens the **Full Note Viewer Sheet** — it does NOT expand the card inline.
- There is no "Show less" on the card. Collapsing is done by closing the Sheet.

#### Card Bottom Row

A horizontal row spanning the full card width:

- **Left side — Badge Row (implemented):**
  - Code snippet is shown as an outline button (with code icon) labeled using `toCodeBadgeLabel(note.codeLanguage)`; clicking opens the Code Snippet Viewer Sheet.
  - Understanding level is shown as a single outline badge for Q&A notes.
  - A separate "Flagged" badge is not rendered.

- **Right side — Metadata:**
  - Updated-at metadata is not rendered on the note card.

---

### Empty States

Three distinct empty states, each shown in the center of the note list area:

1. **No notes exist at all:**
   - Heading: `No notes yet`
   - Subtext: `Create your first note to get started.`
   - A primary button: `New Note` — clicking opens the Create Note Sheet.

2. **Notes exist but none match current filters:**
   - Heading: `No notes match your filters`
   - Subtext: `Try adjusting your search or clearing the filters.`
   - A ghost button: `Clear filters` — clicking resets all filters to their default state.

3. **Filtered list has only Freeform notes with Understanding Level sort selected:**
   - Show the notes normally. The Understanding Level sort falls back silently to Last Updated. No error shown.

---

### Full Note Viewer Sheet

**Trigger:** Clicking `View full note` text link on a Freeform card, or `View full note` in the overflow menu.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** First 6 words of the note body followed by `...`, or the full body if shorter.

**Content:**

- Full body text, not truncated, vertically scrollable inside the sheet.
- If the note has a code snippet, the code block is rendered below the body.
- **Implemented:** code is rendered via `CodeBlock` (Shiki).
- Read-only. No editing within this sheet.

**Sheet Footer:**

- `Close` — ghost button.
- `Edit Note` — secondary button. Closes this sheet and opens the Edit Note Sheet.

---

### Create Note Sheet

**Trigger:** Clicking the `New Note` button in the Page Header Row, or the FAB on mobile.

**Component:** Coss UI Sheet, sliding in from the right side of the screen.

**Sheet title:** `New Note`

**Sheet width (desktop):** Use Coss UI Sheet size tokens — do not use arbitrary widths.

#### Step 1 — Note Type Selection

Before showing the full form, present a type selector:

- Two large selectable cards or toggle buttons: `Q&A` and `Freeform`
- Default: no type pre-selected. User must choose.
- Once a type is selected, the appropriate form fields appear below without closing and reopening the sheet.

#### Form Fields — Q&A Type

1. **Course (Select — optional):**
   - Label: `Course`
   - Options: `No course` (default), then all user courses alphabetically.

2. **Question (Textarea — required):**
   - Label: `Question` | Placeholder: `What is the question?`

3. **Answer (Textarea — required):**
   - Label: `Answer` | Placeholder: `Write the answer...`

4. **Understanding Level (Segmented control — required):**
   - Label: `Understanding Level`
   - 3 options, each as a large selectable button:
     - `Confused` (value: 1)
     - `Getting It` (value: 2)
     - `Clear` (value: 3)
   - No default — user must select one. Cannot submit without a selection.

5. **Code Snippet (optional, collapsible):**
   - Collapsed by default. Label: `+ Add code snippet`
   - Expanding reveals: Language Select + Code Textarea (monospace).
   - Cannot re-collapse unless both fields are empty.

6. **Flag for review (Switch — optional):** Default off.

#### Form Fields — Freeform Type

1. **Course (Select — optional):** Same as Q&A.
2. **Body (Textarea — required):** Label: `Note` | Placeholder: `Write your note...` | Taller than Q&A textareas.
3. **Code Snippet (optional, collapsible):** Same as Q&A.
4. **Flag for review (Switch — optional):** Same as Q&A.

#### Sheet Footer

- `Cancel` — ghost button. If any field has been filled, show a discard Alert Dialog before closing.
- **Implemented:** `Save Note` is currently rendered but disabled.

---

### Edit Note Sheet

**Trigger:** `Edit` in the note overflow menu.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Edit Note`

**Form:** Same as Create, pre-populated with current values. Note type is a read-only label — cannot be changed after creation.

**Sheet Footer:**

- `Cancel` — same discard confirmation as Create.
- **Implemented:** `Save Changes` is currently rendered but disabled.

**Implemented note:** The editor supports an optional code snippet section that uses `CodeEditor` (CodeMirror) and a searchable language selector.

---

### Code Snippet Viewer Sheet

**Trigger:** Clicking the Code Snippet Badge on a note card.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `code_language` value (e.g. `Python`), or `Code Snippet` if language is `text`.

**Content (implemented):** Read-only code rendered via `CodeBlock` (Shiki) and wrapped in a scrollable area.

**Sheet Footer:**

- `Close` — ghost button.
- `Edit Note` — secondary button. Opens Edit Note Sheet for the same note.

---

### Delete Alert Dialog

**Trigger:** `Delete` in the note overflow menu.

**Component:** Coss UI Alert Dialog.

**Title:** `Delete note?`

**Body:** `This action cannot be undone. The note will be permanently deleted.`

**Buttons:**

- `Cancel` — ghost button.
- `Delete` — destructive button. On success: removes card from list. On failure: restores card, shows Coss UI Toast error.

---

## MOBILE LAYOUT

### Page Header Row (Mobile)

**Position:** Sticky below the Top Bar.

**Row 1:**

- Left: Page title `Notes`
- Right: `New Note` icon-only primary button (plus icon). Opens Create Note Sheet as bottom sheet.
- Right: `Export` icon-only ghost button (download icon). Opens Export Popover.

**Row 2 — Search:**

- **Implemented:** no search row is present.

**Row 3 — Filter Chips:**
Horizontally scrollable chip row:

- Type chip | Course chip | Flagged chip | Sort By chip
- Each chip, when tapped, opens a Coss UI bottom sheet with options as a vertical radio list.
- Active filters show a visual indicator on their chip.

**Hide/Show All Answers (mobile):**
Full-width ghost button below the chip row, visible only when the list contains Q&A notes.

**Implemented behavior:** the mobile layout uses icon buttons in the header row for flagged-only and show/hide all answers.

---

## Active State / Icon Color (Implemented)

- Notes header flagged-only icon uses `var(--destructive)` when active.
- Notes header global show answers icon uses `var(--info)` when active.
- In the editor sheet, understanding level icons use `var(--warning)` / `var(--info)` / `var(--success)` when selected.

---

### Note List (Mobile)

- Single column. Same card anatomy as desktop.
- Answer reveal behavior identical to desktop.
- Freeform body truncated to 4 lines. `View full note` link opens Full Note Viewer Sheet (bottom sheet). No inline expansion.
- Infinite scroll identical to desktop.

---

### Sheets on Mobile

All Sheets open as **bottom sheets** on mobile (slide up from bottom). Configure the Coss UI Sheet `side` prop to `bottom` on mobile breakpoints. Height: ~90% of viewport with a drag handle. Form content is vertically scrollable inside the sheet.

---

### FAB (Mobile)

**Position:** Bottom-right, floating above the bottom dock.
**Icon:** Plus icon.
**Action:** Opens Create Note Sheet (bottom sheet). Intentional duplication of the header button for thumb-zone access.

---

## Data Dependencies

- **Note list:** `public.notes` via RLS. Server-side filtering and sorting where possible; debounced client-side for search.
- **Course filter options:** `public.courses` via RLS.
- **Flag toggle:** Optimistic update on `public.notes.flag`.
- **Create:** INSERT into `public.notes`.
- **Edit:** UPDATE on `public.notes`.
- **Delete:** DELETE on `public.notes`.
- **Export:** Client-side generation from filtered set. Fetch full filtered set before generating if batch is incomplete.

---

## Interaction States Summary

| Action                   | Component              | Side Effect                |
| ------------------------ | ---------------------- | -------------------------- |
| Create note              | Sheet                  | Prepend card to list       |
| Edit note                | Sheet                  | Update card in place       |
| Delete note              | Alert Dialog           | Remove card from list      |
| View full Freeform note  | Sheet                  | No data change             |
| View code snippet        | Sheet                  | No data change             |
| Toggle flag              | Optimistic icon button | Update badge + flag icon   |
| Export notes             | Popover → download     | No data change             |
| Reveal/hide answer (Q&A) | Inline button on card  | No data change             |
| Reveal/hide all answers  | Page header button     | No data change             |
| Apply filter             | Select / chip          | Re-fetch or re-filter list |
| Change sort              | Select / chip          | Re-sort current list       |
| Infinite scroll trigger  | Automatic              | Append next batch          |
