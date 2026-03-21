import { getRecentDeaths } from '@/lib/data/characters'
import type { DeathWithCharacter } from '@/types/database'
import Link from 'next/link'

export const revalidate = 600
export const metadata = { title: 'Recent Deaths – CalmTracker' }

export default async function DeathsPage() {
  const deaths = await getRecentDeaths(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="ruled-section display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#3a2a18', marginBottom: '1.25rem' }}>
          CASUALTY REGISTER
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 className="display-font" style={{ fontSize: '2rem', letterSpacing: '0.12em', fontWeight: 700, color: '#e2d8c2' }}>
            RECENT DEATHS
          </h1>
          {deaths.length > 0 && (
            <span className="display-font" style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: '#b82020', border: '1px solid #4a1010', background: '#1a0808', padding: '3px 10px' }}>
              {deaths.length} RECORDS
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.88rem', color: '#9a8a72', marginTop: '0.4rem', fontStyle: 'italic' }}>
          Latest death records for hunted players · updated every 5 min
        </p>
      </div>

      {deaths.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid #2a2018', color: '#6a5a44', fontStyle: 'italic' }}>
          No death records yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {(deaths as DeathWithCharacter[]).map((d, i) => (
            <div key={d.id} className="fade-in-up"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.9rem 1.1rem', background: i % 2 === 0 ? '#161210' : '#131008', border: '1px solid #2a2018', borderTop: i === 0 ? '1px solid #2a2018' : 'none', animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', color: '#7a1515', flexShrink: 0 }}>☠</span>
                <Link href={`/characters/${d.characters?.slug ?? ''}`} className="ember-link" style={{ fontSize: '0.92rem' }}>
                  {d.characters?.name ?? 'Unknown'}
                </Link>
                {d.level && (
                  <span className="display-font" style={{ fontSize: '0.62rem', color: '#6a5a44', letterSpacing: '0.08em' }}>
                    LVL {d.level}
                  </span>
                )}
                <span className="mono-font" style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#6a5a44' }}>
                  {new Date(d.died_at).toLocaleString()}
                </span>
              </div>
              {d.reason && (
                <p style={{ fontSize: '0.8rem', color: '#9a8a72', fontStyle: 'italic', paddingLeft: '1.6rem', margin: 0 }}>
                  {d.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
