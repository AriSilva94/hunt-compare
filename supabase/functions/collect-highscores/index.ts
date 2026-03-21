/**
 * collect-highscores
 * Runs once per day (00:30 UTC).
 * Fetches top 1000 Calmera players from TibiaData API,
 * upserts character records, and saves the daily snapshot.
 * Idempotent: re-running on the same date will update, not duplicate.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { startJob, finishJob } from '../_shared/job-logger.ts'
import { CALMERA_WORLD_ID, sleep, toErrorMessage } from '../_shared/utils.ts'
import { fetchHighscorePage, type TibiaHighscoreEntry } from '../_shared/tibiadata.ts'

const PAGE_DELAY_MS = 800

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const runId = await startJob(supabase, 'collect-highscores')
  const today = new Date().toISOString().slice(0, 10)

  try {
    const entries = await fetchAllHighscorePages()
    if (entries.length === 0) throw new Error('No entries returned from TibiaData highscores')

    await upsertCharacters(supabase, entries)

    const charMap = await loadCharacterMap(supabase, entries.map((e) => e.name))
    const prevMap = await fetchYesterdayXp(supabase, [...charMap.values()].map((c) => c.id))

    const snapRows = buildSnapshotRows(entries, charMap, prevMap, today)

    const { error: snapErr } = await supabase
      .from('daily_snapshots')
      .upsert(snapRows, { onConflict: 'character_id,snapshot_date' })

    if (snapErr) throw snapErr

    await finishJob(supabase, runId, 'success', snapRows.length)
    return Response.json({ ok: true, processed: snapRows.length, date: today })
  } catch (err) {
    const msg = toErrorMessage(err)
    await finishJob(supabase, runId, 'failed', 0, msg)
    return Response.json({ ok: false, error: msg }, { status: 500 })
  }
})

async function fetchAllHighscorePages(): Promise<TibiaHighscoreEntry[]> {
  const results: TibiaHighscoreEntry[] = []
  let page = 1

  while (true) {
    const data = await fetchHighscorePage('Calmera', page)
    if (data === null || data.entries.length === 0) return results

    results.push(...data.entries)

    if (page >= data.totalPages) return results

    page++
    await sleep(PAGE_DELAY_MS)
  }
}

async function upsertCharacters(
  supabase: ReturnType<typeof createClient>,
  entries: TibiaHighscoreEntry[]
): Promise<void> {
  const rows = entries.map((e) => ({
    world_id: CALMERA_WORLD_ID,
    name: e.name,
    vocation: e.vocation,
    level: e.level,
    experience: e.value,
    rank: e.rank,
  }))

  const { error } = await supabase
    .from('characters')
    .upsert(rows, { onConflict: 'world_id,name' })

  if (error) throw error
}

async function loadCharacterMap(
  supabase: ReturnType<typeof createClient>,
  names: string[]
): Promise<Map<string, { id: number }>> {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name')
    .in('name', names)

  if (error) throw error
  return new Map((data ?? []).map((c) => [c.name, c]))
}

async function fetchYesterdayXp(
  supabase: ReturnType<typeof createClient>,
  charIds: number[]
): Promise<Map<number, number>> {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  const { data } = await supabase
    .from('daily_snapshots')
    .select('character_id, experience')
    .eq('snapshot_date', yesterday)
    .in('character_id', charIds)

  return new Map((data ?? []).map((s) => [s.character_id, s.experience]))
}

function buildSnapshotRows(
  entries: TibiaHighscoreEntry[],
  charMap: Map<string, { id: number }>,
  prevMap: Map<number, number>,
  date: string
) {
  return entries.flatMap((e) => {
    const char = charMap.get(e.name)
    if (!char) return []

    const prevXp = prevMap.get(char.id)
    return [{
      character_id: char.id,
      snapshot_date: date,
      experience: e.value,
      level: e.level,
      rank: e.rank,
      xp_gained: prevXp != null ? e.value - prevXp : null,
    }]
  })
}
