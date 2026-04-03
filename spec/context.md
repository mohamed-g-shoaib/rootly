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

For browser extension work, also read:

- `spec/browser-extension-side-panel.md`

For Supabase database advisor/index-maintenance work, also use:

- `spec/sql/supabase-duplicate-index-audit.sql`
- `spec/sql/supabase-duplicate-index-drop-2026-04-03.sql`
- `spec/sql/supabase-redundant-index-check-daily-entries.sql`

For overview performance audits, use:

- `spec/overview-performance-audit-2026-04-03.md`

---

## Important Project Rules

- Respect coss UI as a sealed design system.
- Do not modify `components/ui/*` styling internals unless explicitly needed and approved.
- Prefer existing project patterns over inventing new ones.
- Use local skills when the task matches them.
- Extension-related tasks now have dedicated local skills: `browser-extension-builder`, `chrome-extension-development`, and `chrome-extension-ui`.
- Extension-only review/refinement skills now also include `html-css-best-practices` for handcrafted extension HTML/CSS and `modern-javascript-patterns` for handcrafted extension JavaScript modules.
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

### Dashboard optimization update (2026-04-03)

- Non-overview dashboard optimization implementation started.
- Applied first-pass high-impact updates:
  - `/courses/[id]`: removed duplicate metadata DB fetch by switching to static metadata title.
  - `/review` client: removed repeated O(n) note-id lookups in summary/detail helpers by using id maps.
  - `/review` server: reduced initial notes payload; moved question/answer completeness checks to SQL `not is null` filters.
  - `/notes` client: replaced repeated course/title and note-id linear lookups with memoized maps.
  - Added route-level loading boundaries for `/notes`, `/courses`, `/courses/[id]`, `/daily-entries`, `/review` to improve perceived responsiveness during server fetches.
- Touched files:
  - `app/(dashboard)/courses/[id]/page.tsx`
  - `app/review/ui/review-page.tsx`
  - `app/(dashboard)/review/page.tsx`
  - `app/notes/ui/notes-page.tsx`
  - `app/(dashboard)/notes/loading.tsx`
  - `app/(dashboard)/courses/loading.tsx`
  - `app/(dashboard)/courses/[id]/loading.tsx`
  - `app/(dashboard)/daily-entries/loading.tsx`
  - `app/(dashboard)/review/loading.tsx`

### Pagination update (2026-04-03)

- Added explicit list pagination controls to remaining non-overview dashboard list pages so pagination now exists across all dashboard list surfaces.
- Existing incremental pagination on Notes and Course Detail notes remains in place.
- New explicit page controls (`Previous` / `Next`) added to:
  - `app/courses/ui/courses-page.tsx`
  - `app/daily-entries/ui/daily-entries-page.tsx`
  - `app/review/ui/review-page.tsx`

### Pagination phase 2 update (2026-04-03)

- Started server-backed pagination rollout.
- Review sessions list is now server-backed by page (instead of loading all sessions on first render):
  - `app/review/ui/review-actions.ts`: added `getReviewSessionsPage`.
  - `app/(dashboard)/review/page.tsx`: initial sessions query now fetches first page with exact count.
  - `app/review/ui/review-page.tsx`: page transitions now fetch from server and keep count-aware controls.

### Pagination + server paging extension (2026-04-03)

- Fixed runtime regression in courses list (`Button` usage/import mismatch in `app/courses/ui/courses-page.tsx`).
- Pagination controls are now explicit, subtle, and bottom-anchored across dashboard list surfaces:
  - `app/courses/ui/courses-page.tsx`
  - `app/daily-entries/ui/daily-entries-page.tsx`
  - `app/review/ui/review-page.tsx`
  - `app/notes/ui/notes-page.tsx`
  - `app/courses/ui/course-detail-page.tsx`
- Extended server-backed pagination beyond Review:
  - Courses:
    - `app/courses/ui/courses-actions.ts`: added `getCoursesPage`, `getCourseTopics`
    - `app/(dashboard)/courses/page.tsx`: initial paged fetch + total count + topic data
    - `app/courses/ui/courses-page.tsx`: page/filter/sort transitions now fetch from server
  - Daily Entries:
    - `app/daily-entries/ui/daily-entries-actions.ts`: added `getDailyEntriesPage`
    - `app/(dashboard)/daily-entries/page.tsx`: initial paged fetch + total count
    - `app/daily-entries/ui/daily-entries-page.tsx`: page/filter transitions now fetch from server

### Pagination design refresh (2026-04-03)

- Loaded design-focused skills (`coss`, `make-interfaces-feel-better`, `emil-design-eng`, `userinterface-wiki`) and updated pagination UI to match a quieter coss-style pattern.
- Introduced shared fixed-bottom pagination dock:
  - `app/ui/dashboard-pagination-dock.tsx`
- Dock behavior:
  - fixed viewport position (mobile-safe offset)
  - subtle capsule surface, low-contrast controls, tabular numeric page indicator
  - hidden when only one page exists (`totalPages <= 1`)
- Applied dock across paginated list pages:
  - `app/courses/ui/courses-page.tsx`
  - `app/daily-entries/ui/daily-entries-page.tsx`
  - `app/review/ui/review-page.tsx`
  - `app/notes/ui/notes-page.tsx`
  - `app/courses/ui/course-detail-page.tsx`

### Build stabilization (2026-04-03)

- Fixed a `NoteCard` prop type mismatch in course detail notes rendering:
  - removed unsupported `isMobile` prop pass in `app/courses/ui/course-detail-page.tsx`
- Fixed topic filter option type inference regression in courses list:
  - replaced literal-narrowing `.concat(...)` construction with an explicitly typed spread build in `app/courses/ui/courses-page.tsx`
- Validation: `pnpm run build` now completes successfully.

### Lint stabilization (2026-04-03)

- Fixed `oxlint` config parse failure by removing unsupported `react/jsx-uses-react` rule from `.oxlintrc.json`.
- Resolved follow-up lint blockers surfaced by `--deny-warnings`:
  - `lib/dashboard-route-perf.ts`: hoisted non-capturing helper functions (`measure`, `finish`) out of factory scope to satisfy `unicorn/consistent-function-scoping`.
  - `app/courses/ui/courses-components.tsx`: updated editor reset `useEffect` dependencies to include `course`.
  - `app/daily-entries/ui/daily-entries-components.tsx`: updated entry editor reset `useEffect` dependencies to include `entry`.
- Validation: `pnpm lint` now passes with 0 warnings and 0 errors.

### React Doctor follow-up (2026-04-03)

- Addressed `react-doctor/prefer-dynamic-import` warnings for overview charts by replacing direct `recharts` imports with `next/dynamic(..., { ssr: false })` component loading:
  - `app/overview/ui/charts/understanding-progress-chart.tsx`
  - `app/overview/ui/charts/daily-study-time-chart.tsx`
  - `app/overview/ui/charts/daily-mood-chart.tsx`
- Addressed `react-doctor/nextjs-no-use-search-params-without-suspense` warning in login UI by removing `useSearchParams` usage and reading the callback error query param from `window.location.search` on mount:
  - `app/(auth)/login/ui/login-page.tsx`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes
  - `npx -y react-doctor@latest .` no longer reports the two specific warnings above
- React effect hygiene follow-up:
  - `app/(auth)/login/ui/login-page.tsx` callback error handling now derives value via `useMemo` (with a `window` guard) instead of `useEffect` + state sync, aligning with `react-useeffect` guidance to avoid effects for derived render state.

---

## Current Task Status

### Browser extension exploration

We have started planning a Rootly browser extension.

Current product direction:

