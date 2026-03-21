import { Suspense } from 'react'
import Link from 'next/link'
import { getTopCharacters, getOnlineCharacters } from '@/lib/data/characters'
import CharacterTable from '@/components/characters/CharacterTable'
import type { Character } from '@/types/database'

interface CharacterWithSnapshot extends Character {
  daily_snapshots: { xp_gained: number | null; rank: number | null; snapshot_date: string }[]
}

export const revalidate = 900

export default async function HomePage() {
  const [topChars, onlineChars] = await Promise.all([
    getTopCharacters(),
    getOnlineCharacters(),
  ])

  const onlineCount = onlineChars.length
  const tableData = (topChars as CharacterWithSnapshot[]).map((c) => ({
    ...c,
    xp_gained: c.daily_snapshots?.[0]?.xp_gained ?? null,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2.5rem 0 0.5rem' }}>
        <div className="ruled-section display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#3a2a18', marginBottom: '1.5rem' }}>
          CALMERA · TIBIA · WORLD TRACKER
        </div>
        <h1 className="display-font ember-shimmer" style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)', letterSpacing: '0.22em', color: '#e2d8c2', lineHeight: 1, fontWeight: 900 }}>
          CALMERA
        </h1>
        <div style={{ width: '4rem', height: '2px', background: 'linear-gradient(90deg, transparent, #c07828, transparent)', margin: '1rem auto' }} />
        <p style={{ fontSize: '1rem', color: '#9a8a72', fontStyle: 'italic', fontFamily: 'var(--font-body, serif)' }}>
          Tracking the top 1,000 — experience, combat, survival.
        </p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link href="/online" className="display-font action-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', border: '1px solid #1a5c28', background: '#0a1e10', color: '#40c860', fontSize: '0.68rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
          <span className="online-glow" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#40c860', display: 'inline-block', flexShrink: 0 }} />
          ONLINE NOW · {onlineCount}
        </Link>
        <Link href="/deaths" className="display-font action-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', border: '1px solid #4a1010', background: '#130808', color: '#b82020', fontSize: '0.68rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
          ☠ RECENT DEATHS
        </Link>
      </div>

      {/* Player roster */}
      <section>
        <div className="ruled-section display-font" style={{ fontSize: '0.62rem', letterSpacing: '0.22em', color: '#3a2a18', marginBottom: '1rem' }}>
          FIELD REPORT
        </div>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6a5a44', fontStyle: 'italic', border: '1px solid #2a2018' }}>
            Gathering intelligence...
          </div>
        }>
          <CharacterTable characters={tableData} />
        </Suspense>
      </section>
    </div>
  )
}
