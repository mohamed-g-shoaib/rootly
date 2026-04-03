# Dashboard Instant Navigation Plan (2026-04-03)

## Objective

Make dashboard page transitions feel instant for authenticated users while preserving data correctness.

Primary routes:

- `/overview`
- `/notes`
- `/courses`
- `/courses/[id]`
- `/daily-entries`
- `/review`

---

## Why This Plan

Current dashboard behavior is server-heavy on route change. Even with loading boundaries and streaming, users still see skeleton flashes during frequent navigation.

We will combine three caching layers, each used for what it does best:

1. Next Cache Components for server-rendered read caching and route shell speed.
2. TanStack Query for instant-feeling client interactivity after first load.
3. Redis only when shared/distributed cache pressure justifies external cache infrastructure.

---

## Skills To Apply

- `.agents/skills/next-cache-components/`
- `.agents/skills/tanstack-query-best-practices/`
- `.agents/skills/redis-development/`

Secondary supporting skills:

- `.agents/skills/next-best-practices/`
- `.agents/skills/vercel-react-best-practices/`

---

## Option Matrix

### Option A: Next Cache Components only

Pros:

- Minimal architecture churn
- Keeps App Router server-first model
- Strong fit for list pages and shared read paths

Cons:

- Does not alone provide best-in-class client interaction smoothness
- Requires careful tag invalidation wiring across mutations

Use when:

- You want fast win with low complexity and keep most logic server-side.

### Option B: TanStack Query only

Pros:

- Excellent UX after initial hydration
- Powerful stale-while-revalidate and optimistic mutation flow

Cons:

- Bigger client architecture shift
- Easy to duplicate cache logic if server path remains uncached

Use when:

- You want client-dominant data behavior on highly interactive screens.

### Option C: Next Cache Components + TanStack Query (recommended)

Pros:

- Fast server route reads plus instant client revisits/interaction
- Clear separation: server truth + client warmth
- Best UX/perf balance for Rootly dashboard

Cons:

- More moving parts than single-layer approach
- Requires disciplined query keys and invalidation contracts

Use when:

- You want consistent instant-feel navigation at scale without overcommitting to Redis early.

### Option D: Add Redis distributed cache

Pros:

- Shared cache across instances
- Better stability under high read traffic
- Supports advanced cache patterns and central invalidation

Cons:

- Operational and cost complexity
- Not needed for initial wins on current app size

Use when:

- Next runtime cache hit rate is insufficient or multi-instance invalidation consistency becomes a bottleneck.

---

## Recommended Architecture

Phase-target architecture:

1. Enable Cache Components globally (`cacheComponents: true`).
2. Introduce cached server read functions (`'use cache'`) for dashboard route queries.
3. Apply `cacheLife()` profiles by data volatility.
4. Add `cacheTag()` per domain and wire invalidation from mutations.
5. Add TanStack Query for high-interaction client pages with hydrated initial data.
6. Evaluate Redis after instrumentation shows server cache misses or scaling pain.

---

## Rollout Plan

## Execution Status

### Completed

- Plan and option matrix authored.
- Skill set incorporated into workflow (`next-cache-components`, `tanstack-query-best-practices`, `redis-development`).
- TanStack Query foundation added:
  - shared query provider in app layout
  - Courses page migrated to query-keyed fetching with `keepPreviousData`
  - next-page prefetching added for Courses pagination
- Notes page migrated to query-backed list and course-filter data with cache-updated mutation/live-event flows.
- Review sessions list migrated to query-backed pagination with `keepPreviousData` and next-page prefetching.
- Daily Entries page migrated to query-backed pagination/filtering with `keepPreviousData`, next-page prefetching, and query-cache live updates.
- Dashboard route-segment loading fallbacks for Courses/Notes/Daily Entries/Review (and Course Detail) switched to non-visual fallback (`return null`) to remove page-to-page skeleton flashing during route transitions.
- Seamless transition refinement:
  - removed dashboard segment `loading.tsx` boundaries entirely so App Router keeps prior screen until next segment is ready instead of swapping to fallback content
  - added proactive dashboard dock route prefetching (mount warmup + hover/focus/touch prefetch) in `components/ui/floating-dock.tsx`
