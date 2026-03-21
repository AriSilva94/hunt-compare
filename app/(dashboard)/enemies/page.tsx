import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserEnemies } from '@/lib/data/enemies'
import { searchCharacters } from '@/lib/data/characters'
import type { EnemyWithCharacter } from '@/types/database'
import AddEnemyForm from './AddEnemyForm'
import { EnemyTable } from '@/components/characters/EnemyTable'
import Link from 'next/link'

export const metadata = { title: 'Enemy List – CalmTracker' }

export default async function EnemiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { q = '', filter = '' } = await searchParams

  const [rawEnemies, searchResults] = await Promise.all([
    getUserEnemies(user.id),
    q.trim().length >= 2 ? searchCharacters(q.trim()) : Promise.resolve([]),
  ])

  const enemies = rawEnemies as EnemyWithCharacter[]
  const filteredEnemies = filter === 'online' ? enemies.filter((e) => e.characters?.is_online) : enemies
  const onlineCount = enemies.filter((e) => e.characters?.is_online).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div>
        <div className="ruled-section display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#3a2a18', marginBottom: '1.25rem' }}>
          WAR ROOM
        </div>
        <h1 className="display-font" style={{ fontSize: '2rem', letterSpacing: '0.12em', fontWeight: 700, color: '#e2d8c2' }}>
          ENEMY LIST
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#9a8a72', marginTop: '0.4rem', fontStyle: 'italic' }}>
          Track your targets. Monitor their movements.
        </p>
      </div>

      <AddEnemyForm searchResults={searchResults} initialQuery={q} />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[
          { href: '/enemies', label: `ALL · ${enemies.length}`, active: filter !== 'online', online: false },
          { href: '/enemies?filter=online', label: `ONLINE · ${onlineCount}`, active: filter === 'online', online: true },
        ].map(({ href, label, active, online }) => (
          <Link key={href} href={href} className="display-font"
            style={{ padding: '5px 16px', fontSize: '0.62rem', letterSpacing: '0.12em', textDecoration: 'none', border: '1px solid', borderColor: active ? (online ? '#1a5c28' : '#c07828') : '#2a2018', background: active ? (online ? '#0d2515' : '#1e1408') : 'transparent', color: active ? (online ? '#40c860' : '#c07828') : '#6a5a44', transition: 'all 0.15s' }}>
            {label}
          </Link>
        ))}
      </div>

      {filteredEnemies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid #2a2018', color: '#6a5a44', fontStyle: 'italic' }}>
          No enemies {filter === 'online' ? 'online' : 'tracked'} yet.
        </div>
      ) : (
        <EnemyTable enemies={filteredEnemies} showRank showRemove />
      )}
    </div>
  )
}
