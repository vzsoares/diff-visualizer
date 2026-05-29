# AGENTS.md

Guidance for AI coding agents working in this repo. Humans: see `README.md`.

## What this is

A **frontend-only diff sharer** built on Vite + Alpine.js + Tailwind. Users paste
a unified diff (or compare two texts) and get a shareable URL — the diff is
compressed with LZ-String into a `?d=` query param. No server, no backend.

The UI is a single route (`/`) with two modes driven by Alpine state:
**editor** (textarea + share button) and **viewer** (diff2html output + copy link).
See `src/alpine.ts` for the `diffSharer()` component and `src/diff.ts` for the
encoding/rendering logic.

## Always verify before delivering

Run the full suite and fix anything red **before** presenting a change:

```bash
bun run check       # Biome lint + format (writes)
bun run typecheck   # tsc --noEmit
bun run test        # Vitest unit tests
bun run build       # Vite build (emits dist/ + 404.html)
bun run test:e2e    # Playwright: dev + production-build suites (first time: bunx playwright install chromium)
```

`test:e2e` runs two projects from one `playwright.config.ts`: `dev` (`e2e/` vs.
the dev server) and `preview` (`e2e-preview/` vs. the production build under the
Pages base path — this catches base-path and 404.html SPA-fallback regressions).
Run a single suite with `playwright test --project=dev|preview`.

## How the repo works

- **Pages are plain HTML.** The single route's UI is `src/pages/home.html`
  (Alpine directives, no TypeScript). pinecone-router loads it into `<main id="app">`.
- **The `page-templates` plugin** (`vite.config.ts`) serves `src/pages/*.html` at
  `/pages/*.html` in dev and emits them to `dist/pages/` on build.
- **Persistent chrome is inline** in `index.html` — the nav and footer are plain
  HTML + Alpine, always present in the shell.
- **Reactive logic is in `src/alpine.ts`** — the `diffSharer()` Alpine.data factory.
  Pure encoding/rendering helpers live in `src/diff.ts` (unit-tested).
- **Runtime data for pages goes through `Alpine.store("app", …)`** (`src/app.ts`):
  `version`, `base`. Plain HTML can't import TS, so pages read these via `$store.app`.
- **`src/config.ts`** holds the deploy base path (`BASE = "/diff-visualizer/"`),
  shared by the build and the router.

## Tools

Bun (pm + runner) · Biome (lint/format) · Vitest (unit) · Playwright (e2e) ·
release-it (releases). Vite 8 is Rolldown/**oxc**-based. Runtime libs: `alpinejs`,
`pinecone-router`, `tailwindcss`/`daisyui`, `diff2html`, `lz-string`, `diff`.

## Gotchas

- **Pages are plain HTML served by the `page-templates` plugin** — not bundled.
  In dev its middleware must run BEFORE Vite's SPA fallback (added directly inside
  `configureServer`, not the returned post-hook), or `/pages/x.html` resolves to
  `index.html`.
- **Don't call `Alpine.initTree()` yourself.** Alpine's MutationObserver inits
  HTML pinecone loads into `#app`. A manual init double-binds handlers.
- **Pages can't import TS** — runtime values come from `$store.app` (`version`,
  `base`), set in `alpine:init` before `Alpine.start()`.
- **diff2html links in `x-html` output must have `native` attribute** or
  pinecone-router intercepts the `#d2h-…` hash clicks and 404s. We stamp `native`
  on all anchors after each render via `x-effect` + `$nextTick` on the output div.
- **pinecone v7: `settings()` is a function, called in `alpine:init`** — NOT
  options passed to `Alpine.plugin()`. We set `basePath`, `targetID`, `hash`.
- **basePath must NOT have a trailing slash** (`import.meta.env.BASE_URL` does) or
  routes double up. We strip it: `.replace(/\/$/, "")`.
- **GitHub Pages needs a `404.html` SPA fallback.** The build copies
  `dist/index.html` → `dist/404.html` so shared `?d=…` URLs survive hard reloads.
- **`base` lives in `src/config.ts` (`BASE`)**, applied for build + preview only
  (dev stays `/`). It drives both Vite's `base` and the router `basePath`.
- **`vite.config.ts` isn't type-checked** by `tsc` (outside `include: ["src"]`),
  but Biome **does** lint it.
- **diff2html dark mode** — we remap `--d2h-*` CSS custom properties to their
  `--d2h-dark-*` counterparts under `.dark .d2h-wrapper` in `styles.css` so all
  of diff2html's existing `var()` calls flip automatically.

## Conventions

- Avoid `as` / `any` — narrow with typed `this` params / type guards.
- Match existing style; Biome formats (4-space indent, double quotes).
- Commit directly to `main` (no feature branch). Release with `zen-release`.
- Keep `README.md` and `DESIGN.md` in sync when behavior/visuals change.
