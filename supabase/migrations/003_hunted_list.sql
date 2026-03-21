-- ============================================================
-- Hunted list – per-user list of characters to track deaths for
-- Deaths are collected every 5 minutes for hunted characters only
-- ============================================================

create table user_hunted_lists (
  id           bigint primary key generated always as identity,
  user_id      uuid not null references auth.users(id) on delete cascade,
  character_id bigint not null references characters(id) on delete cascade,
  note         text,
  created_at   timestamptz not null default now(),
  constraint uq_hunted_list unique (user_id, character_id)
);

create index idx_hunted_list_user on user_hunted_lists(user_id);
create index idx_hunted_list_char on user_hunted_lists(character_id);

alter table user_hunted_lists enable row level security;

-- Anyone can see the hunted list
create policy "public read hunted" on user_hunted_lists
  for select using (true);

-- Only the owner can insert/update/delete
create policy "own hunted write" on user_hunted_lists
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