- View transition consistency follow-up:
  - added page-level `ViewTransition` wrappers to dashboard routes (`/notes`, `/courses`, `/courses/[id]`, `/daily-entries`, `/review`) so transition behavior is no longer Overview-only
  - opted floating dock out of view-transition snapshots via `viewTransitionName: "none"` in `components/ui/floating-dock.tsx`
- Overview-specific transition refinement after UX feedback:
  - removed nested chart/suspense `ViewTransition` wrappers in Overview insights to prevent repeated document-level transitions
  - added route-level `ViewTransition` wrapper for `/overview` page parity with other dashboard routes
  - switched dock to named transition target (`dashboard-dock`) and disabled its transition animation in `app/globals.css`
- Overview boundary stabilization follow-up:
  - disabled animated dock-link transitions specifically when navigating to or from `/overview` in `components/ui/floating-dock.tsx`
  - removed `/overview` route-level `ViewTransition` wrapper to avoid regression-prone transitions on that boundary while keeping transitions on other dashboard routes
- Cache Components unblock milestone:
  - enabled `cacheComponents: true` in `next.config.mjs`
  - captured blockers via `next build --debug-prerender`
  - resolved root-layout blocking uncached access by wrapping `DashboardColorThemeStyle` in `Suspense` (`app/layout.tsx`)
  - resolved Overview prerender time-order issue by moving `new Date()` reads after session/request access (`app/(dashboard)/overview/page.tsx`)
  - `pnpm exec next build --debug-prerender` now passes
  - `pnpm lint` and standard `pnpm build` pass with Cache Components enabled
- Phase 2 invalidation parity complete for initial rollout:
  - note mutations now invalidate `notes:user:{userId}` plus related course and overview tags
  - daily entry mutations now invalidate `daily-entries:user:{userId}` plus overview tags
  - review session mutations now invalidate `review-sessions:user:{userId}` plus overview tags
- Phase 2 read-side cache metadata complete for initial rollout:
  - course read actions and initial route helpers now use cache directives with `cacheLife("minutes")` and domain tags (`courses:user:*`, `course:*`, `course-notes:*`)
  - notes read functions now use cache directives with `cacheLife("minutes")` and domain tags (`notes:user:*`, `courses:user:*`)
  - daily entries read pagination now uses cache directives with `cacheLife("minutes")` and `daily-entries:user:*` tag
  - review read functions now use cache directives with `cacheLife("minutes")` and domain tags (`review-sessions:user:*`, `notes:user:*`)
  - overview read functions now declare cache directives, lifetimes, and tags for summary/trend/daily entry domains
  - notes/daily/review route initial-data helpers now also run under cached private helpers with domain tags (reducing uncached page-entry query work)
  - lint/build pass with Cache Components enabled after this expansion
- Course mutation invalidation hooks added for server-side cache consistency tags:
  - `courses:user:{userId}`
  - `course:{courseId}`
  - `course-notes:{courseId}`
- Overview chart sizing hardening for Recharts warnings:
  - added `min-w-0` constraints in `ChartFrame` and chart wrappers
  - replaced `ResponsiveContainer` usage on Overview charts with explicit measured `width`/`height` rendering via `ChartResponsiveShell` (`app/overview/ui/charts/chart-responsive-shell.tsx`)
  - `pnpm lint` passes after this change
- Build and lint currently pass with this state.

### In Progress

- Phase 0 metrics documentation in this spec (baseline table + runbook fields).
- Baseline-vs-trial comparison capture for route latency, skeleton exposure, and query count deltas.

### Not Started

- Phase 4 Redis decision gate and potential distributed cache integration.

---

## Phase 0 Baseline Snapshot

Status: in progress

### Measurement Runs

