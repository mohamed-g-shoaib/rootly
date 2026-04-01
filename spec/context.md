# Rootly Context

## Product

Rootly is a developer-focused learning notebook for self-taught developers.

It is not a general notes app. Core product areas:

- courses
- Q&A and freeform notes
- daily study tracking
- review sessions / spaced repetition
- overview dashboard

v2 is the active cloud-first rebuild using Next.js App Router, Supabase, coss UI, and Tailwind.

---

## Core Docs To Re-read

These are the main orientation docs for this repo:

- `spec/what-is-rootly.md`
- `spec/frontend-development-cycle.md`
- `spec/agent-skills.md`

For dashboard navigation performance work, also read:

- `spec/dashboard-navigation-performance.md`

---

## Important Project Rules

- Respect coss UI as a sealed design system.
- Do not modify `components/ui/*` styling internals unless explicitly needed and approved.
- Prefer existing project patterns over inventing new ones.
- Use local skills when the task matches them.
- Extension-related tasks now have dedicated local skills: `browser-extension-builder`, `chrome-extension-development`, and `chrome-extension-ui`.
- For extension work, use `browser-extension-builder` for scaffolding/patterns, `chrome-extension-ui` for user-facing surface decisions, and `chrome-extension-development` as the final engineering/security/performance quality bar.
- Prefer `rg` for search.
- Use `apply_patch` for file edits.
- Do not revert unrelated user changes.

---

## Skills Used Recently

These were already relevant in recent work:

- `$react-useeffect`
- `$coss`
- `$make-interfaces-feel-better`
- `$vercel-react-best-practices`
- `$next-best-practices`

Use them again when the task matches.

---

## Current Frontend Shape

Frontend is a Next.js App Router app with these main dashboard routes:

- `/overview`
- `/notes`
- `/courses`
- `/courses/[id]`
- `/daily-entries`
- `/review`

Feature UIs live mostly under:

- `app/<feature>/ui/*`

Shared dashboard pieces live under:

- `app/ui/*`
- `components/*`

---

## Current Task Status

### Theme bug

We fixed a dashboard theme issue where the selected color theme reset when the avatar menu closed.

Key fix:

- `hooks/use-color-theme.ts`

Root cause:

- multiple consumers of `useColorTheme()` were mounted
- cleanup always cleared the theme on unmount
- closing the avatar menu unmounted one consumer and reset the theme

Fix:

- only clear theme colors when the last active consumer unmounts

### Homepage CTA loading state

We updated the homepage primary CTA to show a loading state while navigating to `/login`.

Key files:

- `app/(marketing)/ui/marketing-primary-cta.tsx`
- `app/(marketing)/ui/homepage-nav.tsx`

Behavior:

- idle state is `label + arrow`
- loading state is `spinner + label`

### Dashboard navigation performance

We diagnosed that dashboard route changes felt heavy, around 1.7s.

Main confirmed causes:

1. Duplicate auth work:
   - `proxy.ts` does auth/session refresh
   - each page also calls `supabase.auth.getUser()`

2. Page-level blocking server fetches:
   - each route waits for fresh Supabase data before render

3. Non-persistent shell:
   - `DashboardShell` used to mount inside each page UI
   - this caused full shell remounts on every navigation

4. Large client payloads:
   - especially Notes, Review, and Overview

Spec created for this:

- `spec/dashboard-navigation-performance.md`

---

## Dashboard Refactor In Progress

Phase 1 and Phase 2 are complete. Phase 3 is in progress.

### What changed

A shared dashboard route group was created:

- `app/(dashboard)/layout.tsx`

Dashboard routes were moved under:

- `app/(dashboard)/overview/page.tsx`
- `app/(dashboard)/notes/page.tsx`
- `app/(dashboard)/courses/page.tsx`
- `app/(dashboard)/courses/[id]/page.tsx`
- `app/(dashboard)/daily-entries/page.tsx`
- `app/(dashboard)/review/page.tsx`

`DashboardShell` is now mounted once in the shared dashboard layout.

Page UIs were refactored to stop wrapping themselves in `DashboardShell`.

Instead, mobile FAB actions now register with the persistent shell through:

- `useDashboardShellFab()` in `app/ui/dashboard-shell.tsx`

Files updated for that:

- `app/overview/ui/overview-page.tsx`
- `app/notes/ui/notes-page.tsx`
- `app/courses/ui/courses-page.tsx`
- `app/courses/ui/course-detail-page.tsx`
- `app/daily-entries/ui/daily-entries-page.tsx`
- `app/review/ui/review-page.tsx`

### Validation status

