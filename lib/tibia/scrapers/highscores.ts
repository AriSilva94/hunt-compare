import type { HighscoreEntry, HighscoresAdapter } from '../adapters/types'

const TIBIADATA_BASE = 'https://api.tibiadata.com/v4'

// TibiaData returns 50 entries per page, up to 1000 total (20 pages)
const PAGE_DELAY_MS = 800

interface TibiaDataHighscoresResponse {
  highscores: {
    highscore_list: {
      rank: number
      name: string
      vocation: string
      world: string
      level: number
      value: number // experience points
    }[]
    highscore_page: {
      current_page: number
      total_pages: number
      total_records: number
    }
  }
}

export class TibiaHighscoresScraper implements HighscoresAdapter {
  async fetchHighscores(world: string, pages?: number): Promise<HighscoreEntry[]> {
    const results: HighscoreEntry[] = []
    let page = 1

    while (true) {
      const data = await this.fetchPage(world, page)
      if (data === null) return results

      results.push(...data.entries)

      const isLastPage = page >= data.totalPages || (pages !== undefined && page >= pages)
      if (isLastPage) return results

      page++
      await sleep(PAGE_DELAY_MS)
    }
  }

  private async fetchPage(
    world: string,
    page: number
  ): Promise<{ entries: HighscoreEntry[]; totalPages: number } | null> {
    const url = `${TIBIADATA_BASE}/highscores/${encodeURIComponent(world)}/experience/all/${page}`
    const res = await fetch(url, { headers: { 'User-Agent': 'CalmTracker/1.0' } })

    if (!res.ok) {
      console.error(`TibiaData highscores page ${page} failed: ${res.status}`)
      return null
    }

    const json: TibiaDataHighscoresResponse = await res.json()
    const { highscore_list, highscore_page } = json.highscores

    if (highscore_list.length === 0) return null

    return {
      entries: highscore_list.map((e) => ({
        rank: e.rank,
        name: e.name,
        vocation: e.vocation,
        level: e.level,
        experience: e.value,
      })),
      totalPages: highscore_page.total_pages,
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
