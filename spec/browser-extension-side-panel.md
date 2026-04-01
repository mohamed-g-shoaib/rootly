# Rootly Browser Extension Side Panel

## Goal

Build a Rootly browser extension that acts as a fast companion to the website while the user is actively studying.

The extension is not a standalone product. It is a compact bridge into Rootly for quick capture and quick logging during real browsing sessions.

The v1 extension should prioritize:

1. quick note capture
2. quick course creation
3. quick daily study logging
4. a background study timer that saves into `daily_entries`

---

## Product Positioning

Rootly on the web remains the full product.

The extension exists to reduce friction in moments like:

- reading documentation
- watching a tutorial
- following a course lesson
- wanting to log study time without opening the full app
- wanting to save a note without losing browsing context

The extension should feel like a study companion, not a mini dashboard.

That means:

- fewer fields
- fewer decisions
- faster startup
- strong defaults
- easy handoff back to the website for deeper work

## Core Product Principle

The extension must not invent a second Rootly product logic.

It should:

- reuse the website's existing data models and behavioral rules
- preserve the same user mental model as the website
- simplify capture and presentation without changing underlying Rootly meaning

It should not:

- create extension-only rules that contradict the website
- behave like a separate product with its own tracking logic
- trade product fidelity for convenience in ways that confuse users

In practice, this means the extension is allowed to be smaller, faster, and more compact, but not different in meaning.

---

## Primary Surface

## Decision

Use a **side panel** as the sole primary extension surface.

Do not ship a separate popup as a parallel main experience.

## Why

Rootly's extension workflows are not one-click actions. They involve:

- writing notes while still referencing the current page
- selecting a course while browsing
- keeping a timer visible during study
- returning to the extension repeatedly during a session

A popup works poorly for this because it closes whenever the user clicks back into the page.

A side panel is a better fit because it:

- stays open while the user browses
- supports note capture without repeated reopening
- makes timer state easier to monitor
- feels like a companion surface rather than a detached launcher

## Toolbar behavior

Clicking the Rootly toolbar action should open or focus the Rootly side panel.

There should not be a second main popup UI with separate navigation or separate workflows.

---

## Core v1 Use Cases

### 1. Quick note

The user can create a note while browsing.

Supported note types:

- `Q&A`
- `Freeform`

The user should be able to:

- choose the note type
- attach the note to an existing course
- create the note quickly with minimal required fields

### 2. Quick course creation

If the relevant course does not exist yet, the user should be able to create it from the extension without leaving the panel.

### 3. Quick daily study logging

The user should be able to log study time, mood, and an optional short note quickly from the panel.

### 4. Background timer

The user should be able to:

- start a timer
- pause it
- resume it
- stop it

The timer display format should be:

- `HH:MM:SS`

On pause or stop, the user should be able to save the session with:

- duration
- mood
- quick note

Timer saves should write directly into `daily_entries`.

---

## Non-Goals For v1

The extension should not attempt to reproduce the full website.

Out of scope for v1:

- full note management
- review sessions
- overview charts
- full course editing
- heavy data tables
- broad in-page overlays
- general productivity utilities unrelated to Rootly study capture

---

## Authentication

## Decision

The extension should follow website authentication by using the website session as the source of truth.

Do not create a separate extension-owned authentication system.

## Auth model

Rootly website auth is currently Supabase-based and server-cookie-backed.

The extension should authenticate by calling Rootly website endpoints with credentialed requests.

The extension should:

1. open the side panel
2. call a Rootly extension bootstrap/session endpoint with `credentials: "include"`
3. treat `200` as authenticated
4. treat `401` as signed out
5. offer a gentle login action that opens the Rootly website login page
6. retry bootstrap after the website login completes

## Signed-out experience

When unauthenticated, the side panel should not feel broken or harsh.

It should show:

- Rootly branding
- a short explanation that the extension works with the Rootly website account
- a single primary button to open login on the website
- optionally a short supporting line explaining that the panel will work once the site session exists

## Auth principles

- website session is the single source of truth
- no duplicate account system inside the extension
- no bearer-token-centric design unless website-cookie auth proves insufficient
- use `401` from extension endpoints as the main signed-out signal

---

## Visual Design

## Goal

The extension should feel native to Rootly.

It should match:

- the current default custom website theme: `claude-blue`
- coss-style roundness
- coss surface treatment
- coss interaction philosophy

## Theme direction

The extension should use the actual `claude-blue` token values from the website theme source as the basis for its visual system.

It should inherit the feel of:

- soft but crisp surfaces
- rounded corners
- quiet borders
- subtle depth
- calm, purposeful states

## Important constraint

Respect coss as a sealed design system.

That means:

- do not directly copy or mutate `components/ui/*` internals as if the extension were the website
- do not invent a totally separate visual identity
- recreate the same design language with extension-appropriate code and tokens

## UI behavior principles

- render instantly with a lightweight shell
- stay calm and non-distracting beside the page
- use clear primary actions
- keep motion minimal and purposeful
- preserve keyboard accessibility and visible focus
- avoid flashy badges, banners, or attention-grabbing effects