- The extension is not a standalone product; it is a bridge to the Rootly website for quick actions.
- Product preference: avoid shipping both popup and side panel as parallel primary surfaces because that would create user confusion.
- General extension mindset: the extension must not invent a second Rootly product logic.
- The extension should reuse the website's existing models, behaviors, and mental model wherever possible.
- The extension may simplify presentation and speed up capture, but it should not introduce contradictory extension-only rules.
- When deciding between convenience and fidelity, choose the version that helps the user while remaining faithful to Rootly's existing product behavior.
- Authentication should follow website auth state as closely as practical:
  - if the user is already authenticated with Rootly on the website, the extension should open into the signed-in experience
  - if not authenticated, the extension should gently prompt for login and send the user to the website login flow
- Website auth is currently Supabase-based and server-cookie-backed:
  - the website login UI uses Supabase OAuth providers from `app/(auth)/login/ui/login-page.tsx`
  - `app/auth/callback/route.ts` exchanges the OAuth code for a session and redirects into the app
  - `lib/supabase/middleware.ts` refreshes and reads verified auth claims from request cookies
  - extension auth should therefore be designed as a website-session bridge, not as a separate account system
  - preferred extension auth direction: cookie-session-based auth via credentialed requests to Rootly website endpoints
  - extension should treat `401` from Rootly extension endpoints as signed-out state
  - signed-out recovery path should open the website login page, let website OAuth complete normally, then retry the extension bootstrap/session check
  - the extension should not own a separate bearer-token auth system if website-cookie auth can serve as the single source of truth
- The extension design should match Rootly's current default custom theme:
  - `claude-blue`
  - coss-style roundness and surface treatment
  - overall coss UI philosophy, even if the extension UI is implemented separately
- The default website custom theme is explicitly `claude-blue` in `lib/color-theme.ts`, with the actual token values defined in `lib/themes.ts`.
- The main extension use case is compact, fast study capture while the user is already browsing or watching a tutorial.
- If Rootly uses a side panel, it should likely be the sole primary user-facing surface opened from the toolbar action rather than pairing it with a separate popup.
- The current direction is now firm: v1 extension should be side-panel-first, with the side panel as the only primary extension surface.

Planned quick actions:

- create a note
  - note types: Q&A or freeform
  - attach the note to an existing course
- create a course
- log daily study time
- run a study timer in the background
  - display format: `HH:MM:SS`
  - allow start, pause, stop
  - when pausing or stopping, allow saving the session with a mood and quick note
  - timer saves should write directly into `daily_entries`
  - timer saves must follow the same daily aggregation logic as the website:
    - same-day study time adds into the existing daily total rather than creating separate session records
    - today's logged time should remain visible during the day
    - today's mood is editable during the day and later saves may replace the current day's mood
    - today's daily note is also visible and editable during the day, with later saves updating the current day's note

Example workflow:

- a user is reading React docs or watching a Next.js tutorial
- they open the extension
- they quickly choose a note type, select the related course, and save a compact study note
- they can also start a timer and later save the study session without needing the full website flow

Current implementation implication:

- the extension should likely call dedicated website API endpoints for quick actions
- existing website mutations currently live as server actions under:
  - `app/notes/ui/notes-actions.ts`
  - `app/courses/ui/courses-actions.ts`
  - `app/daily-entries/ui/daily-entries-actions.ts`
- those are useful references for payload shape and validation, but they are not yet an extension-facing API surface
- the canonical extension product/architecture spec now lives at `spec/browser-extension-side-panel.md`

### Extension implementation progress

We have started implementation of the browser extension foundation.

Current files:

- `extension/manifest.json`
- `extension/background/service-worker.js`
- `extension/sidepanel/index.html`
- `extension/sidepanel/sidepanel.css`
- `extension/sidepanel/sidepanel.js`
- `extension/sidepanel/dom.js`
- `extension/sidepanel/render.js`
- `extension/sidepanel/selects.js`
- `extension/sidepanel/state.js`
- `extension/lib/config.js`
- `extension/lib/api.js`
- `extension/lib/time.js`

Current behavior:

- toolbar action opens the side panel via MV3 side panel behavior
- side panel has a real signed-out and signed-in shell
- side panel bootstraps against a website endpoint rather than inventing local auth
- side panel now renders signed-in content from per-environment cached bootstrap data when available, then revalidates against Rootly in the background
- extension drafts for note, course, daily log, and timer fields now persist across side-panel close/reopen via `chrome.storage.local`
- signed-in UI no longer shows decorative app chrome like the old `Study companion` header, refresh action, or passive `Connected` badge
- the summary card now shows the actual date instead of a vague `Today` label
- the main action area now uses tabs (`Capture`, `Timer`, `Log`) instead of one long vertically stacked surface
- the quick-course flow now stays minimized behind a disclosure until the user explicitly opens it
- discrete side-panel choices such as course, understanding, and mood now use custom Rootly-styled select menus instead of native browser `<select>` controls
- floating select menus should be able to escape card bounds cleanly rather than being clipped by their parent card
- side-panel motion should stay subtle and purposeful, without decorative hover-lift effects
- the footer now includes a quiet `Dashboard` link plus a minimal `Settings` door for environment switching during development, instead of guessing from open tabs
- the footer settings panel now opens upward as a compact anchored popover so environment switching remains usable in narrow side-panel widths
- extension environment selection is now explicit and stored locally rather than inferred from browser tab state
- timer state now has a first background-worker foundation using `chrome.storage.local`
- timer currently supports start, pause, resume, stop, and reset inside the extension foundation
- the side panel now updates the running timer display locally instead of message-polling the background worker every second
- side panel now supports quick note capture in website-faithful `Q&A` and `Freeform` modes
- side panel now supports quick course creation with the same Rootly course meaning as the website
- extension side-panel styling now follows the website's semantic token, radius, border, ring, and control-density contract more closely instead of using a looser Rootly-inspired approximation
- extension side-panel density is now intentionally tighter, with softer coss-style edge treatment, clearer active-tab contrast, a compact single-line header (`Hi, <first name>` on the left and date on the right) without passive sync copy, and shared `+ / -` disclosure affordances for quick-course and custom select controls`r`n- the summary header no longer echoes today's daily note; instead, the log panel shows any existing saved daily note in a dedicated contextual summary card and treats the textarea below as the explicit edit surface for replacing it
- extension action buttons now show explicit loading states (save/create/timer/environment actions) so user intent and in-flight work are always visible
- custom selects now include stronger keyboard and a11y behavior (selected-option focus, Home/End support, Tab close behavior, and improved listbox semantics)
- extension now injects a lightweight content script on Rootly pages so same-browser daily-entry saves can bridge into the open dashboard immediately without waiting for a full refresh
- extension note saves now use the same browser-bridge pattern as daily entries, so an open Notes dashboard can upsert a newly created note immediately instead of waiting for reload
- paused timer time can now be saved directly into `daily_entries`
- manifest now wires the extension and toolbar icons from `extension/icons/*` for real browser chrome/store asset usage

Current website extension API:

- `app/api/extension/bootstrap/route.ts`
- `app/api/extension/daily-entries/route.ts`
- `app/api/extension/notes/route.ts`
- `app/api/extension/courses/route.ts`
- `lib/extension-api.ts`

Current bootstrap behavior:

- uses website Supabase cookie session via `supabase.auth.getClaims()`
- returns `401` when signed out
- returns minimal user identity, recent courses, and today's `daily_entries` state when signed in
- accepts a client-provided `today=YYYY-MM-DD` query value so extension daily-entry state follows the user's local date instead of server timezone assumptions
- side-panel bootstrap now treats cached bootstrap data as a lightweight immediate shell and no longer lets timer-state sync failures take down the whole panel

Current write behavior:

- side panel now supports an inline quick daily-log form
- `POST /api/extension/daily-entries` now applies Rootly daily aggregation rules:
  - creates today's entry if missing
  - adds minutes into today's existing total if present
  - lets same-day mood and daily note update to the current values provided by the user
