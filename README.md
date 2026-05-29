# Diff Sharer

Paste a unified diff — or compare two texts side by side — and get a shareable link instantly. No server, no database, no account.

🔗 **[Live demo](https://vzsoares.github.io/diff-visualizer/)**

## How it works

The diff is compressed with [LZ-String](https://github.com/pieroxy/lz-string) and stored entirely in the `?d=` query parameter. Opening the URL renders the diff immediately using [diff2html](https://diff2html.xyz/). Nothing leaves your browser.

## Features

- **Paste a diff** — drop in any unified diff and share
- **Compare texts** — paste original and modified side by side, diff is generated for you
- **Zero backend** — the URL is the database; works offline after first load
- **Dark mode** — remembers your preference
- Deploys to GitHub Pages out of the box

## Development

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # production build → dist/
bun run preview      # preview the build
bun run typecheck    # tsc --noEmit
bun run test         # unit tests (Vitest)
bun run test:e2e     # browser tests (Playwright)
bun run check        # lint + format (Biome)
```

First e2e run needs the browser: `bunx playwright install chromium`

## Deploy

Push to `main` — the CI workflow builds and deploys to GitHub Pages automatically. Update `BASE` in `src/config.ts` if hosting under a different path.

## Stack

Vite · Alpine.js · Tailwind CSS v4 · daisyUI · pinecone-router · TypeScript · Bun · Biome · Vitest · Playwright

## License

[MIT](LICENSE) · Created by [vzsoares](https://github.com/vzsoares)
