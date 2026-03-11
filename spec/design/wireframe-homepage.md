# Wireframe — Homepage (Marketing)

> **Route:** `/`
> **Audience:** Unauthenticated visitors only. Authenticated users are redirected to `/overview` by middleware.
> **CTA target:** `/login` (no waitlist, no email capture).

---

## Global Design Rules

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

## Animation Rules (from Emil Kowalski + Raphael Salaja)

The homepage is seen once or twice by a user — it can breathe. The dashboard is seen every day — it stays restrained. This is the *only* place in the product where richer motion is acceptable.

```
✅ Animate only `transform` and `opacity`. Never animate layout properties (width, height, top, left).
✅ Use `ease-out` as the default easing. Use custom cubic-bezier: cubic-bezier(0.32, 0.72, 0, 1).
✅ Entrance animations: start from scale(0.96) + opacity 0, arrive at scale(1) + opacity 1.
✅ Stagger section reveals on scroll — each element enters sequentially, not simultaneously.
✅ Every animation must be purposeful: it clarifies how something works, guides attention, or creates earned delight.
✅ Respect prefers-reduced-motion — fall back to opacity-only transitions, never disable entirely.
✅ Keep entrance durations between 300ms–500ms for marketing sections. UI interactions stay under 300ms.
🚫 NEVER animate for decoration. If you cannot articulate why the animation exists, remove it.
🚫 NEVER animate from scale(0). Minimum enter scale is scale(0.95).
🚫 NEVER use transition: all. List properties explicitly.
🚫 No auto-playing videos, no looping animations that run indefinitely without user interaction.
```

**Anticipation rule:** The interactive mockup section is the most important element on the page. Everything before it is anticipation. Everything after it is reinforcement.

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────┐
│  NAV                                                │
├─────────────────────────────────────────────────────┤
│  HERO                                               │
│  (headline + sub + CTAs + scroll cue)               │
├─────────────────────────────────────────────────────┤
│  MOCKUP                                             │
│  (full mini-app — all pages, localStorage, dock)    │
├─────────────────────────────────────────────────────┤
│  FEATURES  (3 columns, each with visual mockup)     │
├─────────────────────────────────────────────────────┤
│  HOW IT WORKS  (numbered, 4 steps)                  │
├─────────────────────────────────────────────────────┤
│  SOCIAL PROOF  (3 cards, real quotes)               │
├─────────────────────────────────────────────────────┤
│  FINAL CTA                                          │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
└─────────────────────────────────────────────────────┘
```

All sections use the **global content container** (the same max-width token used everywhere in the app — do not introduce a new one). Sections breathe — generous vertical padding between each.

---

## Section 1 — Nav

### Layout

Fixed at top. Full-width. Minimal.

```
[ RootlyLogo ]                    [ GitHub ] [ Get started ]
```

- Left: `RootlyLogo` component (SVG mark + wordmark). Wraps with `next/link` to `/`.
- Right:
  - Ghost/outline link: `Star on GitHub` — links to the repo.
  - Primary button: `Get started` → `/login`.

### Behavior

- On scroll past the hero, the nav gains `backdrop-blur` and a thin bottom border.
- On mobile: GitHub link collapses — only logo and `Get started` remain.
- This is NOT `DashboardShell` nav. Completely separate component.

### Component Notes

- Use coss ui `Button` with the appropriate variant for `Get started`.
- Background transition on scroll: CSS transition on `background-color` + `border-bottom-color` only. No JS animation library.

---

## Section 2 — Hero

### Purpose

One job: make the visitor understand what Rootly does in under 4 seconds.

### Layout (desktop)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   The learning notebook                             │
│   built for developers.                             │
│                                                     │
│   Capture notes, track progress, and review         │
│   what you've learned — all in one place.           │
│                                                     │
│   [ Get started — it's free ]   [ See how it works ]│
│                                                     │
│   ↓                                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Copy

- **Headline:** `The learning notebook built for developers.` — two lines, large, left-aligned desktop / centered mobile. No gradient text.
- **Sub:** `Capture notes, track progress, and review what you've learned — all in one place.` — `text-muted-foreground`.
- **CTAs:** Primary `Get started — it's free` → `/login`. Ghost `See how it works` → smooth scroll `#mockup`.
- **Scroll cue:** chevron below CTAs, fades in after 1s, opacity-pulse only.

### Entrance Animation

