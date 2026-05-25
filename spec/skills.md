## Skills

### 1- vercel-react-best-practices

**Triggers**: React performance, Next performance, re-render reduction, bundle size, data fetching
**Pairs With**: `next-best-practices`, `tanstack-query-best-practices`, `react-useeffect`
**Top 2 Rules**: Start async work in parallel when possible. Use Suspense and dynamic loading to avoid blocking large UI trees.

Full context: `.agents/skills/vercel-react-best-practices/SKILL.md`

### 2- next-best-practices

**Triggers**: App Router, RSC boundaries, route handlers, metadata, async params, runtime choice
**Pairs With**: `vercel-react-best-practices`, `next-cache-components`
**Top 2 Rules**: Follow App Router file conventions first. Respect server/client boundaries and modern async Next APIs.

Full context: `.agents/skills/next-best-practices/SKILL.md`

### 3- vercel-composition-patterns

**Triggers**: boolean prop sprawl, reusable APIs, compound components, provider design
**Pairs With**: `vercel-react-best-practices`, `typescript-advanced-types`
**Top 2 Rules**: Prefer composition over boolean mode props. Model complex shared UI as explicit compound components.

Full context: `.agents/skills/vercel-composition-patterns/SKILL.md`

### 4- emil-design-eng

**Triggers**: UI polish, interaction feel, animation taste, design review, visual craft
**Pairs With**: `make-interfaces-feel-better`, `userinterface-wiki`, `fixing-motion-performance`
**Top 2 Rules**: Taste and small details matter. Every animation needs a clear purpose and should feel fast.

Full context: `.agents/skills/emil-design-eng/SKILL.md`

### 5- fixing-motion-performance

**Triggers**: jank, animation stutter, layout thrashing, blur issues, scroll-linked motion
**Pairs With**: `emil-design-eng`, `userinterface-wiki`
**Top 2 Rules**: Prefer compositor-friendly properties like transform and opacity. Remove expensive motion patterns before polishing them.

Full context: `.agents/skills/fixing-motion-performance/SKILL.md`

### 6- supabase-postgres-best-practices

**Triggers**: Supabase SQL, query optimization, indexes, schema review, RLS-aware backend work
**Pairs With**: `postgresql-table-design`, `postgres-pro`
**Top 2 Rules**: Design queries and indexes for actual access patterns. Keep Supabase/Postgres choices simple, explicit, and production-safe.

Full context: `.agents/skills/supabase-postgres-best-practices/SKILL.md`

### 7- postgresql-table-design

**Triggers**: new schema, table design, data types, constraints, relational modeling
**Pairs With**: `supabase-postgres-best-practices`, `postgres-pro`
**Top 2 Rules**: Pick Postgres-native data types and constraints intentionally. Design schema shape around integrity and query patterns, not convenience.

Full context: `.agents/skills/postgresql-table-design/SKILL.md`

### 8- postgres-pro

**Triggers**: EXPLAIN plans, advanced SQL, JSONB, replication, performance debugging
**Pairs With**: `supabase-postgres-best-practices`, `postgresql-table-design`
**Top 2 Rules**: Use database evidence before guessing. Treat indexes, execution plans, and query shape as first-class tools.

Full context: `.agents/skills/postgres-pro/SKILL.md`

### 9- typescript-advanced-types

**Triggers**: generics, conditional types, mapped types, reusable type utilities
**Pairs With**: `vercel-composition-patterns`, `next-best-practices`
**Top 2 Rules**: Use advanced types to encode real constraints. Prefer precise reusable type tools over `any` or loose escape hatches.

Full context: `.agents/skills/typescript-advanced-types/SKILL.md`

### 10- seo-audit

**Triggers**: SEO audit, ranking drop, indexing issue, metadata review, core web vitals
**Pairs With**: `content-strategy`
**Top 2 Rules**: Start from diagnosis, not content guesses. Check technical crawl/index/render issues before broad recommendations.

Full context: `.agents/skills/seo-audit/SKILL.md`

### 11- react-useeffect

**Triggers**: `useEffect`, derived state, syncing state, client fetching, React side effects
**Pairs With**: `vercel-react-best-practices`, `tanstack-query-best-practices`
**Top 2 Rules**: Do not use effects for values that can be derived during render. Keep effects for true external synchronization.

Full context: `.agents/skills/react-useeffect/SKILL.md`

### 12- make-interfaces-feel-better

**Triggers**: make it feel better, UI feels off, micro-interactions, shadows, borders, hover states
**Pairs With**: `emil-design-eng`, `userinterface-wiki`
**Top 2 Rules**: Polish comes from many small intentional choices. Improve tactile states, spacing, and motion without adding noise.

Full context: `.agents/skills/make-interfaces-feel-better/SKILL.md`

### 13- userinterface-wiki

**Triggers**: UI review, UX best practices, animation review, typography, icons, polish audit
**Pairs With**: `emil-design-eng`, `make-interfaces-feel-better`
**Top 2 Rules**: Review UI systematically and call out concrete issues. Focus on interaction quality, readability, and user trust.

Full context: `.agents/skills/userinterface-wiki/SKILL.md`

