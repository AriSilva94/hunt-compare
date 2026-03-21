-- ============================================================
-- Calmera Tracker – Initial Schema
-- ============================================================

-- Extensions
create extension if not exists pg_trgm;

-- Enums
create type job_status as enum ('running', 'success', 'failed');
create type vocation as enum ('Knight', 'Paladin', 'Sorcerer', 'Druid', 'Elite Knight', 'Royal Paladin', 'Master Sorcerer', 'Elder Druid', 'Monk', 'Exalted Monk', 'None');

-- ============================================================
-- worlds
-- ============================================================
create table worlds (
  id          smallint primary key generated always as identity,
  name        text not null unique,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into worlds (name) values ('Calmera');

-- ============================================================
-- characters
-- ============================================================
create table characters (
  id           bigint primary key generated always as identity,
  world_id     smallint not null references worlds(id),
  name         text not null,
  vocation     vocation,
  level        int,
  experience   bigint,
  rank         int,
  is_online    boolean not null default false,
  last_login   timestamptz,
  last_seen_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint uq_characters_world_name unique (world_id, name)
);

create index idx_characters_world_rank on characters(world_id, rank);
create index idx_characters_is_online  on characters(is_online) where is_online = true;
create index idx_characters_name       on characters using gin (name gin_trgm_ops);

-- ============================================================
-- daily_snapshots  (one row per character per day)
-- ============================================================
create table daily_snapshots (
  id            bigint primary key generated always as identity,
  character_id  bigint not null references characters(id) on delete cascade,
  snapshot_date date not null,
  experience    bigint not null,
  level         int,
  rank          int,
  xp_gained     bigint,         -- computed vs previous day
  created_at    timestamptz not null default now(),
  constraint uq_snapshot unique (character_id, snapshot_date)
);

create index idx_snapshots_char_date on daily_snapshots(character_id, snapshot_date desc);
create index idx_snapshots_date      on daily_snapshots(snapshot_date);

-- ============================================================
-- online_sessions  (lightweight presence log)
-- ============================================================
create table online_sessions (
  id           bigint primary key generated always as identity,
  character_id bigint not null references characters(id) on delete cascade,
  seen_at      timestamptz not null default now()
);

-- Only keep last 7 days of raw presence; older rows can be pruned
create index idx_online_sessions_char on online_sessions(character_id, seen_at desc);

-- ============================================================
-- deaths
-- ============================================================
create table deaths (
  id           bigint primary key generated always as identity,
  character_id bigint not null references characters(id) on delete cascade,
  died_at      timestamptz not null,
  level        int,
  reason       text,           -- raw death reason string
  created_at   timestamptz not null default now(),
  constraint uq_death unique (character_id, died_at)
);

create index idx_deaths_char     on deaths(character_id, died_at desc);
create index idx_deaths_recent   on deaths(died_at desc);

-- ============================================================
-- job_runs  (ingestion audit log)
-- ============================================================
create table job_runs (
  id          bigint primary key generated always as identity,
  job_name    text not null,
  status      job_status not null default 'running',
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  rows_affected int,
  error_msg   text,
  metadata    jsonb
);

create index idx_job_runs_name_started on job_runs(job_name, started_at desc);

-- ============================================================
-- user_enemy_lists  (authenticated users' watchlists)
-- ============================================================
create table user_enemy_lists (
  id           bigint primary key generated always as identity,
  user_id      uuid not null references auth.users(id) on delete cascade,
  character_id bigint not null references characters(id) on delete cascade,
  note         text,
  created_at   timestamptz not null default now(),
  constraint uq_enemy_list unique (user_id, character_id)
);

create index idx_enemy_list_user on user_enemy_lists(user_id);

-- ============================================================
-- updated_at auto-update trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_characters_updated_at
  before update on characters
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- characters: public read, no client write
alter table characters enable row level security;
create policy "public read characters" on characters for select using (true);

-- daily_snapshots: public read
alter table daily_snapshots enable row level security;
create policy "public read snapshots" on daily_snapshots for select using (true);

-- online_sessions: public read
alter table online_sessions enable row level security;
create policy "public read online_sessions" on online_sessions for select using (true);

-- deaths: public read
alter table deaths enable row level security;
create policy "public read deaths" on deaths for select using (true);

-- job_runs: no client access (service role only)
alter table job_runs enable row level security;

-- user_enemy_lists: authenticated, own rows only
alter table user_enemy_lists enable row level security;
create policy "own enemy list" on user_enemy_lists
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
