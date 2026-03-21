'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { OnlineDot } from '@/components/ui/OnlineDot'
import type { Character } from '@/types/database'

interface Row extends Character { xp_gained?: number | null }
interface Props { characters: Row[] }

export default function CharacterTable({ characters }: Props) {
  const [search, setSearch] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rank' | 'xp_gained'>('rank')

  const filtered = useMemo(() => {
    let list = characters
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }
    if (onlineOnly) list = list.filter((c) => c.is_online)
    if (sortBy === 'xp_gained') list = [...list].sort((a, b) => (b.xp_gained ?? 0) - (a.xp_gained ?? 0))
    return list
  }, [characters, search, onlineOnly, sortBy])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 1rem', background: '#161210', border: '1px solid #2a2018', borderBottom: 'none' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="chronicle-input"
          style={{ padding: '5px 10px', fontSize: '0.8rem', width: '200px', fontFamily: 'var(--font-body, serif)' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', letterSpacing: '0.06em', color: '#9a8a72', cursor: 'pointer', fontFamily: 'var(--font-display-var, serif)' }}>
          <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} style={{ accentColor: '#40c860' }} />
          ONLINE ONLY
        </label>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          {(['rank', 'xp_gained'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="display-font"
              style={{ padding: '4px 12px', fontSize: '0.62rem', letterSpacing: '0.1em', cursor: 'pointer', border: '1px solid', borderColor: sortBy === s ? '#c07828' : '#2a2018', background: sortBy === s ? '#c07828' : 'transparent', color: sortBy === s ? '#0d0b08' : '#9a8a72', transition: 'all 0.15s' }}
            >
              {s === 'rank' ? 'BY RANK' : 'BY DAILY XP'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #2a2018' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#1a1510', borderBottom: '1px solid #2a2018' }}>
              {[
                { label: '#', w: '48px' },
                { label: 'Name' },
                { label: 'Vocation', hidden: 'md' },
                { label: 'Level', right: true },
                { label: 'Daily XP', right: true, hidden: 'sm' },
                { label: 'Status', center: true },
              ].map((col) => (
                <th key={col.label}
                  className={col.hidden ? `hidden ${col.hidden}:table-cell` : ''}
                  style={{ padding: '10px 14px', textAlign: col.right ? 'right' : col.center ? 'center' : 'left', fontSize: '0.6rem', letterSpacing: '0.16em', color: '#6a5a44', fontFamily: 'var(--font-display-var, serif)', fontWeight: 600, width: col.w }}
                >
                  {col.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6a5a44', fontStyle: 'italic' }}>
                  No players found.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr key={c.id} className="roster-row" style={{ borderBottom: '1px solid #1e1a14', background: i % 2 === 0 ? '#0f0d0a' : '#111009' }}>
                  <td style={{ padding: '10px 14px', color: '#3a2e20', fontSize: '0.75rem', fontFamily: 'var(--font-mono-var, monospace)' }}>
                    {c.rank ?? '–'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.is_online && <OnlineDot />}
                      <Link href={`/characters/${c.slug}`} className="ember-link">
                        {c.name}
                      </Link>
                    </div>
                  </td>
                  <td className="hidden md:table-cell" style={{ padding: '10px 14px', color: '#9a8a72', fontSize: '0.82rem', fontStyle: 'italic' }}>
                    {c.vocation ?? '–'}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#9a8a72', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem' }}>
                    {c.level ?? '–'}
                  </td>
                  <td className="hidden sm:table-cell" style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem' }}>
                    {c.xp_gained != null
                      ? <span style={{ color: '#d4a840' }}>+{c.xp_gained.toLocaleString()}</span>
                      : <span style={{ color: '#2a2018' }}>–</span>}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <Badge variant={c.is_online ? 'online' : 'offline'}>
                      {c.is_online ? 'Online' : 'Offline'}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="display-font" style={{ textAlign: 'right', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#2a2018' }}>
        {filtered.length} / {characters.length} PLAYERS
      </p>
    </div>
  )
}
