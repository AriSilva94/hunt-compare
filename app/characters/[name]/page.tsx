import { notFound } from 'next/navigation'
import {
  getCharacterByName,
  getCharacterSnapshots,
  getCharacterDeaths,
} from '@/lib/data/characters'
import { Badge } from '@/components/ui/Badge'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  return { title: `${decodeURIComponent(name)} – CalmTracker` }
}

export default async function CharacterPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  const character = await getCharacterByName(decodedName)
  if (!character) notFound()

  const [snapshots, deaths] = await Promise.all([
    getCharacterSnapshots(character.id, 30),
    getCharacterDeaths(character.id, 10),
  ])

  const todayXp = snapshots[0]?.xp_gained ?? null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{character.name}</h1>
              <Badge variant={character.is_online ? 'online' : 'offline'}>
                {character.is_online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">
              {character.vocation ?? 'Unknown'} · Calmera
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{character.level ?? '–'}</div>
              <div className="text-xs text-gray-500 mt-0.5">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {character.rank ? `#${character.rank}` : '–'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Rank</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${todayXp != null ? 'text-green-400' : 'text-gray-600'}`}>
                {todayXp != null ? `+${todayXp.toLocaleString()}` : '–'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Today XP</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500">Total XP: </span>
            <span className="text-white">
              {character.experience?.toLocaleString() ?? '–'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Login: </span>
            <span className="text-white">
              {character.last_login
                ? new Date(character.last_login).toLocaleString()
                : '–'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* XP History */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">XP History (30 days)</h2>
          {snapshots.length === 0 ? (
            <p className="text-gray-500 text-sm">No snapshot data yet.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {snapshots.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center text-sm py-1.5 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-400">{s.snapshot_date}</span>
                  <div className="flex gap-4">
                    <span className="text-gray-500">Rank #{s.rank ?? '–'}</span>
                    <span className={s.xp_gained != null && s.xp_gained > 0 ? 'text-green-400' : 'text-gray-600'}>
                      {s.xp_gained != null ? `+${s.xp_gained.toLocaleString()}` : '–'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Deaths */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Recent Deaths</h2>
          {deaths.length === 0 ? (
            <p className="text-gray-500 text-sm">No death records.</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {deaths.map((d) => (
                <div key={d.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">☠</span>
                    <span className="text-gray-300">
                      Level {d.level ?? '?'}
                    </span>
                    <span className="text-gray-600 text-xs ml-auto">
                      {new Date(d.died_at).toLocaleDateString()}
                    </span>
                  </div>
                  {d.reason && (
                    <p className="text-gray-500 text-xs mt-0.5 pl-5">{d.reason}</p>
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
