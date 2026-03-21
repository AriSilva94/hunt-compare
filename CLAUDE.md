# Build a full-stack web application for Tibia world tracking (Calmera only)

You are a senior full-stack engineer and software architect.

I want you to generate a production-minded MVP for a Tibia tracking website focused on **one world only: Calmera**.

The stack must be:

- **Next.js (latest, App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for database, auth, and backend
- **Supabase Edge Functions** for scheduled collectors
- **Supabase Cron** for scheduling jobs
- **GitHub** as repository
- The project should be designed to run well on **Supabase Free** for the MVP

Do **not** build a generic Tibia fan site.  
Build the project specifically around this product goal:

## Product goal

Track **top 1000 Calmera players by experience**, and provide:

- daily XP tracking
- current online/offline status
- last login
- death history/details
- an “enemies” style listing page where users can quickly see who is online right now and how their XP is changing

## Important business constraints

- Scope is **Calmera only**
- We are intentionally limiting the dataset to **top 1000 players**
- We do **not** need every Tibia character in the world
- The official sources we rely on are:
  - the **world page** for Calmera to know who is online
  - the **highscores pages** for Calmera experience ranking
  - the **character page** for last login and death details
- The product should be architected for future expansion, but the first version must stay lean and realistic for a free-tier MVP

---

# Core data collection strategy

Design the project around these three collection flows:

## 1. Online status collector
Runs every **15 minutes**.

Purpose:
- fetch the current online players for **Calmera**
- update which tracked players are online right now
- persist a lightweight status history if useful, but do not over-store noisy data

Rules:
- do **not** fetch one character page per player every 15 minutes
- use the world-level online source as the primary source for online/offline
- optimize for low cost and low storage usage

## 2. Daily highscores collector
Runs **once per day**.

Purpose:
- fetch the **experience highscores** for Calmera
- iterate through all pages needed to cover the **top 1000**
- store the daily ranking snapshot
- store total XP and level if available from the ranking source
- calculate daily XP gain from snapshot differences

Rules:
- this is the canonical source for daily XP/rank
- the system should preserve historical daily snapshots
- design for idempotency so rerunning the same daily job does not create duplicates

## 3. Daily character details collector
Runs **once per day** after the highscores import.

Purpose:
- fetch character-level details for each tracked player
- update:
  - last login
  - death records/details
  - any character-level metadata needed by the UI

Rules:
- avoid storing useless raw HTML long-term
- normalize death data into proper relational tables
- do not duplicate the same death record multiple times

---

# Architecture requirements

Design the project using the following architectural principles:

## Frontend
Use **Next.js App Router**.

Requirements:
- prefer **Server Components** by default
- use **Client Components only where interactivity is needed**
- keep secrets off the client
- build a clean structure using the `app/` directory
- use Route Handlers only where they genuinely help

## Backend
Use **Supabase** as the main backend platform.

Requirements:
- Postgres as the source of truth
- Row Level Security enabled
- use **Supabase Auth** with SSR-friendly setup
- use **Supabase Edge Functions** for collectors and background jobs
- use **Supabase Cron** to trigger recurring jobs
- optionally suggest **Supabase Queues** only if they add real value for resilience, but do not overcomplicate the MVP

## Data modeling
Create a database design that is normalized and practical.

At minimum, define tables for:

- tracked worlds
- tracked characters
- daily experience snapshots
- online status / current presence
- online status history (only if justified)
- death records
- job runs / ingestion logs
- user accounts
- enemy lists or user watchlists

Also define:
- indexes
- uniqueness constraints
- foreign keys
- deduplication strategy
- recommended RLS direction

## Job orchestration
Design the system so collectors are separated and safe.

Requirements:
- jobs must be idempotent
- jobs must be retry-friendly
- jobs must log run status
- jobs should be split by responsibility
- jobs should not depend on the Next.js frontend process

---

# Product features to build

Create the project with these pages/features:

## Public pages
- Home page
- Calmera overview page
- Top players list
- Character detail page
- Recent deaths feed
- Online now page

## Authenticated pages
- Sign in / sign up
- Dashboard
- My enemy list / watchlist
- Saved tracked players

## Functional UI requirements
- searchable player table
- filters for online/offline
- daily XP sorting
- death indicators
- “last login” visibility
- responsive UI
- clean modern design using Tailwind
- dark mode is optional but appreciated

---

# Exact behavior expectations

## Character listing
For each tracked character, the UI should be able to show:
- name
- world
- current rank
- current known XP
- daily XP gain
- online/offline status
- last login
- latest death status if relevant

## Character detail page
Should show:
- profile summary
- XP history
- rank history if available
- recent deaths
- last login
- current online/offline state
- timeline-like display if reasonable

## Enemy list
Users should be able to:
- mark characters as enemies
- view enemies first
- filter enemies currently online
- monitor daily XP of enemies

---

# Technical constraints

## Cost-awareness
This MVP must be realistic for **Supabase Free**.

Optimize for:
- low number of scheduled job invocations
- low storage usage
- minimal over-fetching
- no unnecessary raw document persistence
- efficient indexing and deduplication

## Security
- do not expose service role keys to the client
- keep all privileged ingestion logic server-side
- use SSR-compatible auth setup
- separate public reads from privileged writes
- enforce ownership on user-specific lists like enemy lists

## Maintainability
- clear folder structure
- reusable typed data access layer
- strong TypeScript types
- database types generated or organized cleanly
- clean separation between UI, domain logic, and ingestion logic

---

# Deliverables I want from you

Generate the project as if you were preparing it for a real repository.

I want:

## 1. Architecture summary
Explain the chosen architecture and why it fits this product.

## 2. Folder structure
Provide a clear production-minded folder tree for:
- Next.js app
- shared libs
- Supabase functions
- SQL or migrations
- types
- components
- features/modules

## 3. Database schema
Provide the initial SQL schema or migration files for the MVP.

Include:
- tables
- enums if justified
- indexes
- constraints
- RLS starter policies

## 4. Supabase client setup
Implement the correct SSR-friendly Supabase setup for Next.js:
- browser client
- server client
- middleware/proxy approach if needed for auth token refresh
- environment variable structure

## 5. Scheduled ingestion architecture
Implement the collectors as separate Supabase Edge Functions:

Suggested functions:
- `collect-calmera-online-status`
- `collect-calmera-highscores`
- `collect-calmera-character-details`
- `recalculate-daily-aggregates` (only if actually useful)

For each one, define:
- purpose
- input/output
- idempotency behavior
- error handling
- logging strategy

## 6. Cron schedule plan
Provide recommended cron schedules for:
- online status every 15 minutes
- daily highscores
- daily character detail sync

## 7. MVP UI implementation
Generate the main pages and components for the MVP.

## 8. Seed/mock strategy
If scraping/integration cannot be completed immediately, provide a mock adapter interface so the app can still run with seeded data.

## 9. Source adapter design
Create an abstraction layer for Tibia data sources so scraping/parsing logic is isolated.

I want interfaces/adapters like:
- world online source adapter
- highscores source adapter
- character details source adapter

This is important so the project can evolve later.

## 10. README
Create a strong README with:
- project purpose
- stack
- setup steps
- environment variables
- local development
- running migrations
- deploying
- cron setup
- future roadmap

---

# Coding standards

Use these standards:

- TypeScript everywhere
- clean architecture mindset, but do not over-engineer
- no unnecessary complexity
- no huge generic abstraction layers
- prefer practical modularity
- clear naming
- avoid deeply nested spaghetti code
- write code that a solo developer can maintain

---

# What I do NOT want

- do not use the Pages Router
- do not make the frontend depend on constant client-side fetching for core pages
- do not use a monolith of undocumented logic
- do not make the ingestion pipeline run inside random frontend page loads
- do not assume all Tibia characters are discoverable beyond the chosen top-1000 scope
- do not overbuild microservices
- do not add Redis, Kafka, RabbitMQ, or extra infrastructure unless absolutely necessary

---

# Implementation preference

Please generate the solution in this order:

1. Architecture explanation
2. Folder structure
3. Database schema
4. Supabase auth/SSR setup
5. Ingestion/source adapter design
6. Edge Functions
7. Next.js pages/components
8. README
9. Final setup instructions

---

# Extra note

This project is for a Tibia tracker focused on **Calmera** and designed around **top 1000 experience-ranked players**.

The MVP priorities are:

1. online/offline visibility
2. daily XP tracking
3. death tracking
4. last login
5. enemy/watchlist experience

Keep the first version lean, robust, and realistic.