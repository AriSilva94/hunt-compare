'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addEnemyAction } from './actions'

interface SearchResult {
  id: number
  name: string
  rank: number | null
  level: number | null
  vocation: string | null
  is_online: boolean
}

interface Props {
  userId: string
  searchResults: SearchResult[]
  initialQuery: string
}

export default function AddEnemyForm({ userId, searchResults, initialQuery }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/enemies?q=${encodeURIComponent(query)}`)
  }

  function handleAdd(characterId: number) {
    startTransition(async () => {
      await addEnemyAction(userId, characterId)
      router.push('/enemies')
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search character to add as enemy..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 flex-1"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-black font-medium px-4 py-2 rounded text-sm transition-colors"
        >
          Search
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          {searchResults.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${r.is_online ? 'bg-green-500' : 'bg-gray-600'}`} />
                <span className="text-white text-sm font-medium">{r.name}</span>
                <span className="text-gray-500 text-xs">
                  {r.vocation} · Lv {r.level} · #{r.rank}
                </span>
              </div>
              <button
                onClick={() => handleAdd(r.id)}
                disabled={isPending}
                className="text-xs bg-red-900 hover:bg-red-800 border border-red-700 text-red-300 px-3 py-1 rounded transition-colors disabled:opacity-50"
              >
                + Add enemy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
