import { createClient } from '@/lib/supabase/server'

const today = () => new Date().toISOString().slice(0, 10)

export async function getHuntedList() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hunted_list')
    .select(`
      *,
      characters (
        id, name, slug, rank, level, vocation, is_online, last_login,
        daily_snapshots (xp_gained, snapshot_date),
        deaths (died_at, level, reason)
      )
    `)
    .eq('characters.daily_snapshots.snapshot_date', today())
    .order('id', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function addHunted(characterId: number, note?: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('hunted_list')
    .insert({ character_id: characterId, note: note ?? null })
  if (error) throw error
}

export async function removeHunted(characterId: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('hunted_list')
    .delete()
    .eq('character_id', characterId)
  if (error) throw error
}

export async function isHunted(characterId: number): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hunted_list')
    .select('id')
    .eq('character_id', characterId)
    .maybeSingle()
  return !!data
}