---

## Surface Behavior

The side panel should support page-adjacent studying without fighting the page.

## Requirements

- remain useful while the user reads or watches content
- feel responsive across narrow and wide panel widths
- avoid layouts that break when resized
- avoid competing visually with the website content

## Context awareness

The side panel should be capable of showing lightweight page context when useful, such as:

- current tab title
- current URL

This should help the panel feel connected to the current study page.

However, page context should support the capture workflow, not dominate it.

v1 should avoid aggressive page-specific behavior or heavy content-script UI.

---

## Information Architecture

The v1 side panel should stay shallow and easy to scan.

Recommended top-level structure:

1. signed-out state
2. signed-in home
3. note flow
4. course flow
5. daily log flow
6. timer flow

## Signed-in home

The home state should be a compact action hub, not a dashboard.

Suggested sections:

- greeting / account status
- current page context
- quick actions
- timer status

Suggested primary actions:

- New note
- New course
- Log study time
- Start or resume timer

## Note flow

Keep the note form compact.

### Q&A note fields

- course
- question
- answer
- optional quick code snippet area only if justified later

### Freeform note fields

- course
- body

The note flow should optimize for fast completion, not exhaustive metadata entry.

## Course flow

v1 quick course creation should stay minimal:

- title
- optional instructor
- optional course link seeded from current page when relevant

## Daily log flow

v1 daily log should focus on:

- study time
- mood
- optional short note

## Timer flow

The timer area should show:

- current status: idle, running, paused
- current elapsed time in `HH:MM:SS`
- primary action based on state

When pausing or stopping, show a compact save flow for:

- duration
- mood
- optional quick note

---

## Architecture

## Extension shape

Use a modern Manifest V3 extension with:

- side panel UI
- background service worker
- shared local extension storage for lightweight state

Recommended high-level structure:

```text
extension/
  manifest.json
  sidepanel/
    index.html
    main.tsx
  background/
    service-worker.ts
  lib/
    api.ts
    auth.ts
    timer.ts
    storage.ts
    theme.ts
    types.ts
  icons/
```

## Runtime responsibilities

### Side panel

Owns:

- rendering UI
- loading bootstrap data
- submitting quick actions
- displaying timer state

### Background service worker

Owns:

- timer state lifecycle
- persistence of lightweight timer state
- alarms or time reconciliation as needed
- communication with the side panel

## Communication model

Use a clear separation:

- side panel <-> background service worker
- side panel/background <-> Rootly website extension endpoints

---

## Website API Surface

The extension should call dedicated website endpoints.

Do not treat existing server actions as the extension API contract.

Current website mutation files are useful references only:

- `app/notes/ui/notes-actions.ts`
- `app/courses/ui/courses-actions.ts`
- `app/daily-entries/ui/daily-entries-actions.ts`

## Required v1 endpoints

### `GET /api/extension/bootstrap`

Returns the minimum data needed to open the side panel quickly.

Suggested payload:

- auth status
- minimal user identity
- recent or relevant courses for note assignment
- current active timer state if any website-backed state is needed later

If unauthenticated, return `401`.

### `POST /api/extension/notes`

Create a quick note.

### `POST /api/extension/courses`

Create a quick course.

### `POST /api/extension/daily-entries`

Create or update daily study logging entries for:

- quick manual log
- timer save

### Optional support endpoint

If needed later:

- `GET /api/extension/courses` for search or hydration beyond bootstrap

## Endpoint principles

- keep payloads small
- validate server-side
- rely on authenticated website session cookies
- return actionable errors
- use `401` for signed-out state

---

## Daily Entry Behavior

The timer saves directly into `daily_entries`.

## Consequence

There is no separate study-session table in v1 for the extension.

## Expected behavior

- starting a timer does not immediately write to the database
- saving from pause or stop writes the studied duration into the user's daily entry
- quick manual logging and timer logging should both work against the same daily-entry model
- the extension must follow the website's existing daily-entry logic rather than inventing extension-specific session behavior

## Merge rules

Daily entries are **per-day aggregates**.

That means:

- if no entry exists for today, create today's `daily_entries` row
- if an entry already exists for today, add the newly saved duration to the existing `study_time_minutes`
- multiple timer runs on the same day are not stored as separate session rows in v1
- manual daily logging and timer logging both contribute to the same daily total for that calendar day

Example:

- user studies from `1:00 PM` to `3:00 PM` on April 1
- later studies again from `6:00 PM` to `8:00 PM` on April 1
- Rootly should record one April 1 daily total of `04:00:00`, not two separate saved sessions

## Mood behavior

Mood is a daily field and should remain editable throughout the day.

That means:

- if today's entry already has a mood, show it in the extension
- if the user saves a new mood later the same day, allow it and update today's entry
- the extension should help the user stay aware of today's current logged mood, not lock it after the first save

Example:

- user first logs `Neutral`
- later the same day logs `Burned Out`
- today's daily entry should update to reflect the newer mood

