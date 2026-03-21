import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { OnlineDot } from '@/components/ui/OnlineDot'
import RemoveHuntedButton from '@/app/(dashboard)/hunted/RemoveHuntedButton'
import type { HuntedWithCharacter } from '@/types/database'

interface Props {
  hunted: HuntedWithCharacter[]
  showRemove?: boolean
}

export default function HuntedTable({ hunted, showRemove = false }: Props) {
  if (hunted.length === 0) return null

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #2a2018' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: '#1a1510', borderBottom: '1px solid #2a2018' }}>
            <ColHeader label="#" />
            <ColHeader label="Name" />
            <ColHeader label="Vocation" hidden="md" />
            <ColHeader label="Level" right />
            <ColHeader label="Last Death" hidden="sm" />
            <ColHeader label="Status" center />
            {showRemove && <ColHeader label="" />}
          </tr>
        </thead>
        <tbody>
          {hunted.map((h, i) => {
            const c = h.characters
            const lastDeath = c?.deaths?.[0] ?? null
            return (
              <tr key={h.id} className="roster-row" style={{ borderBottom: '1px solid #1e1a14', background: i % 2 === 0 ? '#0f0d0a' : '#111009' }}>
                <td style={{ padding: '10px 14px', color: '#3a2e20', fontSize: '0.75rem', fontFamily: 'var(--font-mono-var, monospace)' }}>
                  {c?.rank ?? '–'}
                </td>
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
                <td className="hidden sm:table-cell" style={{ padding: '10px 14px', fontSize: '0.78rem' }}>
                  {lastDeath ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#b82020' }}>
                        ☠ Lv {lastDeath.level} · {new Date(lastDeath.died_at).toLocaleDateString()}
                      </span>
                      {lastDeath.reason && (
                        <span style={{ color: '#6a5a44', fontStyle: 'italic', fontSize: '0.72rem' }}>
                          {lastDeath.reason.length > 60 ? lastDeath.reason.slice(0, 60) + '…' : lastDeath.reason}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#2a2018' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <Badge variant={c?.is_online ? 'online' : 'offline'}>
                    {c?.is_online ? 'Online' : 'Offline'}
                  </Badge>
                </td>
                {showRemove && c?.id != null && (
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <RemoveHuntedButton characterId={c.id} />
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

function ColHeader({ label, right = false, center = false, hidden }: {
  label: string; right?: boolean; center?: boolean; hidden?: 'sm' | 'md'
}) {
  return (
    <th className={hidden ? `hidden ${hidden}:table-cell` : ''}
      style={{ padding: '10px 14px', textAlign: right ? 'right' : center ? 'center' : 'left', fontSize: '0.6rem', letterSpacing: '0.16em', color: '#6a5a44', fontFamily: 'var(--font-display-var, serif)', fontWeight: 600 }}>
      {label.toUpperCase()}
    </th>
  )
}
