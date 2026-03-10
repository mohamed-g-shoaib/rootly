# Backend Development Cycle (Supabase)

**Project:** Rootly (v2)

**Supabase project id:** `gforbcrkqdowocyfrrjj`

**Auth providers enabled (as of this checkpoint):** Google, GitHub, LinkedIn

This document is an always-up-to-date reference for what has been implemented on the backend (database layer) and how it was validated.

---

## Scope (from `spec/what-is-rootly.md`)

Backend scope in this project (so far) is the Supabase PostgreSQL schema + security model to support:

- Courses
- Notes (Q&A + Freeform)
- Daily study tracking
- Spaced repetition review sessions
- Overview analytics (7/30/90 day ranges)

Non-goals of this document:

- Next.js integration details (route handlers, server actions)
- UI implementation

---

## Core Data Model Summary

All tables are in schema `public` and are user-scoped via `user_id = auth.uid()`.

### `public.courses`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `title text not null`
- `instructor text null`
- `course_link text null`
- `links text[] not null default '{}'`
- `topics text[] not null default '{}'`
- `progress integer not null default 0` with check `(0..100)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `public.notes`

Represents both Q&A and Freeform notes in one table.

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `course_id uuid null references public.courses(id) on delete set null`
- `type text not null` with check `('qa'|'freeform')`

Q&A fields:

- `question text`
- `answer text`
- `understanding_level smallint` with check `(1..5)`

Freeform fields:

- `body text`

Shared fields:

- `code_snippet text null`
- `code_language text not null default 'text'`
- `flag boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Integrity constraints:

- For `type = 'qa'`: requires `question`, `answer`, `understanding_level` and enforces `body is null`
- For `type = 'freeform'`: requires `body` and enforces `question/answer/understanding_level is null`

### `public.daily_entries`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `date date not null`
- `study_time integer not null default 0` with check `(>=0)`
- `mood smallint not null` with check `(1,2,3)`
- `notes text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Uniqueness:

- `unique(user_id, date)` (one entry per day per user)

### `public.review_sessions`

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`
- `date date not null`
- `question_count integer not null` with check `(>0)`
- `shuffled boolean not null default false`
- `flagged_only boolean not null default false`
- `accuracy numeric(5,2) not null` with check `(0..100)`
- `time_spent integer not null` with check `(>=0)`
- `notes_leveled_up uuid[] not null default '{}'`
- `notes_leveled_down uuid[] not null default '{}'`
- `weakest_course_id uuid null references public.courses(id) on delete set null`
- `strongest_course_id uuid null references public.courses(id) on delete set null`
- `created_at timestamptz not null default now()`

---

## RLS (Row Level Security)

RLS is enabled on all core tables:

- `public.courses`
- `public.notes`
- `public.daily_entries`
- `public.review_sessions`

Policies are CRUD-scoped and restricted to the `authenticated` role.

Pattern used:

- `USING (user_id = (select auth.uid()))`
- `WITH CHECK (user_id = (select auth.uid()))`

This ensures each user can only access their own rows.

---

## Indexes (Access-Path Driven)

### Courses

- `courses_user_id_idx (user_id)`
- `courses_updated_at_idx (updated_at desc)`

### Notes

- `notes_user_id_idx (user_id)`
- `notes_course_id_idx (course_id)`
- `notes_user_updated_at_idx (user_id, updated_at desc)`
- `notes_user_flagged_idx (user_id) where flag`

Additional indexes to support review/overview queries:

- `notes_user_qa_updated_at_idx (user_id, updated_at desc) where type='qa'`
- `notes_user_course_qa_updated_at_idx (user_id, course_id, updated_at desc) where type='qa' and course_id is not null`

### Daily Entries

- `daily_entries_user_id_idx (user_id)`
- `daily_entries_user_date_idx (user_id, date desc)`

### Review Sessions

- `review_sessions_user_id_idx (user_id)`
- `review_sessions_user_date_idx (user_id, date desc)`
- `review_sessions_weakest_course_id_idx (weakest_course_id)`
- `review_sessions_strongest_course_id_idx (strongest_course_id)`

