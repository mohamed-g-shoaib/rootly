# Unified Card System — Design Spec

## Context & Current State

This spec was written after reviewing all four card components on the
`feature/auth` branch at commit `a566bc3`. The files in scope are:

- `app/notes/ui/notes-components.tsx` → `NoteCard`
- `app/courses/ui/courses-components.tsx` → `CourseCard`
- `app/daily-entries/ui/daily-entries-components.tsx` → `EntryCard`
- `app/review/ui/review-components.tsx` → `SessionCard`

### Root cause of the current inconsistency

Every card today uses `<Card className="p-4">` with content that grows freely
inside it. There is no fixed height, no zone separation, and no overflow
constraint. As a result:

- `NoteCard` grows when a code snippet button is present, when an answer is
  revealed, or when a freeform body has many lines.
- `CourseCard` grows when topics wrap to a second line or when a title breaks
  to three or more lines. It also has a dangling `<div className="pt-4" />`
  spacer at the bottom.
- `EntryCard` is relatively stable but has inconsistent internal spacing and
  no overflow protection on the notes field.
- `SessionCard` has a free-wrapping stats row that can reflow on narrow
  containers.

---

## The Principle

> A card is a **viewport**, not a container.
> Content is always framed by the card — the card never grows to fit content.

Every card must have a **fixed, predictable height** regardless of what data
it contains. Content that exceeds its zone is clipped or truncated. Users
access the full content via a `PreviewCard` hover (desktop) or a sheet (mobile
/ tap).

This creates:
- No layout shifts when data varies
- A consistent grid where all cards in a row are always the same height
- Muscle memory: users always know where to look for each piece of information

---

## Fixed Card Height

```
h-[220px]
```

This value applies to **all four card types** via a wrapping `motion.div` (or
plain `div` for cards without animation). The `Card` itself gets `h-full`:

```tsx
<motion.div className="h-[220px]" initial={...} animate={...} transition={...}>
  <Card className="h-full p-4">
    <div className="flex h-full flex-col gap-3">
      {/* header */}
      {/* body */}
      {/* footer */}
    </div>
  </Card>
</motion.div>
```

If after visual testing one card type genuinely cannot fit its minimum
meaningful content at `220px`, it may use `h-[240px]` — but this must be
documented with a comment and must be the exception, not the rule.

---

## Zone Anatomy (all cards)

```
┌─────────────────────────────────────────┐  shrink-0  ~48px
│  HEADER                                 │
│  metadata row 1 (xs, muted)             │
│  primary title (line-clamp-2, medium)   │
├─────────────────────────────────────────┤  flex-1 min-h-0 overflow-hidden
│  BODY                                   │
│  primary content — clamped / truncated  │
│                                         │
├─────────────────────────────────────────┤  shrink-0  ~40px
│  FOOTER                                 │
│  [left: badges / chips]  [right: actions]│
└─────────────────────────────────────────┘
```

### Zone CSS rules

**Header** (`shrink-0`):
- Max 2 lines via `line-clamp-2` on the title element
- Actions (buttons) in header right must never wrap — use `flex-shrink-0` on
  the action cluster

**Body** (`flex-1 min-h-0 overflow-hidden`):
- Content never expands this zone — the zone takes whatever space remains
  between header and footer
- All text inside uses `line-clamp-3` (or `line-clamp-2` for secondary text)
- No scrollbars — content that does not fit is simply clipped

**Footer** (`shrink-0 flex items-center justify-between gap-2 pt-2`):
- Left side: badges / chips — `flex items-center gap-1.5 overflow-hidden flex-nowrap`
  Badges must never wrap to a second line. If they overflow, hide with
  `overflow-hidden`. The full list is accessible via PreviewCard or sheet.
- Right side: icon action buttons — `flex items-center gap-1 flex-shrink-0`

---

## Interactive Body Zone (all cards)

On **desktop**, the body zone is wrapped in a `PreviewCard` trigger. Hovering
it opens a `PreviewCardPopup` showing the full untruncated content.

On **mobile / touch**, tapping the body zone calls the relevant "view full"
handler (e.g. `onViewFull` for notes) which opens the existing sheet.

Apply to the body text element:

```
hover:underline decoration-dotted decoration-muted-foreground/50 underline-offset-2 cursor-pointer
```

This signals interactivity without being visually noisy at rest.

