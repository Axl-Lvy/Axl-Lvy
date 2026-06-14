# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server.
- `npm run build` — production build (also the typecheck gate; type errors fail the build).
- `npm run lint` — Next/ESLint.
- `npm run format` / `npm run format:check` — Prettier.

There is no test runner in this repo.

## Architecture

Next.js 14 App Router, TypeScript, Tailwind. Personal site that bundles a marketing landing plus a handful of small standalone "fun" pages. Deployed on Vercel.

### Routing & i18n

- All app routes are nested under `src/app/[locale]/...`. Two locales: `en`, `fr` (see `src/i18n.ts`). Translations live in `messages/{en,fr}.json`.
- `next-intl` middleware handles locale prefixing. Components consume strings via `useTranslations(...)` (client) or `getTranslations(...)` (server).
- The fun pages (`/listen`, `/boomboom`, `/confirm-email`) are standalone — they don't follow the marketing layout's design system and often use inline styles.

### State / persistence patterns

Two distinct patterns, pick deliberately:

1. **Ephemeral in-memory** — `src/app/api/musicState.ts`. Module-scoped state. Resets on cold start, *not shared across serverless instances*. Used by `listen`/`boomboom` because the feature only needs to coordinate a brief window between two browsers on the same Vercel instance. Don't use this for anything that needs durability or cross-instance consistency.
2. **Supabase** — used for anything durable (e.g. `delete-user`). Server uses the service role key (`SUPABASE_SECRET_KEY`); tables have RLS enabled with **no policies**, so the public `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (which ships in the browser bundle) gets nothing. The service role key bypasses RLS, which is how the API still works. When adding a new Supabase-backed table, follow this pattern: `enable row level security` and don't add policies unless you actually want public access.

### Vendored static apps

`public/tarotmeter/` and `public/memorchess/` are pre-built standalone Kotlin/Wasm apps. `next.config.mjs` rewrites `/<app>` → `/<app>/index.html` and serves them with `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` (required for SharedArrayBuffer / WebAssembly threads). `src/middleware.ts` carves these paths out of the next-intl middleware.

Don't edit files under those folders directly — they're build outputs from other repos, kept in sync via GitHub Actions:

- Producer repos (e.g. `Axl-Lvy/TarotMeter`, `Axl-Lvy/MemorChess`) build `composeApp/build/dist/wasmJs/productionExecutable/` and `curl` a `repository_dispatch` to this repo with the artifact URL in `client_payload.message`.
- Consumer workflows here (`.github/workflows/update_<app>.yml`) listen for those events, `gh run download` the artifact into `public/<app>/`, run `python3 scripts/fix_<app>_paths.py` to inject `<base href="/<app>/">` and rewrite relative paths, then commit.

To add another vendored app: copy one of the `update_*.yml` + `fix_*_paths.py` pairs, add headers + rewrites in `next.config.mjs`, and carve the path out of `src/middleware.ts`. The producer side needs a `REPOSITORY_ACCESS_TOKEN` PAT secret with `contents: write` on this repo.

## Environment variables

Server-only:
- `SUPABASE_SECRET_KEY` — service role key (bypasses RLS).

Public (shipped to browser):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — anon key. Only useful for client auth flows (e.g. delete-user takes a user JWT).

`.env` is gitignored; `.env.example` is the template.

## Conventions

- Prettier with the repo's config; run `npm run format` before committing if you touched many files.
- Inline styles are fine and idiomatic in the fun pages — don't reflexively migrate them to Tailwind.
- `npm run build` is the typecheck. If it passes, types are fine; there's no separate `tsc` step in CI.
