import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserEnemies } from '@/lib/data/enemies'
import { searchCharacters } from '@/lib/data/characters'
import type { EnemyWithCharacter } from '@/types/database'
import AddEnemyForm from './AddEnemyForm'
import RemoveEnemyButton from './RemoveEnemyButton'
import { Badge } from '@/components/ui/Badge'
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
  const filteredEnemies =
    filter === 'online' ? enemies.filter((e) => e.characters?.is_online) : enemies

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Enemy List</h1>

      {/* Search to add */}
      <AddEnemyForm userId={user.id} searchResults={searchResults} initialQuery={q} />

      {/* Filter */}
      <div className="flex gap-2">
        <Link
          href="/enemies"
          className={`text-xs px-3 py-1.5 rounded border transition-colors ${
            filter !== 'online'
              ? 'bg-amber-500 text-black border-amber-500'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
          }`}
        >
          All ({enemies.length})
        </Link>
        <Link
          href="/enemies?filter=online"
          className={`text-xs px-3 py-1.5 rounded border transition-colors ${
            filter === 'online'
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
          }`}
        >
          Online ({enemies.filter((e) => e.characters?.is_online).length})
        </Link>
      </div>

      {/* Enemy list */}
      {filteredEnemies.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-lg">
          No enemies {filter === 'online' ? 'online' : 'tracked'} yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Vocation</th>
                <th className="px-4 py-3 text-right">Level</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredEnemies.map((e) => {
                const c = e.characters
                return (
                  <tr key={e.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{c?.rank ?? '–'}</td>
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
                    <td className="px-4 py-3 text-center">
                      <Badge variant={c?.is_online ? 'online' : 'offline'}>
                        {c?.is_online ? 'Online' : 'Offline'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RemoveEnemyButton userId={user.id} characterId={c?.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