- Headline: `opacity 0→1`, `translateY(12px)→0`, `400ms ease-out`, no delay.
- Sub: same, `100ms` delay.
- CTAs: same, `200ms` delay.
- Scroll cue: `opacity 0→1` only, `600ms` delay, `800ms` duration.
- All play-once on mount (not scroll-triggered — hero is immediately visible).

---

## Section 3 — Mockup (Full Interactive Mini-App)

> **This is the most important section on the page.** It is a fully functional embedded mini-app — every real page of Rootly is accessible, all interactions work, all sheets open. The only difference from the real app is that data is stored in `localStorage` (demo namespace) and never persisted to a real backend. Users who explore deeply get the complete product experience without signing up.

### Purpose

Let the visitor use the real product: create courses, add notes, run a review session, log a daily entry, see their progress on the Overview — all within the browser chrome wrapper on the homepage. When they sign up, nothing feels unfamiliar.

### LCP Strategy

The mockup opens on the **Notes page** by default, not Overview. This avoids loading recharts on the critical paint path. Overview is accessible via the floating dock but is not the initial page. The browser chrome wrapper itself is below the hero, so it is already below the fold on most viewports — but we still default to the lightest page (Notes) to be safe.

### Layout

```
┌─────────────────────────────────────────────────────┐
│  id="mockup"                                        │
│                                                     │
│  "Try it — no account needed."                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  [ ● ● ●   rootly.app/notes          ]        │  │  ← browser chrome top bar
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │                                         │  │  │
│  │  │   [ active page renders here ]          │  │  │
│  │  │   (Notes / Courses / Overview /         │  │  │
│  │  │    Daily Entries / Review)              │  │  │
│  │  │                                         │  │  │
│  │  │  ┌─────────────────────────────────┐   │  │  │
│  │  │  │  FloatingDock (real component)  │   │  │  │
│  │  │  └─────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Container & Sizing

- The browser chrome wrapper follows the **global content container width** (same max-width token used across the app). It is NOT a fixed pixel width, and does NOT use arbitrary Tailwind values.
- Fixed height on the inner content area — use a CSS custom property or a coss ui height token if available. The content area does not grow with content. It is a fixed viewport.
- The `FloatingDock` sits inside the content area, pinned to the bottom of the fixed-height viewport (position absolute bottom).
- On mobile (`sm` and below): browser chrome top bar is hidden. The content area and dock remain.

### Browser Chrome Top Bar

- Three traffic-light dots (decorative, no action).
- Mock URL bar that updates reactively to reflect the current page: `rootly.app/notes`, `rootly.app/courses`, `rootly.app/overview`, `rootly.app/daily-entries`, `rootly.app/review`.
- Same border and background as the content area — no custom colors.

### Pages in the Mockup

All five pages are rendered inside the mockup. The active page is determined by `mockActivePage` state in `HomepageMockup`. Each page is a **mockup-specific wrapper** that imports the real page's UI components but replaces all data-fetching hooks with the demo localStorage store.

#### Page routing pattern

No Next.js routing is used inside the mockup. `mockActivePage` is a string enum:
```
type MockPage = 'notes' | 'courses' | 'overview' | 'daily-entries' | 'review'
```

The `FloatingDock` receives `mockActivePage` and `setMockActivePage` as props and uses them in place of `usePathname` / `router.push`.

#### Page 1 — Notes (default)

- Renders the real `NoteCard` grid, with the type filter strip and show/hide all answers toggle (same as the previously implemented mockup header strip).
- All sheets work: create sheet (add note), edit sheet (edit note), viewer sheet (view full note), code viewer sheet.
- All sheet write operations persist to the **demo localStorage store** (not Supabase).
- Card cap enforced (see Card Cap Rules below). When a new note is created, if the cap is reached, the oldest note is removed from the demo store.
- `NoteCard` no longer requires `readOnly` in this version — the full card interactions are enabled, including overflow menu (edit / delete / view).

#### Page 2 — Courses

- Renders the real Courses page UI: course cards grid, create course sheet, edit course sheet, delete course confirmation.
- All write operations persist to the demo localStorage store.
- No server actions — all mutations go through the demo store.

#### Page 3 — Overview

- Renders the real Overview page UI: stats, charts (recharts), streaks.
- Loaded via `React.lazy` + `Suspense` with a skeleton fallback — deferred so it does not block the initial Notes page paint.
- Data sourced from the demo localStorage store (notes + daily entries + courses).

#### Page 4 — Daily Entries

- Renders the real Daily Entries page UI: entry list, create/edit entry sheet.
- All write operations persist to the demo localStorage store.

#### Page 5 — Review

- Renders the real Review session UI.
- Seeded Q&A notes from the demo store are used as the source.
- Rating actions (Confused / Getting It / Clear) update the understanding level of the note in the demo localStorage store.
- No Supabase calls.

### Demo localStorage Store

All demo data lives in `localStorage` under namespaced keys. The store is implemented in `app/(marketing)/ui/mock-store.ts`.

#### Namespace

All keys are prefixed with `rootly_demo_` to avoid collision with any future real auth or app localStorage keys:

```
rootly_demo_notes
rootly_demo_courses
rootly_demo_daily_entries
rootly_demo_review_sessions
```

#### Store API (`mock-store.ts`)

Exports a single `useDemoStore()` hook (or a plain object of getters/setters — choose whichever is cleanest). The interface must cover:

```ts
// Notes
getNotes(): DemoNote[]
addNote(note: Omit<DemoNote, 'id' | 'createdAt'>): void
updateNote(id: string, patch: Partial<DemoNote>): void
deleteNote(id: string): void

