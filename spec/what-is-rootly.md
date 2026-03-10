# Rootly — LLM Context Document

> This document is the authoritative source of truth for understanding Rootly as a product, its purpose, architecture, and technical decisions. It is written for LLMs to fully understand Rootly before generating code, plans, or recommendations.

---

## What is Rootly?

Rootly is a **developer-focused learning notebook** — a personal tool that helps self-taught developers and learners capture, organize, and review knowledge while actively studying courses, tutorials, and documentation.

It is NOT a general-purpose notes app. It is specifically designed around the way developers learn: structured capture, course organization, spaced repetition review, and progress visualization.

The product exists as two distinct repositories:

| Repo               | Purpose                                                     | Status                                                                      |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| `rootly-notes-app` | The v1 shipped product — offline-first, open source, public | Live at [rootly-notes-app.vercel.app](https://rootly-notes-app.vercel.app/) |
| `rootly`           | The v2 mega project — full-stack, cloud-first, scalable     | In active development                                                       |

---

## The Problem Rootly Solves

When developers are mid-course or mid-video, they need to quickly capture what they're learning without context-switching or losing focus. Existing tools like Notion, Google Docs, or plain text files are too generic — they don't understand the structure of developer learning:

- Notes need a question/answer format, not just freeform paragraphs
- Code snippets need syntax highlighting
- Progress needs to be measurable, not just stored
- Review needs to be active and spaced, not passive re-reading

Rootly acts as that structured capture layer built specifically for how developers consume and retain knowledge.

---

## Who It's For

- Self-taught developers actively following online courses or tutorials
- Learners who want a single structured place to retain what they learn
- People who want to be intentional about their learning process
- Developers who track their own progress and want to visualize trends

---

## What Rootly is NOT

- Not a project management tool
- Not a team tool
- Not a general note-taking app like Notion or Obsidian
- Not a course platform — it tracks your learning from external courses, it doesn't host them
- Not a social or sharing platform

---

## Core Workflows

### 1. Notes

There are two types of notes:

**Q&A Notes** — structured notes for concepts you want to understand and remember:

- A **question** (what you're trying to understand)
- An **answer** (what you learned)
- An optional **code snippet** with language and syntax highlighting
- An **understanding level** (1–5) representing how well you grasp the concept
- A **flag** boolean for marking notes for review

**Freeform Notes** — unstructured notes for thoughts, summaries, or anything that doesn't fit a Q&A format:

- A **body** field for freeform content
- An optional **code snippet** with language and syntax highlighting
- A **flag** boolean for marking notes for review
- No understanding level — freeform notes are not reviewed in spaced repetition mode

Both note types are stored in the same notes collection. The `type` field (`"qa"` | `"freeform"`) distinguishes them. Notes do not have to belong to a course — `course_id` is optional. A note with `course_id: null` is considered uncategorized.

---

### 2. Course Organization

Notes are attached to courses. Each course has:

- A **title** (required)
- An **instructor name** (optional)
- A **course link** — the primary URL of the course itself (optional)
- **Resource links** — additional reference links (optional)
- **Topic tags** (optional)
- A **progress** percentage (0–100) representing how far through the course you are
- Created/updated timestamps

---

### 3. Daily Study Session Tracking

Log each study day with:

- A **date** displayed in 12hr format, e.g. `Monday, Dec 1`
- **Study time** entered as separate hours and minutes fields, e.g. `Hours: 02 | Minutes: 54` — stored internally as total minutes
- A **mood score** (1–3) mapped to human-readable labels:

| Value | Label      |
| ----- | ---------- |
| 1     | Burned Out |
| 2     | Neutral    |
| 3     | Focused    |

- Optional **reflective notes** for the session

The mood labels are a UI concern only — the database stores `1–3` and the frontend maps them to labels. This keeps the model clean and makes it easy to change labels later without a migration.

---

### 4. Spaced Repetition Review

Review mode applies to **Q&A notes only** — freeform notes are never included.

#### Session Setup

Before starting a session, the user configures:

- **Question count** — `10`, `20`, `All`, or `Custom` (user-defined number)
- **Shuffle** — toggle to randomize question order and further test memory
- **Include flagged only** — optional toggle to restrict the session to flagged notes only; when off, all Q&A notes are included

#### During Review

- Answers are hidden; the user reads the question and tests their memory
- The user reveals the answer, then rates their recall to adjust the understanding level up or down
- Progress through the session is visible

#### Session Summary

At the end of each session, the summary shows:

- **Accuracy** — percentage of notes where understanding level went up (0–100%)
- **Time spent** — displayed as `Hours: 00 | Minutes: 17`
- **Notes that leveled up** — list of notes whose understanding level increased
- **Notes that leveled down** — list of notes whose understanding level decreased
- **Weakest course** — the course with the lowest average understanding level across reviewed notes (`null` if all reviewed notes are uncategorized)
- **Strongest course** — the course with the highest average understanding level across reviewed notes (`null` if all reviewed notes are uncategorized)

#### Saved Sessions

After completing a review, the user can **save the session** with a custom name. Saved sessions are stored and accessible from the Review page for historical reference.

---

### 5. Overview

The Overview page visualizes all learning data. All charts and metrics support a **time range filter**: last **7 days**, **30 days**, or **90 days**.

#### Summary Cards

Four top-level stat cards always visible regardless of time range:

| Card              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| Total Courses     | Number of courses created                              |
| Total Notes       | Total notes across all courses and uncategorized       |
| Avg Understanding | Average understanding level across all Q&A notes (1–5) |
| Study Time        | Total study time logged across all daily sessions      |

#### Charts

**Understanding Progress**
Track comprehension levels over time and identify learning trends. Shows how average understanding level changes across the selected time range.

**Daily Study Sessions**
Monitor study consistency and time investment patterns. Shows study time per day across the selected time range.

**Learning Mood Analysis**
Understand how emotional state affects the learning journey. Shows mood scores (`Burned Out`, `Neutral`, `Focused`) across the selected time range.

**Course Mastery Overview**
Compare understanding levels across different courses and subjects. Shows average understanding level per course, sorted from weakest to strongest. Uncategorized notes are excluded from this chart.

#### Overview Data Considerations

- Time range filter applies to all charts simultaneously
- Summary cards show **all-time totals**, not filtered by time range — they are global stats
- Courses with no Q&A notes are excluded from the Course Mastery chart
- Days with no study session logged show as zero on the Daily Study Sessions chart, not as gaps, to make consistency visible
- Mood chart uses the label names (`Burned Out`, `Neutral`, `Focused`), not raw numbers

#### Recharts Performance

Recharts is heavy by default and can cause noticeable slowdowns when charts render on load or when data updates. To keep the Overview page fast:

- **Lazy load each chart** using `dynamic(() => import(...), { ssr: false })` — this prevents Recharts from bloating the server bundle and defers each chart's JS until it is needed
- **Wrap each chart in a Suspense boundary** with a skeleton placeholder so the page is immediately usable while charts load in the background
- **Memoize chart data** with `useMemo` to prevent recalculating transformed data on every render — only recompute when the raw data or time range filter changes
- **Avoid rendering charts that are off-screen** — use an `IntersectionObserver` or a library like `react-intersection-observer` to only mount a chart when it scrolls into view
- **Cap data points** — for the Daily Study Sessions and Understanding Progress charts, aggregate data into daily or weekly averages rather than rendering one point per note or per session, especially when the 90-day range is selected
- **Disable animations in CI or on low-end devices** — Recharts animates by default; pass `isAnimationActive={false}` when `prefers-reduced-motion` is detected or during testing

The golden rule: **never import Recharts at the top level of a page**. Every chart should be a dynamically imported client component with its own loading state.

---

## Data Models

### Course

```typescript
{
  id: string
  user_id: string
  title: string
  instructor: string | null
  course_link: string | null
  links: string[]
  topics: string[]
  progress: number          // 0–100
  created_at: string
  updated_at: string
}
```

### Note

```typescript
{
  id: string
  user_id: string
  course_id: string | null // null = note not attached to any course (uncategorized)
  type: "qa" | "freeform"
  // Q&A only
  question: string | null
  answer: string | null
  understanding_level: 1 | 2 | 3 | 4 | 5 | null
  // Freeform only
  body: string | null
  // Shared
  code_snippet: string | null
  code_language: string
  flag: boolean
  created_at: string
  updated_at: string
}
```

### DailyEntry

```typescript
{
  id: string
  user_id: string
  date: string // stored as YYYY-MM-DD, displayed as "Monday, Dec 1"
  study_time: number // stored as total minutes, displayed as hours + minutes
  mood: 1 | 2 | 3
  notes: string | null
  created_at: string
  updated_at: string
}
```

### ReviewSession

```typescript
{
  id: string
  user_id: string
  name: string                     // user-defined session name
  date: string                     // YYYY-MM-DD
  question_count: number           // how many notes were reviewed
  shuffled: boolean
  flagged_only: boolean
  accuracy: number                 // 0–100
  time_spent: number               // stored as total minutes
  notes_leveled_up: string[]       // note IDs
  notes_leveled_down: string[]     // note IDs
  weakest_course_id: string | null  // null if all reviewed notes are uncategorized
  strongest_course_id: string | null // null if all reviewed notes are uncategorized
  created_at: string
}
```

All tables use **Row Level Security (RLS)**. Users only ever see their own data. The `user_id` field on every table is the anchor for RLS policies — always set to `auth.uid()` on insert and filtered on select.

---

## v1 — rootly-notes-app (Reference Implementation)

The v1 is a fully shipped, open-source product. It provides the clearest reference for what Rootly is supposed to do.

**Architecture:** Offline-first with optional cloud sync. Data defaults to `localStorage`. Supabase is opt-in for cloud sync.

**Routes:**

| Path              | Description                     |
| ----------------- | ------------------------------- |
| `/`               | Public landing page             |
| `/overview`       | Dashboard with charts and stats |
| `/notes`          | View, filter, manage notes      |
| `/courses`        | Manage courses and resources    |
| `/daily-tracking` | Log study time and mood         |
| `/review`         | Spaced repetition practice mode |
| `/learn-rootly`   | Onboarding and tutorial         |
| `/about`          | About the project               |
| `/login`          | Sign in with Google or GitHub   |

**Tech stack:**

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui, Radix UI
- Recharts for charts
- React Hook Form + Zod v4 for forms
- Sonner for notifications
- Supabase for Auth, PostgreSQL, RLS
- Lucide React for icons
- Geist Sans/Mono fonts
- next-themes for dark/light mode

**SEO and AI discoverability features:**

- Dynamic `sitemap.xml`
- `robots.txt` with rules for GPTBot, Claude, Perplexity
- JSON-LD structured data (WebApplication)
- Auto-generated OpenGraph images
- `llms.txt` and `llms-full.txt` for AI parsing

---

## v2 — rootly (The Mega Project)

This is the active rebuild. It is cloud-first, scalable, and built for long-term production quality. It inherits all the product concepts from v1 but is built on a better foundation.

**Key differences from v1:**

- Cloud-first instead of offline-first (Supabase is required, not optional)
- Built for scale from the start to handle 5000+ concurrent users
- New UI system: **coss ui** built on **Base UI** (not shadcn/ui + Radix UI)
- New icon system: **Hugeicons** (not Lucide)
- Oxlint + Oxfmt instead of ESLint + Prettier
- New Supabase API keys: `sb_publishable_...` and `sb_secret_...` (not legacy `anon` / `service_role`)
- `pnpm` as the package manager

### v2 Routes (Draft)

| Path              | Description                                 |
| ----------------- | ------------------------------------------- |
| `/`               | Public landing page                         |
| `/overview`       | Charts, stats, and progress visualization   |
| `/notes`          | View, filter, and manage all notes          |
| `/courses`        | Manage courses                              |
| `/daily-tracking` | Log study time and mood                     |
| `/review`         | Spaced repetition session setup and history |
| `/login`          | Auth page                                   |

**Middleware behavior:** All routes except `/`, `/login`, and static assets are protected. Unauthenticated users are redirected to `/login`.

### v2 Tech Stack

| Category        | Technology                                |
| --------------- | ----------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)        |
| Language        | TypeScript (strict)                       |
| UI Components   | coss ui (built on Base UI)                |
| Styling         | Tailwind CSS v4                           |
| Icons           | Hugeicons (`@hugeicons/react`)            |
| Fonts           | Inter (sans), Geist Mono (mono)           |
| Theming         | next-themes                               |
| Charts          | Recharts                                  |
| Animation       | Motion (Framer Motion v12)                |
| Onboarding      | driver.js                                 |
| Date picker     | react-day-picker                          |
| Validation      | Zod v4                                    |
| Auth            | Supabase Auth                             |
| Database        | Supabase PostgreSQL with RLS              |
| Backend client  | `@supabase/supabase-js` + `@supabase/ssr` |
| Linting         | Oxlint v1 (replaces ESLint entirely)      |
| Formatting      | Oxfmt (replaces Prettier entirely)        |
| Package manager | pnpm                                      |

### v2 Environment Variables

```env
# Public — safe in browser
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Server-only — never expose to browser
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# CLI / local dev only
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_DB_PASSWORD=your-db-password
```

### v2 Oxlint Configuration

Plugins enabled: `oxc`, `typescript`, `unicorn`, `react`, `nextjs`, `jsx-a11y`, `import`, `promise`

Categories: `correctness: error`, `suspicious: warn`

TypeScript overrides:

- `typescript/no-explicit-any: error`
- `typescript/no-non-null-assertion: warn`

Ignored paths: `.next/**`, `out/**`, `build/**`, `coverage/**`, `.vercel/**`, `components/ui/**`, `next-env.d.ts`

Type-aware linting is enabled via `oxc.typeAware: true` in `.vscode/settings.json`.

### v2 Oxfmt Configuration

- `printWidth: 80`, `tabWidth: 2`, `semi: false`, `singleQuote: false`, `trailingComma: "es5"`
- Tailwind class sorting enabled, pointing to `app/globals.css`, with `cn` and `cva` as sort functions
- Embedded language formatting: `auto`
- `components/ui/**` is excluded (coss ui copy-paste components should not be reformatted)

### v2 CI Workflows

Two GitHub Actions workflows:

- `oxlint.yml` — runs `oxlint --deny-warnings --format=github` on every push and PR
- `oxfmt.yml` — runs `oxfmt --check` on every push and PR

---

## Design Principles

- **Developer-first UX** — the app should feel at home for a developer audience
- **Intentionality over features** — every feature should make learning more deliberate, not just more documented
- **Data ownership** — in v2, data is cloud-synced but always strictly scoped to the user via RLS; no user ever sees another user's data
- **No noise** — the interface should not distract from learning; it should support it
- **Accessibility** — dark/light mode support, `jsx-a11y` enforced via Oxlint

### coss ui Styling Preservation

coss ui components are **copy-paste owned code** — they live in `components/ui/` and are treated as a design system layer, not as an external dependency. Because of this, the following rules apply strictly:

- **Never override or modify the styling of installed coss ui components.** Their visual design, spacing, borders, shadows, and variants are intentional and production-tested. If a component needs a change, build a wrapper or a new variant on top of it — do not edit the source file directly.
- **Preserve the border and ring approach.** coss ui uses **opaque borders mixed with bottom shadows** to create crisp, contrasted borders with enhanced visual depth — especially effective across light and dark backgrounds. This is one of the most distinctive and well-crafted aspects of the design system and must not be replaced with standard Tailwind border utilities.
- **Preserve the color token system.** coss ui extends the standard shadcn/ui CSS variable palette with additional semantic tokens: `--info`, `--info-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--destructive-foreground`. These tokens must remain intact and must be used consistently in any custom components that need to communicate state.
- **Preserve Base UI stacking context setup.** The app root wrapper uses `isolation: isolate` and the body uses `position: relative` for iOS Safari 26+ compatibility. These must not be removed — they ensure portaled components like dialogs, popovers, and selects render correctly above page content without z-index conflicts.
- **`components/ui/` is excluded from Oxfmt formatting.** coss ui component files should never be auto-formatted — their internal formatting is part of how they are maintained and updated from the registry.

The guiding rule: **treat coss ui components as a sealed design system**. Compose on top of them, never modify them underneath.

---

## Supabase Authorization Model

- Every table uses RLS — users only ever access their own rows
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is used for browser/client operations (replaces legacy `anon` key)
- `SUPABASE_SECRET_KEY` is used server-side only for elevated operations (replaces legacy `service_role` key)
- The underlying Postgres role for elevated access is still `service_role` (with `BYPASSRLS`)
- Auth flows use `@supabase/ssr` for session handling in Next.js App Router (server components, middleware, route handlers)