| Run ID       | Date       | Mode               | Branch/Commit        | Notes                                                                                                                            |
| ------------ | ---------- | ------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| baseline-001 | 2026-04-03 | local dev/prod mix | current working tree | Initial baseline scaffold created; route-by-route timings pending capture                                                        |
| baseline-002 | 2026-04-03 | local dev          | current working tree | Localhost `Invoke-WebRequest` loop (`n=12`) later found to hit `/login` responses for protected routes                           |
| baseline-003 | 2026-04-03 | local dev          | current working tree | Authenticated telemetry sample captured from server log for `/courses` via `[dashboard-perf]` (`totalMs=1039.75`, `stepCount=2`) |
| baseline-004 | 2026-04-03 | local dev          | current working tree | Authenticated browser navigation loop captured in `[dashboard-perf]` logs (`n=9-10` per route; `/courses/[id]` still pending)    |

### Route Performance Baseline

| Route          | p50 nav latency (ms)  | p95 nav latency (ms)  | Skeleton visible (Y/N) | Skeleton duration p50 (ms) | Skeleton duration p95 (ms) | Supabase queries per nav (approx) | Notes                                                                                                            |
| -------------- | --------------------- | --------------------- | ---------------------- | -------------------------- | -------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| /overview      | 314.78                | 329.33                | N                      | 0                          | 0                          | ~3-4                              | Authenticated `dashboard-perf` sample set (`n=9`); separate `/overview#insights` stream not included in this row |
| /notes         | 299.65                | 311.94                | N                      | 0                          | 0                          | ~2                                | Authenticated `dashboard-perf` sample set (`n=10`); max spike observed: `482.85`                                 |
| /courses       | 196.35                | 217.46                | N                      | 0                          | 0                          | ~2                                | Authenticated `dashboard-perf` sample set (`n=10`)                                                               |
| /courses/[id]  | TBD (auth run needed) | TBD (auth run needed) | N                      | 0                          | 0                          | ~2                                | CLI probe was login content, not dashboard route render                                                          |
| /daily-entries | 189.87                | 206.03                | N                      | 0                          | 0                          | ~1                                | Authenticated `dashboard-perf` sample set (`n=10`)                                                               |
| /review        | 211.25                | 423.39                | N                      | 0                          | 0                          | ~3                                | Authenticated `dashboard-perf` sample set (`n=10`); heavy-tail spikes present                                    |

### Mutation Freshness Baseline

| Mutation Flow | UI updates immediately | Requires manual refresh | Eventual consistency lag observed | Notes                                                                                                                         |
| ------------- | ---------------------- | ----------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Create course | Yes                    | No                      | Low                               | Query invalidation now wired in courses path                                                                                  |
| Update course | Yes                    | No                      | Low                               | Query invalidation now wired in courses path                                                                                  |
| Delete course | Yes                    | No                      | Low                               | Query invalidation now wired in courses path                                                                                  |
| Create note   | Yes                    | No                      | Low                               | Code-path verified: optimistic cache update + query invalidation + server `updateTag`; interactive auth QA pass still pending |
| Update note   | Yes                    | No                      | Low                               | Code-path verified: optimistic cache update + query invalidation + server `updateTag`; interactive auth QA pass still pending |
| Delete note   | Yes                    | No                      | Low                               | Code-path verified: optimistic cache update + query invalidation + server `updateTag`; interactive auth QA pass still pending |

---

## Cache Components Readiness Checklist

Status: in progress

Goal: safely re-enable `cacheComponents: true` without blocking-route build failures.

### Global Readiness

- [x] Identify current blocker routes (`/courses/[id]` during trial).
- [x] Capture debug stack traces with `next build --debug-prerender` for each blocker.
- [x] Enumerate all request-time API usage (`cookies`, `headers`, `searchParams`) in dashboard tree.
- [x] Define cached-scope policy: pass runtime data as args unless explicitly using private cache mode.

### Route Boundary Readiness

Runtime API findings snapshot:

