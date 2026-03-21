'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addHuntedAction } from './actions'

interface SearchResult {
  id: number
  name: string
  rank: number | null
  level: number | null
  vocation: string | null
  is_online: boolean
}

interface Props {
  searchResults: SearchResult[]
  initialQuery: string
}

export default function AddHuntedForm({ searchResults, initialQuery }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/hunted?q=${encodeURIComponent(query)}`)
  }

  function handleAdd(characterId: number) {
    startTransition(async () => {
      await addHuntedAction(characterId)
      router.push('/hunted')
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search character to mark as hunted..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="chronicle-input"
          style={{ flex: 1, padding: '9px 12px', fontSize: '0.85rem', fontFamily: 'var(--font-body, serif)' }}
        />
        <button type="submit" className="display-font ember-btn"
          style={{ padding: '9px 18px', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700, flexShrink: 0 }}>
          SEARCH
        </button>
      </form>

      {searchResults.length > 0 && (
        <div style={{ border: '1px solid #2a2018', overflow: 'hidden' }}>
          {searchResults.map((r, i) => (
            <div key={r.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: i % 2 === 0 ? '#161210' : '#131008', borderBottom: i < searchResults.length - 1 ? '1px solid #1e1a14' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: r.is_online ? '#40c860' : '#2a2018', flexShrink: 0, display: 'inline-block' }}
                  className={r.is_online ? 'online-glow' : ''} />
                <span style={{ color: '#e2d8c2', fontWeight: 600, fontSize: '0.88rem' }}>{r.name}</span>
                <span style={{ color: '#3a2a18', fontSize: '0.75rem', fontStyle: 'italic' }}>
                  {r.vocation} · Lv {r.level} · #{r.rank}
                </span>
              </div>
              <button onClick={() => handleAdd(r.id)} disabled={isPending} className="display-font add-enemy-btn"
                style={{ padding: '4px 12px', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                + MARK HUNTED
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
