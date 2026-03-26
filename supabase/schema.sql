-- Camp.IQ Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates all tables, RLS policies, and triggers for the MVP

-- ============================================
-- 1. EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- 2. TABLES
-- ============================================

-- Profiles: extends Supabase auth.users with app-specific data
-- Every user who signs up gets a profile row automatically (see trigger below)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  trip_preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trips: the core planning object
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  party_size int default 1,
  trip_type text check (trip_type in ('car_camping', 'backpacking', 'glamping', 'rv', 'dispersed')),
  max_travel_time_hours numeric,
  biome text,
  vibe text,
  freeform_notes text,
  status text default 'draft' check (status in ('draft', 'planned', 'active', 'completed', 'cancelled')),
  selected_recommendation jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Itineraries: one per trip, stores the full plan as JSONB
create table public.itineraries (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null unique,
  pre_trip_tasks jsonb default '[]',
  daily_plan jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities: individual activities within an itinerary
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  type text not null,
  location text,
  scheduled_time timestamptz,
  duration_minutes int,
  description text,
  sort_order int default 0,
  day_number int default 1,
  created_at timestamptz default now()
);

-- ============================================
-- 3. AUTO-UPDATE TIMESTAMPS
-- ============================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger trips_updated_at before update on public.trips
  for each row execute function update_updated_at();
create trigger itineraries_updated_at before update on public.itineraries
  for each row execute function update_updated_at();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- This ensures users can only access their own data
-- ============================================

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.itineraries enable row level security;
alter table public.activities enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Trips: users can CRUD their own trips
create policy "Users can view own trips"
  on public.trips for select using (auth.uid() = user_id);
create policy "Users can create own trips"
  on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips"
  on public.trips for update using (auth.uid() = user_id);
create policy "Users can delete own trips"
  on public.trips for delete using (auth.uid() = user_id);

-- Itineraries: access through trip ownership
create policy "Users can view own itineraries"
  on public.itineraries for select
  using (exists (
    select 1 from public.trips
    where trips.id = itineraries.trip_id and trips.user_id = auth.uid()
  ));
create policy "Users can create own itineraries"
  on public.itineraries for insert
  with check (exists (
    select 1 from public.trips
    where trips.id = itineraries.trip_id and trips.user_id = auth.uid()
  ));
create policy "Users can update own itineraries"
  on public.itineraries for update
  using (exists (
    select 1 from public.trips
    where trips.id = itineraries.trip_id and trips.user_id = auth.uid()
  ));

-- Activities: access through itinerary -> trip ownership
create policy "Users can view own activities"
  on public.activities for select
  using (exists (
    select 1 from public.itineraries i
    join public.trips t on t.id = i.trip_id
    where i.id = activities.itinerary_id and t.user_id = auth.uid()
  ));
create policy "Users can create own activities"
  on public.activities for insert
  with check (exists (
    select 1 from public.itineraries i
    join public.trips t on t.id = i.trip_id
    where i.id = activities.itinerary_id and t.user_id = auth.uid()
  ));
create policy "Users can update own activities"
  on public.activities for update
  using (exists (
    select 1 from public.itineraries i
    join public.trips t on t.id = i.trip_id
    where i.id = activities.itinerary_id and t.user_id = auth.uid()
  ));

-- ============================================
-- 5. AUTO-CREATE PROFILE ON SIGNUP
-- When a user signs up via Supabase Auth, this trigger
-- automatically creates a row in the profiles table
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
