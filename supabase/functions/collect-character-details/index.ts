/**
 * collect-character-details
 * Runs 5x per day, processing all 1000 tracked characters per cycle.
 * Each invocation handles one batch of 100 characters (batch 0–9).
 * Fetches character pages from TibiaData API to update
 * last_login and death records for each tracked player.
 * Idempotent: deaths deduped by unique (character_id, died_at).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { startJob, finishJob } from '../_shared/job-logger.ts'
import { CALMERA_WORLD_ID, sleep, toErrorMessage } from '../_shared/utils.ts'
import { fetchCharacter } from '../_shared/tibiadata.ts'

const BATCH_SIZE = 100
const REQUEST_DELAY_MS = 100

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const runId = await startJob(supabase, 'collect-character-details')

  // batch (0–9) determines which 100-character slice to process
  const body = await req.json().catch(() => ({}))
  const batch = typeof body.batch === 'number' ? Math.max(0, Math.min(9, body.batch)) : 0
  const offset = batch * BATCH_SIZE

  try {
    const { data: chars, error: charErr } = await supabase
      .from('characters')
      .select('id, name')
      .eq('world_id', CALMERA_WORLD_ID)
      .order('rank', { ascending: true })
      .range(offset, offset + BATCH_SIZE - 1)

    if (charErr) throw charErr

    let processed = 0

    for (const char of chars!) {
      const ok = await processCharacter(supabase, char)
      if (ok) processed++
      await sleep(REQUEST_DELAY_MS)
    }

    await finishJob(supabase, runId, 'success', processed)
    return Response.json({ ok: true, processed, offset, batch: BATCH_SIZE })
  } catch (err) {
    const msg = toErrorMessage(err)
    await finishJob(supabase, runId, 'failed', 0, msg)
    return Response.json({ ok: false, error: msg }, { status: 500 })
  }
})

async function processCharacter(
  supabase: ReturnType<typeof createClient>,
  char: { id: number; name: string }
): Promise<boolean> {
  try {
    const data = await fetchCharacter(char.name)
    if (!data) return false

    await supabase
      .from('characters')
      .update({
        last_login: data.character.last_login ?? null,
        level: data.character.level,
        vocation: data.character.vocation,
      })
      .eq('id', char.id)

    if (data.deaths.length > 0) {
      const deathRows = data.deaths.map((d) => ({
        character_id: char.id,
        died_at: d.time,
        level: d.level,
        reason: d.reason,
      }))

      await supabase
        .from('deaths')
        .upsert(deathRows, { onConflict: 'character_id,died_at', ignoreDuplicates: true })
    }

    return true
  } catch (err) {
    console.error(`Failed for ${char.name}:`, err)
    return false
  }
}
