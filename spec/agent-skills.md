# Agent Skills

> This document is the authoritative reference for all `.agents` skills available in this project. It describes each skill's purpose, its top rules by priority, where to find its files, and what resources are available inside it. Use this document to know **which skill to load** before generating, reviewing, or refactoring code.

Skills in this repository live under the `.agents/skills/` directory. Depending on the skill publisher, each skill directory may contain some or all of the following:

| File / Folder | Purpose |
| ------------- | ------- |
| `SKILL.md` | Lightweight entry point describing when to apply the skill and how to use it |
| `AGENTS.md` | Fully compiled, expanded version of the rules for deeper context |
| `README.md` | Human-facing documentation about structure and contribution |
| `CLAUDE.md` | Publisher-specific companion guidance file |
| `rules/` | Individual rule files, typically one rule per file |
| `references/` | Topic-specific reference documents loaded as needed |
| `evals/` | Evaluation fixtures or validation assets used by the skill |
| `*.md` topic files | Standalone topic guides linked directly from `SKILL.md` |

---

## Skills Index

| # | Skill | Publisher | Version / Notes | Path |
| --- | --- | --- | --- | --- |
| 1 | [Vercel React Best Practices](#1-vercel-react-best-practices) | Vercel | `v1.0.0` | `.agents/skills/vercel-react-best-practices/` |
| 2 | [Next.js Best Practices](#2-nextjs-best-practices) | Project-local | Topic index skill | `.agents/skills/next-best-practices/` |
| 3 | [React Composition Patterns](#3-react-composition-patterns) | Vercel | `v1.0.0` | `.agents/skills/vercel-composition-patterns/` |
| 4 | [Design Engineering](#4-design-engineering) | Project-local (Emil Kowalski-inspired) | Single-file skill | `.agents/skills/emil-design-eng/` |
| 5 | [Fixing Motion Performance](#5-fixing-motion-performance) | Project-local | Single-file audit/fix skill | `.agents/skills/fixing-motion-performance/` |
| 6 | [Supabase Postgres Best Practices](#6-supabase-postgres-best-practices) | Supabase | `v1.1.0` | `.agents/skills/supabase-postgres-best-practices/` |
| 7 | [PostgreSQL Table Design](#7-postgresql-table-design) | Project-local | Single-file skill | `.agents/skills/postgresql-table-design/` |
| 8 | [PostgreSQL Pro](#8-postgresql-pro) | Jeff Allan | `v1.1.0` | `.agents/skills/postgres-pro/` |
| 9 | [TypeScript Advanced Types](#9-typescript-advanced-types) | Project-local | Single-file skill | `.agents/skills/typescript-advanced-types/` |
| 10 | [SEO Audit](#10-seo-audit) | Project-local | `v1.1.0` | `.agents/skills/seo-audit/` |

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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point with category table, quick reference, and usage notes |
| `AGENTS.md` | Fully compiled guide for all 58 rules |
| `README.md` | Contribution guide and rule structure |
| `rules/` | 58 individual rule files with explanations and good/bad examples |

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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point linking to all topic guides |
| `file-conventions.md` | Route segments, special files, and structural conventions |
| `rsc-boundaries.md` | Invalid RSC patterns and serialization pitfalls |
| `async-patterns.md` | Async params, search params, cookies, and headers |
| `runtime-selection.md` | Node.js vs Edge runtime guidance |
| `directives.md` | `'use client'`, `'use server'`, and `'use cache'` usage |
| `functions.md` | Navigation hooks and server/runtime helper functions |
| `error-handling.md` | Route-level errors, redirects, and auth errors |
| `data-patterns.md` | Data fetching patterns, waterfalls, and server/client tradeoffs |
| `route-handlers.md` | Route handler behavior and when to use it |
| `metadata.md` | Static/dynamic metadata and OG image generation |
| `image.md` | `next/image` usage and optimization |
| `font.md` | `next/font` setup and preload guidance |
| `bundling.md` | Package compatibility, CSS imports, and bundle analysis |
| `scripts.md` | `next/script` usage and third-party script loading |
| `hydration-error.md` | Common hydration mismatch causes and fixes |
| `suspense-boundaries.md` | Hooks and patterns that require Suspense |
| `parallel-routes.md` | Parallel and intercepting route patterns |
| `self-hosting.md` | Docker standalone output and cache handlers |
| `debug-tricks.md` | AI/debug tooling and targeted rebuild tips |

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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point with priority categories and quick reference |
| `AGENTS.md` | Fully compiled guide with expanded rule detail |
| `README.md` | Structure and contribution guide |
| `rules/` | 8 individual rule files with explanations and examples |

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

| File | Description |
| ---- | ----------- |
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

| File | Description |
| ---- | ----------- |
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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point with category table and usage guidance |
| `AGENTS.md` | Fully compiled deep-context version of the skill |
| `README.md` | Human-facing usage and structure notes |
| `CLAUDE.md` | Publisher-specific companion guidance |
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

| File | Description |
| ---- | ----------- |
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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point with workflow, patterns, constraints, and output templates |
| `references/performance.md` | EXPLAIN analysis, indexes, statistics, and tuning |
| `references/jsonb.md` | JSONB operators, containment, and indexing |
| `references/extensions.md` | PostGIS, pgvector, pg_trgm, and related extensions |
| `references/replication.md` | Streaming replication, logical replication, and failover |
| `references/maintenance.md` | VACUUM, ANALYZE, `pg_stat` views, and bloat monitoring |

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

| File | Description |
| ---- | ----------- |
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

| File | Description |
| ---- | ----------- |
| `SKILL.md` | Full audit workflow covering technical SEO, on-page SEO, content quality, outputs, and tooling |
| `references/ai-writing-detection.md` | Reference on common AI-writing patterns to avoid during SEO/content review |
| `evals/evals.json` | Evaluation fixture for validating the skill's behavior |