### 14- tailwind-css-patterns

**Triggers**: Tailwind styling, utility composition, responsive styling, component styling
**Pairs With**: `tailwindcss-advanced-layouts`, `html-css-best-practices`
**Top 2 Rules**: Use utility composition clearly and consistently. Keep responsive styles intentional rather than ad hoc.

Full context: `.agents/skills/tailwind-css-patterns/SKILL.md`

### 15- tailwindcss-advanced-layouts

**Triggers**: CSS grid, sticky layouts, overflow, complex responsive layout, fluid sizing
**Pairs With**: `tailwind-css-patterns`
**Top 2 Rules**: Solve layout problems with sound CSS structure first. Use grid and flex deliberately instead of stacking one-off fixes.

Full context: `.agents/skills/tailwindcss-advanced-layouts/SKILL.md`

### 16- browser-extension-builder

**Triggers**: extension scaffolding, MV3 architecture, runtime boundaries, messaging, storage flow
**Pairs With**: `chrome-extension-ui`, `chrome-extension-development`
**Top 2 Rules**: Start with the right extension architecture. Keep permissions, runtime boundaries, and state flow explicit.

Full context: `.agents/skills/browser-extension-builder/SKILL.md`

### 17- chrome-extension-development

**Triggers**: extension security, permissions, performance, production hardening, publishing readiness
**Pairs With**: `browser-extension-builder`, `chrome-extension-ui`
**Top 2 Rules**: Prefer the strictest engineering and security guidance. Treat permissions, messaging, and data access as high-risk surfaces.

Full context: `.agents/skills/chrome-extension-development/SKILL.md`

### 18- chrome-extension-ui

**Triggers**: popup UX, side panel UX, content-script UI, options UI, extension accessibility
**Pairs With**: `browser-extension-builder`, `chrome-extension-development`
**Top 2 Rules**: Choose the right extension surface for the job. Design for extension constraints like panel size, focus, and lifecycle.

Full context: `.agents/skills/chrome-extension-ui/SKILL.md`

### 19- html-css-best-practices

**Triggers**: extension HTML, extension CSS, semantic markup, CSS organization, responsive extension layouts
**Pairs With**: `browser-extension-builder`, `chrome-extension-ui`, `modern-javascript-patterns`
**Top 2 Rules**: Use semantic structure first. Keep CSS token-driven, maintainable, and resilient across side-panel widths.

Full context: `.agents/skills/html-css-best-practices/SKILL.md`

### 20- modern-javascript-patterns

**Triggers**: extension JavaScript, ES modules, async flows, DOM wiring, JS refactor
**Pairs With**: `browser-extension-builder`, `html-css-best-practices`
**Top 2 Rules**: Keep module boundaries clear. Separate state, rendering, and side effects instead of mixing everything together.

Full context: `.agents/skills/modern-javascript-patterns/SKILL.md`

### 21- vercel-react-view-transitions

**Triggers**: view transitions, shared element animation, route transitions, directional nav motion
**Pairs With**: `next-best-practices`, `emil-design-eng`
**Top 2 Rules**: Audit navigation patterns before implementing motion. Use typed transitions only where hierarchy or direction is meaningful.

Full context: `.agents/skills/vercel-react-view-transitions/SKILL.md`

### 22- next-cache-components

**Triggers**: Cache Components, `use cache`, cache tagging, revalidation, mixed static/dynamic routes
**Pairs With**: `next-best-practices`, `tanstack-query-best-practices`
**Top 2 Rules**: Classify freshness needs before caching. Keep cached scopes small and invalidate from the write path.

Full context: `.agents/skills/next-cache-components/SKILL.md`

### 23- tanstack-query-best-practices

**Triggers**: React Query, query keys, optimistic updates, prefetching, hydration
**Pairs With**: `vercel-react-best-practices`, `react-useeffect`, `next-cache-components`
**Top 2 Rules**: Keep query keys consistent and dependency-complete. Invalidate or optimistically update related reads after mutations.

Full context: `.agents/skills/tanstack-query-best-practices/SKILL.md`

### 24- redis-development

**Triggers**: Redis cache, distributed cache, semantic cache, low-latency reads, Redis scaling
**Pairs With**: `next-cache-components`, `postgres-pro`
**Top 2 Rules**: Match data structures to workloads. Treat TTL, memory, and operational safety as part of the design.

Full context: `.agents/skills/redis-development/SKILL.md`

### 25- content-strategy

**Triggers**: content strategy, topic planning, editorial roadmap, topic clusters, what should I write about
**Pairs With**: `seo-audit`, `humanizer`
**Top 2 Rules**: Make each piece searchable, shareable, or both. Use customer language and buyer-stage intent to prioritize topics.

Full context: `.agents/skills/content-strategy/SKILL.md`

### 26- humanizer

**Triggers**: make this sound human, remove AI tone, natural writing, rewrite robotic copy
**Pairs With**: `content-strategy`
**Top 2 Rules**: Add real personality instead of only removing patterns. Replace vague, inflated, promotional phrasing with concrete natural language.

Full context: `.agents/skills/humanizer/SKILL.md`
