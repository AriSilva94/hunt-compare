'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { OnlineDot } from '@/components/ui/OnlineDot'
import { fmtXP, timeAgo } from '@/lib/utils/format'
import type { OnlineCharacterRow } from '@/lib/data/characters'

const VOC_ABBR: Record<string, string> = {
  'Knight': 'KN', 'Paladin': 'PA', 'Sorcerer': 'SC', 'Druid': 'DR',
  'Elite Knight': 'EK', 'Royal Paladin': 'RP', 'Master Sorcerer': 'MS',
  'Elder Druid': 'ED', 'None': '—',
}

function rowTint(row: OnlineCharacterRow): string {
  const recentDeath = row.last_death_at &&
    (Date.now() - new Date(row.last_death_at).getTime()) < 6 * 3_600_000
  if (recentDeath) return 'rgba(26,8,8,0.55)'
  if ((row.xp_gained_today ?? 0) >= 1_000_000) return 'rgba(192,120,40,0.04)'
  return ''
}

function rowBorderLeft(row: OnlineCharacterRow): string {
  const recentDeath = row.last_death_at &&
    (Date.now() - new Date(row.last_death_at).getTime()) < 6 * 3_600_000
  return recentDeath ? '2px solid #4a1010' : '2px solid transparent'
}

interface Props { players: OnlineCharacterRow[] }

export default function OnlineBoard({ players }: Props) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'rank' | 'xp'>('rank')

  const rows = useMemo(() => {
    let list = players
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (sortBy === 'xp') {
      list = [...list].sort((a, b) => (b.xp_gained_today ?? -1) - (a.xp_gained_today ?? -1))
    }
    return list
  }, [players, search, sortBy])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Filter bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center',
        padding: '0.625rem 0.875rem',
        background: '#161210', border: '1px solid #2a2018', borderBottom: 'none',
      }}>
        <input
          type="text"
          placeholder="Search operative..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="chronicle-input"
          style={{ padding: '4px 10px', fontSize: '0.78rem', width: '190px', fontFamily: 'var(--font-body, serif)' }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px' }}>
          {(['rank', 'xp'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="display-font"
              style={{
                padding: '4px 11px', fontSize: '0.6rem', letterSpacing: '0.12em',
                cursor: 'pointer', border: '1px solid',
                borderColor: sortBy === s ? '#c07828' : '#2a2018',
                background: sortBy === s ? '#c07828' : 'transparent',
                color: sortBy === s ? '#0d0b08' : '#9a8a72',
                transition: 'all 0.15s',
              }}
            >
              {s === 'rank' ? 'BY RANK' : 'BY XP'}
            </button>
          ))}
        </div>
        <span className="display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#6a5a44', whiteSpace: 'nowrap' }}>
          {rows.length} / {players.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #2a2018' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#1a1510', borderBottom: '1px solid #2a2018' }}>
              {[
                { label: '#',          align: 'left',   w: '52px' },
                { label: 'Name',       align: 'left'              },
                { label: 'Voc',        align: 'left',   sm: true  },
                { label: 'Lvl',        align: 'right'             },
                { label: 'Daily XP',   align: 'right',  sm: true  },
                { label: 'Last Death', align: 'left',   md: true  },
              ].map((col) => (
                <th
                  key={col.label}
                  className={col.md ? 'hidden md:table-cell' : col.sm ? 'hidden sm:table-cell' : ''}
                  style={{
                    padding: '9px 13px',
                    textAlign: col.align as 'left' | 'right',
                    fontSize: '0.58rem', letterSpacing: '0.18em',
                    color: '#6a5a44',
                    fontFamily: 'var(--font-display-var, serif)', fontWeight: 600,
                    width: col.w,
                  }}
                >
                  {col.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#6a5a44', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  No targets match your search.
                </td>
              </tr>
            ) : (
              rows.map((p, i) => {
                const bg = rowTint(p) || (i % 2 === 0 ? '#0f0d0a' : '#111009')
                const recentDeath = p.last_death_at &&
                  (Date.now() - new Date(p.last_death_at).getTime()) < 48 * 3_600_000

                return (
                  <tr
                    key={p.id}
                    className="roster-row"
                    style={{ borderBottom: '1px solid #1e1a14', background: bg, borderLeft: rowBorderLeft(p) }}
                  >
                    <td style={{ padding: '9px 13px', color: '#3a2e20', fontSize: '0.72rem', fontFamily: 'var(--font-mono-var, monospace)' }}>
                      {p.rank ?? '—'}
                    </td>
                    <td style={{ padding: '9px 13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <OnlineDot />
                        <Link href={`/characters/${p.slug}`} className="ember-link" style={{ fontSize: '0.88rem' }}>
                          {p.name}
                        </Link>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell" style={{ padding: '9px 13px', color: '#9a8a72', fontSize: '0.72rem', fontStyle: 'italic', fontFamily: 'var(--font-body, serif)', whiteSpace: 'nowrap' }}>
                      {p.vocation ? (VOC_ABBR[p.vocation] ?? p.vocation.slice(0, 2)) : '—'}
                    </td>
                    <td style={{ padding: '9px 13px', textAlign: 'right', color: '#9a8a72', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem' }}>
                      {p.level ?? '—'}
                    </td>
                    <td className="hidden sm:table-cell" style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {p.xp_gained_today != null && p.xp_gained_today > 0 ? (
                        <span style={{ color: p.xp_gained_today >= 1_000_000 ? '#d4a840' : '#c07828' }}>
                          {fmtXP(p.xp_gained_today)}
                        </span>
                      ) : (
                        <span style={{ color: '#2a2018' }}>—</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell" style={{ padding: '9px 13px' }}>
                      {recentDeath ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#b82020', fontSize: '0.72rem', fontFamily: 'var(--font-mono-var, monospace)' }}>
                          <span style={{ opacity: 0.9 }}>☠</span>
                          {timeAgo(p.last_death_at!)}
                        </span>
                      ) : (
                        <span style={{ color: '#2a2018', fontSize: '0.72rem', fontFamily: 'var(--font-mono-var, monospace)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
