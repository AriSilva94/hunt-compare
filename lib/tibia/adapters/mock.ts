/**
 * Mock adapters – used for local dev without hitting tibia.com.
 * Switch by setting NEXT_PUBLIC_USE_MOCK_TIBIA=true in .env.local
 */
import type {
  WorldOnlineAdapter,
  HighscoresAdapter,
  CharacterDetailsAdapter,
  OnlinePlayer,
  HighscoreEntry,
  CharacterDetails,
} from './types'

const VOCATIONS = [
  'Elite Knight',
  'Royal Paladin',
  'Master Sorcerer',
  'Elder Druid',
]

function randomVocation() {
  return VOCATIONS[Math.floor(Math.random() * VOCATIONS.length)]
}

const MOCK_NAMES = [
  'Ruthless Yvain',
  'Knightrix',
  'Paladorex',
  'Sorcero Max',
  'Dru Elder',
  'Calmera King',
  'Dark Hunter',
  'Night Stalker',
  'Iron Will',
  'Shadow Blade',
]

export class MockWorldOnlineAdapter implements WorldOnlineAdapter {
  async fetchOnlinePlayers(_world: string): Promise<OnlinePlayer[]> {
    return MOCK_NAMES.slice(0, 5).map((name, i) => ({
      name,
      level: 400 - i * 20,
      vocation: randomVocation(),
    }))
  }
}

export class MockHighscoresAdapter implements HighscoresAdapter {
  async fetchHighscores(_world: string, pages = 1): Promise<HighscoreEntry[]> {
    const count = Math.min(pages * 50, MOCK_NAMES.length)
    return Array.from({ length: count }, (_, i) => ({
      rank: i + 1,
      name: MOCK_NAMES[i % MOCK_NAMES.length] + (i >= MOCK_NAMES.length ? ` ${Math.floor(i / MOCK_NAMES.length)}` : ''),
      vocation: randomVocation(),
      level: 500 - i * 3,
      experience: 1_000_000_000 - i * 5_000_000,
    }))
  }
}

export class MockCharacterDetailsAdapter implements CharacterDetailsAdapter {
  async fetchCharacterDetails(name: string): Promise<CharacterDetails | null> {
    return {
      name,
      vocation: randomVocation(),
      level: 450,
      world: 'Calmera',
      lastLogin: new Date(Date.now() - 3600 * 1000),
      deaths: [
        {
          diedAt: new Date(Date.now() - 86400 * 1000),
          level: 449,
          reason: 'Killed at Level 449 by a demon.',
        },
      ],
    }
  }
}
