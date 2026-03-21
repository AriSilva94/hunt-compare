'use server'

import { addEnemy, removeEnemy } from '@/lib/data/enemies'

export async function addEnemyAction(userId: string, characterId: number) {
  await addEnemy(userId, characterId)
}

export async function removeEnemyAction(userId: string, characterId: number) {
  await removeEnemy(userId, characterId)
}
