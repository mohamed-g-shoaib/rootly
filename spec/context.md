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
- extension environment selection is now explicit and stored locally rather than inferred from browser tab state
- timer state now has a first background-worker foundation using `chrome.storage.local`
- timer currently supports start, pause, resume, stop, and reset inside the extension foundation
- the side panel now updates the running timer display locally instead of message-polling the background worker every second
- side panel now supports quick note capture in website-faithful `Q&A` and `Freeform` modes
- side panel now supports quick course creation with the same Rootly course meaning as the website
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
- side panel timer can now save paused timer time into today's `daily_entries`
- timer save copy now makes the integer-minute save behavior explicit by telling the user exactly how much time will be added to today before they save
- daily-log and timer drafts now treat today's current daily entry as the baseline so saved mood/note values do not linger as fake unsaved drafts
- current implementation only allows timer save once at least 1 minute has elapsed, avoiding hidden sub-minute rounding behavior
- timer now supports an explicit `stop` action in addition to start, pause, resume, and reset
- the timer save panel now includes its own mood and quick-note inputs so ending a study session does not depend on the separate daily-log card
- timer saves still write into the same daily-entry model and update today's visible mood, note, and accumulated time
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










