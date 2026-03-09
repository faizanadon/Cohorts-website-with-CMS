-- ============================================================
-- COHORTS — SUPABASE SCHEMA
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- BRAND / SETTINGS (single-row key-value store)
-- ============================================================
create table if not exists site_settings (
  key   text primary key,
  value jsonb not null
);

-- ============================================================
-- PRICING PLANS
-- ============================================================
create table if not exists pricing_plans (
  id            text primary key,
  name          text not null,
  price         integer not null,
  interval      text not null default 'one-time',
  badge         text,
  highlight     boolean not null default false,
  description   text,
  features      jsonb not null default '[]',
  cta           text,
  cta_url       text,
  sort_order    integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- PLATFORM MODULES
-- ============================================================
create table if not exists platform_modules (
  id          text primary key,
  name        text not null,
  icon        text not null default '📦',
  description text not null,
  url         text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- SOLUTIONS
-- ============================================================
create table if not exists solutions (
  id          text primary key,
  name        text not null,
  slug        text not null,
  icon        text not null default '⚙️',
  color       text not null default '#4f46e5',
  description text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- RETREAT TYPES
-- ============================================================
create table if not exists retreat_types (
  id          text primary key,
  label       text not null,
  emoji       text not null default '🏕️',
  color       text not null default '#4f46e5',
  slug        text not null,
  description text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- LOCATIONS
-- ============================================================
create table if not exists locations (
  id          text primary key,
  label       text not null,
  slug        text not null,
  region      text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  category    text not null,
  read_time   text not null default '5 min',
  body        text,
  published   boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- GUIDES
-- ============================================================
create table if not exists guides (
  id          text primary key,
  title       text not null,
  description text not null,
  icon        text not null default '📋',
  pages       text not null default '30 pages',
  color       text not null default '#4f46e5',
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text not null,
  location    text,
  initials    text,
  color       text not null default '#4f46e5',
  quote       text not null,
  metric      text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- STATS
-- ============================================================
create table if not exists site_stats (
  id         uuid primary key default uuid_generate_v4(),
  value      text not null,
  label      text not null,
  sort_order integer not null default 0
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public: read-only for all tables
-- Admin: full access (authenticated users)
-- ============================================================
alter table site_settings    enable row level security;
alter table pricing_plans    enable row level security;
alter table platform_modules enable row level security;
alter table solutions        enable row level security;
alter table retreat_types    enable row level security;
alter table locations        enable row level security;
alter table blog_posts       enable row level security;
alter table guides           enable row level security;
alter table testimonials     enable row level security;
alter table site_stats       enable row level security;

-- Public read
create policy "Public read site_settings"    on site_settings    for select using (true);
create policy "Public read pricing_plans"    on pricing_plans    for select using (true);
create policy "Public read platform_modules" on platform_modules for select using (true);
create policy "Public read solutions"        on solutions        for select using (true);
create policy "Public read retreat_types"    on retreat_types    for select using (true);
create policy "Public read locations"        on locations        for select using (true);
create policy "Public read blog_posts"       on blog_posts       for select using (published = true);
create policy "Public read guides"           on guides           for select using (true);
create policy "Public read testimonials"     on testimonials     for select using (true);
create policy "Public read site_stats"       on site_stats       for select using (true);

-- Authenticated (admin) full access
create policy "Admin all site_settings"    on site_settings    for all using (auth.role() = 'authenticated');
create policy "Admin all pricing_plans"    on pricing_plans    for all using (auth.role() = 'authenticated');
create policy "Admin all platform_modules" on platform_modules for all using (auth.role() = 'authenticated');
create policy "Admin all solutions"        on solutions        for all using (auth.role() = 'authenticated');
create policy "Admin all retreat_types"    on retreat_types    for all using (auth.role() = 'authenticated');
create policy "Admin all locations"        on locations        for all using (auth.role() = 'authenticated');
create policy "Admin all blog_posts"       on blog_posts       for all using (auth.role() = 'authenticated');
create policy "Admin all guides"           on guides           for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials"     on testimonials     for all using (auth.role() = 'authenticated');
create policy "Admin all site_stats"       on site_stats       for all using (auth.role() = 'authenticated');
