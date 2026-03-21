export const TIBIADATA_BASE = 'https://api.tibiadata.com/v4'

export interface TibiaOnlinePlayer {
  name: string
  level: number
  vocation: string
}

export interface TibiaHighscoreEntry {
  rank: number
  name: string
  vocation: string
  world: string
  level: number
  value: number // experience
}

export interface TibiaHighscorePage {
  current_page: number
  total_pages: number
  total_records: number
}

export interface TibiaDeath {
  time: string
  level: number
  reason: string
}

export interface TibiaCharacter {
  name: string
  vocation: string
  level: number
  world: string
  last_login: string
}

export async function fetchWorldOnlinePlayers(world: string): Promise<TibiaOnlinePlayer[]> {
  const res = await fetch(`${TIBIADATA_BASE}/world/${encodeURIComponent(world)}`, {
    headers: { 'User-Agent': 'CalmTracker/1.0' },
  })
  if (!res.ok) throw new Error(`TibiaData world fetch failed: ${res.status}`)
  const json = await res.json()
  return json.world.online_players as TibiaOnlinePlayer[]
}

export async function fetchHighscorePage(
  world: string,
  page: number
): Promise<{ entries: TibiaHighscoreEntry[]; totalPages: number } | null> {
  const url = `${TIBIADATA_BASE}/highscores/${encodeURIComponent(world)}/experience/all/${page}`
  const res = await fetch(url, { headers: { 'User-Agent': 'CalmTracker/1.0' } })

  if (!res.ok) {
    console.error(`TibiaData highscores page ${page} failed: ${res.status}`)
    return null
  }

  const json = await res.json()
  const { highscore_list, highscore_page } = json.highscores as {
    highscore_list: TibiaHighscoreEntry[]
    highscore_page: TibiaHighscorePage
  }

  if (highscore_list.length === 0) return null

  return { entries: highscore_list, totalPages: highscore_page.total_pages }
}

export async function fetchCharacter(
  name: string
): Promise<{ character: TibiaCharacter; deaths: TibiaDeath[] } | null> {
  const res = await fetch(
    `${TIBIADATA_BASE}/character/${encodeURIComponent(name)}`,
    { headers: { 'User-Agent': 'CalmTracker/1.0' } }
  )

  if (!res.ok) return null

  const json = await res.json()
  const { character, deaths } = json.character as {
    character: TibiaCharacter
    deaths?: TibiaDeath[]
  }

  if (!character?.name) return null

  return { character, deaths: deaths ?? [] }
}
