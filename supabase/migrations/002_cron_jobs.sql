-- ============================================================
-- Supabase Cron Jobs
-- Run each block individually in: Dashboard → Integrations → Cron jobs → SQL editor
-- Or create via UI (fields listed in comments above each block)
-- ============================================================

-- ------------------------------------------------------------
-- Job 1: collect-online-status
--   Name:     collect-online-status
--   Schedule: */15 * * * *  (every 15 minutes)
-- ------------------------------------------------------------
select cron.schedule(
  'collect-online-status',
  '*/15 * * * *',
  $$
    select net.http_post(
      url := 'https://fkrntcnvsafdgsbzcedb.supabase.co/functions/v1/collect-online-status',
      headers := jsonb_build_object(
        'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- ------------------------------------------------------------
-- Job 2: collect-highscores
--   Name:     collect-highscores
--   Schedule: 30 0 * * *  (00:30 UTC, daily)
-- ------------------------------------------------------------
select cron.schedule(
  'collect-highscores',
  '30 0 * * *',
  $$
    select net.http_post(
      url := 'https://fkrntcnvsafdgsbzcedb.supabase.co/functions/v1/collect-highscores',
      headers := jsonb_build_object(
        'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- ------------------------------------------------------------
-- Job 3: collect-character-details
--   Name:     collect-character-details
--   Schedule: 0 3 * * *  (03:00 UTC, daily — after highscores)
-- ------------------------------------------------------------
select cron.schedule(
  'collect-character-details',
  '0 3 * * *',
  $$
    select net.http_post(
      url := 'https://fkrntcnvsafdgsbzcedb.supabase.co/functions/v1/collect-character-details',
      headers := jsonb_build_object(
        'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY',
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);
