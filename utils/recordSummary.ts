/* eslint-disable @typescript-eslint/no-explicit-any */

interface RecordStat {
  label: string;
  value: string | number;
}

interface RecordSummary {
  type: "game-session" | "generic";
  title: string;
  subtitle: string;
  stats: RecordStat[];
}

export function getRecordSummary(data: any): RecordSummary {
  if (data["Session start"]) {
    return {
      type: "game-session",
      title: data._metadata?.title || `Sessão de ${data["Session start"]}`,
      subtitle: `Duração: ${data["Session length"]} | XP Ganho: ${
        data["XP Gain"] || data["Raw XP Gain"]
      }`,
      stats: [
        {
          label: "Monstros",
          value:
            data["Killed Monsters"]?.reduce(
              (sum: number, m: any) => sum + m.Count,
              0
            ) || 0,
        },
        { label: "Loot", value: data["Loot"] },
        { label: "Balance", value: data["Balance"] },
      ],
    };
  }

  return {
    type: "generic",
    title: data._metadata?.title || "Registro JSON",
    subtitle:
      data._metadata?.description ||
      `${Object.keys(data).length} propriedades`,
    stats: [],
  };
}