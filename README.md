# CalmTracker

Track the **top 1000 experience-ranked players** on the Tibia world **Calmera**.

Features: real-time online/offline status, daily XP tracking, death history, last login, and a personal enemy watchlist.

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Edge Functions, Cron) |
| Scraping | Tibia.com world/highscores/character pages |

---

## Project structure

```text
app/                    Next.js App Router pages
  (auth)/               Login & signup routes
  (dashboard)/          Protected dashboard & enemy list
  characters/[name]/    Character detail page
  online/               Online players page
  deaths/               Recent deaths feed
components/             Shared UI components
lib/
  supabase/             Browser/server/middleware clients
  tibia/
    adapters/           Adapter interfaces + mock adapters
    scrapers/           Real Tibia scraper implementations
  data/                 Server-side data access functions
types/                  TypeScript types (database.ts)
supabase/
  functions/            Edge Functions (collectors)
  migrations/           SQL migrations
```

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd calmtracker
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase URL and anon key from **Project Settings → API**.

### 4. Run migrations

In the Supabase dashboard → **SQL Editor**, paste and run:

1. `supabase/migrations/001_initial_schema.sql`

### 5. Start local dev

```bash
npm run dev
```

---

## Deploying Edge Functions

Install the Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
```

Deploy all functions:

```bash
supabase functions deploy collect-online-status
supabase functions deploy collect-highscores
supabase functions deploy collect-character-details
```

---

## Cron setup

After deploying functions, enable `pg_cron` and `pg_net` in:
**Supabase dashboard → Database → Extensions**

Then run `supabase/migrations/002_cron_jobs.sql` in the SQL Editor after setting:

```sql
alter database postgres set app.supabase_url = 'https://your-project.supabase.co';
alter database postgres set app.service_role_key = 'your-service-role-key';
```

**Cron schedules:**

| Job | Schedule |
| --- | --- |
| `collect-online-status` | Every 15 minutes |
| `collect-highscores` | 00:30 UTC daily |
| `collect-character-details` | 03:00 UTC daily |

---

## How data flows

```text
Tibia.com world page  ──►  collect-online-status   (15min) ──► characters.is_online
Tibia.com highscores  ──►  collect-highscores       (daily) ──► characters + daily_snapshots
Tibia.com char page   ──►  collect-character-details(daily) ──► characters.last_login + deaths
```

---

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (safe for client) |
| `SUPABASE_SECRET_KEY` | Secret key (server/edge functions only) |
| `NEXT_PUBLIC_USE_MOCK_TIBIA` | Set to `true` to use mock data in dev |

Edge Functions automatically receive `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase.

---

## Future roadmap

- [ ] XP gain chart (recharts)
- [ ] Death notifications (email/webhook)
- [ ] Multiple worlds support
- [ ] Guild tracking
- [ ] Rank history chart
- [ ] Public API endpoints
