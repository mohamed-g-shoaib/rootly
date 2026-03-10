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

## Component Rules for This Page

- **Create and Edit operations** → always use the Coss UI **Sheet** component. Never a modal, never a separate page.
- **Delete operation** → always use the Coss UI **Alert Dialog** component. Never a simple confirm(), never a toast-only action.
- **Export scope popover** → use the Coss UI **Popover** component.
- **Overflow menu per card** → use the Coss UI **Dropdown Menu** component.
- **Filter selects** → use the Coss UI **Select** component.
- **Search input** → use the Coss UI **Input** component.
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
   - A text input field. Placeholder: `Search notes...`
   - Filters the note list in real time as the user types (debounced — do not fire on every keystroke, wait ~300ms after the user stops typing).
   - Search matches against: note question, answer, body, and course name.
   - Width: the widest element in the filter bar.

2. **Type Filter (Select):**
   - Label: `Type`
   - Options: `All Types` (default), `Q&A`, `Freeform`
   - Filters note list to show only the selected type.

3. **Course Filter (Select):**
   - Label: `Course`
   - Options: `All Courses` (default), then one option per course the user has created, listed alphabetically.
   - Filters note list to show only notes linked to the selected course.

4. **Flagged Filter (Toggle Button or Select):**
   - Label: `Flagged only`
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
- A single ghost/outline button.
- Default label: `Hide All Answers`
- When clicked, all Q&A note cards in the list collapse their answer sections simultaneously.
- Label toggles to: `Show All Answers`
- When clicked again, all answer sections expand simultaneously.
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
     - Two action buttons stacked vertically:
       - `Export as PDF`
       - `Export as Markdown`
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

Each note in the list is rendered as a Card component. The card has a fixed internal layout described below.

#### Card Top Row
A horizontal row spanning the full card width:

- **Left side:**
  - Note type badge: either `Q&A` or `Freeform` — rendered as a Coss UI Badge.
  - Course name (if the note is linked to a course): rendered as a small muted text label immediately below the type badge. If the note has no linked course, this line is omitted entirely.

- **Right side (grouped tightly):**
  - **Flag Toggle Button:** An icon-only button showing a flag icon.
    - If `flag = false`: icon is in its default/muted state. Tooltip: `Flag for review`
    - If `flag = true`: icon is in its active/highlighted state. Tooltip: `Remove flag`
    - Clicking immediately toggles the flag value via an optimistic update (update UI instantly, sync to DB in background).
  - **Overflow Menu Button (`•••`):** An icon-only button (three dots / ellipsis icon).
    - Clicking opens a Coss UI Dropdown Menu anchored below-left of the button.
    - Menu items:
      1. `Edit` → opens the Edit Note Sheet
      2. `Export as PDF` → exports this single note as PDF
      3. `Export as Markdown` → exports this single note as Markdown
      4. A visual separator line
      5. `Delete` → opens the Delete Alert Dialog (styled as a destructive item)

#### Card Main Content Area

**For Q&A notes:**
- **Question:** Displayed in full, not truncated. Uses a slightly larger or bolder text style than the answer (handled by Coss UI typography tokens).
- **Answer:** Displayed below the question, separated by a subtle divider.
  - **Default state:** Hidden. In place of the answer text, render a ghost/outline button labeled `Show Answer`.
  - **When revealed:** The answer text is shown in full. A button labeled `Hide Answer` appears below it.
  - **Global toggle interaction:** If the page-level "Hide All Answers" / "Show All Answers" button is clicked, this card's answer state updates to match. If the user then manually toggles this specific card, it overrides the global state for this card only.

**For Freeform notes:**
- **Body:** Displayed as a text preview. Truncated to a maximum of 4 lines. If the full body exceeds 4 lines, a `Show more` inline text button appears at the end. Clicking `Show more` expands the card to show the full body in place (no navigation, no sheet). A `Show less` button appears at the bottom.

#### Card Bottom Row
A horizontal row spanning the full card width:

- **Left side — Badge Row:**
  Three optional badges displayed in a horizontal row. Each badge is only rendered if the condition is met:

  1. **Code Snippet Badge:**
     - Condition: note has a non-null, non-empty `code_snippet` field.
     - Label: the value of `code_language` (e.g. `Python`, `JavaScript`, `SQL`). If `code_language` is `text` or empty, label is `Code`.
     - Clicking this badge opens a read-only code viewer — a Coss UI Sheet that slides in from the right, showing the code snippet in a monospace code block with the language label as the sheet title. The sheet is read-only; editing the snippet is done via the Edit Sheet.

  2. **Understanding Level Badge (Q&A only):**
     - Condition: note type is `Q&A` and `understanding_level` is set.
     - Label: `Level [N]` where N is the understanding level value (1–5).
     - Do not render this badge for Freeform notes.

  3. **Flagged Badge:**
     - Condition: `flag = true`.
     - Label: `Flagged`
     - This badge is redundant with the flag icon in the top row but serves as a scannable visual indicator in the badge row for consistency.

