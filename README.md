# Next.js template

This is a Next.js template with shadcn/ui.

## Oxlint

This project uses Oxlint for linting.

```bash
pnpm run lint
pnpm run lint:fix
```

The committed Oxlint config lives in `.oxlintrc.json` and includes the React, Next.js, accessibility, import, promise, TypeScript, Unicorn, and Oxc rule sets.

Files under `components/ui/**` are intentionally ignored by Oxlint because they were installed from COSS UI and are being treated as upstream vendor code that should remain untouched.

VS Code-based editors such as VS Code, Antigravity, and Windsurf can use the official `oxc.oxc-vscode` extension. The workspace recommends that extension in `.vscode/extensions.json`, and `.vscode/settings.json` enables `source.fixAll.oxc` on save.

A GitHub Actions workflow is included at `.github/workflows/oxlint.yml` and runs Oxlint with GitHub annotations on every push and pull request.

## Oxfmt

This project uses Oxfmt for formatting.

```bash
pnpm run fmt
pnpm run fmt:check
```

The committed formatter config lives in `.oxfmtrc.json`. It preserves the existing repo style, enables Tailwind class sorting for `cn` and `cva`, and keeps embedded formatting on.

Files under `components/ui/**` are intentionally ignored by Oxfmt because they were installed from COSS UI and are being treated as upstream vendor code that should remain untouched.

VS Code-based editors such as VS Code, Antigravity, and Windsurf can use the same official `oxc.oxc-vscode` extension for formatting. The workspace sets Oxc as the default formatter and enables format-on-save in `.vscode/settings.json`.

A GitHub Actions workflow is included at `.github/workflows/oxfmt.yml` and runs `pnpm run fmt:check` on every push and pull request.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
