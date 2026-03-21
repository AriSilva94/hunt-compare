import type { OnlinePlayer, WorldOnlineAdapter } from '../adapters/types'

const TIBIADATA_BASE = 'https://api.tibiadata.com/v4'

interface TibiaDataWorldResponse {
  world: {
    online_players: { name: string; level: number; vocation: string }[]
  }
}

export class TibiaWorldOnlineScraper implements WorldOnlineAdapter {
  async fetchOnlinePlayers(world: string): Promise<OnlinePlayer[]> {
    const url = `${TIBIADATA_BASE}/world/${encodeURIComponent(world)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'CalmTracker/1.0' } })

    if (!res.ok) throw new Error(`TibiaData world fetch failed: ${res.status}`)

    const json: TibiaDataWorldResponse = await res.json()
    return json.world.online_players.map((p) => ({
      name: p.name,
      level: p.level,
      vocation: p.vocation,
    }))
  }
}