```tsx
<PreviewCard>
  <PreviewCardTrigger render={<div className="flex-1 min-h-0 overflow-hidden cursor-pointer" />}>
    <p className="line-clamp-3 text-sm text-muted-foreground hover:underline decoration-dotted decoration-muted-foreground/50 underline-offset-2">
      {content}
    </p>
  </PreviewCardTrigger>
  <PreviewCardPopup>
    {/* full content */}
  </PreviewCardPopup>
</PreviewCard>
```

On mobile, replace the `PreviewCard` wrapper with a plain `div` and attach
`onClick={onViewFull}` (or equivalent) to the body div.

---

## NoteCard Spec

**File:** `app/notes/ui/notes-components.tsx`

**Models used:** `Note`, `NoteType`, `UnderstandingLevel` from `notes-model.ts`

### Header (`shrink-0`)

- Left column, top row: `{note.courseTitle}` — `text-xs text-muted-foreground truncate`
- Left column, bottom row: `{note.question}` (Q&A) or nothing (Freeform) —
  `line-clamp-2 font-medium`
- For Freeform notes, the header only shows the course title. There is no
  "title" for freeform — the body IS the content.
- Right: **nothing in the header**. All actions move to the footer.

### Body (`flex-1 min-h-0 overflow-hidden`)

**Q&A notes:**

The body zone always contains the answer. Whether the answer is shown or
hidden is controlled by `showAnswer = overrideShow ?? globalShowAnswers`.

- When `showAnswer` is **true**:
  Render `{note.answer}` — `line-clamp-3 text-sm text-muted-foreground`
  Wrap in the interactive `PreviewCard` pattern (desktop hover = full Q+A
  preview, mobile tap = `onViewFull`).

- When `showAnswer` is **false**:
  Render a `<Button variant="outline" size="sm" onClick={() => onOverrideChange(true)}>Show Answer</Button>`
  This button occupies the **same vertical slot** as the answer text.
  The card height does not change.

Both states occupy the same `flex-1 min-h-0 flex items-start` zone.
The zone height is fixed — neither the button nor the text can expand it.

```tsx
<div className="flex-1 min-h-0 flex items-start overflow-hidden">
  {showAnswer ? (
    /* PreviewCard wrapping answer text */
  ) : (
    <Button variant="outline" size="sm" onClick={() => onOverrideChange(true)}>
      Show Answer
    </Button>
  )}
</div>
```

**Freeform notes:**

Render `{note.body}` — `line-clamp-3 text-sm text-muted-foreground`
Wrap in the interactive `PreviewCard` pattern.

**Props that stay:** `globalShowAnswers`, `overrideShow`, `onOverrideChange`,
`onViewFull` (used for mobile tap-to-open-sheet on body), `onViewCode`
(used in footer — see below).

**What gets removed from the body:**
- The inline "View full note" `Button variant="link"` — full note is now
  accessed via the interactive body zone
- The "Show Answer" button that previously pushed content down (replaced by
  the fixed-slot pattern above)
- The "Hide Answer" button — once an answer is revealed on a card, the user
  hides all answers via the **page-level** "Show all answers" toggle in the
  notes header. Per-card hide is removed intentionally.
- The desktop "Peek answer" `PreviewCard` trigger button

### Footer (`shrink-0`)

**Left side** (`flex items-center gap-1.5 overflow-hidden flex-nowrap`):

- If `note.codeSnippet`:
  `<Badge variant="outline" className="cursor-pointer shrink-0" onClick={onViewCode}>`
  `  <CodeIcon size={14} /> {toCodeBadgeLabel(note.codeLanguage)}`
  `</Badge>`
  Use `Badge`, NOT `Button`. This replaces the old `Button variant="outline" size="sm"` code chip.

- If Q&A and `note.understandingLevel`:
  `<Badge variant="outline" className="shrink-0">{understandingLabel(note.understandingLevel)}</Badge>`

Both badges are `shrink-0` and sit left. They never wrap.

**Right side** (`flex items-center gap-1 flex-shrink-0`):

- Flag button: `<Button variant="ghost" size="icon">` with `Flag01Icon`
  — keep existing color logic (`note.flag ? "text-destructive" : "text-muted-foreground"`)
- Menu button: `<Button variant="ghost" size="icon">` with `MoreVerticalIcon`
  — keep existing `DropdownMenu` contents exactly as-is