- daily-entry saves from the extension now also broadcast into the current browser via the background worker, and dashboard pages subscribe to `daily_entries` realtime updates plus the window bridge so open dashboard surfaces update immediately after extension saves
- extension note saves now also broadcast into the current browser via the background worker, and the Notes page subscribes to `notes` realtime updates plus the window bridge so extension-created notes appear live in an open dashboard
- side panel timer can now save paused timer time into today's `daily_entries`
- timer save copy now makes the integer-minute save behavior explicit by telling the user exactly how much time will be added to today before they save
- daily-log and timer drafts now treat today's current daily entry as the baseline so saved mood/note values do not linger as fake unsaved drafts
- current implementation only allows timer save once at least 1 minute has elapsed, avoiding hidden sub-minute rounding behavior
- timer now supports an explicit `stop` action in addition to start, pause, resume, and reset
- the timer save panel now includes its own mood and quick-note inputs so ending a study session does not depend on the separate daily-log card
- timer saves still write into the same daily-entry model and update today's visible mood, note, and accumulated time`r`n- required extension fields now use destructive ring feedback when the user tries to save without completing them, instead of only surfacing validation through status text
- post-save clearing behavior is now explicit:
  - note and quick-course inputs/selects reset after successful create/save
  - daily-log hours/minutes reset after save while daily mood/note remain persisted for same-day edits
  - timer save mood/note reset after successful timer save so the next timer session starts clean
- `POST /api/extension/notes` now supports quick note capture with the same Rootly note meaning as the website:
  - `Q&A` notes require `question`, `answer`, and `understandingLevel`
  - `Freeform` notes require `body`
  - `courseId` remains optional and maps directly to the website note model
- the side panel quick-note form now loads recent courses from bootstrap and preserves the user's current note mode and course while clearing the note fields after save
- the quick-note course picker now uses the same compact custom-select pattern as the mood and understanding controls
- custom select options are now rendered with DOM nodes and text content rather than injected HTML
- course selection now comes from the bootstrapped course list without a separate extension search flow
- the old passive `Current page`, `Recent courses`, and full-card website handoff sections have been removed to keep the extension focused on direct actions
- `POST /api/extension/courses` now supports quick course creation with the same Rootly course meaning as the website:
  - `title` is required
  - `instructor` and `courseLink` remain optional
  - `links`, `topics`, and `progress` default to the same website-compatible values used for a brand new course
- the side panel quick-course form now inserts the created course into local extension state immediately and selects it for note capture without requiring a full refresh
- side-panel logic is now split into focused modules for DOM refs, state, rendering, and custom select behavior instead of concentrating everything in one oversized file
- side-panel controller logic was further modularized so `extension/sidepanel/sidepanel.js` now orchestrates focused modules:
  - `extension/sidepanel/form-utils.js` for reusable field/button/form helpers
  - `extension/sidepanel/draft-manager.js` for draft persistence/hydration and baseline-aware draft state
  - `extension/sidepanel/listeners.js` for tab/select/input/action/document/runtime listener registration
  - `extension/sidepanel/bootstrap-controller.js` for bootstrap/session hydrate, cache sync, timer state sync, and daily-entry write-through updates
  - `extension/sidepanel/action-handlers.js` for note/course/daily/timer action workflows and environment switching logic
- extension bridge messaging is now stricter:
  - background service worker only accepts timer/broadcast commands from trusted side-panel sender URLs
  - broadcast payloads are schema-validated in the worker before forwarding to tabs
  - content script validates daily-entry and note bridge payload shape before posting into `window`
- extension CORS handling now supports optional explicit extension-id allowlisting via `ROOTLY_EXTENSION_IDS`
- `POST /api/extension/daily-entries` now accepts optional `clientRequestId` and performs best-effort in-memory idempotency replay protection for duplicate requests within a short TTL
- extension reliability checks now include repo-local unit tests:
  - `lib/extension-idempotency.test.js`
  - `extension/lib/time.test.js`
  - run via `pnpm run test:extension`

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

### Responsive hydration safety

We hit another Base UI hydration mismatch in the dashboard after responsive client branches diverged from the server tree.

Current fix:

- `hooks/use-media-query.ts` now uses `useSyncExternalStore` with a stable server snapshot instead of effect-driven post-render state initialization

### Dashboard UX polish follow-up

- daily entries `Log Today` and courses `New Course` sheet editors were aligned with notes/review sheet behavior by keeping editor sheet bodies mounted and resetting local draft state on open, so open/close transitions are consistent
- pointer cursor behavior for dashboard avatar interactions is now enforced at shared UI primitive level (not per-screen overrides):
  - menu items/submenus
  - combobox items
  - select triggers/items
  - switch root (used by dark/light toggle)
- overview insights chart-loading skeleton was replaced with a lightweight pulse-based placeholder (no gradient shimmer) for lower paint/compositing overhead

### Overview hydration and loading polish

- hydration mismatch on dashboard/overview was addressed by stabilizing initial media-query values during hydration (`useMediaQuery` now returns SSR-aligned `false` until mount)
- overview range toggle IDs were made explicit/stable (`overview-range-mobile`, `overview-range-desktop`) instead of generated ids
- dashboard avatar menu trigger now uses a stable explicit id (`dashboard-user-menu-trigger`) to avoid generated-id drift warnings
- overview insights client-side chart loading fallbacks now use the same lightweight pulse skeleton style as server fallback, removing the old heavy shimmer fallback from post-hydration chart loading

### Overview performance optimization pass

- created route audit/spec doc at `spec/overview-performance-audit-2026-04-03.md` with findings and execution plan
- reduced chart chunk waterfalls by removing nested `dynamic(() => import("recharts"))` from chart modules and using direct `recharts` imports inside chart components
- preloaded overview trend rows early in `app/(dashboard)/overview/page.tsx` to overlap summary and insights work
- removed duplicate summary understanding query path by deriving `avgUnderstanding` from `getOverviewTrendRows(nowIso)` instead of a separate understanding-level query
- introduced cached shared overview context in `app/overview/overview-data.ts` to reuse supabase/user session resolution across overview data functions
- removed unnecessary dynamic import boundary for lightweight `CourseMasteryList` in insights client

Latest follow-up:

- overview summary now uses `get_overview_summary` RPC via `getOverviewSummaryStats()` as the fast-path for total courses/notes and average understanding
- summary retains a fallback exact-count path for environments where the RPC is unavailable
- summary still prewarms trend rows for streamed insights, but trend fetch is no longer on the summary critical path

Newest update:

- removed trend-row prewarm from summary request flow to reduce contention when summary is using fallback paths
- logs showed `summary-rpc` fast-path unavailable (`hasData:false`) in active environment
- added bootstrap SQL for RPC creation/grants:
  - `spec/sql/overview-summary-rpc-bootstrap.sql`

Most recent follow-up:

- overview summary `entry-rows` is now lazy fallback only (no eager execution on fast-path)
- overview summary RPC bootstrap now includes `today_study_minutes` and `streak_days` so hero metrics can be served from the same RPC payload
- summary fallback trigger now checks RPC field presence instead of zero values, so valid `0` stats no longer cause unnecessary `entry-rows` fallback queries

Newest additions:

- summary now non-blockingly prewarms insights entry/trend data to improve streamed insights latency
- overview summary RPC bootstrap SQL was optimized to reduce repeated table scans by using shared aggregate CTEs (`daily_agg`, `notes_agg`, `courses_agg`)

Latest execution decision:

- overview summary now defaults to the faster non-RPC path in this environment
- RPC summary path remains available behind `ROOTLY_OVERVIEW_USE_SUMMARY_RPC=1` for benchmarking/feature-flag rollout
- non-RPC path now derives average understanding from trend rows to preserve metric correctness

### Supabase performance advisor follow-up

Duplicate-index advisor warnings for `daily_entries` and `notes` were validated as exact duplicate non-unique index pairs. Audit output selected these for removal:

- `public.daily_entries_user_date_desc_idx`
- `public.notes_user_updated_at_desc_idx`

Prepared cleanup script:

- `spec/sql/supabase-duplicate-index-drop-2026-04-03.sql`

Execution caveat captured from Supabase SQL editor:

