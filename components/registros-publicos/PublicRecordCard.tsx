import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateOnly } from "@/utils/date";
import { getPublicRecordPreview } from "@/utils/publicRecordPreview";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordCardProps {
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

export function PublicRecordCard({ record }: PublicRecordCardProps) {
  const preview = getPublicRecordPreview(record.data);

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
    <Link href={`/detalhe-publico/${record.id}`} className="block">
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full p-3">
        <div className="mb-2">
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
                {preview.title}
              </Typography>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {preview.type === "game-session" && (
                <span className="text-lg">🎮</span>
              )}
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

          <Typography variant="small" className="line-clamp-2 text-xs">
            {preview.description}
          </Typography>
        </div>

        {preview.highlights.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            {preview.highlights.slice(0, 4).map((highlight, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded text-center"
              >
                <Typography variant="caption" className="text-xs block">
                  {highlight.icon} {highlight.label}
                </Typography>
                <Typography variant="small" className="font-bold text-xs block">
                  {highlight.value}
                </Typography>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-xs">
          <Typography variant="small" className="text-gray-500 text-xs">
            {formatDateOnly(record.created_at)}
          </Typography>
          <Typography
            variant="small"
            className="text-blue-600 font-medium hover:text-blue-800 text-xs"
          >
            Ver →
          </Typography>
        </div>
      </Card>
    </Link>
  );
}