- `app/(dashboard)/**`: no direct `cookies()`, `headers()`, or `searchParams` usage found.
- Dashboard runtime auth/session access is centralized through `lib/dashboard-session.ts` -> `lib/supabase/server.ts` (`cookies()`).
- Auth/login and extension API `searchParams`/headers usage exists outside the dashboard route group and should not be included in cache-components route boundary audits.
- Root layout cookie read (`DashboardColorThemeStyle`) now executes behind `Suspense` to avoid blocking-route uncached access under Cache Components.
- Overview now reads current time only after session/request access, satisfying prerender ordering constraints.

- [x] `/courses`: verified in successful debug-prerender and standard builds with Cache Components enabled.
- [x] `/courses/[id]`: verified in successful debug-prerender and standard builds with Cache Components enabled.
- [x] `/notes`: verified in successful debug-prerender and standard builds with Cache Components enabled.
- [x] `/daily-entries`: verified in successful debug-prerender and standard builds with Cache Components enabled.
- [x] `/review`: verified in successful debug-prerender and standard builds with Cache Components enabled.
- [x] `/overview`: verified in successful debug-prerender and standard builds with Cache Components enabled.

### Build/Verification Readiness

- [x] Trial run with `cacheComponents: true` via debug-prerender build.
- [x] `pnpm lint` passes.
- [x] `pnpm run build` passes.
- [ ] Compare baseline vs trial route metrics and skeleton exposure.
- [x] Document any regressions and rollback criteria.

Metric note:

- Added opt-in route telemetry utility in `lib/dashboard-route-perf.ts` gated by `ROOTLY_DASHBOARD_PERF_LOG=1`.
- `baseline-002` CLI loop data is excluded from authenticated dashboard baseline because protected route probes resolved to login content.
- Cache hit/miss headers (`x-nextjs-cache`) were not available in current dev-mode CLI probes; cache behavior should be measured from dashboard-perf logs and authenticated browser runs.
- `baseline-004` now provides authenticated route telemetry for `/overview`, `/notes`, `/courses`, `/daily-entries`, and `/review`; `/courses/[id]` still needs authenticated sampling.
- True pre-rollout vs post-rollout delta remains unavailable because pre-rollout route timings were not captured before cache/tanstack rollout.

### Authenticated Telemetry Snapshot (`baseline-004`)

Derived from user-provided `[dashboard-perf]` logs (`totalMs`):

| Route          | Samples | p50 totalMs | p95 totalMs | Typical measured step labels                                                                                                                                   |
| -------------- | ------- | ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /overview      | 9       | 314.78      | 329.33      | `session`, `summary:fallback-note-count`, `summary:fallback-course-count`, `summary:fallback-trend-rows`, `summary:entry-rows`, `summary:derive-understanding` |
| /notes         | 10      | 299.65      | 311.94      | `session`, `notes:query-notes`                                                                                                                                 |
| /courses       | 10      | 196.35      | 217.46      | `session`, `courses-query`                                                                                                                                     |
| /daily-entries | 10      | 189.87      | 206.03      | `session`, `entries-query`                                                                                                                                     |
| /review        | 10      | 211.25      | 423.39      | `session`, `review-data`                                                                                                                                       |

Additional observation:

- Browser logs repeatedly show Recharts container warnings (`width(-1)`, `height(-1)`) on `/overview`; this should be addressed separately as a chart layout stability issue.

## Phase 0: Baseline and Guardrails

- Capture baseline route timings and skeleton exposure counts.
- Ensure every list mutation path has explicit invalidation hook points.
- Confirm no cached scope directly reads runtime APIs (`cookies`, `headers`, `searchParams`) unless intentionally private.

Success criteria:

- Baseline dashboard metrics documented.
- No hidden write paths without invalidation plan.

## Phase 1: Cache Components Foundation

- Enable `cacheComponents: true` in Next config.
- Start with `/courses` and `/courses/[id]` read paths.
- Add cache tags:
  - `courses:user:{userId}`
  - `course:{courseId}`
- Add cache lifetimes:
  - Lists: profile `minutes`
  - Detail: profile `minutes` or `hours` based on mutation frequency
- Add invalidation in mutation server actions (`revalidateTag` or `updateTag`).

