/**
 * collect-hunted-deaths
 * Runs every 5 minutes via Supabase Cron.
 * Fetches character pages from TibiaData for all characters in any user's
 * hunted list and upserts new deaths. Idempotent.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { startJob, finishJob } from '../_shared/job-logger.ts'
import { sleep, toErrorMessage } from '../_shared/utils.ts'
import { fetchCharacter } from '../_shared/tibiadata.ts'

const REQUEST_DELAY_MS = 150

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const runId = await startJob(supabase, 'collect-hunted-deaths')

  try {
    // Get all characters in the global hunted list
    const { data: rows, error } = await supabase
      .from('hunted_list')
      .select('character_id, characters(id, name)')

    if (error) throw error

    const chars: { id: number; name: string }[] = []
    for (const row of rows ?? []) {
      const c = row.characters as { id: number; name: string } | null
      if (c) chars.push(c)
    }

    let processed = 0

    for (const char of chars) {
      const ok = await processCharacter(supabase, char)
      if (ok) processed++
      await sleep(REQUEST_DELAY_MS)
    }

    await finishJob(supabase, runId, 'success', processed)
    return Response.json({ ok: true, processed, total: chars.length })
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
    if (!data || data.deaths.length === 0) return true

    const deathRows = data.deaths.map((d) => ({
      character_id: char.id,
      died_at: d.time,
      level: d.level,
      reason: d.reason,
    }))

    await supabase
      .from('deaths')
      .upsert(deathRows, { onConflict: 'character_id,died_at', ignoreDuplicates: true })

    return true
  } catch (err) {
    console.error(`Failed for ${char.name}:`, err)
    return false
  }
}
