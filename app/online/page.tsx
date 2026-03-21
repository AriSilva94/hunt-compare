import { getOnlineCharacters } from '@/lib/data/characters'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export const revalidate = 300 // 5 min

export const metadata = { title: 'Online Now – CalmTracker' }

export default async function OnlinePage() {
  const players = await getOnlineCharacters()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Online Now</h1>
        <p className="text-gray-400 text-sm mt-1">
          {players.length} tracked player{players.length !== 1 ? 's' : ''} currently online on Calmera
        </p>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No tracked players online right now.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Vocation</th>
                <th className="px-4 py-3 text-right">Level</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{p.rank ?? '–'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <Link
                        href={`/characters/${encodeURIComponent(p.name)}`}
                        className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                      >
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {p.vocation ?? '–'}
                  </td>
                  <td className="px-4 py-3 text-right text-white">{p.level ?? '–'}</td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell text-xs">
                    {p.last_login
                      ? new Date(p.last_login).toLocaleString()
                      : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
