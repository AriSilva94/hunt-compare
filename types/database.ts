export type JobStatus = 'running' | 'success' | 'failed'
export type Vocation =
  | 'Knight'
  | 'Paladin'
  | 'Sorcerer'
  | 'Druid'
  | 'Elite Knight'
  | 'Royal Paladin'
  | 'Master Sorcerer'
  | 'Elder Druid'
  | 'None'

export interface World {
  id: number
  name: string
  is_active: boolean
  created_at: string
}

export interface Character {
  id: number
  world_id: number
  name: string
  vocation: Vocation | null
  level: number | null
  experience: number | null
  rank: number | null
  is_online: boolean
  last_login: string | null
  last_seen_at: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface DailySnapshot {
  id: number
  character_id: number
  snapshot_date: string
  experience: number
  level: number | null
  rank: number | null
  xp_gained: number | null
  created_at: string
}

export interface OnlineSession {
  id: number
  character_id: number
  seen_at: string
}

export interface Death {
  id: number
  character_id: number
  died_at: string
  level: number | null
  reason: string | null
  created_at: string
}

export interface JobRun {
  id: number
  job_name: string
  status: JobStatus
  started_at: string
  finished_at: string | null
  rows_affected: number | null
  error_msg: string | null
  metadata: Record<string, unknown> | null
}

export interface UserEnemyList {
  id: number
  user_id: string
  character_id: number
  note: string | null
  created_at: string
}

export interface UserHuntedList {
  id: number
  user_id: string
  character_id: number
  note: string | null
  created_at: string
}

// ---- Joined types for Supabase query results ----

export interface CharacterSummary {
  id: number
  name: string
  slug: string
  rank: number | null
  level: number | null
  vocation: Vocation | null
  is_online: boolean
  last_login: string | null
}

export interface SnapshotSummary {
  xp_gained: number | null
  snapshot_date: string
}

export interface DeathWithCharacter extends Death {
  characters: Pick<Character, 'name' | 'slug' | 'rank' | 'vocation'> | null
}

export interface HuntedWithCharacter {
  id: number
  character_id: number
  note: string | null
  created_at: string
  characters: (CharacterSummary & {
    daily_snapshots: SnapshotSummary[]
    deaths: Pick<Death, 'died_at' | 'level' | 'reason'>[]
  }) | null
}

export interface EnemyWithCharacter {
  id: number
  user_id: string
  character_id: number
  note: string | null
  created_at: string
  characters: (CharacterSummary & {
    daily_snapshots: SnapshotSummary[]
  }) | null
}
