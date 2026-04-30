# Rootly Context

## Product

Rootly v2 is a developer-focused learning notebook (cloud-first rebuild). Stack: Next.js App Router, Supabase, coss UI, Tailwind.

Core areas: courses, Q&A + freeform notes, daily study tracking, spaced repetition review, overview dashboard.

---

## Key Orientation Docs

Always read before starting:

- `spec/what-is-rootly.md`
- `spec/frontend-development-cycle.md`
- `spec/agent-skills.md`

Task-specific:

- Dashboard nav perf → `spec/dashboard-navigation-performance.md`
- Extension work → `spec/browser-extension-side-panel.md`
- Instant nav plan → `spec/dashboard-instant-navigation-plan-2026-04-03.md`
- Overview perf → `spec/overview-performance-audit-2026-04-03.md`
- DB index work → `spec/sql/supabase-duplicate-index-audit.sql`

---

## Project Rules

- coss UI is a sealed design system. Do not modify `components/ui/*` internals unless explicitly approved.
- Prefer existing patterns. Do not invent new ones.
- Use local skills when the task matches.
- Use `rg` for search, `apply_patch` for edits.
- Do not revert unrelated user changes.
- Do not reintroduce per-page `DashboardShell` wrappers.

---

## Architecture: Current State

### Dashboard Routes

Shared layout: `app/(dashboard)/layout.tsx` — `DashboardShell` mounts once here.

Routes:

- `app/(dashboard)/overview/page.tsx`
- `app/(dashboard)/notes/page.tsx`
- `app/(dashboard)/courses/page.tsx`
- `app/(dashboard)/courses/[id]/page.tsx`
- `app/(dashboard)/daily-entries/page.tsx`
- `app/(dashboard)/review/page.tsx`

Feature UIs: `app/<feature>/ui/*` — Shared pieces: `app/ui/*`, `components/*`

Mobile FABs register via `useDashboardShellFab()` in `app/ui/dashboard-shell.tsx`.

### Auth

- Auth helpers centralized in `lib/dashboard-session.ts`
- Dashboard layout + routes use verified JWT claims, not repeated `supabase.auth.getUser()` calls
- `proxy.ts` handles protected-route auth gate via verified claims
- Website auth is Supabase cookie-based (server-cookie-backed)

### Data / Caching

- **Cache Components** enabled in `next.config.mjs` (`cacheComponents: true`)
- **TanStack Query** (`components/query-provider.tsx`) wraps the app in `app/layout.tsx`
- TanStack Query active on: `/courses`, `/notes`, `/review` (sessions), `/daily-entries`
- Overview remains server-streamed (intentionally deferred from TanStack)
- Cache tags + `updateTag()` invalidation wired in all mutation actions
- `cacheLife("minutes")` + domain tags on all read-side server actions

### Pagination

- Shared fixed-bottom dock: `app/ui/dashboard-pagination-dock.tsx`
- Server-backed pagination on all list routes
- Per-page counts: Notes 12, Courses 12, Daily Entries 10, Review Sessions 8
- Scroll reset on page change via `hooks/use-pagination-scroll-reset.ts`

### Navigation / Transitions

- Shared CSS page transition (entry-only: opacity + translate + blur) in `app/globals.css`
- Route-group templates: `app/(dashboard)/template.tsx`, `app/(marketing)/template.tsx`, `app/(auth)/template.tsx`
- Transition wrapper: `components/ui/page-transition-shell.tsx` (keyed by `usePathname()`)
- Browser/React View Transitions removed; `experimental.viewTransition` disabled
- Floating dock: `components/ui/floating-dock.tsx` — route prefetch on hover/focus/touch, no VT snapshots

### Sound

- Global click-sound system in `components/theme-provider.tsx`
- Fires on buttons/links only — excludes typing targets and `[data-click-sound="off"]` subtrees
- Theme switches use dedicated switch sound, not generic click
- Mute controls in dashboard avatar menu and marketing footer

---

## Extension: Current State

**Firm direction:** Side-panel-first (sole primary surface). Not a standalone product — a bridge to the Rootly website.

### Extension Files

```
extension/
  manifest.json
  background/service-worker.js
  sidepanel/
    index.html, sidepanel.css, sidepanel.js
    dom.js, render.js, selects.js, state.js
    form-utils.js, draft-manager.js, listeners.js
    bootstrap-controller.js, action-handlers.js
  lib/
    config.js, api.js, time.js
  icons/
```

### Website Extension API

- `app/api/extension/bootstrap/route.ts` — auth check, user identity, recent courses, today's entry
- `app/api/extension/daily-entries/route.ts` — POST with daily aggregation logic
- `app/api/extension/notes/route.ts` — POST Q&A or Freeform notes
- `app/api/extension/courses/route.ts` — POST new course
- `lib/extension-api.ts`

### Extension Auth

- Cookie-session bridge to website (no separate token system)
- `401` from extension endpoints = signed-out state
- Recovery: open website login → OAuth completes → retry bootstrap

