export interface TibiaCharacterResponse {
  character: TibiaCharacter;
  achievements?: TibiaAchievement[];
  deaths?: TibiaDeath[];
  account_information?: TibiaAccountInformation;
  other_characters?: TibiaOtherCharacter[];
}

export interface TibiaCharacter {
  account_status: string;
  achievement_points: number;
  comment: string;
  deletion_date: string | null;
  former_names: string[];
  former_world: string;
  guild: TibiaGuild | null;
  houses: TibiaHouse[];
  last_login: string | null;
  level: number;
  loyalty_title: string;
  married_to: string | null;
  name: string;
  position: string;
  residence: string;
  sex: string;
  title: string;
  unlocked_titles: string[];
  vocation: string;
  world: string;
}

export interface TibiaGuild {
  name: string;
  rank: string;
}

export interface TibiaHouse {
  houseid: number;
  name: string;
  paid: string;
  size: number;
  status: string;
  town: string;
  world: string;
}

export interface TibiaAchievement {
  grade: number;
  name: string;
  stars: number;
}

export interface TibiaDeath {
  assists: TibiaKiller[];
  killers: TibiaKiller[];
  level: number;
  reason: string;
  timestamp: string;
}

export interface TibiaKiller {
  name: string;
  player: boolean;
  summon: string;
  traded: boolean;
}

export interface TibiaAccountInformation {
  account_status: string;
  created: string;
  loyalty_title: string;
  position: string;
}

export interface TibiaOtherCharacter {
  deleted: boolean;
  main: boolean;
  name: string;
  position: string;
  status: string;
  traded: boolean;
  world: string;
}

export interface TibiaApiResponse {
  character: TibiaCharacterResponse;
  information: {
    api_version: number;
    execution_time: number;
    last_updated: string;
    timestamp: string;
  };
}

export interface TibiaApiError {
  information: {
    api: {
      version: number;
      release: string;
      commit: string;
    };
    timestamp: string;
    tibia_urls: string[];
    status: {
      http_code: number;
      error: number;
      message: string;
    };
  };
}

export interface CharacterValidationResult {
  isValid: boolean;
  character: TibiaCharacter | null;
  error: string | null;
}

export interface SavedCharacter {
  id: string;
  name: string;
  level: number;
  vocation: string;
  world: string;
  sex: string;
  addedAt: string;
  isSelected: boolean;
}

// Tipos para a tabela do Supabase
export interface DatabaseCharacter {
  id: string;
  user_id: string;
  name: string;
  level: number;
  vocation: string | null;
  world: string | null;
  sex: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCharacterDTO {
  name: string;
  level: number;
  vocation: string;
  world: string;
  sex: string;
  avatar_url?: string | null;
  is_active?: boolean;
}

export interface UpdateCharacterDTO {
  name?: string;
  level?: number;
  vocation?: string;
  world?: string;
  sex?: string;
  avatar_url?: string | null;
  is_active?: boolean;
}

export type TibiaVocation =
  | "None"
  | "Druid"
  | "Elder Druid"
  | "Knight"
  | "Elite Knight"
  | "Paladin"
  | "Royal Paladin"
  | "Sorcerer"
  | "Master Sorcerer"
  | "Monk"
  | "Exalted Monk";
