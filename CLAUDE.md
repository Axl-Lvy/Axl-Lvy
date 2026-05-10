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
- The fun pages (`/insane`, `/listen`, `/boomboom`, `/confirm-email`) are standalone — they don't follow the marketing layout's design system and often use inline styles.

### State / persistence patterns

Two distinct patterns, pick deliberately:

1. **Ephemeral in-memory** — `src/app/api/musicState.ts`. Module-scoped state. Resets on cold start, *not shared across serverless instances*. Used by `listen`/`boomboom` because the feature only needs to coordinate a brief window between two browsers on the same Vercel instance. Don't use this for anything that needs durability or cross-instance consistency.
2. **Supabase** — used for anything durable (`delete-user`, `insane/lineup`). Server uses the service role key (`SUPABASE_SECRET_KEY`); tables have RLS enabled with **no policies**, so the public `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (which ships in the browser bundle) gets nothing. The service role key bypasses RLS, which is how the API still works. When adding a new Supabase-backed table, follow this pattern: `enable row level security` and don't add policies unless you actually want public access.

### `/insane` festival app

Self-contained festival timetable with optional admin editing. Pieces:

- `src/app/[locale]/insane/page.tsx` — UI. `INITIAL_LINEUP` is the hardcoded fallback; on mount the page fetches `/api/insane/lineup` and replaces state if a row exists.
- `src/lib/insaneStore.ts` — Supabase read/write of singleton row in `insane_lineup` table.
- `src/lib/insaneAuth.ts` — HMAC-signed `insane_admin` cookie (HttpOnly, `Secure` only in production so localhost works).
- `src/app/api/insane/{login,me,lineup}/route.ts` — login (checks `INSANE_PASSWORD`, sets cookie), session probe, public read + cookie-gated write.
- Favorites are localStorage only, per-browser.

The header link to `/insane` is in `src/components/Header.tsx`, gated by `INSANE_VISIBLE_UNTIL` — a hard date constant. Update or delete it once the festival is over.

### Vendored static apps

`public/tarotmeter/` and `public/memorchess/` are pre-built standalone apps (Kotlin/JS-style, Wasm). `next.config.mjs` rewrites `/tarotmeter` → `/tarotmeter/index.html` and serves them with `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` (required for SharedArrayBuffer / WebAssembly threads). Don't edit files under those folders directly — they're build outputs from other repos.

## Environment variables

Server-only:
- `SUPABASE_SECRET_KEY` — service role key (bypasses RLS).
- `INSANE_PASSWORD` — admin login password for `/insane`.
- `INSANE_COOKIE_SECRET` — HMAC secret for the admin cookie.

Public (shipped to browser):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — anon key. Only useful for client auth flows (e.g. delete-user takes a user JWT).

`.env` is gitignored; `.env.example` is the template.

## Conventions

- Prettier with the repo's config; run `npm run format` before committing if you touched many files.
- Inline styles are fine and idiomatic in the fun pages — don't reflexively migrate them to Tailwind.
- `npm run build` is the typecheck. If it passes, types are fine; there's no separate `tsc` step in CI.