**What gets removed from the header:**
The entire top-right action cluster (flag + menu) moves here. The header top
section becomes metadata-only.

---

## CourseCard Spec

**File:** `app/courses/ui/courses-components.tsx`

**Models used:** `Course` from `courses-model.ts`

### Header (`shrink-0`)

- Left column, top row: `{course.instructor}` — `text-xs text-muted-foreground truncate`
  If no instructor, render nothing (do not reserve space).
- Left column, bottom row: `{course.title}` wrapped in existing
  `<Link href={`/courses/${course.id}`}>` — `line-clamp-2 font-medium`
  **Keep this Link exactly as it is. Do not remove or relocate it.**
- Right: **nothing in the header**

### Body (`flex-1 min-h-0 overflow-hidden`)

- Progress label + percentage: `flex items-center justify-between gap-3` —
  `text-sm text-muted-foreground` + `text-sm tabular-nums`
- Progress bar: existing `<Progress>` component below the label row
- This zone is `flex flex-col justify-center gap-2` — vertically centered

No interactive body zone needed for CourseCard — the title link in the header
already navigates to the detail page.

### Footer (`shrink-0`)

**Left side** (`flex items-center gap-1.5 overflow-hidden flex-nowrap`):

- Up to 3 topic `<Badge variant="outline" className="shrink-0">` chips
- If `course.topics.length > 3`:
  Wrap the `+{remainingTopics} more` in a `PreviewCard` trigger:
  ```tsx
  <PreviewCard>
    <PreviewCardTrigger render={<Badge variant="outline" className="shrink-0 cursor-pointer" />}>
      +{remainingTopics} more
    </PreviewCardTrigger>
    <PreviewCardPopup>
      <div className="flex flex-wrap gap-1.5">
        {course.topics.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
      </div>
    </PreviewCardPopup>
  </PreviewCard>
  ```
- If no topics: left side is empty

**Right side** (`flex items-center gap-1 flex-shrink-0`):

- Links button (if `hasLinks`): `<Button variant="ghost" size="icon">` with
  `Link01Icon` — keep existing `onClick={onViewLinks}`
- Menu button: existing `DropdownMenu` unchanged

**What gets removed:**
- The free-wrapping `<div className="flex flex-wrap gap-2 pt-4">` topics
  section (replaced by footer left)
- The dangling `<div className="pt-4" />` spacer at the bottom

---

## EntryCard Spec

**File:** `app/daily-entries/ui/daily-entries-components.tsx`

**Models used:** `DailyEntry`, `MoodValue` from `daily-entries-model.ts`

### Header (`shrink-0`)

- Left: `{formatEntryDate(entry.date, now)}` — `font-medium truncate`
- Right: `{isToday ? <Badge variant="outline">Today</Badge> : null}` — `shrink-0`

The "Today" badge moves from its current inline position inside the title
flex row to the **header right slot**.

### Body (`flex-1 min-h-0 overflow-hidden`)

Two rows, `flex flex-col gap-2 text-sm text-muted-foreground`:

- Row 1: `<ClockIcon size={18} />` + `{formatStudyTime(entry.studyTimeMinutes)}`
  — `flex items-center gap-2`
- Row 2: mood emoji + `{moodLabel(entry.mood)}`
  — `flex items-center gap-2`

These are fixed, non-overflowing data points. No PreviewCard needed here.

### Footer (`shrink-0`)

**Left side** (`flex items-center gap-1.5 overflow-hidden flex-nowrap`):

- If `entry.notes`:
  `<span className="text-xs text-muted-foreground truncate">{entry.notes}</span>`
  Single line, truncated. Full notes are accessible via edit sheet.
- If no notes: empty left side

**Right side** (`flex items-center gap-1 flex-shrink-0`):

- Menu button only: existing `DropdownMenu` unchanged

**What gets removed:**
- The inline `{entry.notes}` from the flex-wrap stats row in the body
  (moves to footer left as truncated text)
- The "Today" badge from inside the title flex row (moves to header right)
- The `flex-wrap` on the stats row (now a structured 2-row body)

---

## SessionCard Spec

**File:** `app/review/ui/review-components.tsx`

**Models used:** `ReviewSession` from `review-model.ts`

### Header (`shrink-0`)

