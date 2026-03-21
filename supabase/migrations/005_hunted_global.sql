-- Replace per-user hunted list with a global platform hunted list
drop table user_hunted_lists;

create table hunted_list (
  id           bigint primary key generated always as identity,
  character_id bigint not null references characters(id) on delete cascade,
  note         text,
  created_at   timestamptz not null default now(),
  constraint uq_hunted unique (character_id)
);

create index idx_hunted_list_char on hunted_list(character_id);

alter table hunted_list enable row level security;

-- Anyone can read
create policy "public read hunted" on hunted_list
  for select using (true);

-- Authenticated users can insert/delete
create policy "auth manage hunted" on hunted_list
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
