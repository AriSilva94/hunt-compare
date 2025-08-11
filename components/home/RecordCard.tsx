import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateTime } from "@/utils/date";
import { getRecordSummary } from "@/utils/recordSummary";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface RecordCardProps {
  record: Record & {
    character?: {
      id: string;
      name: string;
      level: number;
      vocation: string;
      world: string;
      sex: string;
    } | null;
  };
}

export function RecordCard({ record }: RecordCardProps) {
  const summary = getRecordSummary(record.data);

  // Helper functions para personagem
  const getVocationIcon = (vocation: string): string => {
    if (vocation.toLowerCase().includes("druid")) return "🍃";
    if (vocation.toLowerCase().includes("knight")) return "⚔️";
    if (vocation.toLowerCase().includes("paladin")) return "🏹";
    if (vocation.toLowerCase().includes("sorcerer")) return "🔥";
    if (vocation.toLowerCase().includes("monk")) return "🥋";
    return "👤";
  };

  const getVocationColor = (vocation: string): string => {
    if (vocation.toLowerCase().includes("druid")) return "bg-green-500";
    if (vocation.toLowerCase().includes("knight")) return "bg-red-500";
    if (vocation.toLowerCase().includes("paladin")) return "bg-yellow-500";
    if (vocation.toLowerCase().includes("sorcerer")) return "bg-blue-500";
    if (vocation.toLowerCase().includes("monk")) return "bg-orange-500";
    return "bg-gray-500";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Avatar compacto do personagem */}
          {record.character ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full ${getVocationColor(
                  record.character.vocation
                )} flex items-center justify-center shadow-sm`}
              >
                <span
                  className="text-xs text-white"
                  role="img"
                  aria-label={record.character.vocation}
                >
                  {getVocationIcon(record.character.vocation)}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                ❓
              </span>
            </div>
          )}

          <Typography
            variant="small"
            className="line-clamp-1 flex-1 min-w-0 font-semibold"
          >
            {summary.title}
          </Typography>
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0 ml-2">
          <span
            className={`px-2 py-1 text-xs rounded ${
              record.is_public
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {record.is_public ? "Público" : "Privado"}
          </span>
          {record.has_bestiary && (
            <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              📖 Bestiário
            </span>
          )}
        </div>
      </div>

      {/* Informação inline do personagem */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {record.character ? (
            <span className="truncate block">
              👤 {record.character.name} • Lv.{record.character.level} •{" "}
              {record.character.world}
            </span>
          ) : (
            <span>👤 Personagem não informado</span>
          )}
        </div>
      </div>

      <Typography variant="small" className="mb-2 text-xs line-clamp-2">
        {summary.subtitle}
      </Typography>

      {summary.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {summary.stats.slice(0, 3).map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-1.5 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <Typography variant="caption" className="text-xs block">
                {stat.label}
              </Typography>
              <Typography variant="small" className="font-bold text-xs block">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </Typography>
            </div>
          ))}
        </div>
      )}

      <Typography variant="small" className="text-gray-500 mb-2 text-xs">
        {formatDateTime(record.created_at)}
      </Typography>

      <div className="flex gap-1">
        <Link
          href={`/detalhe/${record.id}`}
          className="flex-1 text-center bg-blue-600 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
        >
          Detalhes
        </Link>

        {record.is_public && (
          <Link
            href={`/detalhe-publico/${record.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-600 text-white px-2 py-1.5 rounded text-xs hover:bg-green-700 transition-colors"
          >
            Link Público
          </Link>
        )}
      </div>
    </Card>
  );
}
