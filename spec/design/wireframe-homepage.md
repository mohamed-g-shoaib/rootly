# Wireframe — Homepage (Marketing)

> **Route:** `/`
> **Audience:** Unauthenticated visitors only. Authenticated users are redirected to `/overview` by middleware. Clicking the logo in the dashboard shell returns authenticated users to `/`.
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
✅ Use `ease-out` as the default easing. Use custom cubic-bezier for precision: cubic-bezier(0.32, 0.72, 0, 1).
✅ Entrance animations: start from scale(0.96) + opacity 0, arrive at scale(1) + opacity 1.
✅ Stagger section reveals on scroll — each element enters sequentially, not simultaneously.
✅ Every animation must be purposeful: it either clarifies how something works, guides attention, or creates a moment of earned delight.
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
│  (interactive product preview — the centrepiece)    │
├─────────────────────────────────────────────────────┤
│  FEATURES  (3 columns)                              │
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

All sections are full-width with a max-width content container (same token used consistently — do not use arbitrary values). Sections breathe — generous vertical padding between each one.

---

## Section 1 — Nav

### Layout

Fixed at top. Full-width. Minimal.

```
[ RootlyLogo ]                    [ GitHub ] [ Get started ]
```

- Left: `RootlyLogo` component (SVG mark + wordmark). Wraps with `next/link` to `/`.
- Right:
  - Ghost/outline link button: `Star on GitHub` — links to the v1 open source repo (`rootly-notes-app`).
  - Primary button: `Get started` → `/login`.

### Behavior

- On scroll past the hero section, the nav gains a subtle background blur (`backdrop-blur`) and a thin bottom border — so it doesn't visually compete with the hero but remains readable over content.
- No mega-menu. No hamburger on mobile. On mobile, the GitHub link collapses — only the logo and `Get started` remain.
- Nav is NOT the `DashboardShell` nav. This is a completely separate component specific to the homepage.

### Component Notes

- Use coss ui `Button` with the appropriate variant for `Get started`.
- The nav background transition on scroll is a CSS transition on `background-color` + `border-bottom-color` — no JS animation library needed here.

---

## Section 2 — Hero

### Purpose

One job: make the visitor understand *what Rootly does* in under 4 seconds and make them want to try it. No feature list. No adjectives. A single, clear claim.

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

- **Headline:** `The learning notebook built for developers.`
  - Two lines. Large. Not centered — left-aligned on desktop, centered on mobile.
  - No tagline above the headline. No badge. No gradient text. Just the words.
- **Subheadline:** `Capture notes, track progress, and review what you've learned — all in one place.`
  - One sentence. `text-muted-foreground`. Slightly smaller than the headline.
- **CTAs:**
  - Primary: `Get started — it's free` → `/login`
  - Secondary (ghost): `See how it works` → smooth scroll to `#mockup`

### Visual

- No hero image. No illustration. No background gradient.
- Background is the same `background` token as the rest of the page. The typography carries the section.
- A subtle scroll-cue arrow/chevron icon below the CTAs — fades in after 1s, pulses gently (opacity pulse only, `prefers-reduced-motion` disables the pulse).

### Entrance Animation

- Headline: `opacity: 0 → 1`, `translateY(12px) → translateY(0)`, `400ms ease-out`. No delay.
- Subheadline: same motion, `100ms` delay after headline.
- CTAs: same motion, `200ms` delay after subheadline.
- Scroll cue: `opacity: 0 → 1` only, `600ms` delay, `800ms` duration.
- All entrance animations are play-once on mount. Not triggered by scroll — the hero is immediately visible.

### Why no hero image

The interactive mockup directly below is the visual proof. A hero image would be redundant and weaker than the real thing. The hero earns its power from restraint. Let the copy land, then let the mockup deliver.

---

## Section 3 — Mockup (Interactive Product Preview)

> **This is the most important section on the page.** It replaces what other landing pages do with a screenshot or video. A living, interactive replica of the product is far more persuasive than either.

### Purpose

Let the visitor interact with the actual Notes page — reading notes, revealing answers, toggling understanding levels — without signing up. They should leave this section thinking "I already know how to use this."

### Layout

