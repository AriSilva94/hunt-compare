import { getRecentDeaths } from '@/lib/data/characters'
import type { DeathWithCharacter } from '@/types/database'
import Link from 'next/link'

export const revalidate = 600

export const metadata = { title: 'Recent Deaths – CalmTracker' }

export default async function DeathsPage() {
  const deaths = await getRecentDeaths(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recent Deaths</h1>
        <p className="text-gray-400 text-sm mt-1">Latest death records for tracked Calmera players</p>
      </div>

      {deaths.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No death records yet.</div>
      ) : (
        <div className="space-y-2">
          {(deaths as DeathWithCharacter[]).map((d) => (
            <div
              key={d.id}
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-red-500 text-lg">☠</span>
                <div>
                  <Link
                    href={`/characters/${encodeURIComponent(d.characters?.name ?? '')}`}
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    {d.characters?.name ?? 'Unknown'}
                  </Link>
                  {d.level && (
                    <span className="text-gray-500 text-xs ml-2">at level {d.level}</span>
                  )}
                </div>
              </div>
              <div className="text-gray-400 text-sm flex-1">
                {d.reason ?? 'Unknown cause'}
              </div>
              <div className="text-gray-600 text-xs whitespace-nowrap">
                {new Date(d.died_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
