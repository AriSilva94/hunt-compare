import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateOnly } from "@/utils/date";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface StatisticCard {
  title: string;
  icon: string;
  bgColor: string;
  textColor: string;
  getValue: (records: Record[]) => string | number;
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
    title: "Registros Públicos",
    icon: "🌐",
    bgColor: "bg-green-50",
    textColor: "text-green-600 dark:text-green-400",
    getValue: (records) => records.filter((r) => r.is_public).length,
  },
  {
    title: "Registros Privados",
    icon: "🔒",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600 dark:text-purple-400",
    getValue: (records) => records.filter((r) => !r.is_public).length,
  },
  {
    title: "Último Registro",
    icon: "📅",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600 dark:text-amber-400",
    getValue: (records) =>
      records.length > 0 ? formatDateOnly(records[0].created_at) : "Nenhum",
  },
];

interface StatisticsCardsProps {
  records: Record[];
  loading: boolean;
}

export function StatisticsCards({ records, loading }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statisticCards.map((stat) => (
        <Card key={stat.title} className={`${stat.bgColor} p-3`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="text-xs truncate">
                {stat.title}
              </Typography>
              <Typography
                variant={"p"}
                className={`${stat.textColor} font-semibold truncate`}
              >
                {loading ? "..." : stat.getValue(records)}
              </Typography>
            </div>
            <span className="mt-4 text-xl ml-2 flex-shrink-0">{stat.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
