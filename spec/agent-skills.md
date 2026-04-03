# Agent Skills

> This document is the authoritative reference for all `.agents` skills available in this project. It describes each skill's purpose, its top rules by priority, where to find its files, and what resources are available inside it. Use this document to know **which skill to load** before generating, reviewing, or refactoring code.

Skills in this repository live under the `.agents/skills/` directory. Depending on the skill publisher, each skill directory may contain some or all of the following:

| File / Folder      | Purpose                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `SKILL.md`         | Lightweight entry point describing when to apply the skill and how to use it |
| `AGENTS.md`        | Fully compiled, expanded version of the rules for deeper context             |
| `README.md`        | Human-facing documentation about structure and contribution                  |
| `CLAUDE.md`        | Publisher-specific companion guidance file                                   |
| `rules/`           | Individual rule files, typically one rule per file                           |
| `references/`      | Topic-specific reference documents loaded as needed                          |
| `evals/`           | Evaluation fixtures or validation assets used by the skill                   |
| `*.md` topic files | Standalone topic guides linked directly from `SKILL.md`                      |

---

## Working With Extension Skills

Use the three extension-focused skills as complementary guides rather than independent alternatives:

1. Start with `browser-extension-builder` when creating or extending extension structure, MV3 scaffolding, manifest shape, runtime boundaries, storage flow, or messaging patterns.
2. Bring in `chrome-extension-ui` when deciding between popup, side panel, content-script UI, options surfaces, accessibility behavior, loading states, or other extension-specific UX details.
3. Use `chrome-extension-development` as the engineering quality bar across the whole task, especially for TypeScript structure, permissions, security, performance, testing, and publishing readiness.

Recommended sequencing:

1. New extension feature: `browser-extension-builder` -> `chrome-extension-ui` if user-facing -> `chrome-extension-development` for final implementation review
2. Pure UI/UX choice: let `chrome-extension-ui` lead, then sanity-check with `chrome-extension-development`
3. Security, API, or architecture-heavy work: let `chrome-extension-development` lead, using `browser-extension-builder` for runtime patterns as needed

If the skills disagree, prefer the stricter engineering and security guidance from `chrome-extension-development`, then the architectural constraints from `browser-extension-builder`, and treat `chrome-extension-ui` as UI-specific guidance within those boundaries.

For Rootly extension work only, also load:

- `html-css-best-practices` when reviewing or refining the extension's HTML structure, CSS architecture, responsive behavior, and accessibility
- `modern-javascript-patterns` when reviewing or refactoring the extension's plain JavaScript modules, async flows, DOM wiring, and module boundaries

---

## Skills Index

