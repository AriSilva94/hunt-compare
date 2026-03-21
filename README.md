# CalmTracker

A real-time tracker for the Tibia world **Calmera**, focused on the **top 1000 experience-ranked players**.

Monitor who's online right now, how much XP they're gaining each day, when they last logged in, and who recently died — all from a clean web interface.

---

## What it does

### Online status

Every 15 minutes, CalmTracker fetches the Calmera world page and updates which of the top 1000 players are currently online. No character pages are fetched individually — the world-level source is efficient and lightweight.

### Daily XP tracking

Once per day, the tracker scrapes the full Calmera experience highscores (all pages covering the top 1000), stores a snapshot, and calculates how much XP each player gained since yesterday.

### Death history

Once per day, character detail pages are fetched for each tracked player, extracting recent deaths with timestamps, killers, and locations. Deaths are stored without duplication — if the same death appears on consecutive days, it's only recorded once.

### Enemy watchlist

Logged-in users can mark any tracked character as an enemy. The enemy list page shows your enemies first, filtered by online status, with their daily XP prominently displayed.

---

## Pages

| Page | Description |
| --- | --- |
| `/` | Home — all 1000 tracked players with XP, rank, and online status |
| `/online` | Players currently online on Calmera |
| `/deaths` | Recent deaths feed across all tracked players |
| `/characters/[name]` | Individual character page — XP history, deaths, last login |
| `/dashboard` | Your personal dashboard (requires login) |
| `/enemies` | Your enemy watchlist (requires login) |
| `/login` · `/signup` | Authentication |

---

## How the data flows

```text
Tibia.com world page      →  collect-online-status     (every 15 min)
                                  ↓
                          who is online right now

Tibia.com highscores      →  collect-highscores         (once daily, 00:30 UTC)
                                  ↓
                          XP rankings + daily gain calculation

Tibia.com character pages →  collect-character-details  (once daily, 03:00 UTC)
                                  ↓
                          last login + death records
```

The three collectors are independent Supabase Edge Functions, each with its own schedule. They run in the background, completely separate from the Next.js app.

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Edge Functions, Cron) |
| Data source | Tibia.com — world page, highscores, character pages |

The frontend is built with **Server Components by default**. Data is fetched server-side on each request (or with short revalidation windows), so users never wait for client-side loading states on core pages.

---

## Local development

### 1. Clone and install

```bash
git clone <repo>
cd calmtracker
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values from **Supabase → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-secret-key
```

To develop without scraping Tibia.com, enable mock data:

```env
NEXT_PUBLIC_USE_MOCK_TIBIA=true
```

### 4. Apply migrations

In the Supabase dashboard → **SQL Editor**, run the files in order:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_cron_jobs.sql
```

### 5. Run the app

```bash
npm run dev
```

---

## Deploying collectors

The three background jobs are Supabase Edge Functions. Deploy them with the Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>

supabase functions deploy collect-online-status
supabase functions deploy collect-highscores
supabase functions deploy collect-character-details
```

Cron schedules are configured in `002_cron_jobs.sql`. Enable the `pg_cron` and `pg_net` extensions first in **Supabase → Database → Extensions**.

---

## Roadmap

- [ ] XP gain chart per character
- [ ] Death notifications (email or webhook)
- [ ] Multiple worlds support
- [ ] Guild tracking
- [ ] Rank history over time
- [ ] Public API
