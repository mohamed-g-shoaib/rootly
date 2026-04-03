# Overview Performance Audit - 2026-04-03

## Scope

Route audited:

- `/overview`

Primary files reviewed:

- `app/(dashboard)/overview/page.tsx`
- `app/overview/overview-data.ts`
- `app/overview/ui/overview-insights.tsx`
- `app/overview/ui/overview-insights-client.tsx`
- `app/overview/ui/charts/*`
- `hooks/use-media-query.ts`

Skills applied:

- `next-best-practices`
- `vercel-react-best-practices`
- `fixing-motion-performance`
- `make-interfaces-feel-better`

---

## Findings

### 1) Chart chunk waterfall (critical)

Observation:

- The route dynamically imports chart wrappers in `overview-insights-client.tsx`.
- Each chart wrapper was also dynamically importing `recharts` internally.

Impact:

- Two async boundaries before a chart can paint.
- Longer post-hydration loading and extra skeleton exposure.

### 2) Insights work starts later than necessary (high)

Observation:

- `page.tsx` awaited summary data before rendering the `Suspense` subtree for insights.

Impact:

- Less overlap between summary fetch and insights fetch.
- Increased total time to fully interactive insights.

### 3) Duplicate understanding query path (high)

Observation:

- Summary requested `getOverviewUnderstandingLevels` while insights also requested trend rows containing `understanding_level`.

Impact:

- Redundant notes query and duplicate compute path.

### 4) Repeated overview session context acquisition (medium)

Observation:

- Multiple overview data functions repeatedly called `getDashboardSupabase()` and `getDashboardUserId()`.

Impact:

- Extra repeated setup overhead and noisier call graph.

### 5) Loading consistency issue (medium)

Observation:

- Different loading surfaces existed between server fallback and client chart fallback.

Impact:

- Perceived "old skeleton after new skeleton" effect.

---

## Implemented Solutions

### A) Removed nested chart dynamic imports

Changes:

- Converted chart components to direct `recharts` imports:
  - `app/overview/ui/charts/daily-study-time-chart.tsx`
  - `app/overview/ui/charts/daily-mood-chart.tsx`
  - `app/overview/ui/charts/understanding-progress-chart.tsx`

Expected result:

- Eliminates one async layer from chart rendering path.
- Faster chart paint after component chunk resolves.

### B) Preloaded insights trend rows during summary flow

Changes:

- Added early non-blocking preload in `app/(dashboard)/overview/page.tsx`:
  - `void getOverviewTrendRows(nowIso)`

Expected result:

- Better overlap between summary and insights data work.

### C) Removed duplicate understanding-level query

Changes:

- Replaced `getOverviewUnderstandingLevels(nowIso)` usage in summary with `getOverviewTrendRows(nowIso)`.
- Derived `avgUnderstanding` from trend rows already used by insights.
- Removed unused `getOverviewUnderstandingLevels` export from `app/overview/overview-data.ts`.

Expected result:

- One fewer notes query per overview request path.

### D) Added shared cached overview context

Changes:

- Introduced `getOverviewContext` in `app/overview/overview-data.ts`.
- Reused it across:
  - `getOverviewEntryRows`
  - `getOverviewSummaryEntryRows`
  - `getOverviewTrendRows`

Expected result:

- Cleaner request-scoped context reuse.
- Reduced repeated session/context setup calls.

### F) Collapsed duplicate daily entries fetch path

Changes:

- Added cached base query `getOverviewDailyRows(nowIso)` (365-day window with mood).
- Refactored:
  - `getOverviewSummaryEntryRows(nowIso)` to derive from cached base rows.
  - `getOverviewEntryRows(nowIso)` to slice 90-day window from cached base rows.

Expected result:

- Summary and insights reuse one underlying `daily_entries` fetch instead of issuing two separate queries.
- Lower `/overview` server render time and lower `/overview#insights` entry-row fetch time.

### G) Overlapped session and summary data work

Changes:

- Exported `getOverviewContext` and reused it from page-level session measurement.
- Started `summary:entry-rows` and `summary:trend-rows` promises before awaiting session completion.
- Awaited prestarted promises together with count queries once `userId` was known.

Expected result:

