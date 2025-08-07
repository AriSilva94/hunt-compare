/* eslint-disable @typescript-eslint/no-explicit-any */

interface RecordHighlight {
  label: string;
  value: string;
  icon: string;
}

interface RecordPreview {
  type: "game-session" | "generic";
  title: string;
  description: string;
  highlights: RecordHighlight[];
}

export function getPublicRecordPreview(data: any): RecordPreview {
  if (data["Session start"] && data["Killed Monsters"]) {
    const totalMonsters =
      data["Killed Monsters"]?.reduce(
        (sum: number, m: any) => sum + m.Count,
        0
      ) || 0;
    const totalItems =
      data["Looted Items"]?.reduce(
        (sum: number, item: any) => sum + item.Count,
        0
      ) || 0;

    return {
      type: "game-session",
      title: data._metadata?.title || `Sessão de ${data["Session start"]}`,
      description:
        data._metadata?.description || `${data["Session length"]} de jogo`,
      highlights: [
        {
          label: "XP Ganho",
          value: data["XP Gain"] || data["Raw XP Gain"],
          icon: "⭐",
        },
        {
          label: "Monstros",
          value: totalMonsters.toLocaleString(),
          icon: "👾",
        },
        { 
          label: "Itens", 
          value: totalItems.toLocaleString(), 
          icon: "💎" 
        },
        { 
          label: "Lucro", 
          value: data["Balance"], 
          icon: "💰" 
        },
      ],
    };
  }

  return {
    type: "generic",
    title: data._metadata?.title || "Registro de Dados",
    description:
      data._metadata?.description || `${Object.keys(data).length} propriedades`,
    highlights: [],
  };
}