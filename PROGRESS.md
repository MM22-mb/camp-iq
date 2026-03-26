# Camp.IQ — Build Progress

## Status: Phase 1 MVP Complete (Code Only) — Needs Supabase Setup

---

## What's Built

### Phase 1: Auth + Trip Creation Flow

| Step | Status | Description |
|------|--------|-------------|
| 0. Git Init | Done | Repository initialized |
| 1. Project Scaffolding | Done | Next.js 16, shadcn/ui, Tailwind v4, Vitest, TypeScript |
| 2. Supabase Schema | Done | SQL file at `supabase/schema.sql` (needs to be run in Supabase dashboard) |
| 3. Supabase Clients | Done | Server + browser clients, auth middleware |
| 4. Auth Pages | Done | Login, signup, forgot password, Google OAuth |
| 5. Authenticated Layout | Done | Header with nav, protected route group, landing page |
| 6. Profile Page | Done | Name + experience level form |
| 7. Trip Questionnaire | Done | 5-step form (basics, group, preferences, notes, review) |
| 8. Mock Recommendations | Done | 6 hardcoded campsites, scoring algorithm, top 3 display |
| 9. Itinerary View | Done | Day-by-day timeline, pre-trip checklist with persistence |
| 10. My Trips Dashboard | Done | Trip grid with cards, empty state |
| 11. Testing + Polish | Done | 27 unit tests passing, loading states, 404 handling |

### Routes (14 total)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page with hero + features |
| `/auth/login` | Dynamic | Email/password + Google OAuth login |
| `/auth/signup` | Static | Account creation form |
| `/auth/forgot-password` | Static | Password reset request |
| `/auth/callback` | API | OAuth redirect handler |
| `/auth/confirm` | API | Email verification handler |
| `/dashboard` | Dynamic | My Trips homepage |
| `/profile` | Dynamic | User profile editor |
| `/trips/new` | Dynamic | 5-step trip questionnaire |
| `/trips/[tripId]` | Dynamic | Trip detail (redirects to recs or itinerary) |
| `/trips/[tripId]/recommendations` | Dynamic | 3 AI recommendations with match scores |
| `/trips/[tripId]/itinerary` | Dynamic | Hour-by-hour itinerary + checklist |
| `/explore` | Dynamic | Coming soon placeholder |

### Tests

- **27 tests passing** across 4 test files
- Auth validation schemas (login, signup, forgot password)
- Trip validation schema (all field types)
- Mock recommendation scoring (returns 3, sorted by score, varies by input)
- Mock itinerary generation (correct days, tasks, activities)

---

## Setup Required (You Need To Do This)

### 1. Supabase Setup
- [ ] Go to [supabase.com](https://supabase.com) and open your project
- [ ] Open **SQL Editor** > New Query
- [ ] Paste contents of `supabase/schema.sql` and click **Run**
- [ ] Go to **Authentication > Providers** > Enable Google OAuth
- [ ] Go to **Authentication > URL Configuration**:
  - Site URL: `http://localhost:3000`
  - Redirect URLs: add `http://localhost:3000/auth/callback`

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in your Supabase URL and anon key from **Settings > API** in Supabase dashboard

### 3. GitHub
- [ ] Create a repo at github.com/new (name: `camp-iq`)
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/camp-iq.git`
- [ ] First commit and push

### 4. Vercel
- [ ] Go to [vercel.com](https://vercel.com) > Add New Project > Import `camp-iq` from GitHub
- [ ] Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Deploy

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| Security | Row Level Security (RLS) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | react-hook-form + Zod |
| Testing | Vitest + React Testing Library |
| Hosting | Vercel |
| AI | Mock (hardcoded) — ready to swap for real AI |

---

## What's Next (Future Phases)

### Phase 2: Real AI + Editor
- [ ] Replace `src/lib/mock/` with real AI API calls (OpenAI or Claude)
- [ ] Trip editor — swap/customize individual activities
- [ ] Explore page — browse and clone community trips
- [ ] Past trips with ratings

### Phase 3: vNext (from PRD)
- [ ] Social login sync
- [ ] Collaboration mode
- [ ] Gear recommendations
- [ ] Trip sharing
- [ ] Payment system (Stripe)

### Phase 4: Long-term (from PRD)
- [ ] Direct booking integration
- [ ] Community sites and message boards
- [ ] Dynamic trip optimizer (weather, crowds)
- [ ] Predictive habit engine

---

*Last updated: 2026-03-23*
