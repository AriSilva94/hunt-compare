/* eslint-disable @typescript-eslint/no-explicit-any */

// Estrutura para um monstro morto
export interface KilledMonster {
  [monsterName: string]: number;
}

// Estrutura para um item lootado
export interface LootedItem {
  [itemName: string]: number;
}

// Estrutura completa de dados de sessão
export interface SessionData {
  // Dados obrigatórios da sessão
  "Session start"?: string;
  "Session end"?: string;
  "Session length"?: string;
  "Session data"?: string;

  // Dados obrigatórios de hunt
  "Killed Monsters": KilledMonster[];
  
  // Dados opcionais comuns
  "Looted Items"?: LootedItem[];
  "Experience"?: string;
  "Experience/h"?: string;
  "Experience Gained"?: string;
  "Raw Experience"?: string;
  "Raw Experience/h"?: string;
  "Experience Bonus"?: string;
  "Healing"?: string;
  "Mana"?: string;
  "Loot"?: string;
  "Supplies"?: string;
  "Balance"?: string;
  "Damage Dealt"?: string;
  "Damage Received"?: string;
  "Healing Done"?: string;
  "Mana Used"?: string;

  // Dados de arma (quando aplicável)
  weaponDetail?: {
    id: string;
    name: string;
    attack: number;
    defense: number;
    defenseModifier: number;
    attackModifier: number;
    hands: number;
    type: string;
    level: number;
    proficiencies?: { [level: number]: number | null };
  };

  // Permitir outros campos dinâmicos
  [key: string]: any;
}

// Tipos para validação
export type SessionFormat = "json" | "text" | "invalid";

// Função para verificar se os dados são uma sessão válida
export function isValidSessionData(data: any): data is SessionData {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Deve ter pelo menos uma referência de sessão
  const hasSessionInfo = !!(
    data["Session start"] || 
    data["Session end"] || 
    data["Session length"] || 
    data["Session data"]
  );

  // Deve ter dados de monstros mortos
  const hasKilledMonsters = !!(
    data["Killed Monsters"] && 
    Array.isArray(data["Killed Monsters"])
  );

  return hasSessionInfo && hasKilledMonsters;
}

// Função para validar dados de texto de sessão
export function isValidSessionText(text: string): boolean {
  const trimmed = text.trim();
  
  // Deve conter indicadores de sessão
  const hasSessionMarkers = (
    trimmed.includes("Session data:") || 
    trimmed.includes("Session:") ||
    trimmed.includes("Session start") ||
    trimmed.includes("Session end")
  );

  // Deve conter dados de monstros
  const hasMonsterData = (
    trimmed.includes("Killed Monsters:") ||
    trimmed.includes("Killed monsters:")
  );

  return hasSessionMarkers && hasMonsterData;
}