```
┌─────────────────────────────────────────────────────┐
│  id="mockup"                                        │
│                                                     │
│  "Try it — no account needed."                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  [ Browser chrome: rounded top bar ]          │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  Notes page replica (scrollable)        │  │  │
│  │  │  - 4–6 hardcoded Q&A + freeform notes   │  │  │
│  │  │  - reveal answer interaction works      │  │  │
│  │  │  - understanding level buttons work     │  │  │
│  │  │  - flag button works                    │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Implementation Details

- The mockup is a **read-only** replica of the Notes UI.
  - Rendered inside a decorative browser chrome wrapper (a `div` with rounded corners, a top bar with three traffic-light dots, and a mock URL bar showing `rootly.app/notes`).
  - The inner content is scrollable.
  - It is NOT an `<iframe>`. It is a custom `HomepageMockup` component that directly imports and renders the Notes card components with hardcoded data.
- **What works:**
  - Reveal/hide answer toggle per card.
  - Understanding level button selection (visual only — state lives in the mockup component, not persisted).
  - Flag toggle (visual only).
- **What is disabled/hidden:**
  - The `DashboardShell` nav (top bar, dock, FAB) is not rendered.
  - The Notes page header (filters, export, add note) is not rendered — the mockup shows only the card list.
  - No sheets open. Click on a card opens nothing — the viewer sheet is disabled in mockup mode.
- **Data:** 5 hardcoded notes in `app/(marketing)/ui/homepage-mock-notes.ts` — a mix of Q&A (3) and freeform (2), covering realistic developer learning content (e.g. a note about closures, one about async/await, one freeform summary of a chapter).
- The mockup component accepts a `readOnly: true` prop that disables all sheet-opening interactions.

### Visual Treatment

- The browser chrome wrapper has a `border` using the standard coss ui border token and a subtle shadow — same depth approach as coss ui cards.
- On desktop: the mockup takes up ~70% of the content container width, centered.
- On mobile: the mockup is full-width. The browser chrome top bar is hidden on screens below `sm` — just the card list is shown directly.

### Entrance Animation

- The entire browser chrome wrapper: `opacity: 0 → 1`, `translateY(20px) → translateY(0)`, `500ms ease-out`.
- Triggered when the section scrolls into view (`IntersectionObserver`, threshold: `0.15`).
- The individual note cards stagger in after the wrapper: each card `100ms` apart, same `opacity + translateY` motion.

### Label above the mockup

- `"Try it — no account needed."` in `text-muted-foreground`, small, centered above the browser chrome.
- Purpose: explicit permission. Visitors often don't realize they can interact. The label removes the uncertainty.

---

## Section 4 — Features

### Purpose

Three columns. Each one describes a core workflow. No icons that are purely decorative — every icon must clarify the concept it labels. No fluff copy. Developer audience reads fast.

### Layout

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  [Icon]          │ │  [Icon]          │ │  [Icon]          │
│                  │ │                  │ │                  │
│  Capture         │ │  Review          │ │  Track           │
│                  │ │                  │ │                  │
│  Q&A and         │ │  Spaced          │ │  Log daily study │
│  freeform notes  │ │  repetition      │ │  sessions and    │
│  with code       │ │  sessions        │ │  watch your      │
│  snippets and    │ │  built around    │ │  understanding   │
│  understanding   │ │  your own notes. │ │  trend over      │
│  levels.         │ │                  │ │  time.           │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Copy

| Column | Icon (Hugeicons) | Title | Body |
| --- | --- | --- | --- |
| 1 | `NoteIcon` or similar | `Capture` | `Q&A and freeform notes with code snippets, syntax highlighting, and understanding levels.` |
| 2 | `RepeatIcon` or similar | `Review` | `Spaced repetition sessions built around your own notes — not a generic question bank.` |
| 3 | `AnalyticsIcon` or similar | `Track` | `Log daily study sessions and watch your understanding trend over time.` |

### Visual Treatment

- No card borders, no backgrounds. Just the icon, title, and body sitting on the page. White space does the separation work.
- Icons: Hugeicons, `size={24}`, `color="currentColor"`. Not filled — use stroke variant.
- Title: `font-semibold`, slightly larger than body.
- Body: `text-muted-foreground`.

### Entrance Animation

- All three columns stagger in on scroll: `opacity + translateY(12px)`, `100ms` apart, `350ms ease-out` each.

---

## Section 5 — How It Works

### Purpose

Linear-style numbered steps. Four steps, sequentially explaining the core loop. Not a tutorial — a story. The user should feel the rhythm of how Rootly fits into a learning day.

### Layout

```
How it works

01  Add your courses
    Create a course for each video series, tutorial, or
    documentation set you are working through.

02  Capture as you learn
    Write Q&A notes for concepts you want to remember.
    Add code snippets directly in the note.

03  Review regularly
    Run a spaced repetition session on your notes.
    Rate each answer — Rootly adjusts your understanding level.

04  See your progress
    The overview shows your study time, mood trends,
    and understanding growth across all your courses.
