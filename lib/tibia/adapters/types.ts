// ============================================================
// Tibia Source Adapter Interfaces
// ============================================================

export interface OnlinePlayer {
  name: string
  level: number
  vocation: string
}

export interface HighscoreEntry {
  rank: number
  name: string
  vocation: string
  level: number
  experience: number
}

export interface CharacterDeath {
  diedAt: Date
  level: number
  reason: string
}

export interface CharacterDetails {
  name: string
  vocation: string
  level: number
  world: string
  lastLogin: Date | null
  deaths: CharacterDeath[]
}

// ---- Adapter interfaces ----

export interface WorldOnlineAdapter {
  fetchOnlinePlayers(world: string): Promise<OnlinePlayer[]>
}

export interface HighscoresAdapter {
  fetchHighscores(world: string, pages?: number): Promise<HighscoreEntry[]>
}

export interface CharacterDetailsAdapter {
  fetchCharacterDetails(name: string): Promise<CharacterDetails | null>
}
