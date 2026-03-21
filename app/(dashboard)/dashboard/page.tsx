import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserEnemies } from '@/lib/data/enemies'
import type { EnemyWithCharacter } from '@/types/database'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

export const metadata = { title: 'Dashboard – CalmTracker' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const enemies = (await getUserEnemies(user.id)) as EnemyWithCharacter[]
  const online = enemies.filter((e) => e.characters?.is_online)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Enemies tracked</div>
          <div className="text-3xl font-bold text-white">{enemies.length}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Enemies online</div>
          <div className="text-3xl font-bold text-green-400">{online.length}</div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Enemy List</h2>
          <Link
            href="/enemies"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Manage →
          </Link>
        </div>

        {enemies.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border border-gray-800 rounded-lg">
            No enemies tracked yet.{' '}
            <Link href="/enemies" className="text-amber-400 hover:underline">
              Add one
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Vocation</th>
                  <th className="px-4 py-3 text-right">Level</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Today XP</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {enemies.map((e) => {
                  const c = e.characters
                  const xp = c?.daily_snapshots?.[0]?.xp_gained ?? null
                  return (
                    <tr key={e.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/characters/${encodeURIComponent(c?.name ?? '')}`}
                          className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                        >
                          {c?.name ?? '–'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                        {c?.vocation ?? '–'}
                      </td>
                      <td className="px-4 py-3 text-right text-white">{c?.level ?? '–'}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        {xp != null ? (
                          <span className="text-green-400">+{xp.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-600">–</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={c?.is_online ? 'online' : 'offline'}>
                          {c?.is_online ? 'Online' : 'Offline'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