```

### Visual Treatment

- Section title: `How it works` — large, left-aligned, `font-semibold`.
- Each step: two-column layout (desktop) — step number on the left, title + body on the right.
- Step number: `text-muted-foreground`, `font-mono`, large. e.g. `01`, `02`.
- Step title: `font-semibold`.
- Step body: `text-muted-foreground`, one paragraph.
- A thin horizontal rule (`Separator`) between each step.
- On mobile: single column, number above title.

### Entrance Animation

- Steps enter sequentially on scroll: stagger `150ms` apart, `opacity + translateY(8px)`, `350ms ease-out`.

---

## Section 6 — Social Proof

### Purpose

Three short, real quotes from real users. No star ratings, no avatars that look generated, no company logos unless the person is real and notable. Developer credibility > enterprise logos.

> **Note:** At launch, use placeholder copy modeled after real feedback from v1 users. Replace with real quotes as they come in. Do not fabricate.

### Layout

```
┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐
│  "Quote text here."    │ │  "Quote text here."    │ │  "Quote text here."    │
│                        │ │                        │ │                        │
│  — Name                │ │  — Name                │ │  — Name                │
│    Role                │ │    Role                │ │    Role                │
└────────────────────────┘ └────────────────────────┘ └────────────────────────┘
```

- Each card: coss ui `Card` with standard padding. No custom border styles.
- Quote: `text-foreground`, italic.
- Attribution: `text-muted-foreground`, `font-medium` for name, regular for role.
- On mobile: vertical stack, full-width.

### Entrance Animation

- Cards stagger in on scroll: same `opacity + translateY(12px)` pattern, `120ms` apart.

---

## Section 7 — Final CTA

### Purpose

Repeat the offer one more time at the bottom. By this point the visitor has seen the product, understood the workflow, and read real quotes. The only barrier left is inertia. The final CTA removes it.

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Start learning with intention.                    │
│                                                     │
│   Rootly is free to use. No credit card required.   │
│                                                     │
│            [ Get started — it's free ]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Headline: `Start learning with intention.`
- Subtext: `Rootly is free to use. No credit card required.`
- CTA: single primary `Button` → `/login`. Same label as hero CTA: `Get started — it's free`.
- Centered on both desktop and mobile.
- Section has a visually distinct background — use `--muted` token or a subtle top/bottom border — to frame it as a closing beat, not just more content.

### Entrance Animation

- Single reveal on scroll: `opacity + translateY(16px)`, `400ms ease-out`. No stagger — it's one unit.

---

## Section 8 — Footer

### Layout

```
[ RootlyLogo ]   Built with ♥ for self-taught developers.   [ GitHub ]
                       © 2025 Rootly
```

- Left: `RootlyLogo` (mark only, no wordmark — smaller).
- Center: tagline + copyright.
- Right: link to GitHub repo.
- Thin `Separator` above the footer.
- `text-muted-foreground` throughout. No heavy typography.
- On mobile: stacked, centered.

### No animation

The footer has no entrance animation. It is a functional conclusion, not a reveal moment.

---

## Route & File Structure

```
app/
  (marketing)/
    page.tsx                          ← route entry for /
    layout.tsx                        ← marketing layout (no DashboardShell)
    ui/
      homepage-hero.tsx
      homepage-nav.tsx
      homepage-mockup.tsx             ← interactive notes replica
      homepage-mock-notes.ts          ← hardcoded note data for mockup
      homepage-features.tsx
      homepage-how-it-works.tsx
      homepage-social-proof.tsx
      homepage-final-cta.tsx
      homepage-footer.tsx
```

The `(marketing)` route group uses a **separate layout** that does NOT include `DashboardShell`. Authenticated users never see this layout — middleware redirects them to `/overview` before this layout renders.

---

## Middleware Behavior

```
/  (homepage)
  └── unauthenticated → render (marketing)/page.tsx
  └── authenticated   → redirect 307 to /overview
```

All other protected routes (e.g. `/notes`, `/courses`) already redirect unauthenticated users to `/login`. This is the inverse: `/` redirects authenticated users away from the marketing page.

The logo in the `DashboardShell` (app navbar) links to `/`. For an authenticated user, clicking it hits the middleware, which immediately redirects them to `/overview`. This is intentional — the homepage is never shown to logged-in users.

---

## Motion Dependency

All animations on the homepage use **Motion (Framer Motion v12)** — already in `package.json` as `motion`. Do not reach for raw CSS transitions for scroll-triggered reveals; use `motion/react` with `whileInView` and `viewport: { once: true }`.

`viewport: { once: true }` is mandatory. Animations fire once when the section enters the viewport — never on scroll-out, never on re-entry.

---

## Anti-Patterns for This Page

```
🚫 No hero image or hero illustration — the mockup IS the visual.
🚫 No video embeds or auto-playing demos.
🚫 No email capture / waitlist form.
🚫 No feature comparison table with competitors.
🚫 No pricing section (Rootly is free).
🚫 No "As seen in..." press logos.
🚫 No gradient text on headlines.
🚫 No looping background animations.
🚫 No more than 2 font weights in any section (semibold + regular).
🚫 No custom color outside the coss ui token system — including gradients on backgrounds.
```

---

## Open Questions (resolve before implementation)

1. **Social proof copy** — do real quotes from v1 users exist? If not, use placeholder `[QUOTE PENDING]` in the implementation and do not fabricate.
2. **Mockup note content** — the 5 hardcoded notes should feel real and developer-relevant. Confirm the subject matter (e.g. JS closures, async/await, CSS specificity, Git rebase, React hooks).
3. **GitHub link** — confirm whether the `Star on GitHub` nav link points to `rootly-notes-app` (v1, public) or `rootly` (v2, potentially private).