| #   | Skill                                                                   | Publisher                              | Version / Notes                                              | Path                                               |
| --- | ----------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| 1   | [Vercel React Best Practices](#1-vercel-react-best-practices)           | Vercel                                 | `v1.0.0`                                                     | `.agents/skills/vercel-react-best-practices/`      |
| 2   | [Next.js Best Practices](#2-nextjs-best-practices)                      | Project-local                          | Topic index skill                                            | `.agents/skills/next-best-practices/`              |
| 3   | [React Composition Patterns](#3-react-composition-patterns)             | Vercel                                 | `v1.0.0`                                                     | `.agents/skills/vercel-composition-patterns/`      |
| 4   | [Design Engineering](#4-design-engineering)                             | Project-local (Emil Kowalski-inspired) | Single-file skill                                            | `.agents/skills/emil-design-eng/`                  |
| 5   | [Fixing Motion Performance](#5-fixing-motion-performance)               | Project-local                          | Single-file audit/fix skill                                  | `.agents/skills/fixing-motion-performance/`        |
| 6   | [Supabase Postgres Best Practices](#6-supabase-postgres-best-practices) | Supabase                               | `v1.1.0`                                                     | `.agents/skills/supabase-postgres-best-practices/` |
| 7   | [PostgreSQL Table Design](#7-postgresql-table-design)                   | Project-local                          | Single-file skill                                            | `.agents/skills/postgresql-table-design/`          |
| 8   | [PostgreSQL Pro](#8-postgresql-pro)                                     | Jeff Allan                             | `v1.1.0`                                                     | `.agents/skills/postgres-pro/`                     |
| 9   | [TypeScript Advanced Types](#9-typescript-advanced-types)               | Project-local                          | Single-file skill                                            | `.agents/skills/typescript-advanced-types/`        |
| 10  | [SEO Audit](#10-seo-audit)                                              | Project-local                          | `v1.1.0`                                                     | `.agents/skills/seo-audit/`                        |
| 11  | [React useEffect](#11-react-useeffect)                                  | Project-local                          | Official-docs-inspired guidance                              | `.agents/skills/react-useeffect/`                  |
| 12  | [Make Interfaces Feel Better](#12-make-interfaces-feel-better)          | Project-local                          | UI polish skill with focused reference files                 | `.agents/skills/make-interfaces-feel-better/`      |
| 13  | [User Interface Wiki](#13-user-interface-wiki)                          | Raphael Salaja                         | `v3.0.0`                                                     | `.agents/skills/userinterface-wiki/`               |
| 14  | [Tailwind CSS Patterns](#14-tailwind-css-patterns)                      | Project-local                          | Utility-first styling and responsive composition guide       | `.agents/skills/tailwind-css-patterns/`            |
| 15  | [Tailwind CSS Advanced Layouts](#15-tailwind-css-advanced-layouts)      | Project-local                          | Grid, flex, sticky, overflow, and fluid sizing patterns      | `.agents/skills/tailwindcss-advanced-layouts/`     |
| 16  | [Browser Extension Builder](#16-browser-extension-builder)              | vibeship-spawner-skills                | Imported single-file skill; source metadata notes Apache 2.0 | `.agents/skills/browser-extension-builder/`        |
| 17  | [Chrome Extension Development](#17-chrome-extension-development)        | Project-local                          | Single-file Chrome extension engineering guide               | `.agents/skills/chrome-extension-development/`     |
| 18  | [Chrome Extension UI](#18-chrome-extension-ui)                          | Chrome Extensions Community            | `0.1.0`                                                      | `.agents/skills/chrome-extension-ui/`              |
| 19  | [HTML/CSS Best Practices](#19-htmlcss-best-practices)                   | Project-local                          | Extension-only HTML/CSS review and implementation guide      | `.agents/skills/html-css-best-practices/`          |
| 20  | [Modern JavaScript Patterns](#20-modern-javascript-patterns)            | Project-local                          | Extension-only JavaScript review and refactoring guide       | `.agents/skills/modern-javascript-patterns/`       |
| 21  | [Vercel React View Transitions](#21-vercel-react-view-transitions)      | Vercel                                 | `1.0.0`                                                      | `.agents/skills/vercel-react-view-transitions/`    |

---

## 1. Vercel React Best Practices

**Publisher:** Vercel
**Version:** `1.0.0`
**When to load:** Writing, reviewing, or refactoring React and Next.js code where performance matters: data fetching, bundle size, rendering, server/client boundaries, or re-render behavior

### Purpose

Comprehensive performance optimization guidance for React and Next.js applications. The skill currently contains 58 rules across 8 priority-ranked categories, starting with async waterfall elimination and bundle size optimization, then moving through server performance, client fetching, re-render reduction, rendering behavior, JavaScript performance, and advanced patterns.

### Top 10 Rules by Priority

1. **`async-defer-await`** - Move `await` into the branch where the result is actually needed
2. **`async-parallel`** - Use `Promise.all()` for independent async work
3. **`async-suspense-boundaries`** - Use `<Suspense>` to stream slow subtrees progressively
4. **`bundle-barrel-imports`** - Import directly from source files instead of barrel files
5. **`bundle-dynamic-imports`** - Use `next/dynamic` for heavy components and defer their JS cost
6. **`server-cache-react`** - Use `React.cache()` for per-request deduplication in Server Components
7. **`server-parallel-fetching`** - Restructure component trees so server fetches start in parallel
8. **`rerender-memo`** - Extract expensive work into memoized components instead of recomputing inline
9. **`rerender-derived-state-no-effect`** - Derive state during render rather than syncing it with effects
10. **`rerender-functional-setstate`** - Use functional `setState` whenever the next value depends on previous state

### Available Files

| File        | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| `SKILL.md`  | Entry point with category table, quick reference, and usage notes |
| `AGENTS.md` | Fully compiled guide for all 58 rules                             |
| `README.md` | Contribution guide and rule structure                             |
| `rules/`    | 58 individual rule files with explanations and good/bad examples  |

---

## 2. Next.js Best Practices

**Publisher:** Project-local
**Version / Notes:** Topic-index skill with 19 linked reference files
**When to load:** Writing or reviewing Next.js App Router code involving route structure, RSC boundaries, async APIs, runtime selection, metadata, route handlers, bundling, hydration, or deployment

### Purpose

Topic-based guidance for modern Next.js applications. Unlike the React performance skill, this skill is organized as a reference index: `SKILL.md` points to focused topic files covering file conventions, async APIs, directives, runtime choice, error handling, data patterns, route handlers, metadata, optimization primitives, hydration, Suspense, advanced routing, self-hosting, and debugging.

### Top 10 Rules by Priority

1. **File conventions first** - Use the correct App Router file and folder conventions, including modern route segment patterns
2. **Respect RSC boundaries** - Never build invalid Server/Client Component combinations or pass non-serializable props across the boundary
3. **Await async request APIs** - In Next.js 15+, treat `params`, `searchParams`, `cookies()`, and `headers()` as async
4. **Choose runtime intentionally** - Default to Node.js runtime unless Edge is clearly justified
5. **Use directives correctly** - Push `'use client'` as deep as possible and apply `'use cache'` where appropriate
6. **Use the right primitive for data work** - Distinguish between Server Components, Server Actions, and Route Handlers
7. **Handle routing errors explicitly** - Use `error.tsx`, `global-error.tsx`, `not-found.tsx`, redirects, and auth-oriented error helpers
8. **Optimize framework primitives** - Prefer `next/image`, `next/font`, `next/script`, and correct metadata APIs over manual equivalents
9. **Guard against hydration and CSR bailouts** - Wrap hooks like `useSearchParams` in `<Suspense>` and fix common hydration mismatch causes
10. **Understand advanced routing and deployment** - Apply parallel routes, intercepting routes, standalone output, cache handlers, and targeted debugging tools when needed

### Available Files

| File                     | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `SKILL.md`               | Entry point linking to all topic guides                         |
| `file-conventions.md`    | Route segments, special files, and structural conventions       |
| `rsc-boundaries.md`      | Invalid RSC patterns and serialization pitfalls                 |
| `async-patterns.md`      | Async params, search params, cookies, and headers               |
| `runtime-selection.md`   | Node.js vs Edge runtime guidance                                |
| `directives.md`          | `'use client'`, `'use server'`, and `'use cache'` usage         |
| `functions.md`           | Navigation hooks and server/runtime helper functions            |
| `error-handling.md`      | Route-level errors, redirects, and auth errors                  |
| `data-patterns.md`       | Data fetching patterns, waterfalls, and server/client tradeoffs |
| `route-handlers.md`      | Route handler behavior and when to use it                       |
| `metadata.md`            | Static/dynamic metadata and OG image generation                 |
| `image.md`               | `next/image` usage and optimization                             |
| `font.md`                | `next/font` setup and preload guidance                          |
| `bundling.md`            | Package compatibility, CSS imports, and bundle analysis         |
| `scripts.md`             | `next/script` usage and third-party script loading              |
| `hydration-error.md`     | Common hydration mismatch causes and fixes                      |
| `suspense-boundaries.md` | Hooks and patterns that require Suspense                        |
| `parallel-routes.md`     | Parallel and intercepting route patterns                        |
| `self-hosting.md`        | Docker standalone output and cache handlers                     |
| `debug-tricks.md`        | AI/debug tooling and targeted rebuild tips                      |

---

## 3. React Composition Patterns

**Publisher:** Vercel
**Version:** `1.0.0`
**When to load:** Refactoring components with too many flags, designing reusable component APIs, building compound components, or improving state architecture and React 19 readiness

### Purpose

Composition-oriented guidance for building flexible React components without boolean-prop sprawl. The skill is organized into 4 priority-ranked categories and currently exposes 8 rule files covering architecture, state management, implementation patterns, and React 19 API updates.

### Top 10 Rules by Priority

1. **`architecture-avoid-boolean-props`** - Avoid boolean props for behavior switches; compose variants instead
2. **`architecture-compound-components`** - Use shared-context compound components for complex UI
3. **`state-decouple-implementation`** - Keep state implementation details inside the provider
4. **`state-context-interface`** - Model context around `state`, `actions`, and `meta`
5. **`state-lift-state`** - Lift shared state into providers when siblings need it
6. **`patterns-explicit-variants`** - Prefer explicit variant components over mode/config props
7. **`patterns-children-over-render-props`** - Prefer composition through `children` over `renderX` props
8. **`react19-no-forwardref`** - In React 19+, stop defaulting to `forwardRef` and update APIs accordingly

### Available Files

| File        | Description                                              |
| ----------- | -------------------------------------------------------- |
| `SKILL.md`  | Entry point with priority categories and quick reference |
| `AGENTS.md` | Fully compiled guide with expanded rule detail           |
| `README.md` | Structure and contribution guide                         |
| `rules/`    | 8 individual rule files with explanations and examples   |

---

## 4. Design Engineering

**Publisher:** Project-local (Emil Kowalski-inspired)
**Version / Notes:** Single-file craft and UI polish skill
**When to load:** Reviewing or building polished UI where taste, animation decisions, component feel, interaction quality, and subtle implementation details matter

### Purpose

This skill encodes a design-engineering mindset rather than a narrow API checklist. It combines philosophy, review format requirements, animation decision-making, component interaction standards, performance rules, accessibility notes, and debugging advice into a single self-contained document.

### Top 10 Rules by Priority

1. **Taste is trained** - Study excellent products and make deliberate visual choices rather than stopping at "works"
2. **Unseen details compound** - Small implementation details add up to perceived quality
3. **Beauty is leverage** - Good defaults, motion, and polish are product differentiators
4. **Review format is mandatory** - UI reviews must use a markdown table with `Before | After | Why`
5. **Do not animate high-frequency keyboard actions** - Repeated actions should feel instant, not ornamental
6. **Every animation needs a purpose** - Use motion for state, feedback, spatial consistency, explanation, or to avoid jarring changes
7. **Use strong easing and avoid `ease-in` for UI** - Default to `ease-out` or custom curves that feel responsive
8. **Keep UI motion fast** - Common interface animations should usually stay under 300ms
9. **Buttons and popovers need physicality** - Use subtle press scaling, origin-aware popovers, and never animate from `scale(0)`
10. **Prefer performant, interruptible motion** - Favor transforms, opacity, transitions, reduced-motion support, and animation techniques that stay smooth under load

### Available Files

| File       | Description                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `SKILL.md` | Full self-contained skill covering philosophy, reviews, animation, performance, accessibility, and debugging |

---

## 5. Fixing Motion Performance

**Publisher:** Project-local
**Version / Notes:** Single-file audit and remediation skill
**When to load:** Investigating janky animations, layout thrash, scroll-linked motion problems, heavy blur/filter effects, or mixed animation systems in existing UI code

### Purpose

Focused performance-review guidance for animation systems. The skill defines a rendering glossary, 9 priority-ranked rule categories, concrete anti-patterns, and code-level remediation strategies while explicitly requiring fixes to stay within the existing animation stack unless a migration is requested.

### Top 10 Rules by Priority

1. **Do not interleave layout reads and writes** - Avoid layout thrash inside the same frame
2. **Default to `transform` and `opacity`** - Start with compositor-friendly motion before considering paint or layout animation
3. **Do not animate layout continuously on large surfaces** - Layout animation is only acceptable on small, isolated areas
4. **Do not drive animation from scroll events** - Prefer Scroll/View Timelines or IntersectionObserver-based triggers
5. **Measure once, animate later** - Batch DOM reads, then animate with FLIP-style transforms or opacity
6. **Pause work when off-screen** - Stop or reduce motion that users cannot currently see
7. **Avoid paint-heavy animation on large elements** - Filters, masks, gradients, and similar properties need strict limits
8. **Do not animate inherited CSS variables for motion** - Scope animated variables locally or write transforms directly
9. **Keep blur small and short-lived** - Blur should stay under about 8px, never run continuously, and never cover large surfaces
10. **Do not partially migrate animation tools** - Fix issues inside the current stack unless the user explicitly requests a rewrite

### Available Files

| File       | Description                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill with rules, glossary, common fixes, and review guidance |

---

## 6. Supabase Postgres Best Practices

**Publisher:** Supabase
**Version:** `1.1.0`
**When to load:** Writing or reviewing Postgres SQL, optimizing queries, designing schemas, configuring connection behavior, or working with RLS in Supabase-backed systems

### Purpose

Comprehensive Postgres optimization guidance maintained by Supabase. The skill organizes 31 reference files across 8 priority-ranked categories: query performance, connection management, security and RLS, schema design, locking, data access patterns, monitoring, and advanced features.

### Top 10 Rules by Priority

1. **`query-missing-indexes`** - Add indexes for columns used in `WHERE`, `JOIN`, and `ORDER BY`
2. **`query-composite-indexes`** - Order composite indexes around equality-first, range-last access paths
3. **`query-partial-indexes`** - Use partial indexes for hot subsets of data
4. **`query-covering-indexes`** - Use `INCLUDE (...)` to unlock index-only scans
5. **`conn-pooling`** - Always use connection pooling
6. **`conn-prepared-statements`** - Use prepared statements for safety and lower parse/plan overhead
7. **`security-rls-basics`** - Enable RLS everywhere it is required
8. **`security-rls-performance`** - Write RLS policies in ways that avoid expensive per-row function calls
9. **`schema-primary-keys`** - Prefer identity columns over legacy `SERIAL`
10. **`schema-foreign-key-indexes`** - Add explicit indexes to foreign-key columns because Postgres does not do this automatically

### Available Files

| File          | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `SKILL.md`    | Entry point with category table and usage guidance                                                      |
| `AGENTS.md`   | Fully compiled deep-context version of the skill                                                        |
| `README.md`   | Human-facing usage and structure notes                                                                  |
| `CLAUDE.md`   | Publisher-specific companion guidance                                                                   |
| `references/` | 31 topic files covering query, connection, security, schema, locking, monitoring, and advanced features |

---

## 7. PostgreSQL Table Design

**Publisher:** Project-local
**Version / Notes:** Single-file schema design skill
**When to load:** Designing PostgreSQL schemas from scratch, choosing types, defining constraints, planning indexes, evaluating partitioning, or deciding how to model JSONB and extension-backed data

### Purpose

Dense, PostgreSQL-specific schema design guidance collected into a single file. It covers primary keys, normalization, data-type selection, constraints, indexing, partitioning, safe schema evolution, generated columns, extensions, JSONB strategy, and workload-specific guidance for update-heavy or insert-heavy tables.

### Top 10 Rules by Priority

1. **Use sane primary keys** - Prefer `BIGINT GENERATED ALWAYS AS IDENTITY`; reserve `UUID` for clear distributed or opaque-ID needs
2. **Normalize first** - Start in 3NF and denormalize only when measurement justifies it
3. **Use `NOT NULL` aggressively** - Pair semantic non-nullability with defaults where appropriate
4. **Index foreign keys manually** - Postgres never auto-indexes FK columns
5. **Choose PostgreSQL-native types carefully** - Prefer `TIMESTAMPTZ`, `NUMERIC` for money, `TEXT`, `BIGINT`, and `JSONB`
6. **Avoid discouraged legacy types** - Do not use `timestamp`, `varchar(n)`, `char(n)`, `money`, `timetz`, or `serial`
7. **Use lowercase `snake_case` identifiers** - Avoid quoted and mixed-case names
8. **Use the right index type** - B-tree, GIN, GiST, BRIN, expression, partial, and covering indexes each serve different workloads
9. **Partition only for clear operational reasons** - Use declarative partitioning or hypertables for very large, partition-key-friendly data
10. **Plan schema evolution safely** - Use concurrent index creation, understand rewrites, and treat production migrations carefully

### Available Files

| File       | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill with schema rules, data-type guidance, examples, and migration advice |

---

## 8. PostgreSQL Pro

**Publisher:** Jeff Allan
**Version:** `1.1.0`
**When to load:** Optimizing slow queries, verifying index strategy, working with JSONB, tuning VACUUM/autovacuum, using extensions, or configuring and monitoring replication

### Purpose

Operational PostgreSQL guidance with a senior-DBA workflow. The skill focuses on live-database problem solving: analyze with `EXPLAIN`, design and verify indexes, optimize queries, configure replication, and monitor long-term health through maintenance and statistics views.

### Top 10 Rules by Priority

1. **Always start with `EXPLAIN (ANALYZE, BUFFERS)`** - Never optimize blind
2. **Verify indexes before and after changes** - Confirm the planner actually uses what you create
3. **Use `CREATE INDEX CONCURRENTLY` in production** - Avoid blocking writes
4. **Run `ANALYZE` after bulk changes** - Refresh statistics before trusting planner choices
5. **Monitor autovacuum and bloat** - High-churn tables need active maintenance
6. **Use connection pooling** - Avoid direct-connection exhaustion under load
7. **Monitor replication lag** - Do not let standby lag silently accumulate
8. **Use prepared statements** - Reduce parse overhead and improve safety
9. **Do not use `SELECT *` in production queries** - Be explicit and preserve index opportunities
10. **Do not disable autovacuum globally** - Tune it instead of turning it off

### Available Files

| File                        | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `SKILL.md`                  | Entry point with workflow, patterns, constraints, and output templates |
| `references/performance.md` | EXPLAIN analysis, indexes, statistics, and tuning                      |
| `references/jsonb.md`       | JSONB operators, containment, and indexing                             |
| `references/extensions.md`  | PostGIS, pgvector, pg_trgm, and related extensions                     |
| `references/replication.md` | Streaming replication, logical replication, and failover               |
| `references/maintenance.md` | VACUUM, ANALYZE, `pg_stat` views, and bloat monitoring                 |

---

## 9. TypeScript Advanced Types

**Publisher:** Project-local
**Version / Notes:** Single-file advanced type system skill
**When to load:** Building complex generic utilities, type-safe APIs, event systems, validation layers, advanced reducers, or any TypeScript-heavy feature where `any` would otherwise creep in

### Purpose

Comprehensive TypeScript type-system guidance in one file. The skill walks through generics, conditional types, mapped types, template literal types, utility types, inference techniques, advanced patterns, type testing, common pitfalls, and compile-time performance considerations.

### Top 10 Rules by Priority

1. **Use `unknown` over `any`** - Preserve type safety and force narrowing
2. **Use conditional types with `infer`** - Extract inner types without runtime code
3. **Prefer discriminated unions over vague optional objects** - Model real state machines explicitly
4. **Use mapped types to transform shapes** - Derive types instead of manually duplicating them
5. **Constrain generics with `extends`** - Express the minimum contract a generic needs
6. **Use template literal types for string conventions** - Encode naming and path rules in types
7. **Prefer type guards and assertion functions over unchecked casts** - Narrow safely at runtime
8. **Reach for deep utility types when needed** - `DeepReadonly` and `DeepPartial` are essential for nested state/config
9. **Test your types** - Use compile-time equality helpers to prevent regression
10. **Keep advanced types readable and performant** - Avoid overly deep conditional nesting and recursive complexity when simpler forms work

### Available Files

| File       | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill with concepts, patterns, examples, tests, and pitfalls |

---

## 10. SEO Audit

**Publisher:** Project-local
**Version:** `1.1.0`
**When to load:** Auditing, reviewing, or diagnosing SEO issues on a site, especially around indexing, crawlability, rankings, technical SEO, on-page SEO, traffic drops, Core Web Vitals, or organic-search performance problems

### Purpose

Structured SEO audit guidance for diagnosing why a site is underperforming in organic search. The skill is built around a clear priority order: crawlability and indexation first, then technical foundations, on-page optimization, content quality, and authority. It also includes an explicit warning about schema-markup detection limits when using static fetch tools.

### Top 10 Rules by Priority

1. **Start with context** - Understand the site type, business goal, priority keywords, recent changes, and audit scope before judging issues
2. **Check product marketing context first** - Read `.agents/product-marketing-context.md` when present before asking redundant questions
3. **Prioritize crawlability and indexation first** - Confirm Google can discover, crawl, and index the important URLs before anything else
4. **Audit robots.txt and XML sitemaps** - Look for accidental blocks, missing sitemap references, and non-canonical URLs in the sitemap
5. **Validate canonicalization and indexation signals** - Check `noindex`, canonicals, redirects, duplicate content, and soft 404 patterns
6. **Review Core Web Vitals and technical speed factors** - Focus on LCP, INP, CLS, TTFB, JS, CSS, images, caching, CDN, and font loading
7. **Audit mobile-first readiness** - Verify responsive behavior, tap targets, viewport config, and content parity with desktop
8. **Check core on-page elements page by page** - Review titles, meta descriptions, headings, content depth, images, internal links, and keyword targeting
9. **Do not claim schema is missing from static HTML alone** - JS-injected JSON-LD often will not appear in `curl` or static fetch output
10. **Deliver prioritized, actionable findings** - Organize results into executive summary, evidence-backed findings, and a practical action plan

### Available Files

| File                                 | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `SKILL.md`                           | Full audit workflow covering technical SEO, on-page SEO, content quality, outputs, and tooling |
| `references/ai-writing-detection.md` | Reference on common AI-writing patterns to avoid during SEO/content review                     |
| `evals/evals.json`                   | Evaluation fixture for validating the skill's behavior                                         |

---

## 11. React useEffect

**Publisher:** Project-local
**Version / Notes:** Official-docs-inspired guidance focused on when not to use `useEffect`
**When to load:** Writing or reviewing `useEffect`, derived state, event-driven logic, data fetching, state synchronization, or any React code where effects may be overused

### Purpose

Focused React guidance based on the principle that Effects are an escape hatch for synchronizing with external systems, not a default tool for ordinary state and rendering logic. The skill teaches when to replace `useEffect` with render-time calculation, `useMemo`, event handlers, `key` props, lifted state, or subscription-specific APIs.

### Top 10 Rules by Priority

1. **Use Effects only for external synchronization** - If no external system is involved, an Effect is usually the wrong tool
2. **Do not derive state with `useEffect`** - Compute values from props and state during render instead
3. **Do not use Effects to respond to user events** - Put that logic directly in the event handler
4. **Use `useMemo` for expensive pure calculations** - Do not cache render-derived values with `useEffect`
5. **Use `key` props to reset state on identity changes** - Do not manually reset state in an Effect when component identity changed
6. **Avoid chaining state updates through Effects** - Calculate the next state in one place instead of reacting after the fact
7. **Call parent callbacks at the source of change** - Do not watch local state in an Effect just to notify parents
8. **Use cleanup for data fetching when Effects are required** - Or prefer framework-native data-fetching mechanisms when available
9. **Use `useSyncExternalStore` for subscriptions when possible** - Prefer subscription-specific React APIs over ad hoc Effects
10. **Start from the decision tree** - Distinguish between event handler, Effect, render-time calculation, `useMemo`, and `key`-based reset before writing code

### Available Files

| File               | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `SKILL.md`         | Entry point with quick reference, decision tree, and links to deeper guidance      |
| `anti-patterns.md` | Common `useEffect` mistakes and how to fix them                                    |
| `alternatives.md`  | Better patterns such as `useMemo`, `key`, lifted state, and `useSyncExternalStore` |
| `README.md`        | Human-facing documentation for the skill                                           |

---

## 12. Make Interfaces Feel Better

**Publisher:** Project-local
**Version / Notes:** UI polish skill with 4 focused reference files
**When to load:** Refining interface feel, visual polish, typography, shadows, hover/press states, enter/exit animations, or reviewing why a UI feels slightly off

### Purpose

Practical design-engineering guidance focused on the small details that compound into a polished interface. The skill emphasizes typography, surfaces, animation feel, and performance hygiene, with short rules that are especially useful during UI review and final refinement passes.

### Top 10 Rules by Priority

1. **Concentric border radius** - Nested rounded elements should use radii derived from padding, not identical corner values
2. **Optical over geometric alignment** - Icons and asymmetrical shapes often need manual visual alignment
3. **Shadows over borders** - Prefer layered, transparent depth over hard visual separation where appropriate
4. **Interruptible animations** - Use transitions for interactive states so motion can retarget smoothly
5. **Split and stagger enter animations** - Animate semantic chunks, not a single large container
6. **Subtle exit animations** - Keep exits softer with small fixed offsets instead of dramatic travel
7. **Contextual icon animations** - Icon swaps should use opacity, scale, and blur thoughtfully
8. **Font smoothing** - Apply antialiasing for crisper text rendering on macOS/retina displays
9. **Tabular numbers** - Use tabular numerals for dynamic or comparable values to prevent layout jitter
10. **Text wrapping** - Use `text-wrap: balance` for headings and `text-wrap: pretty` for body copy

### Available Files

| File             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `SKILL.md`       | Entry point with core principles, checklist, and linked references     |
| `typography.md`  | Text wrapping, font smoothing, tabular numbers, and typographic polish |
| `surfaces.md`    | Border radius, shadows, outlines, hit areas, and visual structure      |
| `animations.md`  | Interruptible motion, icon transitions, enter/exit animation details   |
| `performance.md` | Transition specificity and careful use of `will-change`                |

---

## 13. User Interface Wiki

**Publisher:** Raphael Salaja
**Version:** `3.0.0`
**When to load:** Deep UI review or generation work spanning motion, timing, typography, visual design, UX laws, pseudo-elements, icons, container animation, or perceived-performance patterns

### Purpose

Comprehensive UI/UX best-practices reference for web interfaces. The skill contains 152 rules across 12 categories, ranging from animation timing and motion systems to typography, visual design, cognitive-load reduction, and predictive prefetching. It is particularly well-suited for systematic design/code reviews.

### Top 10 Rules by Priority

1. **`timing-under-300ms`** - User-initiated animations should complete within 300ms
2. **`timing-consistent`** - Similar elements should use consistent timing values
3. **`physics-active-state`** - Interactive elements need a pressed-state scale transform
4. **`staging-one-focal-point`** - Only one element should animate prominently at a time
5. **`easing-entrance-ease-out`** - Entrances should use ease-out timing
6. **`duration-press-hover`** - Hover and press feedback should stay in the 120-180ms range
7. **`ux-progressive-disclosure`** - Show what matters now and reveal complexity later
8. **`ux-cognitive-load-reduce`** - Remove redundant or distracting interface burden
9. **`type-text-wrap-balance-headings`** - Headings should use balanced text wrapping where supported
10. **`visual-concentric-radius`** - Nested rounded surfaces should use concentric radius relationships

### Available Files

| File        | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| `SKILL.md`  | Entry point with category overview, quick reference, and usage guidance                       |
| `AGENTS.md` | Fully compiled guide covering all 152 rules                                                   |
| `rules/`    | Individual rule files grouped by animation, UX, typography, visual design, and related topics |

---

## 14. Tailwind CSS Patterns

**Publisher:** Project-local
**Version / Notes:** Single-file utility-first styling guide
**When to load:** Building or refining Tailwind-based UI where responsive layout, spacing, typography, states, accessibility, or reusable utility composition matter

### Purpose

Practical Tailwind guidance for day-to-day component work. The skill focuses on mobile-first styling, consistent use of design tokens, composed utility patterns, responsive layouts, accessibility states, and keeping repeated class patterns intentional rather than ad hoc.

### Top 10 Rules by Priority

1. **Start mobile-first** - Write the base layout for small screens first and add breakpoint prefixes only where needed
2. **Use design tokens over arbitrary values** - Prefer Tailwind scales for spacing, color, and type whenever possible
3. **Compose utilities deliberately** - Build clear utility groups instead of scattered one-off classes
4. **Extract repeated patterns** - Turn recurring utility bundles into shared components or class helpers
5. **Use semantic layout primitives** - Flexbox for one-dimensional alignment, grid for two-dimensional structure
6. **Respect interaction states** - Hover, focus, active, disabled, and reduced-motion states all need explicit styling
7. **Keep accessibility visible** - Preserve focus rings, touch targets, and contrast rather than styling them away
8. **Use responsive typography and spacing** - Let layout density expand with breakpoint changes instead of staying rigid
9. **Test responsive behavior intentionally** - Verify small, medium, and large layouts instead of assuming utilities compose well
10. **Keep production output clean** - Favor maintainable class composition and valid content paths over brittle dynamic utilities

### Available Files

| File       | Description                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `SKILL.md` | Full self-contained Tailwind patterns guide covering layout, spacing, typography, states, accessibility, and performance notes |

---

## 15. Tailwind CSS Advanced Layouts

**Publisher:** Project-local
**Version / Notes:** Single-file advanced layout technique guide
**When to load:** Solving tricky layout problems with CSS Grid, Flexbox, sticky positioning, scrolling containers, container queries, fluid sizing, or layered responsive structure

### Purpose

Focused layout guidance for more complex Tailwind work. The skill emphasizes robust grid and flex patterns, fluid sizing with `minmax()` and `clamp()`, safe overflow handling, sticky and fixed positioning, scroll behavior, and layout patterns that hold up across breakpoints.

### Top 10 Rules by Priority

1. **Use the right layout model** - Reach for grid for two-dimensional composition and flex for one-dimensional alignment
2. **Prevent overflow blowouts** - Add `min-w-0`, `overflow-hidden`, and resilient track sizing where text or content can stretch containers
3. **Use fluid sizing where fixed widths fail** - Prefer `min()`, `max()`, `minmax()`, and `clamp()` for responsive surfaces
4. **Handle mobile toolbars deliberately** - Use scrollable rows, sticky positioning, and fixed actions intentionally on small screens
5. **Build safe sticky layers** - Sticky headers and sidebars need explicit offsets, z-index discipline, and backdrop treatment
6. **Use scroll containers intentionally** - Horizontal overflow, snap, and scroll padding should feel designed rather than incidental
7. **Design for shrinking content** - Flex and grid children should opt into shrink behavior when labels or values can be long
8. **Prefer semantic spacing structures** - Use gaps, divides, and logical spacing instead of brittle margins
9. **Use container-aware responsiveness when helpful** - Let components respond to their own space, not only the viewport
10. **Test breakpoint edge cases** - Validate narrow mobile widths, intermediate tablet widths, and dense desktop layouts for blowouts and awkward wrapping

### Available Files

| File       | Description                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained layout guide covering grid, flex, sticky/fixed positioning, scrolling, fluid sizing, and responsive patterns |

---

## 16. Browser Extension Builder

**Publisher:** vibeship-spawner-skills
**Version / Notes:** Imported single-file skill; source metadata lists Apache 2.0 and `date_added: 2026-02-27`
**When to load:** Starting or shaping a browser extension project, especially around MV3 architecture, content scripts, background workers, popup UI, storage, permissions, Chrome Web Store publishing, or cross-browser support

### Purpose

High-level browser extension architecture guidance focused on building practical extensions that respect real-world platform constraints. The skill covers Manifest V3 structure, popup/background/content-script separation, storage patterns, UI injection, and common product and permission mistakes that make extensions feel untrustworthy or fragile.

### Top 10 Rules by Priority

1. **Start with modern extension structure** - Separate manifest, popup, content, background, options, and icons from the beginning
2. **Build for Manifest V3** - Use a service worker background model and MV3-compatible project layout
3. **Use content scripts only when page context is required** - Read or modify site content inside targeted content scripts
4. **Keep communication paths explicit** - Route popup, background, and content-script messages through clear runtime messaging patterns
5. **Persist settings with Chrome storage** - Use `chrome.storage.local` or `chrome.storage.sync` intentionally for user data and preferences
6. **Request the minimum permissions possible** - Avoid broad permissions and prefer narrow, time-of-use access
7. **Keep background work lightweight** - MV3 service workers are transient, so avoid long-running heavy logic
8. **Inject page UI carefully** - Mount isolated extension UI deliberately and handle interaction wiring cleanly
9. **Design for site breakage and updates** - Assume selectors and host pages will change, and add resilient error handling
10. **Optimize for trust and daily usefulness** - Build tool-like extensions that justify installation, updates, and store listing friction

### Available Files

| File       | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| `SKILL.md` | Full self-contained skill covering MV3 architecture, storage, messaging, and anti-patterns |

---

## 17. Chrome Extension Development

**Publisher:** Project-local
**Version / Notes:** Single-file engineering guide
**When to load:** Writing or reviewing Chrome extension code involving Manifest V3, `chrome.*` APIs, service workers, content scripts, extension security, testing, publishing, or cross-browser compatibility

### Purpose

Practical implementation guidance for Chrome extension engineering. The skill emphasizes modular TypeScript, least-privilege permissions, MV3-compliant architecture, secure messaging, CSP-aware implementation, performance hygiene, accessibility, internationalization, and release readiness.

### Top 10 Rules by Priority

1. **Follow Manifest V3 strictly** - Use current MV3 patterns and service-worker-based background logic
2. **Keep code modular and typed** - Prefer clear TypeScript modules, logical file separation, and descriptive naming
3. **Split responsibilities by runtime boundary** - Keep popup, background, content scripts, and utilities focused on their own jobs
4. **Use Chrome APIs correctly** - Handle `storage`, `tabs`, `runtime`, `action`, and related APIs through proper async flows
5. **Apply least-privilege permissions** - Request only the permissions the extension truly needs
6. **Treat security and privacy as first-class** - Honor CSP, secure messaging, safe cross-origin behavior, and careful data handling
7. **Optimize for low resource usage** - Avoid leaks, reduce background overhead, and cache strategically
8. **Design polished extension UX** - Support responsive popups, loading states, keyboard navigation, and accessible feedback
9. **Internationalize when needed** - Use `chrome.i18n`, `_locales`, and locale-aware formatting correctly
10. **Prepare for maintenance and publishing** - Include testing, documentation, store assets, privacy disclosures, and update discipline

### Available Files

| File       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `SKILL.md` | Full self-contained guide for MV3 code structure, APIs, security, UX, and publishing |

---

## 18. Chrome Extension UI

**Publisher:** Chrome Extensions Community
**Version:** `0.1.0`
**When to load:** Building or reviewing Chrome extension UI for popups, side panels, content-script surfaces, options pages, extension feedback states, accessibility, or extension-specific visual design decisions

### Purpose

Comprehensive UX and UI guidance for Chrome extensions, organized around the surfaces and constraints unique to browser extensions. The skill prioritizes choosing the right surface first, then accessibility, popup behavior, side panel ergonomics, injected UI isolation, user feedback, settings persistence, and store-facing branding details.

### Top 10 Rules by Priority

1. **Choose the right extension surface first** - Decide between popup, side panel, or in-page content-script UI before implementation
2. **Keep extension UI single-purpose** - Make each surface focused and easy to understand quickly
3. **Request minimal permissions** - UI and trust are tightly linked to permission prompts and install confidence
4. **Guarantee keyboard accessibility** - Support keyboard navigation, visible focus, semantic HTML, and no focus traps
5. **Respect popup constraints** - Design within popup size limits and render primary actions instantly
6. **Handle popup lifecycle explicitly** - Plan for auto-close behavior and state-based popup switching
7. **Design side panels to stay useful without distracting** - Support resizing, lazy sections, and live page context
8. **Isolate injected UI from host pages** - Use Shadow DOM, unique IDs, correct timing, cleanup, and safe overlay layering
9. **Give users clear feedback** - Provide loading, progress, success, badge status, and actionable error messaging
10. **Carry polish through settings and branding** - Auto-save settings, sync where appropriate, and ship complete icon/store assets

### Available Files

| File                | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `SKILL.md`          | Entry point with category overview, quick reference, and rule links                |
| `AGENTS.md`         | Expanded compiled guide with all categories, rule summaries, and references        |
| `references/`       | 42 rule documents covering component choice, accessibility, feedback, and branding |
| `assets/templates/` | Template file for adding new UI rules                                              |

---

## 19. HTML/CSS Best Practices

**Publisher:** Project-local
**Version / Notes:** Single-file HTML/CSS guidance; use for the Rootly extension only
**When to load:** Reviewing or refining Rootly extension HTML and CSS for semantic structure, accessibility, responsive layout, CSS organization, custom properties, and maintainability

### Purpose

Practical HTML/CSS guidance for the extension's side-panel UI. This skill is especially useful when auditing semantic markup, floating UI behavior, CSS variable usage, layout resilience, and accessibility details in the extension's handcrafted HTML and CSS.

### Top 10 Rules by Priority

1. **Use semantic elements first** - Prefer meaningful HTML structure over generic wrappers when a semantic element exists
2. **Keep heading structure coherent** - Use headings in order and avoid misleading document structure
3. **Use buttons for actions and links for navigation** - Preserve correct semantics for interaction
4. **Keep CSS organized and token-driven** - Start with custom properties, then base styles, layout, components, utilities, and media queries
5. **Design mobile-first and responsive by default** - Ensure layouts hold up across narrow and wide side-panel widths
6. **Prefer relative sizing where possible** - Avoid over-reliance on fixed pixel assumptions for resilient layout
7. **Preserve accessible focus and touch targets** - Interactive controls need clear focus and usable target size
8. **Avoid overflow bugs** - Floating UI, layouts, and content should not clip or force accidental horizontal scrolling
9. **Keep selectors efficient and maintainable** - Avoid brittle specificity and unnecessary complexity
10. **Optimize for maintainability and performance** - Favor clear structure, light CSS, and reusable patterns over one-off styling hacks

### Available Files

| File       | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained HTML/CSS guide for semantic structure and styling |

---

## 20. Modern JavaScript Patterns

**Publisher:** Project-local
**Version / Notes:** Single-file JavaScript guidance; use for the Rootly extension only
**When to load:** Reviewing or refactoring Rootly extension JavaScript for module boundaries, async flows, DOM logic, state updates, and maintainable ES modules

### Purpose

Modern JavaScript guidance for the extension's plain-JS runtime. This skill is especially useful when auditing async message flows, DOM rendering code, event wiring, shared helpers, immutable updates, and the general maintainability of extension-side modules.

### Top 10 Rules by Priority

1. **Prefer clear ES module boundaries** - Split unrelated concerns into focused modules with descriptive exports
2. **Use modern syntax where it improves clarity** - Favor `const`, `let`, destructuring, template literals, and concise object handling intentionally
3. **Keep async flows explicit** - Use `async` and `await` clearly, and keep error handling close to the failing work
4. **Avoid duplicated imperative code** - Extract repeated logic into shared helpers instead of repeating event or state code
5. **Use immutable state updates deliberately** - Replace nested mutation with clear derived objects where possible
6. **Keep DOM updates safe** - Prefer DOM APIs and `textContent` over `innerHTML` for untrusted data
7. **Separate rendering from state and effects** - Keep data shaping, DOM rendering, and side effects from collapsing into one file
8. **Keep event wiring maintainable** - Group listeners by concern and avoid sprawling setup blocks
9. **Avoid unnecessary runtime work** - Reduce polling, repeated DOM rebuilds, and avoidable async churn
10. **Write for long-term readability** - Prefer small, explicit functions that make extension behavior easy to trace

### Available Files

| File       | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained guide for modern ES modules and JavaScript patterns |

---

## 21. Vercel React View Transitions

**Publisher:** Vercel
**Version:** `1.0.0`
**When to load:** Adding or reviewing route transitions, shared-element animations, Suspense reveal motion, or typed directional navigation in React and Next.js apps using the native View Transition API

### Purpose

Guidance for implementing browser-native view transitions using React's `<ViewTransition>` API and Next.js integration points. The skill emphasizes animation semantics first (what motion communicates), then implementation order, CSS recipes, transition typing (`nav-forward` and `nav-back`), shared-element naming, Suspense reveals, and reduced-motion-safe behavior.

### Top 10 Rules by Priority

1. **Audit before implementation** - Map all navigation triggers, Suspense boundaries, persistent UI, and shared elements before coding
2. **Implement patterns in priority order** - Shared elements, Suspense reveal, list identity, state enter/exit, then route transitions
3. **Enable Next.js view-transition support intentionally** - Set `experimental.viewTransition: true` to animate `<Link>` navigations
4. **Avoid layout-level VT wrappers for page transitions** - Page-level VTs should own enter/exit to prevent nested suppression
5. **Use typed transitions for hierarchical navigation** - Use `nav-forward` and `nav-back` rather than generic fades for list-to-detail depth
6. **Reserve directional slides for ordered/hierarchical flows** - Use non-directional transitions for lateral tab-like navigation
7. **Use `default="none"` by default** - Opt in explicitly to avoid unwanted global cross-fades on every transition
8. **Use simple string props for Suspense reveal transitions** - Transition types are not available for later Suspense resolves
9. **Use stable unique names for shared elements** - `name` must be unique and present on both source and target in the same transition
10. **Do not rely on `router.back()` for typed back transitions** - Use explicit `router.push()` paths for transition-type control

### Available Files

| File                           | Description                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `SKILL.md`                     | Entry point with API usage, priorities, and integration summary                    |
| `AGENTS.md`                    | Fully expanded compiled guide                                                      |
| `references/implementation.md` | Step-by-step rollout workflow for audits, CSS setup, and pattern adoption          |
| `references/nextjs.md`         | Next.js-specific setup (`experimental.viewTransition`, `transitionTypes`, routing) |
| `references/css-recipes.md`    | Ready-to-use CSS animation and reduced-motion recipes                              |
| `references/patterns.md`       | Common implementation patterns and troubleshooting                                 |
