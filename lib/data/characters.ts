import { createClient } from '@/lib/supabase/server'
import type { Character, DailySnapshot, Death } from '@/types/database'

const CALMERA_WORLD_ID = 1

export async function getTopCharacters(limit = 1000) {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      daily_snapshots!inner (
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

export async function getRecentDeaths(limit = 20) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deaths')
    .select('*, characters(name, rank, vocation)')
    .order('died_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
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
