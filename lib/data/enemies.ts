import { createClient } from '@/lib/supabase/server'

export async function getUserEnemies(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('user_enemy_lists')
    .select(`
      *,
      characters (
        id, name, slug, rank, level, vocation, is_online, last_login,
        daily_snapshots (xp_gained, snapshot_date)
      )
    `)
    .eq('user_id', userId)
    .eq('characters.daily_snapshots.snapshot_date', today)

  if (error) throw error
  return data ?? []
}

export async function addEnemy(userId: string, characterId: number, note?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_enemy_lists')
    .insert({ user_id: userId, character_id: characterId, note: note ?? null })

  if (error) throw error
}

export async function removeEnemy(userId: string, characterId: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_enemy_lists')
    .delete()
    .eq('user_id', userId)
    .eq('character_id', characterId)

  if (error) throw error
}

export async function isEnemy(userId: string, characterId: number): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('user_enemy_lists')
    .select('id')
    .eq('user_id', userId)
    .eq('character_id', characterId)
    .maybeSingle()

  return !!data
}
