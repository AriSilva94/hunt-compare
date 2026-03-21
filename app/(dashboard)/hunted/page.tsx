import { getHuntedList } from '@/lib/data/hunted'
import { searchCharacters } from '@/lib/data/characters'
import type { HuntedWithCharacter } from '@/types/database'
import AddHuntedForm from './AddHuntedForm'
import HuntedTable from '@/components/characters/HuntedTable'
import Link from 'next/link'

export const metadata = { title: 'Hunted List – CalmTracker' }

export default async function HuntedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const { q = '', filter = '' } = await searchParams

  const [rawHunted, searchResults] = await Promise.all([
    getHuntedList(),
    q.trim().length >= 2 ? searchCharacters(q.trim()) : Promise.resolve([]),
  ])

  const hunted = rawHunted as HuntedWithCharacter[]
  const filtered = filter === 'online' ? hunted.filter((h) => h.characters?.is_online) : hunted
  const onlineCount = hunted.filter((h) => h.characters?.is_online).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div>
        <div className="ruled-section display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#3a2a18', marginBottom: '1.25rem' }}>
          HIT LIST
        </div>
        <h1 className="display-font" style={{ fontSize: '2rem', letterSpacing: '0.12em', fontWeight: 700, color: '#e2d8c2' }}>
          HUNTED
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#9a8a72', marginTop: '0.4rem', fontStyle: 'italic' }}>
          Deaths tracked every 5 minutes · {hunted.length} targets
        </p>
      </div>

      <AddHuntedForm searchResults={searchResults} initialQuery={q} />

      <div style={{ display: 'flex', gap: '4px' }}>
        {[
          { href: '/hunted', label: `ALL · ${hunted.length}`, active: filter !== 'online', online: false },
          { href: '/hunted?filter=online', label: `ONLINE · ${onlineCount}`, active: filter === 'online', online: true },
        ].map(({ href, label, active, online }) => (
          <Link key={href} href={href} className="display-font"
            style={{ padding: '5px 16px', fontSize: '0.62rem', letterSpacing: '0.12em', textDecoration: 'none', border: '1px solid', borderColor: active ? (online ? '#1a5c28' : '#7a1515') : '#2a2018', background: active ? (online ? '#0d2515' : '#1a0808') : 'transparent', color: active ? (online ? '#40c860' : '#b82020') : '#6a5a44', transition: 'all 0.15s' }}>
            {label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid #2a2018', color: '#6a5a44', fontStyle: 'italic' }}>
          No targets {filter === 'online' ? 'online' : 'marked'} yet.
        </div>
      ) : (
        <HuntedTable hunted={filtered} showRemove />
      )}
    </div>
  )
}