- Reduces sequential `session -> data` wait in `/overview`.
- Preserves request-scoped cache reuse while improving overlap.

### H) Moved summary stats to single RPC fast-path

Changes:

- Added `getOverviewSummaryStats()` backed by `supabase.rpc("get_overview_summary")`.
- Updated `app/(dashboard)/overview/page.tsx` to use this RPC for:
  - `totalCourses`
  - `totalNotes`
  - `avgUnderstanding`
- Kept a correctness fallback for environments where the RPC is unavailable:
  - fallback exact counts for courses/notes

Expected result:

- Removes multiple summary-critical round-trips in the common path.
- Keeps behavior safe across partially migrated environments.

### I) Removed summary/insights fetch contention

Changes:

- Removed non-critical trend prewarm from `app/(dashboard)/overview/page.tsx` summary request path.

Expected result:

- Prevents summary hero metrics from competing with insights trend fetch on the same request timeline.

### J) RPC availability diagnosis and bootstrap

Observation from logs:

- `summary:summary-rpc` reported `hasData:false`, meaning the fast-path RPC is missing/inaccessible in the active environment.

Remediation artifact:

- `spec/sql/overview-summary-rpc-bootstrap.sql`

This script creates/grants `public.get_overview_summary()` so summary fast-path can be used.

### K) Removed eager summary-entry fallback query

Changes:

- In `app/(dashboard)/overview/page.tsx`, `entry-rows` fallback query is now lazy and only executes when RPC stats are unavailable or missing needed fields.

Expected result:

- On healthy RPC path, expensive `summary:entry-rows` disappears from perf logs.

### L) Extended summary RPC payload for hero metrics

Changes:

- `spec/sql/overview-summary-rpc-bootstrap.sql` now returns:
  - `today_study_minutes`
  - `streak_days`

Expected result:

- Summary hero can avoid additional daily-entry query in common path.

### M) Corrected fallback trigger condition

Changes:

- Fallback query trigger now checks RPC field presence (`today_study_minutes`, `streak_days`) instead of checking whether values are zero.

Why:

- `0` is a valid business value and should not force expensive fallback queries.

### N) Reintroduced insights prewarm without summary blocking

Changes:

- In `app/(dashboard)/overview/page.tsx`, added non-blocking prewarm:
  - `getOverviewEntryRows(nowIso)`
  - `getOverviewTrendRows(nowIso)`

Expected result:

- Keeps summary on fast path while helping streamed insights avoid cold query latency.

Update:

- Prewarm was moved to request start (before summary awaits) to maximize overlap with summary work.

### O) RPC SQL aggregation optimization

Changes:

- Updated `spec/sql/overview-summary-rpc-bootstrap.sql` to reduce repeated scans by:
  - computing `daily_agg` once
  - computing `notes_agg` once
  - computing `courses_agg` once
  - reusing these aggregates in final JSON payload

Expected result:

- Lower DB execution time for `get_overview_summary()`.

### P) Defaulted summary path to non-RPC (env-gated RPC)

Changes:

- `app/(dashboard)/overview/page.tsx` now prefers the faster parallel fallback strategy by default.
- RPC path is still available via `ROOTLY_OVERVIEW_USE_SUMMARY_RPC=1`.
- Fallback path now derives `avgUnderstanding` from trend rows instead of forcing `0`.

Expected result:

- Avoids slow environments where `summary-rpc` dominates request latency.
- Keeps RPC path available for future environments where it benchmarks faster.

### E) Removed unnecessary dynamic chunk for Course Mastery list

Changes:

- Switched `CourseMasteryList` in `overview-insights-client.tsx` from dynamic import to static import.

Expected result:

- Removes avoidable chunk boundary for lightweight component.

---

## Validation Checklist

1. No TypeScript/compile errors in touched overview files.
2. No hydration mismatch warnings on `/overview`.
3. Overview skeleton transitions feel consistent.
4. `ROOTLY_DASHBOARD_PERF=1` logs show improved timing for:
   - summary + insights overlap
   - chart readiness after hydration

---

## Follow-up Recommendations

1. Consider replacing exact count queries with cached counters if user tables grow significantly.
2. Keep route-perf logging enabled in staging for before/after regression checks.
3. If needed, add prefetching for heavy chart chunks on idle after first paint.
