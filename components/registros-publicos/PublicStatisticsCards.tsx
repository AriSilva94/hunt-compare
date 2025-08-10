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
    <div className="grid grid-cols-2 gap-3 mb-6">
      {statisticCards.map((stat) => (
        <Card key={stat.title} className={`${stat.bgColor} p-3`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="text-xs truncate">{stat.title}</Typography>
              <Typography variant="h4" className={`${stat.textColor} font-semibold truncate`}>
                {loading ? "..." : stat.getValue(records)}
              </Typography>
            </div>
            <span className="text-xl ml-2 flex-shrink-0">{stat.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}