# Agent Skills

> This document is the authoritative reference for all `.agent` skills available in this project. It describes each skill's purpose, its top 10 rules by priority, where to find its files, and what resources are available inside it. Use this document to know **which skill to load** before generating, reviewing, or refactoring any code.

Skills follow the [skills.sh](https://skills.sh) standard and are placed in the `.agents/` directory. Depending on the skill publisher, each skill directory may contain some or all of the following:

| File / Folder | Purpose                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------- |
| `SKILL.md`    | Lightweight entry point — describes the skill, when to apply it, and links to references |
| `AGENTS.md`   | Fully compiled, expanded version of all rules — use this when you need deep context      |
| `README.md`   | Human-facing documentation about how the skill is structured and how to contribute       |
| `references/` | Individual rule files (one rule per file) — load specific files when needed              |

---

## Skills Index

| #   | Skill                                                                   | Publisher     | skills.sh Installs | Path                                        |
| --- | ----------------------------------------------------------------------- | ------------- | ------------------ | ------------------------------------------- |
| 1   | [React Best Practices](#1-react-best-practices)                         | Vercel        | 3,900+             | `.agents/react-best-practices/`             |
| 2   | [Next.js Best Practices](#2-nextjs-best-practices)                      | Vercel        | 768+               | `.agents/next-best-practices/`              |
| 3   | [Frontend Design](#3-frontend-design)                                   | Anthropic     | 3,100+             | `.agents/frontend-design/`                  |
| 4   | [React Composition Patterns](#4-react-composition-patterns)             | Vercel        | 1,700+             | `.agents/composition-patterns/`             |
| 5   | [Animation Best Practices](#5-animation-best-practices)                 | Emil Kowalski | —                  | `.agents/emilkowal-animations/`             |
| 6   | [Supabase Postgres Best Practices](#6-supabase-postgres-best-practices) | Supabase      | 724+               | `.agents/supabase-postgres-best-practices/` |
| 7   | [PostgreSQL Table Design](#7-postgresql-table-design)                   | wshobson      | —                  | `.agents/postgresql-table-design/`          |
| 8   | [PostgreSQL Pro](#8-postgresql-pro)                                     | jeffallan     | —                  | `.agents/postgres-pro/`                     |
| 9   | [TypeScript Advanced Types](#9-typescript-advanced-types)               | wshobson      | —                  | `.agents/typescript-advanced-types/`        |
| 10  | [Web Interface Guidelines](#10-web-interface-guidelines)                | Vercel        | 3,200+             | `.agents/web-design-guidelines/`            |

---

## 1. React Best Practices

**Publisher:** Vercel (originally by [@shuding](https://x.com/shuding))
**skills.sh rank:** #51 all-time — 3,900+ installs
**When to load:** Writing, reviewing, or refactoring React components; data fetching; bundle optimization; performance improvements in React or Next.js code

### Purpose

Comprehensive performance optimization guide for React and Next.js applications. Contains 58 rules across 8 priority-ranked categories. The focus is on real, measurable performance gains — from eliminating data waterfalls (CRITICAL) down to advanced patterns (LOW).

### Top 10 Rules by Priority

1. **`async-parallel`** — Use `Promise.all()` for independent async operations; never `await` them sequentially
2. **`async-defer-await`** — Move `await` as late as possible (into the branch where it is actually needed)
3. **`async-suspense-boundaries`** — Use `<Suspense>` boundaries to stream content progressively
4. **`bundle-barrel-imports`** — Import directly from source files; never from barrel (`index.ts`) files
5. **`bundle-dynamic-imports`** — Use `next/dynamic` for heavy components to defer their JS
6. **`server-cache-react`** — Use `React.cache()` for per-request deduplication in Server Components
7. **`server-parallel-fetching`** — Restructure Server Components to parallelize fetches at the same tree level
8. **`rerender-memo`** — Extract expensive computations into memoized components
9. **`rerender-derived-state-no-effect`** — Derive state during render, not inside `useEffect`
10. **`rerender-functional-setstate`** — Always use functional `setState` form when new state depends on previous state

### Available Files

| File        | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `SKILL.md`  | Entry point with category table and quick reference for all 58 rules |
| `AGENTS.md` | Fully compiled document with all rules expanded                      |
| `README.md` | Contribution guide and rule file structure                           |
| `rules/`    | One `.md` file per rule with bad/good code examples                  |

---

## 2. Next.js Best Practices

**Publisher:** Vercel
**skills.sh rank:** #124 all-time — 768+ installs
**When to load:** Writing or reviewing Next.js App Router code; async APIs; RSC/client component boundaries; metadata; image/font optimization; error handling; route handlers; bundling

### Purpose

Defines correct Next.js App Router patterns across 18 topic areas. Unlike the React Best Practices skill (which is focused on performance), this skill is focused on **correctness** — preventing common mistakes in Next.js v15/v16: async params, invalid RSC patterns, hydration errors, wrong runtime selection, and misuse of route handlers vs server actions.

### Top 10 Rules by Priority

1. **RSC boundaries** — Never make async Client Components; detect non-serializable props passed from server to client
2. **Async params/cookies/headers** — In Next.js 15+, `params`, `searchParams`, `cookies()`, `headers()` are all async — always `await` them
3. **`'use client'` placement** — Push `'use client'` as deep as possible to maximize the Server Component tree
4. **`'use cache'` directive** — Use `'use cache'` for Next.js-level caching on server functions and components
5. **Data waterfalls** — Use `Promise.all`, Suspense preloading, or parallel segments to avoid sequential fetches
6. **`next/image` always** — Never use a plain `<img>` tag; always use `next/image` for automatic optimization, sizing, and LCP
7. **`next/font` always** — Load fonts via `next/font` (never via `<link>`); preload only needed subsets
8. **Error boundaries** — Use `error.tsx`, `global-error.tsx`, and `not-found.tsx` for each route segment; never let errors bubble unhandled
9. **`useSearchParams` wrapping** — Always wrap components using `useSearchParams` or `usePathname` in `<Suspense>` to prevent CSR bailout
10. **Route handlers vs server actions** — Use Route Handlers (`route.ts`) for external API consumption; use Server Actions for form mutations from Client Components

### Available Files

| File                     | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `SKILL.md`               | Master index linking to all 18 topic reference files          |
| `async-patterns.md`      | Async params, cookies, headers — Next.js 15+ breaking changes |
| `rsc-boundaries.md`      | Invalid RSC pattern detection                                 |
| `data-patterns.md`       | Data fetching strategies and waterfall avoidance              |
| `error-handling.md`      | Error, not-found, redirect, forbidden patterns                |
| `file-conventions.md`    | Route segments, middleware rename, special files              |
| `bundling.md`            | Server-incompatible packages, ESM/CJS, bundle analysis        |
| `metadata.md`            | Static/dynamic metadata, OG images with `next/og`             |
| `image.md`               | `next/image` usage, remote config, LCP priority               |
| `font.md`                | `next/font`, Google Fonts, Tailwind integration               |
| `parallel-routes.md`     | Modal pattern with `@slot` and `(.)` interceptors             |
| `hydration-error.md`     | Common causes and fixes for hydration mismatches              |
| `suspense-boundaries.md` | Hooks that require Suspense wrapping                          |
| `route-handlers.md`      | `route.ts` basics and when to use vs server actions           |
| `self-hosting.md`        | Docker `standalone` output, multi-instance ISR cache          |
| `debug-tricks.md`        | MCP endpoint and `--debug-build-paths` flag                   |

---

## 3. Frontend Design

**Publisher:** Anthropic
**skills.sh rank:** #54 all-time — 3,100+ installs
**When to load:** Building web components, pages, dashboards, or any UI; styling/beautifying existing interfaces; asked to make something "look good"

### Purpose

Guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. It enforces intentional design thinking before coding — committing to a bold aesthetic direction — and sets strict rules against predictable, cookie-cutter visual choices. Works for HTML/CSS/JS, React, Vue, or any frontend technology.

### Top 10 Rules by Priority

1. **Commit to a bold aesthetic direction first** — Before writing a line of code, pick an extreme tone: brutally minimal, maximalist, retro-futuristic, editorial, etc. Never default to a neutral middle ground
2. **Never use generic fonts** — Avoid Inter, Roboto, Arial, system-ui. Choose characterful display fonts paired with refined body fonts
3. **No purple gradients on white** — The single most overused AI aesthetic; any design that uses it is automatically considered low-quality
4. **Every animation needs a purpose** — Use Motion library (Framer Motion) for React; prioritize CSS-only for HTML; use staggered reveals, not scattered micro-interactions
5. **Color: dominant + sharp accent** — Build a cohesive palette using CSS variables; dominant colors with sharp accents outperform evenly distributed palettes
6. **Spatial composition: break the grid** — Use asymmetry, overlap, diagonal flow, and generous negative space or controlled density
7. **Backgrounds create atmosphere** — Gradient meshes, noise textures, grain overlays, layered transparencies — never default to a plain solid color
8. **Match implementation complexity to vision** — Maximalist designs need elaborate code with full animations; minimalist designs need restraint and spacing precision
9. **Every generation must be different** — Vary light/dark, font choices, aesthetic direction — never converge on the same output
10. **Production-grade and functional** — Visually striking code must also be real, working, accessible code — not just a mockup

### Available Files

| File       | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| `SKILL.md` | Full skill — all design thinking guidelines and rules are self-contained in this single file |

---

## 4. React Composition Patterns

**Publisher:** Vercel
**skills.sh rank:** #61 all-time — 1,700+ installs
**When to load:** Refactoring components with many boolean props; building reusable component libraries; designing flexible component APIs; working with context providers or compound components

### Purpose

Teaches composition patterns that scale — specifically how to avoid the `isLoading`, `isError`, `isSmall`, `isDisabled` boolean prop proliferation antipattern. Covers compound components, state decoupling, context-based interfaces, and React 19 API changes (`forwardRef` removal, `use()` hook).

### Top 10 Rules by Priority

1. **`architecture-avoid-boolean-props`** — Never add boolean props to customize behavior; use composition and explicit variant components instead
2. **`architecture-compound-components`** — Structure complex components with shared context so each sub-component accesses what it needs directly
3. **`state-decouple-implementation`** — The Provider is the only place that knows how state is managed; consumers only see the interface
4. **`state-context-interface`** — Define a generic interface with `state`, `actions`, and `meta` for full dependency injection and testability
5. **`state-lift-state`** — Move state into provider components so sibling components can share it without prop drilling
6. **`patterns-explicit-variants`** — Create explicit variant components (`<ButtonPrimary>`, `<ButtonDestructive>`) instead of `<Button variant="primary" isDestructive>`
7. **`patterns-children-over-render-props`** — Use `children` for composition instead of `renderX` prop callbacks
8. **`react19-no-forwardref`** — In React 19+, do not use `forwardRef`; accept `ref` as a plain prop
9. **`react19-use-context`** — Use the `use()` hook instead of `useContext()` in React 19+
10. **Compound over configuration** — A component that accepts children and composes behavior is always preferable to a monolithic component with a config object

### Available Files

| File        | Description                                         |
| ----------- | --------------------------------------------------- |
| `SKILL.md`  | Entry point with category table and quick reference |
| `AGENTS.md` | Fully compiled document with all rules expanded     |
| `README.md` | Structure and contribution guide                    |
| `rules/`    | Individual rule files with bad/good code examples   |

---

## 5. Animation Best Practices

**Publisher:** Emil Kowalski (via [pproenca/dot-skills](https://github.com/pproenca/dot-skills))
**skills.sh rank:** Experimental — community-maintained
**When to load:** Adding animations to React components; choosing easing curves or timing values; implementing gesture-based interactions; building toasts, drawers, or sheet components; optimizing animation performance; ensuring animation accessibility

### Purpose

Based on Emil Kowalski's [animations.dev](https://animations.dev) course and his open-source libraries (Sonner, Vaul). Contains 43 rules across 7 priority-ranked categories. Directly applicable to Rootly since the project uses **Motion (Framer Motion v12)** for animations.

### Top 10 Rules by Priority

1. **`ease-out-default`** — Use `ease-out` as your default easing for all UI animations
2. **`ease-custom-curves`** — Use custom `cubic-bezier()` values instead of built-in CSS keywords for precision
3. **`timing-300ms-max`** — All UI animations must stay under 300ms; anything longer feels sluggish
4. **`timing-faster-better`** — Faster animations improve perceived performance — when in doubt, go faster
5. **`props-transform-opacity`** — Only animate `transform` and `opacity`; never animate `width`, `height`, `top`, `left`, or any layout-triggering property
6. **`props-hardware-accelerated`** — Use hardware-accelerated animations when the main thread is busy (scrolling, interactions)
7. **`transform-scale-097`** — Scale buttons to `0.97` on press for tactile feedback
8. **`transform-never-scale-zero`** — Never animate from `scale(0)`; start at `scale(0.95)` minimum
9. **`interact-interruptible`** — All animations must be interruptible; never lock the user out during a transition
10. **`polish-reduced-motion`** — Always respect `prefers-reduced-motion`; use opacity as the reduced-motion fallback, but do not remove all animation

### Key Values Reference

| Value                            | Usage                                  |
| -------------------------------- | -------------------------------------- |
| `cubic-bezier(0.32, 0.72, 0, 1)` | iOS-style drawer/sheet animation       |
| `scale(0.97)`                    | Button press feedback                  |
| `scale(0.95)`                    | Minimum enter scale (never `scale(0)`) |
| `200ms ease-out`                 | Standard UI transition                 |
| `300ms`                          | Maximum duration for UI animations     |
| `500ms`                          | Drawer animation duration              |
| `14px`                           | Toast stack offset                     |

### Available Files

| File          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `SKILL.md`    | Full skill with all 43 rules, key values table, and reference file index |
| `references/` | Individual rule files (one per rule, named by rule ID)                   |

---

## 6. Supabase Postgres Best Practices

**Publisher:** Supabase
**skills.sh rank:** #152 all-time — 724+ installs
**When to load:** Writing SQL queries; designing schemas; implementing indexes; reviewing database performance; configuring connection pooling; working with RLS policies

### Purpose

Comprehensive Postgres performance optimization guide maintained by Supabase. Contains rules across 8 priority-ranked categories — from CRITICAL (query performance, connection management, RLS/security) down to LOW (advanced features). Each rule has SQL examples and EXPLAIN output. Directly applicable to Rootly since v2 uses Supabase PostgreSQL with RLS.

### Top 10 Rules by Priority

1. **`query-missing-indexes`** — Add indexes to every column used in `WHERE`, `JOIN`, or `ORDER BY`; unindexed queries on large tables cause sequential scans
2. **`query-composite-indexes`** — Order matters: put equality columns first, range columns last in composite indexes
3. **`query-partial-indexes`** — Use partial indexes (`WHERE status = 'active'`) to index only the hot subset of data
4. **`query-covering-indexes`** — Use `INCLUDE (col)` to add non-key columns and enable index-only scans
5. **`conn-pooling`** — Always use a connection pooler (Supabase uses PgBouncer); direct connections exhaust Postgres limits fast
6. **`conn-prepared-statements`** — Use prepared statements to reduce parse/plan overhead and prevent SQL injection
7. **`security-rls-basics`** — Enable RLS on every table with `ALTER TABLE tbl ENABLE ROW LEVEL SECURITY`; never skip it
8. **`security-rls-performance`** — Write RLS policies using `(select auth.uid())` (with parentheses) to prevent per-row function calls
9. **`schema-primary-keys`** — Use `BIGINT GENERATED ALWAYS AS IDENTITY`; avoid `SERIAL`; use `UUID` only when global uniqueness is required
10. **`schema-foreign-key-indexes`** — PostgreSQL does NOT auto-index FK columns — always add an explicit index on every foreign key

### Available Files

| File          | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `SKILL.md`    | Entry point with 8-category priority table and reference links        |
| `AGENTS.md`   | Fully compiled version (for deep context loading)                     |
| `README.md`   | Installation and usage guide                                          |
| `references/` | One `.md` file per rule with bad/good SQL examples and EXPLAIN output |

---

## 7. PostgreSQL Table Design

**Publisher:** wshobson
**skills.sh rank:** Community — no public install count
**When to load:** Designing new database tables from scratch; choosing column data types; deciding between UUID vs BIGINT for primary keys; setting up constraints, partitioning, or JSONB columns; planning index strategy before writing migrations

### Purpose

A dense, reference-grade PostgreSQL schema design guide. Covers every aspect of table design: correct data types, the types to never use, indexing strategies (B-tree, GIN, GiST, BRIN, partial, covering, expression), partitioning patterns, update-heavy vs insert-heavy workload optimizations, safe schema evolution, JSONB guidance, and extensions. Pairs well with the Supabase skill (which covers query performance and RLS) — this skill covers the schema layer.

### Top 10 Rules by Priority

1. **Primary keys** — Use `BIGINT GENERATED ALWAYS AS IDENTITY`; use `UUID` only when global uniqueness or opacity is needed; never use `SERIAL`
2. **Normalize first (3NF)** — Eliminate redundancy before you denormalize; premature denormalization creates maintenance debt
3. **`NOT NULL` everywhere** — Apply `NOT NULL` to every column where null is semantically meaningless; pair with `DEFAULT` values
4. **Index every FK column** — PostgreSQL never auto-indexes FK columns; add indexes manually or pay the join/lock penalty
5. **Data type discipline** — Use `TIMESTAMPTZ` (never `TIMESTAMP`), `NUMERIC` for money, `TEXT` (never `VARCHAR(n)` or `CHAR(n)`), `BIGINT` for IDs
6. **Never use deprecated types** — Never use `timestamp`, `char(n)`, `varchar(n)`, `money`, `timetz`, `serial`, or `timestamptz(0)`
7. **`snake_case` identifiers** — Always use lowercase `snake_case`; unquoted identifiers are lowercased by Postgres anyway
8. **JSONB with GIN index** — Use `JSONB` (never `JSON`) for semi-structured data; always add a GIN index for containment queries
9. **Partial indexes for hot subsets** — Index only active/pending rows with `WHERE status = 'active'` to keep indexes small and fast
10. **Safe schema evolution** — Use `CREATE INDEX CONCURRENTLY` in production; `NOT NULL` columns with volatile defaults cause full table rewrites — plan migrations carefully

### Available Files

| File       | Description                                                                        |
| ---------- | ---------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill — all rules, examples, data type tables, SQL code blocks |

---

## 8. PostgreSQL Pro

**Publisher:** jeffallan
**skills.sh rank:** Community — MIT licensed, v1.1.0
**When to load:** Analyzing slow queries with `EXPLAIN`; optimizing indexes; setting up streaming or logical replication; configuring VACUUM/autovacuum; monitoring with `pg_stat` views; implementing JSONB indexing; using PostgreSQL extensions (PostGIS, pgvector, pg_trgm)

### Purpose

Positions the LLM as a senior PostgreSQL DBA. Unlike the Supabase and Table Design skills (which cover schema and query best practices), this skill covers **operational PostgreSQL** — the live workflow of identifying bottlenecks, fixing them, verifying the fix, and monitoring ongoing health. It is the most DBA-oriented of the three PostgreSQL skills.

### Top 10 Rules by Priority

1. **Always use `EXPLAIN (ANALYZE, BUFFERS)`** — Never optimize blind; always get a real query plan with buffer stats before and after any change
2. **Verify indexes are used** — Run `EXPLAIN` before creating an index and after; if the planner doesn't use it, the index adds write overhead for nothing
3. **`CREATE INDEX CONCURRENTLY`** — Never create indexes in production with a plain `CREATE INDEX`; it locks the table
4. **Run `ANALYZE` after bulk changes** — Statistics go stale after bulk inserts/deletes; outdated stats lead the planner to wrong strategies
5. **Monitor autovacuum** — Tune `autovacuum_vacuum_scale_factor` for high-churn tables; dead tuple accumulation causes bloat and slowdowns
6. **Use connection pooling** — Always route through pgBouncer or pgPool; direct connections to Postgres under load cause connection exhaustion
7. **Monitor replication lag** — Watch `(sent_lsn - replay_lsn)` in `pg_stat_replication`; don't let standby lag silently grow
8. **Use prepared statements** — Reduces parse/plan overhead and prevents SQL injection; essential for high-frequency queries
9. **Never `SELECT *` in production** — Always name columns explicitly; `SELECT *` bypasses covering indexes and pulls unnecessary data
10. **Never disable autovacuum globally** — Disabling autovacuum causes unbounded table bloat; tune it instead of turning it off

### Core Workflow

```sql
-- 1. Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- 2. Analyze the worst offender
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders
WHERE customer_id = 42 AND status = 'pending';

-- 3. Create a targeted index (concurrently — no lock)
CREATE INDEX CONCURRENTLY idx_orders_customer_status
ON orders (customer_id, status)
WHERE status = 'pending';

-- 4. Verify the index is actually used
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders
WHERE customer_id = 42 AND status = 'pending';

-- 5. Refresh statistics if needed
ANALYZE orders;
```

### Available Files

| File                        | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `SKILL.md`                  | Full skill with workflow, patterns, MUST DO / MUST NOT DO rules, and reference table |
| `references/performance.md` | EXPLAIN ANALYZE, indexes, statistics, query tuning                                   |
| `references/jsonb.md`       | JSONB operators, indexing, GIN, containment queries                                  |
| `references/extensions.md`  | PostGIS, pgvector, pg_trgm, pg_stat_statements                                       |
| `references/replication.md` | Streaming replication, logical replication, failover                                 |
| `references/maintenance.md` | VACUUM, ANALYZE, pg_stat views, bloat monitoring                                     |

---

## 9. TypeScript Advanced Types

**Publisher:** wshobson
**skills.sh rank:** Community — no public install count
**When to load:** Implementing complex generic logic; building type-safe API clients, event emitters, or form validators; creating reusable type utilities; migrating JavaScript to TypeScript; any time you reach for `any` and need a better solution

### Purpose

A comprehensive, example-driven guide to TypeScript's advanced type system. Covers the 5 core pillars — generics, conditional types, mapped types, template literal types, and utility types — plus 6 real-world advanced patterns with full working code. Uniquely includes a **type testing** section and a **common pitfalls** section. The skill is self-contained in a single `SKILL.md` with no separate reference files.

### Top 10 Rules by Priority

1. **Use `unknown` over `any`** — `unknown` forces you to narrow before use; `any` silently disables the type checker and defeats the purpose of TypeScript
2. **Leverage `infer` in conditional types** — Extract inner types (return types, promise types, array element types) without runtime code using `infer R`
3. **Prefer discriminated unions over optional fields** — Model state machines with `{ status: 'success'; data: T } | { status: 'error'; error: string }` so the compiler exhausts all cases
4. **Use mapped types to transform, not duplicate** — Derive `Partial<T>`, `Readonly<T>`, `Getters<T>` from a single source of truth; never manually maintain parallel type shapes
5. **Constrain generics with `extends`** — Always bound generics to the minimum required interface (`T extends HasLength`) rather than leaving them unconstrained
6. **Template literal types for string patterns** — Build `EventHandler = \`on${Capitalize<EventName>}\`` to enforce naming conventions at compile time
7. **Type guards over assertions** — Write `value is string` type guard functions instead of `as string` casts; guards are verified at runtime, casts are not
8. **Use `DeepReadonly<T>` / `DeepPartial<T>` for nested objects** — Built-in `Readonly<T>` and `Partial<T>` are shallow; write recursive versions for config/state objects
9. **Test your types with `AssertEqual<T, U>`** — Write compile-time type tests using `[T] extends [U] ? [U] extends [T] ? true : false : false` to prevent type regressions
10. **Avoid deeply nested conditional types** — They slow down the TypeScript compiler significantly; flatten or cache intermediate types with `type` aliases

### Advanced Patterns Reference

| Pattern                        | Use Case                                                                    |
| ------------------------------ | --------------------------------------------------------------------------- |
| Type-Safe Event Emitter        | Typed `on()` / `emit()` with `EventMap` generic                             |
| Type-Safe API Client           | Endpoint config object with inferred params, body, response                 |
| Builder Pattern                | Compile-time enforcement that all required fields are set before `.build()` |
| `DeepReadonly` / `DeepPartial` | Recursive type transforms for nested config/state objects                   |
| Type-Safe Form Validation      | Generic `FormValidator<T>` with per-field rule arrays                       |
| Discriminated Unions + Reducer | Exhaustive state machines with no impossible states                         |

### Available Files

| File       | Description                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill — all patterns, examples, pitfalls, performance notes, and type testing |

---

## 10. Web Interface Guidelines

**Publisher:** Vercel
**skills.sh rank:** #52 all-time — 3,200+ installs
**When to load:** Reviewing any UI code for correctness; asked to "review my UI", "audit design", "check accessibility", or "check my site against best practices"; before merging any frontend component

### Purpose

An **auditing** skill, not a creation skill. Where Frontend Design (#3) tells the LLM _how to create_ great UI, this skill tells it _how to review_ existing UI against a concrete, comprehensive checklist. It fetches the latest rules from [`vercel-labs/web-interface-guidelines`](https://github.com/vercel-labs/web-interface-guidelines) on every invocation, so rules are always up to date. Output is in terse `file:line` format (VS Code clickable).

> **Note:** This skill dynamically fetches its rules at runtime from:
> `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
> It always reflects the latest version of the guidelines — no local copy needed.

### Top 10 Rules by Priority

1. **Accessibility first** — Icon-only buttons need `aria-label`; form controls need `<label>`; interactive elements need keyboard handlers; use `<button>` for actions and `<a>` for navigation — never `<div onClick>`
2. **Focus states always** — Never use `outline-none` without a `focus-visible:ring-*` replacement; use `:focus-visible` over `:focus`; group compound controls with `:focus-within`
3. **Animation: `transform`/`opacity` only** — Never `transition: all`; list properties explicitly; always honor `prefers-reduced-motion`; all animations must be interruptible
4. **Forms: labels, autocomplete, correct types** — Every input needs `autocomplete` and a meaningful `name`; use `type="email"`, `type="tel"` etc.; never block paste; warn before navigation with unsaved changes
5. **Destructive actions need confirmation** — Never execute destructive operations immediately; always show a confirmation modal or an undo window
6. **URL reflects all state** — Filters, tabs, pagination, expanded panels belong in query params — not `useState`; deep-link all stateful UI
7. **Typography precision** — Use `…` not `...`; curly quotes not straight quotes; `text-wrap: balance` on headings; `font-variant-numeric: tabular-nums` for number columns
8. **Performance: virtualize large lists** — Lists over 50 items must use `virtua` or `content-visibility: auto`; no layout reads (`getBoundingClientRect`) during render
9. **Content handling: always handle edge cases** — Every text container needs `truncate`, `line-clamp-*`, or `break-words`; flex children need `min-w-0`; always handle empty states
10. **Images: explicit dimensions + priority** — Every `<img>` needs `width` and `height` (prevents CLS); above-fold images need `priority`/`fetchpriority="high"`; below-fold need `loading="lazy"`

### Anti-Patterns to Flag

| Anti-Pattern                             | Why                                             |
| ---------------------------------------- | ----------------------------------------------- |
| `user-scalable=no` / `maximum-scale=1`   | Disables zoom — accessibility violation         |
| `transition: all`                        | Animates unexpected properties; never explicit  |
| `outline-none` without focus replacement | Breaks keyboard navigation                      |
| `<div onClick>` / `<span onClick>`       | Should be `<button>`; no keyboard, no semantics |
| Images without `width`/`height`          | Causes Cumulative Layout Shift (CLS)            |
| Large `.map()` without virtualization    | Causes jank on lists > 50 items                 |
| Hardcoded date/number formats            | Use `Intl.DateTimeFormat` / `Intl.NumberFormat` |
| `autoFocus` without justification        | Disruptive on mobile; use sparingly             |
| `onPaste` + `preventDefault`             | Never block paste in form fields                |

### Output Format

The skill outputs findings grouped by file in terse `file:line` format:

```text
## src/Button.tsx
src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties explicitly

## src/Modal.tsx
src/Modal.tsx:12 - missing overscroll-behavior: contain

## src/Card.tsx
✓ pass
```

### Available Files

| File       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `SKILL.md` | Entry point — instructs the LLM to fetch `command.md` from GitHub before each review |
