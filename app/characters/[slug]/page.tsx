import { notFound } from 'next/navigation'
import { getCharacterBySlug, getCharacterSnapshots, getCharacterDeaths } from '@/lib/data/characters'
import { Badge } from '@/components/ui/Badge'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `${slug} – CalmTracker` }
}

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params

  const character = await getCharacterBySlug(slug)
  if (!character) notFound()

  const [snapshots, deaths] = await Promise.all([
    getCharacterSnapshots(character.id, 30),
    getCharacterDeaths(character.id, 10),
  ])

  const todayXp = snapshots[0]?.xp_gained ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Profile card */}
      <div className="war-panel" style={{ padding: '1.75rem' }}>
        <div style={{ height: '2px', background: character.is_online ? 'linear-gradient(90deg, transparent, #25903a, transparent)' : 'linear-gradient(90deg, transparent, #2a2018, transparent)', marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 className="display-font" style={{ fontSize: '1.75rem', letterSpacing: '0.08em', fontWeight: 700, color: '#e2d8c2' }}>
                {character.name}
              </h1>
              <Badge variant={character.is_online ? 'online' : 'offline'}>
                {character.is_online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9a8a72', fontStyle: 'italic' }}>
              {character.vocation ?? 'Unknown vocation'} · Calmera
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'Level', value: character.level?.toString() ?? '–', color: '#9a8a72' },
              { label: 'Rank', value: character.rank ? `#${character.rank}` : '–', color: '#c07828' },
              { label: 'Today XP', value: todayXp != null ? `+${todayXp.toLocaleString()}` : '–', color: todayXp != null ? '#d4a840' : '#2a2018' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', minWidth: '4rem' }}>
                <div className="display-font mono-font" style={{ fontSize: '1.5rem', fontWeight: 700, color, letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {value}
                </div>
                <div className="display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.16em', color: '#6a5a44', marginTop: '3px' }}>
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #2a2018', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem' }}>
          <div>
            <span className="display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: '#6a5a44' }}>TOTAL XP · </span>
            <span style={{ color: '#8a7a62' }}>{character.experience?.toLocaleString() ?? '–'}</span>
          </div>
          <div>
            <span className="display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: '#6a5a44' }}>LAST LOGIN · </span>
            <span style={{ color: '#8a7a62' }}>{character.last_login ? new Date(character.last_login).toLocaleString() : '–'}</span>
          </div>
        </div>
      </div>

      {/* Lower grid */}
      <div style={{ display: 'grid', gap: '1.5rem' }} className="md:grid-cols-2">

        <section className="war-panel" style={{ padding: '1.25rem' }}>
          <h2 className="display-font" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#9a8a72', borderBottom: '1px solid #2a2018', paddingBottom: '0.5rem' }}>
            XP HISTORY · 30 DAYS
          </h2>
          {snapshots.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6a5a44', fontStyle: 'italic', marginTop: '0.75rem' }}>No snapshot data yet.</p>
          ) : (
            <div style={{ marginTop: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {snapshots.map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e1a14', fontSize: '0.82rem' }}>
                  <span className="mono-font" style={{ color: '#6a5a44', fontSize: '0.75rem' }}>{s.snapshot_date}</span>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <span style={{ color: '#6a5a44', fontSize: '0.75rem', fontFamily: 'var(--font-mono-var)' }}>#{s.rank ?? '–'}</span>
                    <span className="mono-font" style={{ color: s.xp_gained != null && s.xp_gained > 0 ? '#d4a840' : '#2a2018', minWidth: '80px', textAlign: 'right' }}>
                      {s.xp_gained != null ? `+${s.xp_gained.toLocaleString()}` : '–'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="war-panel" style={{ padding: '1.25rem' }}>
          <h2 className="display-font" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#9a8a72', borderBottom: '1px solid #2a2018', paddingBottom: '0.5rem' }}>
            RECENT DEATHS
          </h2>
          {deaths.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6a5a44', fontStyle: 'italic', marginTop: '0.75rem' }}>No death records.</p>
          ) : (
            <div style={{ marginTop: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {deaths.map((d) => (
                <div key={d.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #1e1a14', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#7a1515' }}>☠</span>
                    <span style={{ color: '#8a6a50', fontSize: '0.82rem' }}>Level {d.level ?? '?'}</span>
                    <span className="mono-font" style={{ marginLeft: 'auto', color: '#6a5a44', fontSize: '0.72rem' }}>
                      {new Date(d.died_at).toLocaleDateString()}
                    </span>
                  </div>
                  {d.reason && (
                    <p style={{ fontSize: '0.78rem', color: '#9a8a72', fontStyle: 'italic', marginTop: '3px', paddingLeft: '1.35rem' }}>
                      {d.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
