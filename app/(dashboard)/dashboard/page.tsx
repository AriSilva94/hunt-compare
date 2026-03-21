import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserEnemies } from '@/lib/data/enemies'
import type { EnemyWithCharacter } from '@/types/database'
import { EnemyTable } from '@/components/characters/EnemyTable'
import { StatCard } from '@/components/ui/StatCard'
import Link from 'next/link'

export const metadata = { title: 'Dashboard – CalmTracker' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const enemies = (await getUserEnemies(user.id)) as EnemyWithCharacter[]
  const onlineCount = enemies.filter((e) => e.characters?.is_online).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div>
        <div className="ruled-section display-font" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#3a2a18', marginBottom: '1.25rem' }}>
          COMMAND CENTER
        </div>
        <h1 className="display-font" style={{ fontSize: '2rem', letterSpacing: '0.12em', fontWeight: 700, color: '#e2d8c2' }}>
          DASHBOARD
        </h1>
        <p className="mono-font" style={{ fontSize: '0.75rem', color: '#6a5a44', marginTop: '0.3rem' }}>
          {user.email}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#2a2018', border: '1px solid #2a2018', maxWidth: '480px' }}>
        <StatCard label="Enemies Tracked" value={String(enemies.length)} />
        <StatCard label="Enemies Online" value={String(onlineCount)} highlight={onlineCount > 0} />
      </div>

      {/* Enemy table */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="display-font" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: '#9a8a72' }}>
            ENEMY LIST
          </div>
          <Link href="/enemies" className="manage-link">MANAGE →</Link>
        </div>

        {enemies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px solid #2a2018', color: '#6a5a44', fontStyle: 'italic' }}>
            No enemies tracked yet.{' '}
            <Link href="/enemies" className="auth-link">Add one</Link>
          </div>
        ) : (
          <EnemyTable enemies={enemies} showXP />
        )}
      </section>
    </div>
  )
}
