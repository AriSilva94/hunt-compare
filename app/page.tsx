import { Suspense } from 'react'
import Link from 'next/link'
import { getTopCharacters, getOnlineCharacters } from '@/lib/data/characters'
import CharacterTable from '@/components/characters/CharacterTable'
import type { Character } from '@/types/database'

interface CharacterWithSnapshot extends Character {
  daily_snapshots: { xp_gained: number | null; rank: number | null; snapshot_date: string }[]
}

export const revalidate = 900 // 15 min

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
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Calmera World Tracker
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Tracking the top 1000 players on{' '}
          <span className="text-amber-400 font-medium">Calmera</span> —
          daily XP, online status, deaths, and enemy watch.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Tracked Players" value="1,000" />
        <StatCard
          label="Online Now"
          value={onlineCount.toString()}
          highlight={onlineCount > 0}
        />
        <StatCard label="World" value="Calmera" className="hidden sm:flex" />
      </div>

      {/* Quick links */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/online"
          className="bg-green-900 hover:bg-green-800 border border-green-700 text-green-300 text-sm px-4 py-2 rounded transition-colors"
        >
          Online now ({onlineCount})
        </Link>
        <Link
          href="/deaths"
          className="bg-red-900 hover:bg-red-800 border border-red-700 text-red-300 text-sm px-4 py-2 rounded transition-colors"
        >
          Recent deaths
        </Link>
      </div>

      {/* Player table */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">All Tracked Players</h2>
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <CharacterTable characters={tableData} />
        </Suspense>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight = false,
  className = '',
}: {
  label: string
  value: string
  highlight?: boolean
  className?: string
}) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-1 ${className}`}
    >
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span
        className={`text-2xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  )
}