### Extension Behavior

- Bootstrap: cached data for immediate shell, revalidates in background
- Tabs: Capture, Timer, Log
- Drafts persist via `chrome.storage.local`
- Timer: start/pause/resume/stop/reset; saves into `daily_entries` with same-day aggregation
- Note save: Q&A (question + answer + understandingLevel) or Freeform (body); courseId optional
- Daily log: adds minutes to today's total; mood/note are editable same-day
- Bridge messaging: content script on Rootly pages for live dashboard updates after extension saves
- CORS: optional explicit extension-id allowlisting via `ROOTLY_EXTENSION_IDS`
- Idempotency: `clientRequestId` + in-memory TTL replay protection on daily-entries POST
- Tests: `lib/extension-idempotency.test.js`, `extension/lib/time.test.js` — run via `pnpm run test:extension`

### Extension Design

- Matches website `claude-blue` theme — token values in `lib/themes.ts`, applied in `extension/sidepanel/sidepanel.css`
- coss-style roundness, surface treatment, control density
- Custom styled selects (not native `<select>`), keyboard + a11y support

---

## Overview Page: Current State

- Server-streamed: summary renders first, insights/charts stream behind Suspense boundary
- `app/overview/overview-data.ts` — shared cached data helpers
- Summary uses non-RPC path by default; RPC available behind `ROOTLY_OVERVIEW_USE_SUMMARY_RPC=1`
- Charts use `ResizeObserver` shell (`chart-responsive-shell.tsx`) with numeric width/height (no `ResponsiveContainer`)
- Overview and Notes transitions excluded from dock `transitionTypes` to prevent chrome flicker

---

## Performance Instrumentation

Enable with `ROOTLY_DASHBOARD_PERF_LOG=1`.

Emits `[dashboard-perf]` JSON: `{ route, totalMs, stepCount, steps[] }`.

Authenticated baselines (p50 / p95):

- `/overview`: 314 / 329 ms
- `/notes`: 299 / 311 ms
- `/courses`: 196 / 217 ms
- `/daily-entries`: 189 / 206 ms
- `/review`: 211 / 423 ms (heavy-tail spikes)

---

## DB Indexes: Current State

`daily_entries` indexes after cleanup:

- `daily_entries_pkey`
- `daily_entries_user_date_unique`
- `daily_entries_user_id_idx`

Removed (duplicate/redundant):

- `daily_entries_user_date_desc_idx`
- `daily_entries_user_date_idx`
- `notes_user_updated_at_desc_idx`

---

## Marketing Homepage: Current State

### Structure

`app/(marketing)/page.tsx`:

1. Hero (headline + interactive browser mock)
2. How It Works (carousel, 5 cards)
3. Final CTA

### Hero

File: `app/(marketing)/ui/homepage-hero.tsx`

- Headline: "Turn scattered learning into organized progress."
- Interactive 3-tab browser mock (React Docs / Figma Tutorial / Spanish Lesson)
- Tab content cross-fades (200ms, `cubic-bezier(0.23, 1, 0.32, 1)`)
- ARIA tablist/tab/tabpanel roles, keyboard nav

Browser mock component: `BrowserWindowMock` exported from `app/(marketing)/ui/homepage-extension-highlight.tsx`

### How It Works

File: `app/(marketing)/ui/homepage-how-it-works.tsx`

- 5 cards: Organize (ML course), Capture (Figma), Reflect (Spanish), Review (Music Theory), Track (mixed subjects)
- Cards use `Reveal mode="mount"` with stagger on page load, no swipe-triggered re-animation

### Other Marketing Files

- `app/(marketing)/ui/homepage-nav.tsx` — mobile GitHub icon + "Get started" button
- `app/(marketing)/ui/homepage-extension-dialog.tsx` — Chrome unpacked-install instructions
- `app/(marketing)/ui/homepage-final-cta.tsx`
- `app/(marketing)/ui/marketing-primary-cta.tsx` — loading state on navigate

### SEO

- `app/sitemap.ts`, `app/robots.ts`
- Browser extension schema markup on homepage
- `lib/site-config.ts` — keywords include extension-related terms
- `app/opengraph-image.tsx` — updated for inclusive positioning

---

## Theme

- Default custom theme: `claude-blue` (set in `lib/color-theme.ts`, tokens in `lib/themes.ts`)
- `hooks/use-color-theme.ts` — only clears theme on last consumer unmount (prevents reset on avatar menu close)
- `hooks/use-media-query.ts` — uses `useSyncExternalStore` with stable server snapshot; breakpoint `md` = 768px

---

## Active Next Steps

1. Mutation freshness QA across all dashboard routes
2. True pre/post metric delta capture for dashboard perf
3. `/courses/[id]` authenticated timing sample (n≥10 still missing)
4. Continue Cache Components + TanStack Query rollout governance per `spec/dashboard-instant-navigation-plan-2026-04-03.md`