// Courses
getCourses(): DemoCourse[]
addCourse(course: Omit<DemoCourse, 'id' | 'createdAt'>): void
updateCourse(id: string, patch: Partial<DemoCourse>): void
deleteCourse(id: string): void

// Daily Entries
getDailyEntries(): DemoDailyEntry[]
addDailyEntry(entry: Omit<DemoDailyEntry, 'id' | 'createdAt'>): void
updateDailyEntry(id: string, patch: Partial<DemoDailyEntry>): void
deleteDailyEntry(id: string): void
```

#### Reactivity

The store must be reactive — components that consume it must re-render when the store changes. Use a lightweight `useSyncExternalStore` pattern or a React context + `useState` at the `HomepageMockup` level. Do NOT use Zustand, Jotai, or any external state library.

#### No persistence across sessions

The demo store does NOT persist across page loads. On mount, if `rootly_demo_notes` does not exist in localStorage, the store is pre-seeded with the seed data (see below). If keys exist, existing data is used (so interactions within a session are preserved on scroll/re-render).

Actually — clarification: "no data persistence" means no Supabase persistence. The data IS written to localStorage so that interactions survive re-renders and scroll. It does NOT survive a full page reload by design — on page load, seed data is always restored. Implement by always writing seed data on mount, not checking for existing keys.

#### Seed Data

Seed data lives in `app/(marketing)/ui/mock-seed.ts`. It is imported by `mock-store.ts` and written to localStorage on every mount of `HomepageMockup`.

```
Seed: 3 courses
  - "React Deep Dive" (in progress)
  - "TypeScript Fundamentals" (in progress)
  - "Node.js & Express" (not started)

Seed: 9 notes (to fill the desktop cap immediately)
  - 6 Q&A notes spread across the first two courses:
    1. When should you use useMemo? (React Deep Dive)
    2. What is the difference between useEffect and useLayoutEffect? (React Deep Dive)
    3. How does React reconciliation work? (React Deep Dive)
    4. What is a discriminated union in TypeScript? (TypeScript Fundamentals)
    5. When should you use `unknown` instead of `any`? (TypeScript Fundamentals)
    6. What does the `satisfies` operator do? (TypeScript Fundamentals)
  - 3 freeform notes:
    7. Chapter summary: React rendering model (React Deep Dive)
    8. Session recap: TypeScript utility types (TypeScript Fundamentals)
    9. Quick reference: async/await patterns (Node.js & Express)
  - Each Q&A note has a realistic answer (2–3 sentences).
  - Understanding levels are varied: some "Confused", some "Getting It", some "Clear".
  - Some notes are flagged.

Seed: 5 daily entries
  - One per day for the last 5 days.
  - Varied study durations (45 min, 90 min, 30 min, 120 min, 60 min).
  - Varied moods.
  - Varied notes referenced.