- **Right side — Metadata:**
  - A muted text label showing when the note was last updated, in relative format (e.g. `Updated 2 hours ago`, `Updated Mar 3`). Use relative time for recent updates (within 7 days) and absolute date for older ones.

---

### Empty States

Three distinct empty states, each shown in the center of the note list area:

1. **No notes exist at all:**
   - Illustration or large icon (use Coss UI's empty state pattern if available).
   - Heading: `No notes yet`
   - Subtext: `Create your first note to get started.`
   - A primary button: `New Note` — clicking opens the Create Note Sheet.

2. **Notes exist but none match current filters:**
   - Heading: `No notes match your filters`
   - Subtext: `Try adjusting your search or clearing the filters.`
   - A ghost button: `Clear filters` — clicking resets all filters to their default state.

3. **Notes exist but filtered list has only Freeform notes (Understanding Level sort selected):**
   - Show the notes normally. The Understanding Level sort option simply has no effect and the list order falls back to Last Updated. No error shown.

---

### Create Note Sheet

**Trigger:** Clicking the `New Note` button in the Page Header Row.

**Component:** Coss UI Sheet, sliding in from the right side of the screen.

**Sheet title:** `New Note`

**Sheet width (desktop):** Wide enough to comfortably display a form with multiple fields — approximately one-third of the viewport width, but use Coss UI Sheet size tokens, not arbitrary widths.

#### Step 1 — Note Type Selection
Before showing the full form, present a type selector:
- Two large selectable cards or toggle buttons: `Q&A` and `Freeform`
- Default: no type pre-selected, user must choose.
- Once a type is selected, the appropriate form fields appear below without closing and reopening the sheet.

#### Form Fields — Q&A Type

1. **Course (Select — optional):**
   - Label: `Course`
   - Options: `No course` (default), then all user courses alphabetically.
   - Links the note to a course.

2. **Question (Textarea — required):**
   - Label: `Question`
   - Placeholder: `What is the question?`
   - No character limit enforced in UI, but required — cannot submit empty.

3. **Answer (Textarea — required):**
   - Label: `Answer`
   - Placeholder: `Write the answer...`
   - Required — cannot submit empty.

4. **Understanding Level (Segmented control or radio group — required):**
   - Label: `Understanding Level`
   - 5 options labeled `1`, `2`, `3`, `4`, `5`
   - Each option has a short descriptor below it:
     - 1 = `No clue`
     - 2 = `Vague idea`
     - 3 = `Understand`
     - 4 = `Confident`
     - 5 = `Mastered`

5. **Code Snippet (optional, collapsible):**
   - A collapsed section by default, labeled `+ Add code snippet`.
   - Clicking expands to reveal:
     - **Language Select:** Label `Language`. Options include common programming languages plus `Text` as default.
     - **Code Textarea:** Monospace font (Coss UI code input if available). Placeholder: `Paste or write your code here...`
   - Once expanded, it cannot be re-collapsed unless the code fields are both empty.

6. **Flag toggle (optional):**
   - Label: `Flag for review`
   - A Coss UI Switch or Checkbox component. Default: off.

#### Form Fields — Freeform Type

1. **Course (Select — optional):** Same as Q&A.

2. **Body (Textarea — required):**
   - Label: `Note`
   - Placeholder: `Write your note...`
   - Taller textarea than Q&A fields — freeform notes are typically longer.
   - Required — cannot submit empty.

3. **Code Snippet (optional, collapsible):** Same as Q&A.

4. **Flag toggle (optional):** Same as Q&A.

#### Sheet Footer
Two buttons, right-aligned at the bottom of the sheet:
- `Cancel` — ghost button. Closes the sheet without saving. If any field has been filled, show a Coss UI Alert Dialog confirming discard: `Discard changes? Your note will not be saved.` with `Discard` (destructive) and `Keep editing` options.
- `Save Note` — primary button. Disabled until all required fields are valid. Clicking submits the form, closes the sheet, and prepends the new note to the top of the list with an optimistic update.

---

### Edit Note Sheet

**Trigger:** Clicking `Edit` in the note card's overflow menu.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** `Edit Note`

**Form:** Identical to the Create Note Sheet form for the same note type, pre-populated with the note's current values.

**Type field:** The note type (Q&A / Freeform) is displayed as a read-only label — it cannot be changed after creation.

**Sheet Footer:**
- `Cancel` — same discard confirmation behavior as Create.
- `Save Changes` — primary button. Disabled until at least one field has changed. Clicking saves, closes the sheet, and updates the card in place.

---

### Code Snippet Viewer Sheet

**Trigger:** Clicking the Code Snippet Badge on a note card.

**Component:** Coss UI Sheet, sliding in from the right.

**Sheet title:** The value of `code_language` (e.g. `Python`) or `Code Snippet` if language is `text`.

**Content:** A read-only code block displaying the full `code_snippet` value in a monospace font, with syntax highlighting if Coss UI supports it natively.

**Sheet Footer:**
- `Close` — ghost button. Closes the sheet.
- `Edit Note` — secondary button. Closes this sheet and opens the Edit Note Sheet for the same note.

---

### Delete Alert Dialog

**Trigger:** Clicking `Delete` in the note card's overflow menu.

**Component:** Coss UI Alert Dialog (blocking overlay — user cannot interact with anything behind it).

**Title:** `Delete note?`

**Body text:** `This action cannot be undone. The note will be permanently deleted.`

**Buttons:**
- `Cancel` — secondary/ghost button. Closes the dialog, no action taken.
- `Delete` — destructive primary button. Clicking deletes the note, closes the dialog, and removes the card from the list with an optimistic update. If the deletion fails, the card is restored and a Coss UI Toast error is shown.

---

## MOBILE LAYOUT

### Page Header Row (Mobile)

**Position:** Sticky below the Top Bar. Does not scroll.

**Layout:** Due to limited horizontal space, the header row is split into TWO stacked rows:

**Row 1:**
- Left: Page title `Notes`
- Right: `New Note` primary button (icon only — plus icon, no label to save space). Tapping opens the Create Note Sheet as a bottom sheet on mobile.
- Right: `Export` ghost button (icon only — download icon, no label). Tapping opens the Export Popover.

**Row 2 — Filter Bar:**
Scrollable horizontally if filters overflow the viewport width. Displayed as a horizontal scrollable chip/pill row:
- Search Input (full width, above the chip row as its own row)
- Type Filter chip
- Course Filter chip
- Flagged Only toggle chip
- Sort By chip

Each filter chip, when tapped, opens a Coss UI bottom sheet with the filter options listed as a vertical radio list. Selecting an option closes the bottom sheet and applies the filter. Active filters show a visual indicator on their chip (e.g. a dot or filled style).

**Hide/Show All Answers button (mobile):**
If the current list contains Q&A notes, this appears as a full-width ghost button below the filter chip row.

---

### Note List (Mobile)

**Layout:** Single column, same as desktop. Cards stack vertically.

**Card layout on mobile:** Identical to desktop card anatomy with one adjustment:
- The card top row (type badge + course + flag + menu) wraps if needed — flag and menu buttons remain right-aligned.
- Answer reveal and body expand behavior is identical to desktop.
- Badge row is identical to desktop.

**Infinite scroll:** Identical to desktop.

---

### Sheets on Mobile

On mobile, all Coss UI Sheets open as **bottom sheets** (slide up from the bottom) instead of sliding in from the right. This is a Coss UI Sheet behavior — configure the sheet's side prop to `bottom` on mobile breakpoints.

**Height:** The Create and Edit sheets take up approximately 90% of the viewport height on mobile, with a drag handle at the top to dismiss.

**Scrollability:** The form inside the sheet is vertically scrollable if the content exceeds the sheet height.

---

### FAB (Mobile — Notes Page)

**Position:** Floating above the bottom dock, bottom-right.

**Icon:** Plus icon.

**Action:** Tapping opens the Create Note Sheet (bottom sheet).

This duplicates the `New Note` button in the header row intentionally — the FAB provides thumb-zone access without scrolling back to the top.

---

## Data Dependencies

- **Note list:** Fetched from `public.notes` table with RLS applied. Filtered and sorted server-side where possible; client-side filtering for search.
- **Course filter options:** Fetched from `public.courses` table (user's courses only, via RLS).
- **Flag toggle:** Updates `public.notes.flag` field via optimistic update.
- **Create note:** Inserts into `public.notes`.
- **Edit note:** Updates the corresponding row in `public.notes`.
- **Delete note:** Deletes the corresponding row from `public.notes`.
- **Export:** Client-side generation from the current filtered note set already loaded in state. If the filtered set is larger than the current loaded batch, fetch all matching notes before generating the export file.

---

## Interaction States Summary

| Action | Component Used | Side Effect |
|---|---|---|
| Create note | Sheet (right on desktop, bottom on mobile) | Prepend card to list |
| Edit note | Sheet (right on desktop, bottom on mobile) | Update card in place |
| Delete note | Alert Dialog | Remove card from list |
| View code snippet | Sheet (right on desktop, bottom on mobile) | No data change |
| Toggle flag | Optimistic icon button on card | Update badge + flag icon |
| Export notes | Popover → PDF or Markdown download | No data change |
| Reveal/hide answer | Inline toggle on card | No data change |
| Reveal/hide all answers | Page header button | No data change |
| Apply filter | Select / chip | Re-fetch or re-filter list |
| Change sort | Select / chip | Re-sort current list |
| Infinite scroll | Automatic | Append next batch to list |