Success criteria:

- Repeat navigation to courses routes reduces skeleton frequency and server query count.
- No stale-after-mutation regressions.

## Phase 2: Expand Server Caching to Remaining Dashboard Reads

Current rollout status:

- [x] `/notes`
- [x] `/daily-entries`
- [x] `/review`
- [x] `/overview` (staged integration complete for current summary/trend/daily domains)

Suggested tags:

- `notes:user:{userId}`
- `daily-entries:user:{userId}`
- `review-sessions:user:{userId}`
- `overview-summary:user:{userId}`
- `overview-trend:user:{userId}`

Success criteria:

- Warm navigation shows meaningful reduction in blocking server work across all routes.
- Baseline-vs-trial metrics are documented in this spec.

## Phase 3: TanStack Query Warmth Layer

- Introduce shared QueryClient config.
- Hydrate initial server data into query cache for selected pages.
- Add prefetch on likely next actions and route intent.
- Use optimistic updates for create/update/delete flows with rollback.

Priority pages:

1. Courses (completed)
2. Notes (completed)
3. Review (completed)
4. Daily Entries (completed)
5. Overview (deferred for now: server-streamed architecture has no low-risk client fetch surface)

Success criteria:

- Back-and-forth navigation and common list interactions feel immediate after first load.
- Reduced skeleton flashes for revisits.

## Phase 4: Redis Decision Gate

Introduce Redis only if all are true:

- Multi-instance deployment causes low effective server cache persistence.
- Cache miss rates remain high despite phased local caching.
- Read latency or infra cost indicates shared cache value.

If enabled:

- Use Redis as shared cache backend for tagged read domains.
- Keep TTL policy explicit and domain-specific.
- Add observability around hit rate, eviction, and stale consistency.

Success criteria:

- Stable hit rate and lower p95/p99 for heavy dashboard reads.

---

## Invalidation Contract

Every mutation must invalidate the exact read domains it affects.

Examples:

- Course create/update/delete:
  - invalidate `courses:user:{userId}`
  - invalidate `course:{courseId}` for updates/deletes
  - invalidate overview tags if aggregate counters depend on courses

- Note create/update/delete:
  - invalidate `notes:user:{userId}`
  - invalidate `course:{courseId}` if course detail note list depends on notes
  - invalidate `overview-summary:user:{userId}` and `overview-trend:user:{userId}`

- Daily entry write:
  - invalidate `daily-entries:user:{userId}`
  - invalidate `overview-summary:user:{userId}`

- Review session write/delete:
  - invalidate `review-sessions:user:{userId}`
  - invalidate overview aggregates if surfaced there

---

## Metrics and Validation

Track before and after each phase:

- Route transition p50/p95 duration
- Time to meaningful content per dashboard route
- Skeleton visible duration/frequency
- Supabase query count per navigation
- Cache hit/miss rates by domain tag
- Mutation-to-UI-freshness correctness checks

---

## Risks and Mitigations

Risk: stale data after writes.
Mitigation: strict tag invalidation matrix and tests around mutation flows.

Risk: over-caching user-scoped data incorrectly.
Mitigation: include user identity in cache key inputs and tag namespaces.

Risk: complexity creep from dual cache layers.
Mitigation: phase-by-phase rollout and shared utilities for keys/tags/query keys.

Risk: regressions in auth/runtime API usage inside cached scopes.
Mitigation: lint/review rule: read runtime APIs outside cached scopes and pass arguments.

---

## Immediate Next Implementation Slice

1. Capture authenticated route latency samples for `/courses/[id]` (`n>=10`) and populate p50/p95 values.
2. Backfill a true pre-rollout baseline snapshot (if recoverable from logs/history) so baseline-vs-trial delta can be computed.
3. Verify `/overview` Recharts warning elimination in a fresh authenticated navigation loop (`/overview` -> `/notes` -> `/courses` -> `/overview`, repeated 3x); if still present, capture narrowed repro context.
4. Re-evaluate Redis gate only after authenticated metric deltas and cache-miss evidence are captured.
