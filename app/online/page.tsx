import { getOnlineCharactersWithStats } from '@/lib/data/characters'
import { fmtXPLarge } from '@/lib/utils/format'
import { StatCard } from '@/components/ui/StatCard'
import OnlineBoard from '@/components/characters/OnlineBoard'

export const revalidate = 300
export const metadata = { title: 'Online Now – CalmTracker' }

export default async function OnlinePage() {
  const players = await getOnlineCharactersWithStats()

  const onlineCount = players.length
  const totalXPToday = players.reduce((sum, p) => sum + (p.xp_gained_today ?? 0), 0)
  const deathsLast24h = players.filter((p) => {
    if (!p.last_death_at) return false
    return Date.now() - new Date(p.last_death_at).getTime() < 24 * 3_600_000
  }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div>
        <div className="ruled-section display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.28em', color: '#3a2a18', marginBottom: '1.25rem' }}>
          LIVE INTELLIGENCE
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="display-font" style={{ fontSize: '2rem', letterSpacing: '0.12em', fontWeight: 700, color: '#e2d8c2', lineHeight: 1 }}>
            ONLINE NOW
          </h1>
          {onlineCount > 0 && (
            <span
              className="display-font online-glow"
              style={{
                fontSize: '0.65rem', letterSpacing: '0.1em',
                color: '#40c860', border: '1px solid #1a5c28',
                background: '#0d2515', padding: '3px 10px',
              }}
            >
              {onlineCount} ACTIVE
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: '#9a8a72', marginTop: '0.35rem', fontStyle: 'italic', fontFamily: 'var(--font-body, serif)' }}>
          Tracked operatives currently on Calmera · refreshes every 5 min
        </p>
      </div>

      {/* Stat strip */}
      {onlineCount > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#2a2018', border: '1px solid #2a2018' }}>
          <StatCard label="Online" value={String(onlineCount)} color="#40c860" />
          <StatCard
            label="XP Today (sum)"
            value={totalXPToday > 0 ? fmtXPLarge(totalXPToday) : '—'}
            color="#c07828"
          />
          <StatCard
            label="Deaths · 24h"
            value={deathsLast24h > 0 ? String(deathsLast24h) : '—'}
            color={deathsLast24h > 0 ? '#b82020' : '#6a5a44'}
          />
        </div>
      )}

      {/* Board */}
      {onlineCount === 0 ? (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          border: '1px solid #1e1a14', color: '#6a5a44',
          fontStyle: 'italic', fontFamily: 'var(--font-body, serif)',
          fontSize: '0.9rem',
        }}>
          No tracked operatives online. The battlefield is quiet.
        </div>
      ) : (
        <OnlineBoard players={players} />
      )}

    </div>
  )
}