- `DROP INDEX CONCURRENTLY` may fail with `cannot run inside a transaction block` when the runner wraps statements in a transaction
- for this environment, use transaction-safe `DROP INDEX IF EXISTS ...` statements

Current status:

- duplicate index drops were applied successfully
- post-drop verification confirms the removed indexes are no longer present:
  - `public.daily_entries_user_date_desc_idx`
  - `public.notes_user_updated_at_desc_idx`

Optional next cleanup candidate to validate with usage stats and EXPLAIN before dropping:

- `daily_entries_user_date_idx` may overlap with unique index `daily_entries_user_date_unique` for many access paths
- redundant-index validation script now samples a real `daily_entries.user_id` automatically for EXPLAIN checks, because placeholder UUID checks can produce inconclusive seq-scan plans on small datasets

Follow-up decision:

- `daily_entries_user_date_idx` is structurally redundant with `daily_entries_user_date_unique` (same btree key columns) and is a valid cleanup candidate
- small-table EXPLAIN output remained seq-scan-heavy and not highly diagnostic, but index-structure analysis still supports removal to reduce write overhead
- prepared cleanup script:
  - `spec/sql/supabase-redundant-index-drop-daily-entries.sql`

Current status:

- redundant index drop was applied successfully
- post-drop `daily_entries` indexes now are:
  - `daily_entries_pkey`
  - `daily_entries_user_date_unique`
  - `daily_entries_user_id_idx`

Reason:

- responsive branching in dashboard shell and page headers must keep the same initial server/client tree so Base UI generated ids do not drift during hydration

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

### View Transitions skill + rollout evaluation (2026-04-03)

- Added new local skill registration in `spec/agent-skills.md`:
  - `vercel-react-view-transitions`
- Environment viability checks:
  - Next.js version supports Link `transitionTypes` (`node_modules/next/dist/client/app-dir/link.d.ts` includes `transitionTypes?: string[]`)
  - `next.config.mjs` does not yet enable `experimental.viewTransition`
- Recommended integration map (priority order):
  1. Dashboard route transitions:
     - Add `experimental.viewTransition: true` in `next.config.mjs`
     - Add `transitionTypes` on dashboard navigation links in `components/ui/floating-dock.tsx`
     - Use directional types for hierarchical flows (`nav-forward`/`nav-back`) and non-directional types for lateral dashboard tab-like route switches
  2. Shared element for Courses list -> detail:
     - Source card/title link in `app/courses/ui/courses-components.tsx`
     - Matching target element in `app/courses/ui/course-detail-page.tsx`
     - Use stable names like `course-card-${id}` and keep names unique
  3. Suspense reveal polish in Overview:
     - `app/(dashboard)/overview/page.tsx` and `app/overview/ui/overview-insights-client.tsx`
     - Wrap fallback/content pairs with VT enter/exit classes for streamed insights/charts
  4. Loading boundary transitions for dashboard route segments:
     - `app/(dashboard)/*/loading.tsx`
     - Add fallback-side VT wrappers so loading-to-content swap feels continuous
- Guardrails from the skill applied to this project:
  - Avoid layout-level VT wrapper around dashboard `children` in `app/(dashboard)/layout.tsx` when page-level VTs are introduced
  - Use `default="none"` on page-level VTs to avoid accidental cross-fade on every update
  - Prefer explicit push navigations over `router.back()` when transition direction must be controlled

### View Transitions Phase 1 implementation (2026-04-03)

- Completed initial enablement for dashboard navigation transitions:
  - enabled Next.js view transition experiment in `next.config.mjs` via `experimental.viewTransition: true`
  - added `transitionTypes={["dashboard-lateral"]}` to dashboard dock links in `components/ui/floating-dock.tsx` (mobile and desktop variants)
- Current semantics:
  - dashboard primary route switching is tagged as lateral navigation, consistent with skill guidance to avoid directional depth motion for tab-like navigation
  - no layout-level VT wrapper was added yet; page-level/suspense/shared-element VT wiring remains a later phase
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes and shows `viewTransition` experiment enabled

### View Transitions Phase 2 implementation (2026-04-03)

- Implemented shared-element transition for Courses list -> Course detail title:
  - source: `app/courses/ui/courses-components.tsx`
  - target: `app/courses/ui/course-detail-page.tsx`
  - shared name pattern: `course-title-${course.id}`
  - shared behavior: `share="auto"` with `default="none"`
- Added hierarchical directional transition typing for course navigation flow:
  - list -> detail links use `transitionTypes={["nav-forward"]}`
  - detail -> list links use `transitionTypes={["nav-back"]}`
  - includes both header back control and course-not-found fallback back link in course detail page
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### View Transitions Phase 3 implementation (2026-04-03)

- Implemented Suspense reveal transitions for overview streamed regions using React `ViewTransition` wrappers with explicit opt-in behavior:
  - `app/(dashboard)/overview/page.tsx`
    - top-level insights Suspense boundary now wraps fallback with `exit="auto"`
    - streamed insights content now wraps with `enter="auto"` and `default="none"`
  - `app/overview/ui/overview-insights-client.tsx`
    - chart Suspense boundaries (daily study time, daily mood, understanding progress) now use fallback/content ViewTransition wrappers
    - each fallback wrapper uses `exit="auto"`
    - each chart content wrapper uses `enter="auto"` with `default="none"`
- This phase intentionally avoided layout-level VT wrapping and avoided custom CSS class recipes; it uses browser-default transition behavior while retaining explicit trigger control.
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Caching skills + dashboard instant plan spec (2026-04-03)

- Skill registry update in `spec/agent-skills.md` now includes:
  - `next-cache-components`
  - `tanstack-query-best-practices`
  - `redis-development`
- Added architecture/rollout spec for making dashboard navigation feel instant:
  - `spec/dashboard-instant-navigation-plan-2026-04-03.md`
- Plan direction in brief:
  - recommended stack is Next Cache Components + TanStack Query (with Redis only at a later decision gate if shared cache requirements justify it)
  - phased rollout starts with `/courses` cache components + tag invalidation, then expands route-by-route

### Dashboard instant plan start (2026-04-03)

- Began Phase 1 execution on courses routes and validated behavior under production build.
- Implemented safe groundwork that remains active:
  - extracted initial courses read logic into helper in `app/(dashboard)/courses/page.tsx`
  - extracted initial course-detail read logic into helper in `app/(dashboard)/courses/[id]/page.tsx`
  - added cache-tag invalidation hooks on course mutations in `app/courses/ui/courses-actions.ts` via `updateTag(...)` for:
    - `courses:user:{userId}`
    - `course:{courseId}`
    - `course-notes:{courseId}`
  - wrapped root route children in `app/layout.tsx` with a Suspense boundary (fallback `null`) to support later streaming/caching rollout shape
- Cache Components flag trial result:
  - enabling `cacheComponents: true` currently triggers blocking-route build errors on dynamic dashboard routes (notably `/courses/[id]`) due uncached data outside Suspense boundaries
  - flag was intentionally reverted to keep production build stable while we prepare full Suspense/runtime-access migration for Cache Components adoption
- Validation after stabilization:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan continuation (2026-04-03)

- Started TanStack Query warmth layer rollout on Courses.
- Added app-wide QueryClient provider:
  - `components/query-provider.tsx`
  - wired in `app/layout.tsx` so client routes share a persistent query cache
- Migrated courses list client fetching to TanStack Query in:
  - `app/courses/ui/courses-page.tsx`
- Behavior changes in Courses page:
  - page/filter data now uses query keys (`courses-page`, user, page, pageSize, sort, topic)
  - `keepPreviousData` is used to avoid abrupt empty/skeleton-like transitions while fetching next state
  - next-page prefetching is enabled to improve pagination responsiveness
  - create/update/delete flows now invalidate course-page queries via QueryClient instead of directly re-running ad-hoc loaders
- Existing course mutation `updateTag(...)` invalidation in server actions remains in place for server-side cache consistency foundations.
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan tracking update (2026-04-03)

