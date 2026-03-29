# Dashboard Navigation Performance

## Goal

Reduce dashboard route-to-route navigation time so moving between `/overview`, `/notes`, `/courses`, `/daily-entries`, and `/review` feels immediate instead of taking roughly 1.7 seconds.

This spec focuses on the current architectural causes of slow navigation and proposes an implementation plan in the highest-impact order.

---

## Current Problem

Dashboard navigation is slow because several expensive steps happen on every route change:

1. The auth/session path runs more than once per navigation.
2. Each route blocks on fresh server-side Supabase queries before the next screen can render.
3. The shared dashboard chrome is recreated on every route instead of persisting across dashboard pages.
4. Some pages serialize and hydrate large client payloads.

The result is that even normal client-side navigation feels closer to a cold page load.

---

## Confirmed Causes

### 1. Duplicate auth work on every protected route

Protected routes are checked in `proxy.ts`, which calls `updateSession(request)` and performs `supabase.auth.getUser()` on every matched request.

Then each dashboard page repeats `supabase.auth.getUser()` in the page server component before fetching data.

Affected files include:

- `proxy.ts`
- `app/overview/page.tsx`
- `app/notes/page.tsx`
- `app/courses/page.tsx`
- `app/daily-entries/page.tsx`
- `app/review/page.tsx`

This means auth verification is part of the critical path twice.

### 2. Page-level server fetches block the route transition

Each dashboard route fetches its initial data in the route entry and waits for that work before rendering the destination page.

Examples:

- `app/notes/page.tsx` fetches all notes plus courses
- `app/courses/page.tsx` fetches all courses
- `app/daily-entries/page.tsx` fetches all daily entries
- `app/review/page.tsx` fetches sessions, courses, and reviewable notes
- `app/overview/page.tsx` runs several queries and then additional server-side aggregation work

This makes navigation time sensitive to database latency and response size.

### 3. `DashboardShell` is not persistent across dashboard routes

`app/ui/dashboard-route-layout.tsx` currently injects only the dashboard color theme style.

The actual shell is rendered inside each page UI component instead of in a shared dashboard layout. That causes the following to remount on every navigation:

- top bar
- avatar menu
- command palette
- floating dock
- media query logic
- shell-local React state
- shell effects and listeners

This adds avoidable client work and makes transitions feel heavier than they should.

### 4. Large payloads are passed into client-heavy route UIs

Some routes pass full collections into large client components:

- `app/notes/page.tsx` sends the full notes list, including bodies, answers, and code snippets
- `app/review/page.tsx` sends all session history, course options, and review note data
- `app/overview/page.tsx` constructs multiple chart datasets server-side and ships them into a client page

Even when the database is acceptable, serialization, hydration, and client initialization still add latency.

### 5. Overview is especially expensive

The overview route is currently the heaviest dashboard page because it:

- verifies the user
- runs four initial queries in parallel
- runs an additional notes query after that
- performs aggregation/transformation work on the server
- mounts a client dashboard page with several dynamic chart boundaries

This route is likely to dominate perceived slowness when navigating to or from `/overview`.

---

## What This Is Not

This spec does not assume the main problem is:

- broken Next.js client navigation
- Motion/FloatingDock animation cost alone
- a confirmed Postgres indexing issue
- a confirmed Supabase outage or network regression

Supabase is part of the critical path, but the first fixes should target route architecture before database tuning.

---

## Success Criteria

We should consider this successful when:

1. The dashboard shell persists across dashboard routes.
2. A route change no longer requires duplicate auth verification in the hot path.
3. Navigation to common routes feels near-instant on warm navigations.
4. Large pages do not block route transitions on non-critical data.
5. Slow routes can be measured and reasoned about independently.

---

## Plan

## Phase 1: Make the dashboard shell persistent (completed)

### Objective

Move `DashboardShell` out of per-page client UIs and into a shared dashboard layout so it survives route transitions.

### Changes

- Create a real shared dashboard layout that wraps:
  - `DashboardColorThemeStyle`
  - `ColorThemeApplicator`
  - `DashboardShell`
- Move page-specific content into children slots instead of recreating the shell in:
  - `app/overview/ui/overview-page.tsx`
  - `app/notes/ui/notes-page.tsx`
  - `app/courses/ui/courses-page.tsx`
  - `app/daily-entries/ui/daily-entries-page.tsx`
  - `app/review/ui/review-page.tsx`
- Pass only route-specific shell props where needed:
  - `fab`
  - maybe per-page header content if necessary

### Expected impact

This should remove a major chunk of client-side remount work and make navigation feel much smoother even before data optimizations.

### Risks

- The shell currently owns per-route FAB configuration.
- Some pages render header content near the top and may assume shell-local spacing.
- The color theme applicator lifecycle must still behave correctly when mounted once.

---

## Phase 2: Remove duplicate auth work in the navigation hot path (completed)

### Objective

Avoid doing full user lookup twice on every dashboard navigation.

### Changes

- Audit whether page-level `supabase.auth.getUser()` is still required after `proxy.ts` gatekeeping.
- Introduce a shared server-side user resolution strategy for dashboard routes instead of repeating the call in every page.
- Prefer one dashboard-level auth lookup per request rather than one per page file.

### Options

Option A:
Use a dashboard-level server layout to resolve the user once and pass it down.