- Left column, top row: `{formattedDate}` — `text-xs text-muted-foreground`
- Left column, bottom row: `{session.name}` — `line-clamp-2 font-medium`
  Keep existing `onClick={onView}` on this element (it's a `<button type="button">`).
- Right: **nothing in the header**

### Body (`flex-1 min-h-0 overflow-hidden`)

Two-column layout (keep existing structure):

```tsx
<div className="flex w-full items-start justify-between gap-4 flex-1 min-h-0 overflow-hidden">
  <div className="min-w-0 flex-1">
    <div className="text-xs text-muted-foreground">Weakest course</div>
    <div className="pt-1 text-sm truncate font-normal">
      {weakestCourseTitle}
    </div>
  </div>
  <div className="min-w-0 flex-1 text-right">
    <div className="text-xs text-muted-foreground">Strongest course</div>
    <div className="pt-1 text-sm truncate font-normal">
      {strongestCourseTitle}
    </div>
  </div>
</div>
```

Use `truncate` (single line) instead of the current `line-clamp` on course
titles here — two columns do not have room for two lines each.

### Footer (`shrink-0`)

**Left side** (`flex items-center gap-1.5 overflow-hidden flex-nowrap`):

All stats rendered as `<Badge variant="outline" className="shrink-0">`:

```tsx
<Badge variant="outline" className="shrink-0">
  <HugeiconsIcon icon={Target01Icon} size={14} /> {session.accuracy}%
</Badge>
<Badge variant="outline" className="shrink-0">
  <HugeiconsIcon icon={Clock01Icon} size={14} /> {formatMinutes(session.timeSpentMinutes)}
</Badge>
<Badge variant="outline" className="shrink-0">
  <HugeiconsIcon icon={CheckListIcon} size={14} /> {session.questionCount}q
</Badge>
{session.shuffled && <Badge variant="outline" className="shrink-0">Shuffled</Badge>}
{session.flaggedOnly && <Badge variant="outline" className="shrink-0">Flagged</Badge>}
```

All inside `flex items-center gap-1.5 overflow-hidden flex-nowrap` — badges
that do not fit are hidden (not wrapped). Full stats are visible on the session
detail view accessed by clicking the session name.

**Right side** (`flex items-center gap-1 flex-shrink-0`):

- Menu button only: existing `DropdownMenu` unchanged

**What gets removed:**
- The `flex flex-wrap items-center gap-3` stats row that currently sits in the
  card body (moves to footer as badges)
- The separate `<div className="pt-4">` wrapping the weakest/strongest section
  (body zone handles spacing via `flex-1`)

### Skeleton list

`ReviewSessionSkeletonList` must also use `h-[220px]` fixed height so skeleton
cards match real card dimensions:

```tsx
<Card key={i} className="h-[220px] p-4">
```

---

## Implementation Checklist

- [ ] `NoteCard` — fixed height wrapper, 3-zone layout, fixed-slot show/hide
      answer, code + understanding badges in footer, flag + menu in footer,
      interactive body zone with PreviewCard (desktop) / onViewFull (mobile)
- [ ] `CourseCard` — fixed height wrapper, 3-zone layout, title Link preserved,
      progress in body, topics in footer with "+N more" PreviewCard, links +
      menu in footer right, spacer removed
- [ ] `EntryCard` — fixed height wrapper, 3-zone layout, "Today" badge to
      header right, study time + mood in body rows, truncated notes in footer
      left, menu in footer right
- [ ] `SessionCard` — fixed height wrapper, 3-zone layout, date + name in
      header, weakest/strongest in body (truncate not line-clamp), all stats
      as badges in footer left, menu in footer right, skeleton updated
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes with zero warnings

---

## What Must NOT Change

- `globalShowAnswers` toggle in the notes page header — untouched
- `overrideShow` and `onOverrideChange` props on `NoteCard` — kept for
  per-card show/hide
- `onViewFull`, `onViewCode`, `onEdit`, `onDelete`, `onToggleFlag` props on
  `NoteCard` — all kept
- The `<Link href={`/courses/${course.id}`}>` on `CourseCard` title — kept
- All existing `DropdownMenu` contents inside every card — unchanged
- All existing sheet components (`NoteEditorSheet`, `CourseEditorSheet`,
  `EntryEditorSheet`, etc.) — no changes needed, only the cards change
- The `DeleteDialog` components inside each card file — unchanged
