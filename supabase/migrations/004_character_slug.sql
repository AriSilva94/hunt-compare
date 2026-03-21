-- Add slug column to characters for clean URLs
alter table characters add column slug text;

-- Generate slugs from existing names:
-- lowercase, spaces to hyphens, remove non-alphanumeric except hyphens
update characters
set slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'));

-- Make it unique and required going forward
alter table characters add constraint uq_characters_slug unique (slug);
alter table characters alter column slug set not null;

-- Trigger to auto-generate slug on insert/update of name
create or replace function generate_character_slug()
returns trigger language plpgsql as $$
begin
  new.slug := lower(regexp_replace(regexp_replace(new.name, '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'));
  return new;
end;
$$;

create trigger trg_characters_slug
  before insert or update of name on characters
  for each row execute function generate_character_slug();