Seed: 0 review sessions (the Review page generates one on demand from seeded notes).
```

### Card Cap Rules

The mockup maintains a fixed number of visible note cards so the mockup height never grows or shifts. The cap is enforced in the demo store's `addNote` method.

```
Desktop  (lg and above):  9 cards max  (3 columns × 3 rows)
Tablet   (md):            6 cards max  (2 columns × 3 rows)
Mobile   (sm and below):  3 cards max  (1 column  × 3 rows)
```

When `addNote` is called and the current note count equals the cap for the current breakpoint, the **oldest note** (by `createdAt`) is removed before the new note is added. The cap is checked against the breakpoint-appropriate limit.

The breakpoint is detected inside `HomepageMockup` using a `useBreakpoint()` utility (implement as a small `useMediaQuery` wrapper — no external library). The cap value is passed down to the demo store context.

### FloatingDock Integration

The `FloatingDock` component is reused directly — it is the same component used in `DashboardShell`. It is an **exception** to the mockup isolation rule because it is a pure UI navigation component with no server dependencies.

#### Props adaptation

The `FloatingDock` normally uses `usePathname()` to determine the active item and `router.push()` to navigate. In the mockup context:

- A thin adapter wrapper `MockFloatingDock` is created in `app/(marketing)/ui/mock-floating-dock.tsx`.
- `MockFloatingDock` accepts `activePage: MockPage` and `onNavigate: (page: MockPage) => void` props.
- Internally it renders `FloatingDock` with a mocked `pathname` derived from `activePage` and replaces nav item `onClick` handlers with calls to `onNavigate`.
- The FAB (new note / new entry button) in the real dock is adapted: in mockup context it opens the create sheet for the active page, writing to the demo store.
- No changes to the real `FloatingDock` component itself.

### Reusability Principles

This is a complex component. Follow these rules to keep it clean:

```
✅ One file per concern:
   mock-store.ts          — store API + seed writes
   mock-seed.ts           — all seed data, typed
   mock-floating-dock.tsx — FloatingDock adapter
   mock-notes-page.tsx    — Notes page for mockup context
   mock-courses-page.tsx  — Courses page for mockup context
   mock-overview-page.tsx — Overview page for mockup context (lazy)
   mock-daily-entries-page.tsx  — Daily Entries page for mockup context
   mock-review-page.tsx   — Review page for mockup context
   homepage-mockup.tsx    — orchestrator: browser chrome + page switching

✅ Pages import real UI components (NoteCard, CourseCard, etc.) directly.
✅ Pages replace only data hooks — real components are untouched.
✅ All demo-specific types (DemoNote, DemoCourse, etc.) are defined in mock-store.ts.
✅ No prop drilling beyond one level. Store is accessed via context from HomepageMockup.
🚫 Do NOT modify any real page component, real UI component, or real data hook.
🚫 Do NOT add mockup-specific props to real components except the already-existing readOnly on NoteCard.
```

### Entrance Animation

- Browser chrome wrapper: `opacity 0→1`, `translateY(20px)→0`, `500ms ease-out`.
- `whileInView`, `viewport: { once: true, amount: 0.15 }`.
- Note cards stagger in after wrapper: `100ms` apart, same `opacity + translateY`.
- No entrance animation on the dock (it is a UI element, not a reveal moment).

### Label above the mockup

- `"Try it — no account needed."` — `text-muted-foreground`, small, centered.
- Purpose: explicit permission signal.

---

## Section 4 — Features

### Purpose

Three columns. Each names a core workflow, describes it in one sentence, and shows a **static visual mockup** making the concept immediately concrete. No cards, no borders around columns. White space is the separator.

### Layout

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  [Visual mockup] │ │  [Visual mockup] │ │  [Visual mockup] │
│                  │ │                  │ │                  │
│  Capture         │ │  Review          │ │  Track           │
│  [body copy]     │ │  [body copy]     │ │  [body copy]     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Copy

| Column | Title | Body |
| --- | --- | --- |
| 1 | `Capture` | `Q&A and freeform notes with code snippets, syntax highlighting, and understanding levels.` |
| 2 | `Review` | `Spaced repetition sessions built around your own notes — not a generic question bank.` |
| 3 | `Track` | `Log daily study sessions and watch your understanding trend over time.` |

### Visual Mockups (one per column)

Each visual is a **static, non-interactive JSX composition** of real coss ui primitives. Not a screenshot, not an image. No card wrapper around the column — visual sits directly above title.

#### Column 1 — Capture visual

- Single condensed Q&A note (static): course name label, question, answer, understanding level badge (`Getting It`), code language chip (`{ } JavaScript`).
- No flag, no overflow menu — stripped to essentials.

#### Column 2 — Review visual

- Single Q&A in review mode (static): question visible, answer hidden behind `Reveal answer` button.
- Three rating buttons in a row: `Confused` / `Getting It` / `Clear` — static, one visually highlighted.
- Session progress indicator above: `3 / 10`.

#### Column 3 — Track visual

- Small recharts `BarChart` (hardcoded data, 5 bars). No axes, no tooltip, no legend. Bars only.
- Two stat lines below: `🔥 12 day streak` and `avg. 2.4h / day`. `text-muted-foreground`.

### Visual Treatment

- No card borders or column backgrounds. White space separates.
- Consistent fixed height across all three visual mockups so the row is balanced.
- Title: `font-semibold`. Body: `text-muted-foreground`.
- Mobile: single column stack.

### Entrance Animation

- Three columns stagger: `opacity + translateY(12px)`, `100ms` apart, `350ms ease-out`.
- `whileInView`, `viewport: { once: true }`.

---

## Section 5 — How It Works

### Layout

```
How it works