- Expanded `spec/dashboard-instant-navigation-plan-2026-04-03.md` with execution tracking and rollout governance details:
  - added explicit `Phase 0 Baseline Snapshot` tables (route latency/skeleton/query baselines + mutation freshness matrix)
  - added `Cache Components Readiness Checklist` with route-by-route and build-verification gates
  - updated status sections to reflect active in-progress streams (Cache Components unblock work and upcoming Notes TanStack migration)

### Dashboard instant plan continuation: Notes TanStack slice (2026-04-03)

- Migrated Notes route client data layer to TanStack Query:
  - `app/notes/ui/notes-page.tsx`
  - replaced local list/course state hydration with query-backed sources (`notes-list`, `note-courses`)
  - kept existing UI filtering/sorting/pagination behavior unchanged while moving cache ownership to QueryClient
  - wired live note upserts and create/update/delete flows to update query cache and invalidate Notes list queries
- Added Notes list/query server actions for Query usage:
  - `app/notes/ui/notes-actions.ts`
  - `getNotesList({ userId })` for lightweight list payload
  - `getNoteCourses({ userId })` for note course filter options
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan continuation: Review TanStack sessions slice (2026-04-03)

- Migrated Review sessions pagination from manual loading state to TanStack Query in `app/review/ui/review-page.tsx`.
- Behavior updates:
  - sessions page data now uses query keys (`review-sessions-page`, user, page, pageSize)
  - `keepPreviousData` preserves prior page content during page transitions
  - next-page prefetching added for faster pagination advances
  - save/delete session flows now invalidate Review sessions queries through QueryClient
- Existing review session setup/detail logic and lazy note-detail hydration were preserved.
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan continuation: Daily Entries TanStack slice (2026-04-03)

- Migrated Daily Entries pagination/filter loading from manual async state to TanStack Query in `app/daily-entries/ui/daily-entries-page.tsx`.
- Behavior updates:
  - query-keyed entries data by user/page/pageSize/date range/mood filter
  - `keepPreviousData` enabled for smoother page/filter transitions
  - next-page prefetching added for pagination responsiveness
  - create/update/delete flows now invalidate daily entries queries via QueryClient
  - live entry upserts now update query cache directly
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan continuation: Overview TanStack fit + cache readiness audit (2026-04-03)

- Reviewed Overview route/client tree for practical TanStack migration surface.
- Finding: current Overview data path is server-streamed (`app/(dashboard)/overview/page.tsx` + `app/overview/overview-data.ts`) with client chart components receiving preloaded props; no low-risk client fetch/mutation surface identified for TanStack without broader architecture changes.
- Advanced cache-components readiness checklist by enumerating request-time API usage for dashboard scope:
  - no direct `cookies()`/`headers()`/`searchParams` usage in `app/(dashboard)/**`
  - runtime request API access for dashboard auth remains centralized in `lib/dashboard-session.ts` via `lib/supabase/server.ts` (`cookies()`)

### Dashboard navigation flash reduction (2026-04-03)

- User-reported issue: skeleton still visible while moving page-to-page in dashboard.
- Implemented non-visual segment fallbacks (return `null`) for dashboard loading boundaries to keep transitions from flashing placeholder UIs:
  - `app/(dashboard)/notes/loading.tsx`
  - `app/(dashboard)/courses/loading.tsx`
  - `app/(dashboard)/courses/[id]/loading.tsx`
  - `app/(dashboard)/daily-entries/loading.tsx`
  - `app/(dashboard)/review/loading.tsx`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard seamless transition follow-up (2026-04-03)

- User goal: no skeleton and no blank page between dashboard routes; transitions should feel like the same surface.
- Implemented:
  - removed dashboard segment loading boundaries entirely (`app/(dashboard)/**/loading.tsx` files for notes/courses/course-detail/daily-entries/review)
  - added proactive route warming in dock navigation (`components/ui/floating-dock.tsx`):
    - eager prefetch of dashboard routes after mount
    - prefetch on hover/focus/touch before click
- Outcome intent:
  - avoid fallback swaps (skeleton or blank) during route transitions
  - increase chance target route data/flight payload is ready before click
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard transition consistency + dock isolation (2026-04-03)

- User feedback: transition behavior was mostly visible on Overview; floating dock was also being affected by transitions.
- Implemented:
  - page-level `ViewTransition` wrappers added in dashboard route pages:
    - `app/(dashboard)/notes/page.tsx`
    - `app/(dashboard)/courses/page.tsx`
    - `app/(dashboard)/courses/[id]/page.tsx`
    - `app/(dashboard)/daily-entries/page.tsx`
    - `app/(dashboard)/review/page.tsx`
  - floating dock explicitly excluded from view-transition snapshots using `viewTransitionName: "none"` on dock containers in `components/ui/floating-dock.tsx`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Overview transition tuning from design-skill audit (2026-04-03)

- User-reported issue: on Overview, floating dock briefly disappeared/reappeared during transitions.
- Skill-driven adjustment rationale:
  - `vercel-react-view-transitions`: avoid unnecessary nested transitions; each transition should communicate clear continuity
  - `make-interfaces-feel-better` and `emil-design-eng`: reduce high-frequency motion noise and prevent UI chrome from feeling unstable
- Implemented:
  - removed nested `ViewTransition` wrappers from `app/overview/ui/overview-insights-client.tsx` suspense/chart regions
  - added a single route-level `ViewTransition` wrapper to `app/(dashboard)/overview/page.tsx` for parity with other dashboard routes
  - hardened dock isolation by using named transition snapshots (`dashboard-dock`) in `components/ui/floating-dock.tsx` and disabling their animation in `app/globals.css`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Overview boundary transition hardening (2026-04-03)

- Follow-up from user testing: dock flicker still occurred when navigating to/from Overview.
- Applied targeted guardrails:
  - `components/ui/floating-dock.tsx`: transition types are now disabled on dock links when the current route is `/overview` or target route is `/overview`
  - `app/(dashboard)/overview/page.tsx`: removed page-level `ViewTransition` wrapper for `/overview` boundary
- Design-skill rationale:
  - for high-frequency dashboard tab navigation, stable continuity is preferred over motion on problematic boundaries
  - if an animation undermines perceived reliability, remove it for that path
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes

### Dashboard instant plan memory refresh (2026-04-03)

- Refreshed `spec/dashboard-instant-navigation-plan-2026-04-03.md` status/next-slice sections to match current execution state.
- Key refresh points:
  - marked TanStack rollout as effectively complete for interactive list routes (`/courses`, `/notes`, `/review`, `/daily-entries`)
  - kept Overview as an intentionally deferred TanStack target due server-streamed architecture
  - removed stale next-step item about migrating Notes (already completed)
  - updated immediate next steps to focus on mutation freshness QA + true pre/post metric delta capture

### Dashboard baseline timing capture (2026-04-03)

- Captured local route timing snapshot for dashboard routes with dev server running on localhost (`n=12` requests per route via `Invoke-WebRequest`).
- Updated `spec/dashboard-instant-navigation-plan-2026-04-03.md` route baseline table with measured `p50`/`p95` values and current route-level skeleton status.
- Current state notes:
  - route-level loading skeleton exposure is now `N` across dashboard routes after loading-boundary removal
  - `/overview` may still show streamed insights fallback (non route-level)
  - true baseline-vs-trial delta remains pending because pre-rollout timing capture was not recorded before rollout changes

### Dashboard metrics validity + telemetry follow-up (2026-04-03)

- Added opt-in route telemetry in `lib/dashboard-route-perf.ts`:
  - enabled by `ROOTLY_DASHBOARD_PERF_LOG=1`
  - emits `[dashboard-perf]` JSON with `route`, `totalMs`, `stepCount`, and per-step timings/metadata
- Validation finding for CLI baseline runs:
  - terminal `Invoke-WebRequest` probes to protected dashboard routes resolve to login content in the current CLI session, so those timings are not valid authenticated dashboard baselines
  - plan updated to mark those rows as auth-pending and exclude redirect-biased values
