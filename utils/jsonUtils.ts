/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ParsedJsonData {
  [key: string]: any;
}

export interface ChartDataPoint {
  metric: string;
  [key: string]: any;
}

export const parseJsonData = (jsonString: string): ParsedJsonData | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const extractNumericValue = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    // Remove commas and parse as number
    const cleanValue = value.replace(/,/g, "");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (Array.isArray(value)) {
    // For arrays like "Killed Monsters" or "Looted Items", return count
    return value.length;
  }

  return 0;
};

export const processDataForChart = (datasets: {
  [id: string]: { name: string; data: string };
}): ChartDataPoint[] => {
  const parsedDatasets: { [id: string]: ParsedJsonData } = {};
  const targetMetrics = ["Balance", "Raw XP Gain"];

  // Parse all datasets and collect only target metrics
  Object.entries(datasets).forEach(([id, dataset]) => {
    const parsed = parseJsonData(dataset.data);
    if (parsed) {
      parsedDatasets[id] = parsed;
    }
  });

  // Create chart data for target metrics only
  const chartData: ChartDataPoint[] = [];

  targetMetrics.forEach((metric) => {
    const dataPoint: ChartDataPoint = { metric };

    Object.entries(parsedDatasets).forEach(([id, data]) => {
      if (data[metric] !== undefined) {
        dataPoint[datasets[id].name] = extractNumericValue(data[metric]);
      }
    });

    chartData.push(dataPoint);
  });

  return chartData;
};

export const generateSampleData = (): string => {
  return JSON.stringify(
    {
      Balance: "1,197,903",
      Damage: "5,673,637",
      "Damage/h": "5,673,637",
      Healing: "773,047",
      "Healing/h": "773,047",
      "Killed Monsters": [
        { Count: 126, Name: "betrayed wraith" },
        { Count: 50, Name: "fire elemental" },
        { Count: 50, Name: "ancient scarab" },
      ],
      Loot: "1,391,626",
      "Looted Items": [
        { Count: 53, Name: "a black pearl" },
        { Count: 25, Name: "gold coin" },
        { Count: 15, Name: "platinum coin" },
      ],
      "Raw XP Gain": "3,656,717",
      "Raw XP/h": "2,340,828",
      "Session end": "2025-06-19, 06:07:45",
      "Session length": "01:00h",
      "Session start": "2025-06-19, 05:07:44",
      Supplies: "193,723",
      "XP Gain": "3,656,717",
      "XP/h": "2,340,828",
    },
    null,
    2
  );
};
