import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { OnlineDot } from '@/components/ui/OnlineDot'
import RemoveEnemyButton from '@/app/(dashboard)/enemies/RemoveEnemyButton'
import type { EnemyWithCharacter } from '@/types/database'

interface EnemyTableProps {
  enemies: EnemyWithCharacter[]
  showRank?: boolean
  showXP?: boolean
  showRemove?: boolean
}

export function EnemyTable({ enemies, showRank = false, showXP = false, showRemove = false }: EnemyTableProps) {
  if (enemies.length === 0) return null

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #2a2018' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: '#1a1510', borderBottom: '1px solid #2a2018' }}>
            {showRank && <ColHeader label="#" />}
            <ColHeader label="Name" />
            <ColHeader label="Vocation" hidden="md" />
            <ColHeader label="Level" right />
            {showXP && <ColHeader label="Today XP" right hidden="sm" />}
            <ColHeader label="Status" center />
            {showRemove && <ColHeader label="" />}
          </tr>
        </thead>
        <tbody>
          {enemies.map((e, i) => {
            const c = e.characters
            const xp = c?.daily_snapshots?.[0]?.xp_gained ?? null
            return (
              <tr key={e.id} className="roster-row" style={{ borderBottom: '1px solid #1e1a14', background: i % 2 === 0 ? '#0f0d0a' : '#111009' }}>
                {showRank && (
                  <td style={{ padding: '10px 14px', color: '#3a2e20', fontSize: '0.75rem', fontFamily: 'var(--font-mono-var, monospace)' }}>
                    {c?.rank ?? '–'}
                  </td>
                )}
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {c?.is_online && <OnlineDot />}
                    <Link href={`/characters/${c?.slug ?? ''}`} className="ember-link">
                      {c?.name ?? '–'}
                    </Link>
                  </div>
                </td>
                <td className="hidden md:table-cell" style={{ padding: '10px 14px', color: '#9a8a72', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  {c?.vocation ?? '–'}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', color: '#9a8a72', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem' }}>
                  {c?.level ?? '–'}
                </td>
                {showXP && (
                  <td className="hidden sm:table-cell" style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono-var, monospace)', fontSize: '0.82rem' }}>
                    {xp != null
                      ? <span style={{ color: '#d4a840' }}>+{xp.toLocaleString()}</span>
                      : <span style={{ color: '#2a2018' }}>–</span>}
                  </td>
                )}
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <Badge variant={c?.is_online ? 'online' : 'offline'}>
                    {c?.is_online ? 'Online' : 'Offline'}
                  </Badge>
                </td>
                {showRemove && c?.id != null && (
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <RemoveEnemyButton characterId={c.id} />
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ColHeader({
  label,
  right = false,
  center = false,
  hidden,
}: {
  label: string
  right?: boolean
  center?: boolean
  hidden?: 'sm' | 'md'
}) {
  return (
    <th
      className={hidden ? `hidden ${hidden}:table-cell` : ''}
      style={{
        padding: '10px 14px',
        textAlign: right ? 'right' : center ? 'center' : 'left',
        fontSize: '0.6rem',
        letterSpacing: '0.16em',
        color: '#6a5a44',
        fontFamily: 'var(--font-display-var, serif)',
        fontWeight: 600,
      }}
    >
      {label.toUpperCase()}
    </th>
  )
}