- Authenticated telemetry evidence captured:
  - `/courses` emitted `[dashboard-perf]` sample: `totalMs=1039.75`, `stepCount=2` (`session`, `courses-query`)
- Cache-hit header finding:
  - `x-nextjs-cache` was not present in current dev-mode CLI probes, so cache behavior should be evaluated through dashboard-perf logs + authenticated browser sampling
- Mutation freshness matrix update:
  - note create/update/delete rows were moved from `TBD` to implementation-verified (`Yes/No/Low`) based on optimistic client cache updates plus server `updateTag` invalidation wiring

### Authenticated telemetry aggregation update (2026-04-03)

- Ingested user-provided authenticated `[dashboard-perf]` run logs into `spec/dashboard-instant-navigation-plan-2026-04-03.md` as `baseline-004`.
- Filled authenticated p50/p95 route baselines for:
  - `/overview` (`n=9`) -> p50 `314.78`, p95 `329.33`
  - `/notes` (`n=10`) -> p50 `299.65`, p95 `311.94`
  - `/courses` (`n=10`) -> p50 `196.35`, p95 `217.46`
  - `/daily-entries` (`n=10`) -> p50 `189.87`, p95 `206.03`
  - `/review` (`n=10`) -> p50 `211.25`, p95 `423.39` (heavy-tail spikes)
- Remaining route gap:
  - `/courses/[id]` authenticated sample set still missing (`n>=10` target)
- Added known issue note from telemetry run:
  - repeated Recharts container warnings on `/overview` (`width(-1)`, `height(-1)`) are now tracked as a separate follow-up item

### Overview Recharts sizing hardening (2026-04-03)

- Implemented a targeted sizing fix to reduce Recharts container warnings on `/overview`:
  - `app/overview/ui/overview-insights-client.tsx`
    - added `min-w-0` constraints to `ChartFrame` wrappers
  - `app/overview/ui/charts/chart-responsive-shell.tsx`
    - added shared measured-size shell (ResizeObserver) so charts only render after valid container width is available
  - `app/overview/ui/charts/daily-study-time-chart.tsx`
  - `app/overview/ui/charts/daily-mood-chart.tsx`
  - `app/overview/ui/charts/understanding-progress-chart.tsx`
    - switched from `ResponsiveContainer` to explicit numeric `width`/`height` passed into Recharts primitives via measured shell
    - retained wrapper `min-w-0` constraints
- Validation:
  - `pnpm lint` passes
- Follow-up still needed:
  - rerun authenticated overview navigation loop to confirm warnings are fully eliminated in runtime logs

### Cache Components blocker resolution milestone (2026-04-03)

- Loaded and applied `next-cache-components` guidance, then executed a debug-prerender trial with `cacheComponents: true`.
- Captured blocker traces and resolved primary failures:
  - `DashboardColorThemeStyle` cookie access in root layout caused blocking-route errors under Cache Components; fixed by wrapping it in `Suspense` in `app/layout.tsx`.
  - `/overview` used `new Date()` before request/uncached data access; fixed by moving current-time reads after session resolution in `app/(dashboard)/overview/page.tsx`.
- Validation:
  - `pnpm exec next build --debug-prerender` passes
  - `pnpm lint` passes
  - `pnpm run build` passes with Cache Components enabled
- Outcome:
  - Cache Components is now enabled in `next.config.mjs` and stable in the current build pipeline.

### Phase 2 invalidation parity expansion (2026-04-03)

- Added mutation invalidation parity beyond courses:
  - `app/notes/ui/notes-actions.ts`
    - `createNote`/`updateNote`/`deleteNote` now update: `notes:user:{userId}`, `overview-summary:user:{userId}`, `overview-trend:user:{userId}`, and related `course:{courseId}` / `course-notes:{courseId}` when applicable
  - `app/daily-entries/ui/daily-entries-actions.ts`
    - `createEntry`/`updateEntry`/`deleteEntry` now update: `daily-entries:user:{userId}`, `overview-summary:user:{userId}`, `overview-trend:user:{userId}`
  - `app/review/ui/review-actions.ts`
    - `saveReviewSession`/`deleteReviewSession` now update: `review-sessions:user:{userId}`, `overview-summary:user:{userId}`, `overview-trend:user:{userId}`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes (with Cache Components enabled)

### Phase 2 read-side cache metadata expansion (2026-04-03)

- Added explicit read-side cache directives/lifetimes/tags for non-course dashboard domains:
  - `app/notes/ui/notes-actions.ts`
    - `getNote`, `getNotes`, `getNotesList`, `getNoteCourses` now use cache directives with `cacheLife("minutes")` and domain tags (`notes:user:*`, `courses:user:*`)
  - `app/daily-entries/ui/daily-entries-actions.ts`
    - `getDailyEntriesPage` now uses cache directives with `cacheLife("minutes")` and `daily-entries:user:*` tag
  - `app/review/ui/review-actions.ts`
    - `getReviewSessionsPage`, `getReviewNotes` now use cache directives with `cacheLife("minutes")` and domain tags (`review-sessions:user:*`, `notes:user:*`)
  - `app/overview/overview-data.ts`
    - overview daily/trend/summary read functions now declare cache directives with `cacheLife("minutes")` and tags for `overview-summary:*`, `overview-trend:*`, and `daily-entries:*` domains
- Extended read-side cache metadata coverage to course domains:
  - `app/courses/ui/courses-actions.ts`
    - `getCoursesPage` and `getCourseTopics` now use cache directives with `cacheLife("minutes")` and `courses:user:*` tag
  - `app/(dashboard)/courses/page.tsx`
    - `getInitialCoursesData` now uses cache directives with `cacheLife("minutes")` and `courses:user:*` tag
  - `app/(dashboard)/courses/[id]/page.tsx`
    - `getInitialCourseDetailData` now uses cache directives with `cacheLife("minutes")` and tags: `course:*`, `course-notes:*`
- Extended cache metadata to route-entry initial data helpers for non-course dashboard routes:
  - `app/(dashboard)/notes/page.tsx`
    - introduced cached private `getInitialNotesData(userId)` helper with tags: `notes:user:*`, `courses:user:*`
  - `app/(dashboard)/daily-entries/page.tsx`
    - introduced cached private `getInitialDailyEntriesData(userId)` helper with tag: `daily-entries:user:*`
  - `app/(dashboard)/review/page.tsx`
    - introduced cached private `getInitialReviewData(userId)` helper with tags: `review-sessions:user:*`, `courses:user:*`, `notes:user:*`
- Validation:
  - `pnpm lint` passes
  - `pnpm run build` passes (Cache Components still enabled)

### Sound-on-click system implementation (2026-04-03)

- Implemented the full dashboard sound interaction spec from `spec/add-click-sound.md`.
- Added a shared audio preferences context in `components/theme-provider.tsx` with persisted mute state (`portfolio-audio-muted`).
- Added global click-capture playback with interactive-target filtering and opt-out support via `data-click-sound="off"`.
- Added keyboard theme-toggle sound behavior in ThemeProvider (`D` hotkey) with mute guard.
- Added explicit mute controls to both desktop and mobile account surfaces in `app/ui/dashboard-shell.tsx`; the floating dock no longer carries theme or sound controls.
- Added mute controls to both desktop and mobile account surfaces in `app/ui/dashboard-shell.tsx`.
- Audio engine and hook lint hardening completed by switching `onended` assignment to `addEventListener("ended", ...)` in:
  - `lib/audio/sound-engine.ts`
  - `hooks/use-sound.ts`
- Validation:
  - `pnpm lint` passes

### Floating dock visual refresh (2026-04-03)

