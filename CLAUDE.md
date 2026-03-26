# Camp.IQ

AI-powered camping trip planning platform built with Next.js, Supabase, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + RLS)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Hosting**: Vercel
- **Testing**: Vitest + React Testing Library

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm test         # Run tests in watch mode
npx vitest run   # Run tests once (CI mode)
```

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  components/
    ui/          # shadcn/ui components (auto-generated, don't edit)
    auth/        # Authentication components
    layout/      # Header, navigation
    profile/     # Profile components
    trips/       # Trip-related components
  lib/
    supabase/    # Supabase client helpers (server.ts, client.ts)
    validations/ # Zod schemas for form validation
    actions/     # Server Actions (data mutations)
    mock/        # Mock AI data (to be replaced with real AI later)
    types.ts     # TypeScript type definitions
    utils.ts     # Utility functions
```

## Conventions

- **Server Components by default** — only add `"use client"` when the component needs browser APIs, state, or effects
- **Server Actions for mutations** — all data writes go through Server Actions in `src/lib/actions/`
- **Supabase clients**: use `createClient()` from `src/lib/supabase/server.ts` in Server Components/Actions; use `createClient()` from `src/lib/supabase/client.ts` in Client Components
- **Validation**: Zod schemas in `src/lib/validations/` — used both client-side (react-hook-form) and server-side (Server Actions)
- **Never commit `.env.local`** — use `.env.example` as template
- **Security**: Supabase RLS enforces row-level access. Never trust client input without server-side validation.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