01  Add your courses
    Create a course for each video series, tutorial, or documentation set.

02  Capture as you learn
    Write Q&A notes for concepts you want to remember. Add code snippets directly.

03  Review regularly
    Run a spaced repetition session. Rate each answer — Rootly adjusts your level.

04  See your progress
    Overview shows study time, mood trends, and understanding growth.
```

- Section title: large, left-aligned, `font-semibold`.
- Each step: two-column (desktop) — mono step number left, title + body right. `Separator` between steps.
- Mobile: single column, number above title.

### Entrance Animation

- Steps stagger `150ms` apart, `opacity + translateY(8px)`, `350ms ease-out`.
- `whileInView`, `viewport: { once: true }`.

---

## Section 6 — Social Proof

> At launch, use `[QUOTE PENDING]`. Do not fabricate quotes.

- Three coss ui `Card` components, side by side (mobile: stacked).
- Quote: italic, `text-foreground`. Attribution: `text-muted-foreground`.

### Entrance Animation

- Cards stagger `120ms` apart, `opacity + translateY(12px)`.
- `whileInView`, `viewport: { once: true }`.

---

## Section 7 — Final CTA

- Headline: `Start learning with intention.`
- Sub: `Rootly is free to use. No credit card required.`
- Single primary `Button` → `/login`. Centered.
- Visually distinct background via `--muted` token or subtle border.

### Entrance Animation

- Single reveal: `opacity + translateY(16px)`, `400ms ease-out`.
- `whileInView`, `viewport: { once: true }`.

---

## Section 8 — Footer

```
[ RootlyLogo (mark only) ]   Built with ♥ for self-taught developers. © 2026   [ GitHub ]
```

- `Separator` above. `text-muted-foreground` throughout. Mobile: stacked centered.
- No entrance animation.

---

## Route & File Structure

```
app/
  (marketing)/
    page.tsx
    layout.tsx
    ui/
      homepage-nav.tsx
      homepage-hero.tsx
      homepage-mockup.tsx          ← orchestrator: browser chrome, page switcher
      homepage-features.tsx        ← static visual mockups
      homepage-how-it-works.tsx
      homepage-social-proof.tsx
      homepage-final-cta.tsx
      homepage-footer.tsx

      mock-seed.ts                 ← all seed data (typed, no logic)
      mock-store.ts                ← demo localStorage store + useDemoStore hook
      mock-floating-dock.tsx       ← FloatingDock adapter for mockup context
      mock-notes-page.tsx          ← Notes page wired to demo store
      mock-courses-page.tsx        ← Courses page wired to demo store
      mock-overview-page.tsx       ← Overview page wired to demo store (lazy)
      mock-daily-entries-page.tsx  ← Daily Entries page wired to demo store
      mock-review-page.tsx         ← Review page wired to demo store
```

---

## Proxy Behavior (`proxy.ts`)

```
/  → unauthenticated: render (marketing)/page.tsx
   → authenticated:   redirect 307 /overview

/overview, /courses, /notes, /daily-entries, /review
   → unauthenticated: redirect 307 /login
   → authenticated:   render normally
```

Auth check: presence of Supabase cookie `sb-gforbcrkqdowocyfrrjj-auth-token` only.

---

## Motion Dependency

All scroll-triggered animations use **Motion (Framer Motion v12)** — `motion` in `package.json`. Use `motion/react` with `whileInView` + `viewport: { once: true }`. No raw CSS transitions for scroll reveals.

---

## Anti-Patterns

```
🚫 No hero image — the mockup IS the visual.
🚫 No video embeds or auto-playing demos.
🚫 No email capture / waitlist.
🚫 No competitor comparison table.
🚫 No pricing section.
🚫 No gradient text.
🚫 No looping background animations.
🚫 No more than 2 font weights per section.
🚫 No custom color outside coss ui token system.
🚫 No card borders or column backgrounds in Features.
🚫 No Supabase calls anywhere in the mockup.
🚫 No modifications to real page components, real UI components, or real data hooks.
🚫 No external state libraries (Zustand, Jotai, etc.) in the mockup.
🚫 No arbitrary Tailwind values for the mockup container sizing.
```