- Refined `components/ui/floating-dock.tsx` to use a calmer coss-aligned visual treatment.
- Changes made:
  - route labels are now always visible on both desktop and mobile dock items
  - removed the hover proximity zoom/enlarge behavior from the desktop dock
  - changed dock items from circular/extra-rounded treatments to default-radius surfaces using `rounded-lg`
  - changed the dock shell from oversized rounded styling to the same default-radius `rounded-lg` treatment
  - preserved route prefetching and existing view-transition guardrails while simplifying the dock structure
- Validation note:
  - local shell did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Floating dock optical alignment refinement (2026-04-03)

- Loaded design-focused skills for the dock refinement pass:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `userinterface-wiki`
- Applied a second dock polish pass in `components/ui/floating-dock.tsx`:
  - reduced overall dock visual size (smaller shell padding, tighter gaps, smaller icon/text sizing, shorter button height)
  - adjusted shell/button corner relationship toward a concentric-radius treatment so the shell and buttons feel optically aligned rather than equally pill-shaped
  - made inactive buttons quieter by using transparent surfaces until hover, reducing visual bulk
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Dashboard bottom-stack symmetry pass (2026-04-03)

- Unified floating dock, pagination dock, and dashboard content bottom clearance around shared spacing tokens in `app/globals.css`.
- New layout model:
  - bottom edge -> shared gap -> floating dock -> shared gap -> pagination dock -> shared gap -> page content
- Updated:
  - `components/ui/floating-dock.tsx`
    - dock now uses shared mobile/desktop bottom offsets instead of ad-hoc `mb-*` spacing
    - mobile dock is now icon-only
  - `app/ui/dashboard-pagination-dock.tsx`
    - pagination dock now sits above the floating dock using the same shared spacing system
    - pagination shell/buttons now use the same calmer radius family as the dock
  - `app/ui/dashboard-shell.tsx`
    - main content bottom padding now reserves space using the same shared stack math
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Dashboard bottom-stack spacing correction (2026-04-03)

- Follow-up after visual review: the first shared-gap value made the floating dock sit too close to the screen edge, so the stack did not feel symmetric in practice.
- Adjusted `app/globals.css` shared bottom-stack gaps from `0.75rem` to `1.25rem` on both mobile and desktop so the edge/dock, dock/pagination, and pagination/content intervals read more evenly.

### Homepage extension marketing update (2026-04-03)

- Updated the homepage hero CTA in `app/(marketing)/ui/homepage-hero.tsx`:
  - replaced `See how it works` with `Download Extension`
  - CTA now opens a reusable install dialog instead of scrolling
- Added reusable homepage extension install dialog:
  - `app/(marketing)/ui/homepage-extension-dialog.tsx`
  - dialog includes Chrome unpacked-install instructions and the provided Google Drive download URL
- Added a new extension highlight section after `How it works`:
  - `app/(marketing)/ui/homepage-extension-highlight.tsx`
  - showcases the side-panel extension value proposition, a side-panel-style marketing mock, and key benefits
- Wired the new section into the landing page in `app/(marketing)/page.tsx`
- Source of product/UX direction for homepage extension messaging remained `spec/browser-extension-side-panel.md`
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension marketing refinement (2026-04-03)

- Loaded design-focused skills for a tighter homepage pass:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `userinterface-wiki`
- Refined `app/(marketing)/ui/homepage-extension-highlight.tsx` toward a more compact delivery style:
  - removed the `Browser extension` badge
  - removed the separate feature-card row
  - replaced the previous looser mock with a more accurate docs-page browser shell plus side-panel composition
  - the browser side now shows a highlighted excerpt to communicate “extracting from the page” more directly
  - kept benefits concise and folded them into the section instead of spending a full extra row on them
- Reworked `app/(marketing)/ui/homepage-hero-surface.tsx` to be more visual and less text-heavy:
  - simplified the `Before Rootly` and `With Rootly` halves into compact visual states
  - reduced explanatory copy density so the hero surface reads faster and feels less skippable
  - kept the `With Rootly` story aligned with the dashboard + extension system rather than only the website
- Follow-up visual cleanup from user review:
  - removed redundant `Side panel note` copy from the hero surface
  - tightened outer-shell padding on both `homepage-hero-surface.tsx` and `homepage-extension-highlight.tsx`
  - made the hero card halves more symmetrical by tightening and normalizing header height/copy
  - refined the extension browser shell to feel more like a real modern docs page:
    - more compact browser chrome
    - removed unnecessary bottom badges
    - increased excerpt line-height so the marker-style highlight reads cleanly
  - simplified the extension panel header by removing redundant label/description copy and keeping the section itself responsible for the broader explanation
  - removed the trailing separator-line feature list below the extension mock
  - increased section top rhythm so the extension section stands as an independent section instead of a follow-up block
  - normalized section heading/subheading emphasis across marketing sections by increasing section-title scale and supporting-copy scale in:
    - `app/(marketing)/ui/homepage-how-it-works.tsx`
    - `app/(marketing)/ui/homepage-extension-highlight.tsx`
    - `app/(marketing)/ui/homepage-final-cta.tsx`
  - cleaned the extension panel header further by removing redundant `Capture` and `Side panel` labels
  - refined browser chrome further by removing the URL-pill background and slightly enlarging the traffic-light dots
  - removed the leftover side-panel icon from the extension mock header for a cleaner panel surface
  - softened hero/extension surface backgrounds so they align better with the calmer `How it works` card treatment instead of reading as heavy dark blocks
  - follow-up softness pass: reduced the visual weight of the code-example panel and adjacent extension sub-cards so no single panel reads as a heavy dark patch
  - second follow-up softness pass: reduced the remaining inner-card fill strength in both `homepage-hero-surface.tsx` and `homepage-extension-highlight.tsx` so the surface cards and panel cards no longer stand out as darker blocks

### Homepage hero simplification pass (2026-04-03)

- Loaded the same design/UI guidance for this continuation:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `chrome-extension-ui`
  - `userinterface-wiki`
- Updated `app/(marketing)/ui/homepage-hero.tsx` to remove the separate hero surface area entirely so the page now flows directly from the hero into `How it works`.
- Hero messaging was rewritten to carry more of the product story on its own:
  - heading now emphasizes studying from the current page without losing continuity
  - subheading now makes Rootly's purpose clearer by connecting capture, study-time tracking, later review, and the side-panel-first workflow
- Removed the previous hero text width constraint so the hero copy can use the section width more naturally.
- Reduced hero bottom spacing slightly to keep the transition into `How it works` compact after removing the visual surface.
- Deleted the now-unused file `app/(marketing)/ui/homepage-hero-surface.tsx`.
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension mock unification pass (2026-04-03)

- Continued using the active UI/design skill set for the homepage marketing refinement:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `chrome-extension-ui`
  - `userinterface-wiki`
- Updated `app/(marketing)/ui/homepage-extension-highlight.tsx` so the extension marketing visual now lives inside a single browser-window mock instead of two side-by-side cards.
- The extension section composition now communicates:
  - the docs/tutorial website remains visible in the main browser content area
  - the Rootly side panel is open inside the same browser window
  - Rootly is “beside the page while you study,” not a detached second surface
- Visual adjustments made inside the unified mock:
  - browser chrome now wraps both the page and the panel together
  - the page side keeps the highlighted excerpt and code block as the study source
  - the right side is now rendered as an in-window sidebar/panel with its own compact Rootly header and capture/timer/daily-state cards
  - panel and page surfaces were softened and tightened so the split reads as one believable browser context rather than a decorative two-card layout
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension mock polish pass (2026-04-03)

- Continued with the required design/UI skills:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `chrome-extension-ui`
  - `userinterface-wiki`
- Refined `app/(marketing)/ui/homepage-extension-highlight.tsx` after visual review:
  - removed the background-pill treatment behind the URL so the shell chrome reads more naturally
  - removed the `Rootly panel open` helper text from the browser chrome
  - removed the staged/cliche page callout copy (`This is the exact kind of...`)
  - simplified the side-panel edge treatment by removing the extra inset left-edge effect that was making the divider feel wrong
  - tightened radius relationships across the browser content area, side panel, and inner cards so the roundness feels more optically consistent
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension optical alignment refinement (2026-04-03)

