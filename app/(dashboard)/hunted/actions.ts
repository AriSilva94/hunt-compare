'use server'

import { addHunted, removeHunted } from '@/lib/data/hunted'

export async function addHuntedAction(characterId: number) {
  await addHunted(characterId)
}

export async function removeHuntedAction(characterId: number) {
  await removeHunted(characterId)
}
