'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { removeHuntedAction } from './actions'

interface Props {
  characterId: number | undefined
}

export default function RemoveHuntedButton({ characterId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    if (!characterId) return
    startTransition(async () => {
      await removeHuntedAction(characterId)
      router.refresh()
    })
  }

  return (
    <button onClick={handleRemove} disabled={isPending} className="remove-btn">
      REMOVE
    </button>
  )
}
