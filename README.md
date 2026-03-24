# Rootly

Rootly is a developer-focused learning notebook for self-taught developers. It helps you capture notes, organize courses, track study sessions, and review what you learn in one structured system.

This repository is the active v2 app: a cloud-first Next.js application built with Supabase, Coss UI, and App Router.

## What it does

Rootly is designed around developer learning workflows rather than generic note-taking:

- Q&A notes for concepts you want to remember
- Freeform notes for summaries and rough thinking
- Course tracking with progress, topics, and resource links
- Daily study logs with mood and study time
- Review sessions for active recall
- Overview dashboards for progress and consistency

## Current routes

Public routes:

- `/` marketing homepage
- `/login` authentication page
- `/terms` terms of service
- `/privacy` privacy policy
- `/auth/callback` OAuth callback route

Authenticated app routes:

- `/overview`
- `/notes`
- `/courses`
- `/courses/[id]`
- `/daily-entries`
- `/review`

## Tech stack

- Next.js 16 with App Router and Turbopack
- React 19
- TypeScript
- Tailwind CSS v4
- Coss UI on top of Base UI
- Hugeicons
- Supabase Auth and Postgres
- Motion for animation
- Recharts for dashboard charts
- Shiki for code highlighting
- Oxlint and Oxfmt

## Design system

The app uses Coss UI components in [`components/ui`](/D:/Developer/rootly/components/ui). Treat that layer as owned design-system code:

- compose on top of it
- do not casually restyle or rewrite it
- preserve its token system, borders, rings, and layering approach

## SEO and metadata

The repo currently includes:

- root metadata in [`app/layout.tsx`](/D:/Developer/rootly/app/layout.tsx)
- generated `manifest.webmanifest` via [`app/manifest.ts`](/D:/Developer/rootly/app/manifest.ts)
- generated `robots.txt` via [`app/robots.ts`](/D:/Developer/rootly/app/robots.ts)
- generated `sitemap.xml` via [`app/sitemap.ts`](/D:/Developer/rootly/app/sitemap.ts)
- dynamic Open Graph and Twitter images via [`app/opengraph-image.tsx`](/D:/Developer/rootly/app/opengraph-image.tsx) and [`app/twitter-image.tsx`](/D:/Developer/rootly/app/twitter-image.tsx)
- homepage JSON-LD in [`app/(marketing)/page.tsx`](/D:/Developer/rootly/app/(marketing)/page.tsx)
- noindex metadata on private dashboard route trees

Existing app icons:

- [`app/favicon.ico`](/D:/Developer/rootly/app/favicon.ico)
- [`app/apple-icon.png`](/D:/Developer/rootly/app/apple-icon.png)
- [`app/icon.png`](/D:/Developer/rootly/app/icon.png)
- [`public/web-app-manifest-192x192.png`](/D:/Developer/rootly/public/web-app-manifest-192x192.png)
- [`public/web-app-manifest-512x512.png`](/D:/Developer/rootly/public/web-app-manifest-512x512.png)

## Local development

Install dependencies and start the app:

```bash
pnpm install
pnpm dev
```

If you are using npm instead:

```bash
npm install
npm run dev
```

## Environment variables

Create a local env file with the variables the app expects:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SUPABASE_SECRET_KEY=sb_secret_your_key_here
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_DB_PASSWORD=your-db-password
```

Notes:

- `NEXT_PUBLIC_SITE_URL` should point to your local or deployed app URL
- `SUPABASE_SECRET_KEY` is server-only
- the publishable key is safe for browser use

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm fmt
pnpm fmt:check
pnpm typecheck
```

## Tooling

### Oxlint

Rootly uses Oxlint for linting.

```bash
pnpm lint
pnpm lint:fix
```

The committed config lives in [`.oxlintrc.json`](/D:/Developer/rootly/.oxlintrc.json). The project uses React, Next.js, accessibility, import, promise, TypeScript, Unicorn, and Oxc rule sets.

### Oxfmt

Rootly uses Oxfmt for formatting.

```bash
pnpm fmt
pnpm fmt:check
```

The committed config lives in [`.oxfmtrc.json`](/D:/Developer/rootly/.oxfmtrc.json).

### VS Code

The workspace is configured for the official Oxc extension:

- [`.vscode/extensions.json`](/D:/Developer/rootly/.vscode/extensions.json)
- [`.vscode/settings.json`](/D:/Developer/rootly/.vscode/settings.json)

## Authentication and data

- Supabase Auth is used for sign-in
- OAuth callback handling lives in [`app/auth/callback/route.ts`](/D:/Developer/rootly/app/auth/callback/route.ts)
- the app is multi-tenant by user through Row Level Security
- core product data is stored in `courses`, `notes`, `daily_entries`, and `review_sessions`

## Project references

Product context and planning docs live in:

- [`spec/what-is-rootly.md`](/D:/Developer/rootly/spec/what-is-rootly.md)
- [`spec/frontend-development-cycle.md`](/D:/Developer/rootly/spec/frontend-development-cycle.md)
- [`spec/agent-skills.md`](/D:/Developer/rootly/spec/agent-skills.md)

When docs and code disagree, the codebase should be treated as the current source of truth.
