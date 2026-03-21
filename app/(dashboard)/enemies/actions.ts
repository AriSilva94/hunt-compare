'use server'

import { createClient } from '@/lib/supabase/server'
import { addEnemy, removeEnemy } from '@/lib/data/enemies'

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function addEnemyAction(characterId: number) {
  const userId = await getAuthenticatedUserId()
  await addEnemy(userId, characterId)
}

export async function removeEnemyAction(characterId: number) {
  const userId = await getAuthenticatedUserId()
  await removeEnemy(userId, characterId)
}
