# Rootly

Rootly is a developer-focused learning notebook for self-taught developers and serious learners. It exists to make active learning easier to capture, organize, review, and measure without forcing people into a generic notes app workflow. This repository is the v2 cloud-first rebuild: a production-oriented Next.js + Supabase application with a companion browser extension.

### Core Purpose

For users, Rootly turns scattered learning sessions into structured progress across notes, courses, daily study logs, review sessions, and overview analytics.
For builders, Rootly is a focused product system with strong constraints around learning UX, dashboard performance, caching, and design-system consistency.

This project is not meant to become:

- A general-purpose note-taking workspace like Notion or Obsidian
- A team collaboration, project management, or social platform

> **The Central Mechanism** — Rootly helps developers capture what they learn in structured form, revisit it through active recall, and see measurable progress over time.

### Product Model

**What it is:**

- A structured learning notebook centered on Q&A notes, freeform notes, courses, study tracking, and spaced repetition
- A cloud-backed personal product with a side-panel-first browser extension that bridges into the main website

**Core truths that guide every decision:**

- Rootly is for developer learning workflows, not generic knowledge dumping
- Intentional structure matters more than feature sprawl
- Data must stay strictly user-scoped through Supabase auth and RLS
- Existing coss UI patterns are preserved rather than reinvented

**Signature mechanics:**

- Two note modes: Q&A for recall and freeform for flexible capture
- Course-linked learning organization with uncategorized notes allowed
- Daily study logging with time and mood tracking
- Spaced repetition review that updates understanding levels over time
- Overview analytics for learning trends, study consistency, and mastery
- Fast extension capture that syncs into the main app

### Target Audience

#### External

- Self-taught developers taking courses, tutorials, and docs seriously
- Learners who want one system for capture, review, and progress tracking

**Profile:** Technically comfortable, often desktop-first, actively studying while coding or browsing, and most confident when the product feels structured, fast, and purpose-built for developer learning.

#### Internal

- Agents implementing product, frontend, extension, data, and performance work
- Human maintainers working inside an opinionated Next.js App Router codebase

**Profile:** Comfortable with TypeScript, React, and Supabase patterns; expected to preserve product intent, design-system boundaries, and performance-oriented architecture decisions.

### Non-Negotiable Principles

1. No turning Rootly into a generic notes app, because that dilutes the product’s learning-specific value.
2. No modifying `components/ui/*` internals without explicit approval, because coss UI is treated as a sealed design system.
3. No inventing new patterns when an existing project pattern already solves the problem.
4. No reintroducing per-page `DashboardShell` wrappers, because the shared dashboard shell mounts once in `app/(dashboard)/layout.tsx`.
5. No regressions in auth, caching, or user-data isolation; protected routes and read/write paths must remain aligned with verified claims and RLS.

### Product Differentiators

| Area | Common Pattern | Rootly |
| --- | --- | --- |
| Note capture | Generic documents and loose text | Structured Q&A plus freeform capture tuned for learning |
| Review | Passive rereading | Active recall with understanding-level updates |
| Progress | Notes are stored but not measured | Daily study logs, mastery trends, and overview analytics |
| Organization | Flat folders/tags | Courses, optional course attachment, and study-linked context |
| Browser workflow | Context switching to a separate app | Side-panel extension as a fast bridge into the main product |

### Architecture & Constraints

- App surface is split into marketing, auth, and dashboard route groups.
- `DashboardShell` mounts once in `app/(dashboard)/layout.tsx`.
- Auth helpers are centralized in `lib/dashboard-session.ts`; protected routing is handled by `proxy.ts`.
- Next.js Cache Components are enabled, and read paths use `cacheLife`, tags, and targeted invalidation.
- TanStack Query powers interactive dashboard routes like courses, notes, review sessions, and daily entries.
- Overview remains intentionally server-streamed rather than fully query-driven.
- The browser extension is side-panel-first and depends on website cookie-session auth rather than a separate token system.
- Use `rg` for search and `apply_patch` for edits.
- Do not revert unrelated user changes.

### Technology Stack

**Core**

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4

**Backend & Data**

- Supabase PostgreSQL with Row Level Security
- Supabase Auth via `@supabase/ssr` and `@supabase/supabase-js`

**UI & Components**

- coss UI on top of Base UI
- Hugeicons
- Recharts for overview charts

**Interactions & State**

- TanStack Query
- Next.js server components, server actions, and route handlers
- Motion for selected UI interactions

**Tooling**

- `pnpm`
- Oxlint
- Oxfmt

### Working Posture For Agents

Agents working in this repository should think in this order:

1. What is the product truth for Rootly as a learning notebook?
2. Is this work serving structured learning, active recall, or measurable progress?
3. Which existing route, feature, or UI pattern already owns this behavior?
4. Does this preserve dashboard performance, cache freshness, and auth correctness?
5. Does this respect the sealed coss UI design-system boundary?
6. Is the system becoming clearer, faster, and more intentional rather than more generic?

Agents should behave as product-aware implementation partners: protect the product shape first, then implement within the established architecture.
