/**
 * collect-online-status
 * Runs every 15 minutes via Supabase Cron.
 * Fetches online players from TibiaData API and marks tracked characters
 * as online/offline. Writes a lightweight session row for each online player.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { startJob, finishJob } from '../_shared/job-logger.ts'
import { CALMERA_WORLD_ID, USER_AGENT, sleep, toErrorMessage } from '../_shared/utils.ts'
import { fetchWorldOnlinePlayers } from '../_shared/tibiadata.ts'

const SESSION_RETENTION_MS = 7 * 24 * 60 * 60 * 1000
const BATCH_SIZE = 100

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const runId = await startJob(supabase, 'collect-online-status')

  try {
    const onlinePlayers = await fetchWorldOnlinePlayers('Calmera')
    const onlineSet = new Set(onlinePlayers.map((p) => p.name.toLowerCase()))

    const { data: trackedChars, error: charErr } = await supabase
      .from('characters')
      .select('id, name')
      .eq('world_id', CALMERA_WORLD_ID)

    if (charErr) throw charErr

    const now = new Date().toISOString()

    await updateOnlineStatuses(supabase, trackedChars!, onlineSet, now)

    const onlineTracked = trackedChars!.filter((c) =>
      onlineSet.has(c.name.toLowerCase())
    )

    await insertSessionRows(supabase, onlineTracked, now)
    await pruneOldSessions(supabase)

    await finishJob(supabase, runId, 'success', onlineTracked.length)
    return Response.json({ ok: true, online: onlineTracked.length })
  } catch (err) {
    const msg = toErrorMessage(err)
    await finishJob(supabase, runId, 'failed', 0, msg)
    return Response.json({ ok: false, error: msg }, { status: 500 })
  }
})

async function updateOnlineStatuses(
  supabase: ReturnType<typeof createClient>,
  chars: { id: number; name: string }[],
  onlineSet: Set<string>,
  now: string
): Promise<void> {
  // Mark all tracked characters offline first
  const { error: offlineErr } = await supabase
    .from('characters')
    .update({ is_online: false })
    .eq('world_id', CALMERA_WORLD_ID)
  if (offlineErr) throw offlineErr

  // Mark only online characters as online
  const onlineIds = chars
    .filter((c) => onlineSet.has(c.name.toLowerCase()))
    .map((c) => c.id)

  if (onlineIds.length === 0) return

  for (let i = 0; i < onlineIds.length; i += BATCH_SIZE) {
    const batch = onlineIds.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('characters')
      .update({ is_online: true, last_seen_at: now })
      .in('id', batch)
    if (error) console.error('Online batch update error:', error)
  }
}

async function insertSessionRows(
  supabase: ReturnType<typeof createClient>,
  onlineChars: { id: number }[],
  now: string
): Promise<void> {
  if (onlineChars.length === 0) return
  const rows = onlineChars.map((c) => ({ character_id: c.id, seen_at: now }))
  await supabase.from('online_sessions').insert(rows)
}

async function pruneOldSessions(
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const cutoff = new Date(Date.now() - SESSION_RETENTION_MS).toISOString()
  await supabase.from('online_sessions').delete().lt('seen_at', cutoff)
}