Option B:
Keep route-level user access but replace duplicate page lookups with a shared helper that can be reused consistently.

### Expected impact

This reduces repeated network/auth overhead and simplifies the route tree.

### Current result

- warm dashboard route `session` timings dropped from roughly `175-195ms` into a much lower band, often around `15-20ms`
- warm `proxy.ts` timings dropped from roughly `160-260ms` into a much lower band, often around `4-6ms`
- duplicate auth verification is no longer the dominant warm-navigation bottleneck

### Risks

- Must preserve correct redirect behavior for unauthenticated users.
- Must not weaken Supabase SSR auth guarantees.

---

## Phase 3: Reduce initial payload size per route (in progress)

### Objective

Stop sending full datasets to large client pages when only a subset is needed for the initial view.

### Changes

#### Notes

Status: completed

- Fetch only fields required for the list view first
- Defer heavy note content when possible:
  - `answer`
  - `body`
  - `code_snippet`
- Consider loading full note content on sheet open if the current UI permits it

#### Review

Status: completed

- Fetch only data needed for the list/setup state initially
- Consider deferring some session detail fields until detail open
- Current progress:
  - initial review note pool now defers answers and question text
  - review sessions fetch full note content on start
  - saved session detail fetches question text on demand when needed

#### Overview

Status: in progress

- Review whether all overview aggregates must block first render
- Consider splitting summary cards from heavier trend datasets
- Current progress:
  - removed unused review accuracy trend fetch/payload
  - split overview into a lighter summary render plus a streamed insights section
  - deduplicated overlapping overview server data with shared cached helpers
  - reduced the summary-side understanding query so the first render no longer waits on full trend rows
  - reduced the summary-side daily entries query so streak/today metrics no longer depend on the chart dataset

### Expected impact

Smaller server payloads mean faster RSC transfer, less client hydration, and lighter route transitions.

### Risks

- Requires careful UI support for deferred data states
- May affect existing optimistic update assumptions

---

## Phase 4: Stream or defer non-critical data (in progress)

### Objective

Allow the route to render quickly while slower secondary data loads behind boundaries.

### Changes

- Add Suspense boundaries at the server/component level where useful
- Separate above-the-fold content from slower secondary panels
- For overview, consider rendering summary cards first and streaming heavier chart datasets after

### Expected impact

Even if total data time stays similar, perceived navigation speed should improve significantly.

### Risks

- Requires careful loading-state design
- Some pages may need to be split into smaller server/client boundaries first

---

## Phase 5: Measure and optimize Supabase/Postgres only after architectural fixes

### Objective

Once architectural waste is removed, inspect whether individual queries are still too slow.

### Possible follow-up checks

- query latency by route
- response size by route
- missing indexes on:
  - `user_id`
  - `updated_at`
  - `date`
  - common filter/sort combinations
- whether overview aggregations should move to SQL views or RPCs
- whether RLS policies introduce per-row overhead

Current progress:

- lightweight dashboard route timing instrumentation is now available behind `ROOTLY_DASHBOARD_PERF=1`
- route logs now capture total server time and major fetch groups for key dashboard routes
- heavier routes now log more granular substeps, especially Overview summary/insights and Notes
- warm-run measurements and `EXPLAIN (ANALYZE, BUFFERS)` checks show the current dataset is not bottlenecked by raw Postgres execution time
- the shared dashboard layout now uses verified auth claims for shell identity, avoiding an extra dashboard-level `getUser()` call on each navigation while keeping page-level trusted user lookup for data access
- dashboard route entries and Overview data helpers now use a verified claims-based `userId` helper wherever they only need the authenticated subject for filtering/mutations
- `proxy.ts` now uses verified auth claims for the middleware-side authentication gate instead of fetching a fresh Auth user record on every protected request
- recent warm-run measurements show the auth/proxy path is no longer the main dashboard bottleneck; remaining cost is now concentrated in route data work, especially Overview and occasional Review spikes

### Why this is later

Right now the app does too much work per navigation even before query tuning. Database tuning should come after we remove duplicate and unnecessary application work.

---

## Recommended Order

Implement in this order:

1. Persistent dashboard shell
2. Shared dashboard-level auth/user resolution
3. Payload reduction for Notes and Review
4. Overview split/streaming
5. Supabase/Postgres query tuning if still needed

This order gives the highest user-visible improvement fastest.

---

## Validation Plan

After each phase, verify:

1. Navigation between all dashboard routes still works correctly.
2. Auth redirects still behave correctly.
3. Shell state that should persist actually persists.
4. Theme behavior still works in the persistent shell.
5. Route transition time improves subjectively and, if possible, via measurement.

Suggested measurement points:

- `/overview` -> `/notes`
- `/notes` -> `/courses`
- `/courses` -> `/review`
- `/review` -> `/daily-entries`
- `/daily-entries` -> `/overview`

If instrumentation is added later, capture:

- proxy/auth time
- server fetch time
- RSC payload time
- client hydration/remount time

---

## Proposed Implementation Start

The best first code change is:

1. Introduce a real dashboard layout that owns `DashboardShell`
2. Remove `DashboardShell` from page-level client UIs
3. Re-test navigation feel before touching queries

If that alone produces a major improvement, we continue with auth and payload cleanup. If not, we immediately move to Phase 2 and Phase 3.
