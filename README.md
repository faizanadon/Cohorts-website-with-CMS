# Cohorts — Retreat OS Website + CMS

## Quick Start

```bash
cd cohorts
npm install
npm start        # → http://localhost:3000
```

## CMS Admin Panel

Navigate to `http://localhost:3000/#admin` to open the admin panel.

Sign in with your Supabase admin email/password. All content edits save live to Supabase and the frontend reflects them on next page load.

---

## Supabase Setup (required for live CMS)

### 1. Create a Supabase project
Go to https://supabase.com → New project

### 2. Run the schema
In Supabase dashboard → SQL Editor → paste and run:
```
supabase/schema.sql
```

### 3. Seed initial data
Then paste and run:
```
supabase/seed.sql
```

### 4. Create an admin user
Supabase dashboard → Authentication → Users → Invite user
(or use the Supabase Auth API to create a user with email/password)

### 5. Add environment variables
```bash
cp .env.example .env
# Fill in your Supabase URL and anon key from:
# Supabase dashboard → Settings → API
```

### 6. Start the app
```bash
npm start
```

The frontend will now load all content from Supabase. If Supabase is unreachable, it silently falls back to `siteConfig.js` static data — so the site always works.

---

## Architecture

```
cohorts/
├── supabase/
│   ├── schema.sql          ← Run first: creates all tables
│   └── seed.sql            ← Run second: populates with default data
├── src/
│   ├── App.jsx             ← Full website (all pages, routing)
│   ├── siteConfig.js       ← Static fallback data
│   ├── index.js            ← Entry: routes #admin → AdminPanel
│   ├── lib/
│   │   ├── supabase.js     ← Supabase client init
│   │   └── loadSupabaseData.js  ← Fetches all tables → siteConfig shape
│   └── admin/
│       └── AdminPanel.jsx  ← Full CMS admin panel
├── .env.example            ← Copy to .env and fill in credentials
└── package.json
```

## CMS Sections

| Section | What it controls |
|---|---|
| Pricing Plans | The 3-tier pricing grid, prices, features, badges |
| Platform Modules | The 8 OS modules (name, icon, description) |
| Solutions | The 6 solution systems |
| Blog Posts | Blog post titles, categories, content, publish status |
| Guides | Downloadable guides on the Resources page |
| Locations | Retreat destination markets (adding one generates SEO pages) |
| Retreat Types | Retreat categories (adding one generates SEO pages) |

## How live data works

1. App loads → renders immediately with `siteConfig.js` data (no flash/blank state)
2. `loadSupabaseData()` fetches all tables in parallel
3. Module-level `let` vars are overwritten with Supabase data
4. React `forceUpdate` triggers a re-render — UI updates with live data
5. If Supabase is down or unconfigured → step 2 returns null, site stays on siteConfig fallback

## Production Build

```bash
npm run build
# Deploy /build folder to Vercel, Netlify, S3, etc.
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
# Set env vars in Vercel dashboard: REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_ANON_KEY
```
