/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface StatisticCard {
  title: string;
  icon: string;
  bgColor: string;
  textColor: string;
  getValue: (records: Record[]) => number;
}

const statisticCards: StatisticCard[] = [
  {
    title: "Total de Registros",
    icon: "📊",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600 dark:text-blue-400",
    getValue: (records) => records.length,
  },
  {
    title: "Sessões de Jogo",
    icon: "🎮",
    bgColor: "bg-green-50",
    textColor: "text-green-600 dark:text-green-400",
    getValue: (records) =>
      records.filter((r) => r.data && (r.data as any)["Session start"]).length,
  },
  {
    title: "Outros Registros",
    icon: "📁",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600 dark:text-purple-400",
    getValue: (records) =>
      records.filter((r) => !(r.data as any)["Session start"]).length,
  },
];

interface PublicStatisticsCardsProps {
  records: Record[];
  loading: boolean;
}

export function PublicStatisticsCards({
  records,
  loading,
}: PublicStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statisticCards.map((stat) => (
        <Card key={stat.title} className={stat.bgColor}>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">{stat.title}</Typography>
              <Typography variant="h3" className={stat.textColor}>
                {loading ? "..." : stat.getValue(records)}
              </Typography>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}