- Continued using the required homepage UI skill stack:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `chrome-extension-ui`
  - `userinterface-wiki`
- Refined `app/(marketing)/ui/homepage-extension-highlight.tsx` so the docs area and side panel now sit inside one joined inner frame instead of behaving like two separate rounded cards touching each other.
- Key visual changes:
  - reduced the shell inset padding from `8px` to a tighter interior spacing
  - removed the `React docs` badge
  - changed `SIDE PANEL` treatment from a capsule/badge feel to plain supporting text
  - replaced the split-card bottom-corner behavior with a single shared rounded interior frame plus a clean divider so the meeting edge feels optically aligned
  - tightened small supporting copy in the panel (`Capture while you keep reading`, `Adds to today's study time`, `Today`) so labels support the layout without cluttering it
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension corner-alignment correction (2026-04-03)

- Corrected an interpretation mistake in `app/(marketing)/ui/homepage-extension-highlight.tsx`:
  - the page surface and side panel should remain independent rounded surfaces inside the browser window
  - the optical-alignment request was specifically about the outer browser bottom corners relative to the page bottom-left and panel bottom-right corners
- Updated the mock accordingly:
  - removed the mistakenly joined shared inner frame
  - restored separate rounded page and panel surfaces
  - kept the tighter shell inset spacing
  - tuned the radius sizes and inter-surface gap so the bottom corners read more concentric with the outer browser shell rather than looking fused or misaligned
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension spacing balance pass (2026-04-03)

- Continued the homepage refinement with the active design skill set:
  - `coss`
  - `make-interfaces-feel-better`
  - `emil-design-eng`
  - `chrome-extension-ui`
  - `userinterface-wiki`
- Rebalanced spacing in `app/(marketing)/ui/homepage-extension-highlight.tsx` so the outer browser shell inset and the inner page/panel padding no longer feel mismatched.
- Adjustments:
  - slightly reduced the docs-surface interior padding
  - slightly reduced the docs text section top spacing
  - slightly increased the side-panel header/content insets
  - kept the shell itself tight while making the inner surfaces feel intentionally dense rather than uneven
- Goal of the pass:
  - equalize the spacing rhythm across shell and inner surfaces without making the mock feel cheap, roomy, or boxy
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension spacing correction (2026-04-03)

- Follow-up after user review: the earlier spacing pass still left the browser shell too tight relative to the panel interior, especially in the side-panel content wrapper and nested cards.
- Corrected `app/(marketing)/ui/homepage-extension-highlight.tsx` by:
  - increasing the browser shell inset and inter-surface gap from `p-1/gap-1` to `p-2/gap-2`
  - reducing the docs surface padding from `p-3.5` to `p-3`
  - reducing panel header insets from `px-3.5 py-3` to `px-3 py-2.5`
  - reducing panel body padding and nested card padding from `3.5/3` down to `3/2.5`
  - tightening internal vertical spacing in the panel cards (`pt-3` -> `pt-2.5`, `pt-2` -> `pt-1.5`)
- Result intent:
  - the shell should no longer feel visually starved while the panel burns more space than the surrounding frame
  - all three levels (shell, main surfaces, nested cards) now sit in a more coherent compact rhythm
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage extension panel-header simplification (2026-04-03)

- Further refined `app/(marketing)/ui/homepage-extension-highlight.tsx` so the mock side-panel header is now part of the panel body instead of being separated by its own tinted band and divider.
- New treatment:
  - quiet inline top row inside the panel content
  - `Rootly` and supporting copy on the left
  - `Side panel` as plain supporting text on the right
- Rationale:
  - reduces visual segmentation in the already compact panel
  - makes the panel feel more believable and less decorative
  - aligns better with the homepage direction of compact delivery and minimal fuzz
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage hero mock promotion (2026-04-03)

- Promoted the refined browser-extension mock into the hero:
  - `app/(marketing)/ui/homepage-hero.tsx` now renders the browser-and-side-panel mock directly under the hero CTA row
  - `app/(marketing)/ui/homepage-extension-highlight.tsx` now exports `BrowserWindowMock` for reuse
- Rewrote the hero messaging to be more explicit and less vague:
  - heading now states the concrete promise: capture study notes and track study time without leaving the page
  - subheading now describes Rootly directly as a learning notebook for self-taught developers and names the core behaviors: saving notes from docs/tutorials, running a study timer in the browser side panel, and keeping daily progress in one place
- Removed the now-duplicative standalone extension section from `app/(marketing)/page.tsx` so the homepage does not repeat the same browser+panel story twice.
- Resulting homepage flow is now:
  - hero with direct product copy + mock
  - `How it works`
  - final CTA
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage section-spacing normalization (2026-04-03)

- Fixed inconsistent vertical spacing across the marketing homepage sections.
- Root cause:
  - the hero was still contributing bottom padding while the following sections (`How it works`, final CTA) were also spacing themselves from the top, which made the hero-to-next-section gap larger than the rest of the page
- Updated:
  - `app/(marketing)/ui/homepage-hero.tsx`
    - removed hero bottom padding so section rhythm is no longer doubled at the first boundary
- Current spacing model:
  - hero owns the top offset from the nav
  - subsequent sections own the spacing before themselves via their top padding
  - this keeps section gaps more consistent and avoids duplicate padding contributing to one boundary
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage hero copy + carousel motion refinement (2026-04-03)

- Adjusted `app/(marketing)/ui/homepage-hero.tsx` so the hero heading no longer focuses too narrowly on the “without leaving the page” angle.
- New hero messaging emphasis:
  - heading now sells the broader product promise: saving what you learn from docs and tutorials in one place
  - supporting copy still names the side-panel behavior, but only as one concrete part of the wider Rootly workflow (notes, study time, review)
- Updated `app/(marketing)/ui/homepage-how-it-works.tsx` to remove swipe-triggered reveal animation from the horizontal carousel cards:
  - replaced per-card `Reveal` wrappers with plain container divs
  - section heading, supporting copy, and arrow controls still use reveal on page entry
  - carousel cards themselves no longer animate in as they enter the horizontal viewport during swipe/scroll
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage carousel mount-animation correction (2026-04-03)

- Follow-up after behavior review: the previous change removed `Reveal` from the `How it works` cards entirely, which made page-load motion inconsistent with the rest of the homepage.
- Updated `app/(marketing)/ui/homepage-how-it-works.tsx` so each carousel card now uses `Reveal mode="mount"` with light stagger delays.
- Resulting behavior:
  - cards animate once on page load when the section renders
  - cards do not re-trigger reveal animation while swiping horizontally through the carousel
  - section intro and cards now feel consistent on initial load without adding swipe-linked motion noise
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Claude Blue theme token replacement (2026-04-03)

- Updated `lib/themes.ts` to replace the `claude-blue` custom theme color tokens with the new palette provided by the user.
- Scope of this replacement:
  - applied to the semantic color-token set stored in the custom theme registry (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, charts, sidebar tokens, and dark equivalents)
  - kept the theme id as `claude-blue`, so existing default-theme behavior in `lib/color-theme.ts` remains unchanged
- Important implementation note:
  - the provided snippet also included non-color CSS tokens such as fonts, radius, shadows, and spacing, but `lib/themes.ts` only stores color tokens for custom dashboard themes, so those global non-color values were not applied in this pass
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal

### Homepage mock browser-chrome compaction (2026-04-03)

- Refined `app/(marketing)/ui/homepage-extension-highlight.tsx` to make the browser top bar slightly more compact.
- Changes:
  - reduced the top-bar vertical padding from `py-2.5` to `py-2`
  - reduced the URL row inner vertical padding from `py-1` to `py-0.5`
- Intent:
  - keep the browser chrome believable while making it feel a little shorter and less visually tall above the mock content
- Validation note:
  - local shell still did not have `pnpm` available during this edit session, so lint/build were not rerun from this terminal
