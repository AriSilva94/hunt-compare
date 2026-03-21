'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { Character } from '@/types/database'

interface Row extends Character {
  xp_gained?: number | null
}

interface Props {
  characters: Row[]
}

export default function CharacterTable({ characters }: Props) {
  const [search, setSearch] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rank' | 'xp_gained'>('rank')

  const filtered = useMemo(() => {
    let list = characters

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }

    if (onlineOnly) {
      list = list.filter((c) => c.is_online)
    }

    if (sortBy === 'xp_gained') {
      list = [...list].sort((a, b) => (b.xp_gained ?? 0) - (a.xp_gained ?? 0))
    }

    return list
  }, [characters, search, onlineOnly, sortBy])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 w-60"
        />
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlineOnly}
            onChange={(e) => setOnlineOnly(e.target.checked)}
            className="accent-amber-500"
          />
          Online only
        </label>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setSortBy('rank')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              sortBy === 'rank'
                ? 'bg-amber-500 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            By Rank
          </button>
          <button
            onClick={() => setSortBy('xp_gained')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              sortBy === 'xp_gained'
                ? 'bg-amber-500 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            By Daily XP
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left w-12">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Vocation</th>
              <th className="px-4 py-3 text-right">Level</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Daily XP</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No characters found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-800/60 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500">{c.rank ?? '–'}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/characters/${encodeURIComponent(c.name)}`}
                      className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {c.vocation ?? '–'}
                  </td>
                  <td className="px-4 py-3 text-right text-white">{c.level ?? '–'}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {c.xp_gained != null ? (
                      <span className="text-green-400">
                        +{c.xp_gained.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-600">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={c.is_online ? 'online' : 'offline'}>
                      {c.is_online ? 'Online' : 'Offline'}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 text-right">
        {filtered.length} of {characters.length} players
      </p>
    </div>
  )
}