The stale generated route type issue was fixed locally.

What happened:

- `.next/types/validator.ts` still referenced the old deleted route files after the App Router move

What fixed it:

- regenerating route types with repo-local `next typegen`

Current validation state:

- repo-local `tsc --noEmit` passes
- `next typegen` passes
- `.next/types` no longer references the deleted dashboard page/layout paths

Remaining caveat:

- full `next build` is still blocked in this environment because Google Fonts cannot be fetched during the build

---

## Current Performance Progress

### Phase 1: Persistent dashboard shell

Completed.

- `DashboardShell` now lives in `app/(dashboard)/layout.tsx`
- page UIs no longer wrap themselves in `DashboardShell`
- per-route mobile FABs register through `useDashboardShellFab()`

### Phase 2: Reduce duplicate auth work

Completed.

What changed:

- shared dashboard auth helpers were added in `lib/dashboard-session.ts`
- dashboard layout and dashboard route entry files now use shared cached helpers instead of calling `supabase.auth.getUser()` directly in each route file
- the shared dashboard layout now resolves shell identity from verified JWT claims instead of doing a second full `supabase.auth.getUser()` call just to render avatar/menu data
- dashboard route entries and Overview shared data helpers now use a verified claims-based `userId` helper where they only need the authenticated subject, leaving full user fetches out of the hot path for those routes
- `proxy.ts` now performs the protected-route auth gate with verified claims instead of a fresh `supabase.auth.getUser()` fetch on every matched request

Current intent:

- preserve `proxy.ts` auth gatekeeping
- avoid repeated dashboard-level user lookups inside the route tree

Current measured outcome:

- warm route-level `session` work now often lands around `15-20ms` instead of the old roughly `175-195ms`
- warm `proxy.ts` cost now often lands around `4-6ms` instead of the old roughly `160-260ms`
- auth is no longer the main warm-navigation bottleneck

### Next focus: Phase 3 payload reduction

The current optimization pass is reducing initial route payload size, starting with:

- Notes
- Review
- Overview

What is now done:

- Notes now ships lightweight note summary data first
- full note content loads on demand for view/edit/code/export flows
- Review now ships question-level metadata first and lazy-loads full note answers when a review session starts
- Review now also defers question text in the initial note pool and lazy-loads saved-session detail questions on open
- Overview no longer fetches or serializes unused review accuracy trend data
- Overview now renders the hero/summary block separately and streams the heavier insights/chart section behind a boundary
- Overview summary and streamed insights now share cached server data helpers to avoid overlapping per-request fetch work
- Overview summary now computes average understanding from a lighter understanding-level query instead of waiting on full trend rows
- Overview summary now uses a smaller daily-entry query for streak and today metrics instead of relying on the chart entry dataset

What remains in Phase 3:

- continue reducing or splitting overview payloads

### Phase 5: Measurement readiness

We now have lightweight server-side dashboard route timing instrumentation.

Key file:

- `lib/dashboard-route-perf.ts`

Current behavior:

- when `ROOTLY_DASHBOARD_PERF=1` is set, key dashboard routes log total server time and major fetch steps
- Overview and Notes now log more granular substeps inside their heavier server work
- current coverage includes:
  - `/overview`
  - `/overview#insights`
  - `/notes`
  - `/courses`
  - `/courses/[id]`
  - `/daily-entries`
  - `/review`

Recent findings:

- warm-run measurements show `/overview` is still the slowest dashboard route, but the gap is much smaller than at the start of the refactor
- `EXPLAIN (ANALYZE, BUFFERS)` on the current small dataset showed Overview note queries executing in well under 1 ms inside Postgres
- that means the remaining hot-path cost is more likely auth/request/Supabase round-trip overhead than raw database execution time for the current data volume
- after the claims-based route and proxy auth changes, the main remaining warm-route bottlenecks are now Overview data work and occasional Review data spikes rather than auth/proxy overhead

--- 

## What To Remember In A Fresh Chat

- This repo is Rootly v2, a developer learning notebook.
- Read `spec/what-is-rootly.md`, `spec/frontend-development-cycle.md`, and `spec/agent-skills.md` first if needed.
- The active engineering thread is dashboard navigation performance.
- A shared dashboard route layout has already been introduced.
- Route type validation has been refreshed successfully with `next typegen`.
- The current next step is continuing Phase 3 and Phase 5 work on route data, with Overview as the primary target and Review variability as the next thing to inspect.
- Dashboard route timing logs are available via `ROOTLY_DASHBOARD_PERF=1`.
- Do not reintroduce per-page `DashboardShell` wrappers.