---

## Automatic `updated_at` Maintenance

A shared trigger function is installed:

- `public.set_updated_at()`

Triggers:

- `set_updated_at_courses` on `public.courses`
- `set_updated_at_notes` on `public.notes`
- `set_updated_at_daily_entries` on `public.daily_entries`

Behavior:

- On any `UPDATE`, `updated_at` is set to `now()`.

---

## RPCs (Database Functions)

All RPCs are designed to run under RLS and are restricted to the `authenticated` role (not executable by `public`).

Security hardening:

- All functions (RPCs and triggers) explicitly set `SET search_path = ''` to prevent search_path hijacking.
- All internal object references are fully qualified (e.g. `public.notes`, `public.review_sessions`).

### Overview

#### `public.get_overview_summary() -> jsonb`

Returns the overview “summary card” stats (all-time totals):

- `total_courses`
- `total_notes`
- `avg_understanding` (Q&A only)
- `study_time` (sum of daily entry minutes)

#### `public.get_overview_range(p_days integer) -> jsonb`

Validates `p_days` is one of `7`, `30`, or `90`.

Returns:

- `daily_study_sessions`: zero-filled per-day series of `{ date, study_time }`
- `mood_series`: per-day series of `{ date, mood }` (null when no entry)
- `understanding_progress`: per-day series of `{ date, avg_understanding }`
- `course_mastery`: per-course series of `{ course_id, title, avg_understanding }` within the range

Note: understanding progression is based on the day a note was updated (because historical understanding snapshots are not stored).

### Review

#### `public.get_review_note_pool(p_question_count int, p_shuffle bool, p_flagged_only bool, p_course_id uuid default null)`

Returns a set of Q&A notes to review.

Supports:

- limiting to `p_question_count`
- shuffling (`random()` order) when `p_shuffle = true`
- flagged-only when `p_flagged_only = true`
- optional course filter when `p_course_id` is provided

#### `public.compute_review_session_summary(p_note_deltas jsonb) -> jsonb`

Computes session summary fields from a JSON array of objects:

```json
[{"id":"<note_uuid>","before":2,"after":3}, ...]
```

Validates all note ids belong to the current user.

Returns:

- `accuracy`
- `notes_leveled_up`
- `notes_leveled_down`
- `weakest_course_id` / `strongest_course_id` (based on average after levels)

#### `public.save_review_session(...) -> jsonb`

Persists a completed review session to `public.review_sessions`.

Inputs:

- session config: `name`, `date`, `question_count`, `shuffled`, `flagged_only`, `time_spent`
- `p_note_deltas` payload (same shape as above)

Returns:

- `{ id, summary }`

---

## Constraints Hardening (Light)

Added minimal constraints to prevent empty strings / runaway values:

- `courses_title_nonempty`: `length(btrim(title)) > 0`
- `review_sessions_name_nonempty`: `length(btrim(name)) > 0`
- `notes_code_language_len`: `length(code_language) <= 64`

---

## Validation Checklist Used

These checks were used to validate the DB work:

- Confirm tables exist and RLS enabled:
  - `list_tables` (MCP)
- Confirm policies exist + roles are `authenticated`:
  - query `pg_policies`
- Confirm triggers installed:
  - query `information_schema.triggers`
- Confirm RPCs exist and signatures are correct:
  - query `pg_proc` / `pg_namespace`
- Confirm RPC execute privileges:
  - `has_function_privilege('authenticated', oid, 'execute')`
  - `has_function_privilege('public', oid, 'execute')`

- Confirm Supabase Security Advisor has zero WARN entries:
  - `mcp6_get_advisors(type = 'security')`

---

## Current Backend Status

Within the scope defined by `spec/what-is-rootly.md`, the database backend is complete:

- Schema is created
- RLS is enabled and restricted to authenticated users
- Required analytics/review workflows are supported via RPCs

Next work should be in the application layer:

- Next.js integration (server actions / route handlers calling RPCs)
- UI + flows for creating/editing entities
- Frontend use of overview analytics endpoints

---
