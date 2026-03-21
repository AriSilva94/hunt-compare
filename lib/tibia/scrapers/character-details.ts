import type {
  CharacterDetails,
  CharacterDeath,
  CharacterDetailsAdapter,
} from '../adapters/types'

const TIBIADATA_BASE = 'https://api.tibiadata.com/v4'

interface TibiaDataCharacterResponse {
  character: {
    character: {
      name: string
      vocation: string
      level: number
      world: string
      last_login: string // ISO 8601
    }
    deaths?: {
      time: string   // ISO 8601
      level: number
      reason: string // "Died at Level X by Y."
    }[]
  }
}

export class TibiaCharacterDetailsScraper implements CharacterDetailsAdapter {
  async fetchCharacterDetails(name: string): Promise<CharacterDetails | null> {
    const url = `${TIBIADATA_BASE}/character/${encodeURIComponent(name)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'CalmTracker/1.0' } })

    if (!res.ok) return null

    const json: TibiaDataCharacterResponse = await res.json()
    const { character, deaths } = json.character

    if (!character.name) return null

    return {
      name: character.name,
      vocation: character.vocation,
      level: character.level,
      world: character.world,
      lastLogin: character.last_login ? new Date(character.last_login) : null,
      deaths: mapDeaths(deaths ?? []),
    }
  }
}

function mapDeaths(
  raw: TibiaDataCharacterResponse['character']['deaths']
): CharacterDeath[] {
  return (raw ?? []).map((d) => ({
    diedAt: new Date(d.time),
    level: d.level,
    reason: d.reason,
  }))
}
