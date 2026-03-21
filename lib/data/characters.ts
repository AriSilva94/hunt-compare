import { createClient } from '@/lib/supabase/server'
import type { Character, DailySnapshot, Death, Vocation } from '@/types/database'

const CALMERA_WORLD_ID = 1

export async function getTopCharacters(limit = 1000) {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      daily_snapshots (
        xp_gained,
        rank,
        snapshot_date
      )
    `)
    .eq('world_id', CALMERA_WORLD_ID)
    .eq('daily_snapshots.snapshot_date', today)
    .order('rank', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getOnlineCharacters(): Promise<Character[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('world_id', CALMERA_WORLD_ID)
    .eq('is_online', true)
    .order('rank', { ascending: true })

  if (error) throw error
  return (data ?? []) as Character[]
}

export async function getCharacterByName(name: string): Promise<Character | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('world_id', CALMERA_WORLD_ID)
    .ilike('name', name)
    .maybeSingle()

  if (error) throw error
  return data as Character | null
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('world_id', CALMERA_WORLD_ID)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data as Character | null
}

export async function getCharacterSnapshots(
  characterId: number,
  days = 30
): Promise<DailySnapshot[]> {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('daily_snapshots')
    .select('*')
    .eq('character_id', characterId)
    .gte('snapshot_date', since)
    .order('snapshot_date', { ascending: false })

  if (error) throw error
  return (data ?? []) as DailySnapshot[]
}

export async function getCharacterDeaths(
  characterId: number,
  limit = 10
): Promise<Death[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deaths')
    .select('*')
    .eq('character_id', characterId)
    .order('died_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Death[]
}

export async function getRecentDeaths(limit = 50) {
  const supabase = await createClient()

  // Only return deaths for characters in the global hunted list
  const { data: huntedRows } = await supabase
    .from('hunted_list')
    .select('character_id')

  const huntedIds = [...new Set((huntedRows ?? []).map((r) => r.character_id))]
  if (huntedIds.length === 0) return []

  const { data, error } = await supabase
    .from('deaths')
    .select('*, characters(name, slug, rank, vocation)')
    .in('character_id', huntedIds)
    .order('died_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export interface OnlineCharacterRow {
  id: number
  name: string
  slug: string
  rank: number | null
  level: number | null
  vocation: Vocation | null
  is_online: boolean
  last_login: string | null
  xp_gained_today: number | null
  last_death_at: string | null
  last_death_reason: string | null
}

export async function getOnlineCharactersWithStats(): Promise<OnlineCharacterRow[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const since48h = new Date(Date.now() - 48 * 3600 * 1000).toISOString()

  const { data, error } = await supabase
    .from('characters')
    .select(`
      id, name, slug, rank, level, vocation, is_online, last_login,
      daily_snapshots (xp_gained, snapshot_date),
      deaths (died_at, reason)
    `)
    .eq('world_id', CALMERA_WORLD_ID)
    .eq('is_online', true)
    .eq('daily_snapshots.snapshot_date', today)
    .gte('deaths.died_at', since48h)
    .order('rank', { ascending: true })

  if (error) throw error

  return (data ?? []).map((c) => {
    const snaps = Array.isArray(c.daily_snapshots) ? c.daily_snapshots : []
    const deaths = Array.isArray(c.deaths) ? c.deaths : []

    // Deaths are returned in insertion order; find the most recent by reducing once
    const latestDeath = deaths.reduce<{ died_at: string; reason: string | null } | null>(
      (latest, d) => {
        if (!latest) return d
        return d.died_at > latest.died_at ? d : latest
      },
      null
    )

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      rank: c.rank,
      level: c.level,
      vocation: c.vocation,
      is_online: c.is_online,
      last_login: c.last_login,
      xp_gained_today: snaps[0]?.xp_gained ?? null,
      last_death_at: latestDeath?.died_at ?? null,
      last_death_reason: latestDeath?.reason ?? null,
    }
  })
}

export async function searchCharacters(query: string, limit = 20) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('characters')
    .select('id, name, rank, level, vocation, is_online')
    .eq('world_id', CALMERA_WORLD_ID)
    .ilike('name', `%${query}%`)
    .order('rank', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