## Daily note behavior

The daily note should behave like mood: visible during the day and editable throughout the day.

That means:

- if today's entry already has a note, show it in the extension
- if the user edits or replaces the note later the same day, allow it and update today's entry
- the extension should treat the note as the current editable daily reflection, not as an append-only session log

Example:

- user first writes `Studied React state management`
- later the same day changes it to `Studied React state management and felt tired near the end`
- today's daily entry should reflect the latest edited note for that day

## Visibility during the day

The side panel should show the user's current daily state when available.

That includes:

- today's accumulated study time
- today's current mood
- today's current daily note

This should help the extension feel supportive and informative during the day, not force the user to remember what has already been logged.

---

## Timer Behavior

## Requirements

- timer continues while the side panel is closed
- timer state survives popup-like UI disappearance because the side panel is not the source of truth
- state must survive normal extension UI re-open
- elapsed time should be reconstructed reliably

## Recommended model

Persist a lightweight timer state in `chrome.storage.local`, such as:

- status
- startedAt
- pausedAt
- accumulatedMs

The background service worker should be the timer authority.

The side panel should subscribe to that state and render it.

## UX rules

- timer controls must be obvious
- state transitions must be instant
- save flow after pause or stop must be short and forgiving
- if saving fails, the duration must not be silently lost

---

## Permissions

Use the minimum permissions necessary.

The extension should avoid broad permissions that are hard to justify to users or store reviewers.

Likely v1 needs:

- storage
- side panel
- the minimum tab access required for current-page context
- host permissions only for Rootly website origins needed for extension API calls

Avoid broad catch-all site permissions unless a later feature truly requires them.

---

## Browser Target

v1 should target browsers where the Manifest V3 side panel experience is strong enough to support the intended workflow.

Practical implication:

- optimize v1 for Chromium-class browsers first
- do not compromise the product shape just to preserve a popup-first cross-browser fallback

If a later browser target lacks an equivalent side panel experience, that should be a separate product decision rather than a reason to weaken the main Rootly UX.

---

## Performance Constraints

The extension should feel instant.

## Side panel startup rules

- render a meaningful shell immediately
- do not block first paint on network
- show cached lightweight data when available
- revalidate bootstrap data in the background

## Background rules

- keep the service worker lightweight
- avoid unnecessary long-running work
- persist only small amounts of timer and draft state
- avoid noisy polling

---

## Accessibility

The side panel must be keyboard-accessible and screen-reader-friendly.

Minimum expectations:

- visible focus states
- semantic form structure
- accessible labels
- no focus traps
- strong contrast within the `claude-blue` design language

---

## Error Handling

The extension should never feel brittle.

## Expected cases

- signed out
- network failure
- Rootly endpoint failure
- timer save failure
- stale bootstrap data

## UX rules

- show concise, actionable errors
- preserve drafts when possible
- never lose timer-save data silently
- make retry obvious

---

## Suggested v1 Build Approach

Build the extension UI as a small React + TypeScript app.

## Why

- easier state management
- easier panel composition
- better alignment with Rootly frontend patterns
- easier token reuse for `claude-blue`
- easier accessible UI composition

This is preferable to a purely ad hoc HTML + JavaScript panel if the goal is to faithfully match Rootly's design language and maintain the code comfortably.

---

## Implementation Phases

## Phase 1: foundations

- create MV3 extension scaffold
- set up side panel entry
- add background service worker
- define minimal manifest and permissions
- establish shared types and storage helpers

## Phase 2: auth bridge

- add `GET /api/extension/bootstrap`
- implement credentialed website session check
- add signed-out side panel state
- open website login from the extension

## Phase 3: visual system

- port `claude-blue` tokens into extension theme primitives
- establish coss-like layout, spacing, controls, and surfaces
- create core panel shell

## Phase 4: quick actions

- implement note creation flow
- implement course creation flow
- implement manual daily log flow

## Phase 5: timer

- implement background timer state
- implement running/paused/stopped UI
- implement timer save into `daily_entries`
- handle failure and recovery safely

## Phase 6: refinement

- keyboard and a11y checks
- loading and error polish
- responsive side panel width refinement
- store-readiness review

---

## Validation Plan

Validate the extension against real study behavior, not only code correctness.

## Product validation

1. User can authenticate through website login and return to a working extension.
2. User can keep the panel open while browsing docs or a tutorial.
3. User can create a note without losing page context.
4. User can create a course without leaving the panel.
5. User can start a timer, close the panel, reopen it, and still see correct timer state.
6. User can save timer time into `daily_entries` successfully.

## Technical validation

1. `401` is handled cleanly as signed-out state.
2. Side panel renders meaningful UI immediately.
3. Timer state survives side panel close/reopen.
4. Draft user input is not lost on transient failures.
5. Permissions remain minimal and justified.

---

## Final Product Principle

The Rootly extension should feel like this:

"I can keep studying, and Rootly stays beside me just enough to capture what matters."

If the extension starts feeling like a cramped duplicate of the website, the spec is being violated.
