'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { removeEnemyAction } from './actions'

interface Props {
  userId: string
  characterId: number
}

export default function RemoveEnemyButton({ userId, characterId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    startTransition(async () => {
      await removeEnemyAction(userId, characterId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="text-xs text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      Remove
    </button>
  )
}
