// Paleta de cores para registros - cores distintas e acessíveis
export const RECORD_COLORS = [
  {
    primary: "#3B82F6",     // blue-500
    light: "#DBEAFE",       // blue-100
    dark: "#1D4ED8",        // blue-700
    name: "Azul"
  },
  {
    primary: "#EF4444",     // red-500
    light: "#FEE2E2",       // red-100
    dark: "#DC2626",        // red-600
    name: "Vermelho"
  },
  {
    primary: "#10B981",     // emerald-500
    light: "#D1FAE5",       // emerald-100
    dark: "#059669",        // emerald-600
    name: "Verde"
  },
  {
    primary: "#F59E0B",     // amber-500
    light: "#FEF3C7",       // amber-100
    dark: "#D97706",        // amber-600
    name: "Âmbar"
  },
  {
    primary: "#8B5CF6",     // violet-500
    light: "#EDE9FE",       // violet-100
    dark: "#7C3AED",        // violet-600
    name: "Violeta"
  },
  {
    primary: "#06B6D4",     // cyan-500
    light: "#CFFAFE",       // cyan-100
    dark: "#0891B2",        // cyan-600
    name: "Ciano"
  },
  {
    primary: "#F97316",     // orange-500
    light: "#FED7AA",       // orange-100
    dark: "#EA580C",        // orange-600
    name: "Laranja"
  },
  {
    primary: "#EC4899",     // pink-500
    light: "#FCE7F3",       // pink-100
    dark: "#DB2777",        // pink-600
    name: "Rosa"
  },
  {
    primary: "#84CC16",     // lime-500
    light: "#ECFCCB",       // lime-100
    dark: "#65A30D",        // lime-600
    name: "Lima"
  },
  {
    primary: "#6366F1",     // indigo-500
    light: "#E0E7FF",       // indigo-100
    dark: "#4F46E5",        // indigo-600
    name: "Índigo"
  }
];

// Função para obter a cor de um registro baseado no índice
export function getRecordColor(index: number) {
  return RECORD_COLORS[index % RECORD_COLORS.length];
}

// Função para obter apenas a cor primária
export function getRecordPrimaryColor(index: number): string {
  return getRecordColor(index).primary;
}

// Função para obter a cor clara
export function getRecordLightColor(index: number): string {
  return getRecordColor(index).light;
}

// Função para obter a cor escura
export function getRecordDarkColor(index: number): string {
  return getRecordColor(index).dark;
}

// Função para gerar dados de gráfico com cores por registro
export function generateColoredChartData<T extends { name: string; value: number; recordId: string }>(
  data: T[]
): (T & { fill: string })[] {
  return data.map((item, index) => ({
    ...item,
    fill: getRecordPrimaryColor(index)
  }));
}

// Função para gerar CSS personalizado para cores
export function generateRecordColorCSS(index: number) {
  const colors = getRecordColor(index);
  return {
    '--record-primary': colors.primary,
    '--record-light': colors.light,
    '--record-dark': colors.dark,
  } as React.CSSProperties;
}