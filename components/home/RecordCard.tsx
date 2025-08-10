import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateTime } from "@/utils/date";
import { getRecordSummary } from "@/utils/recordSummary";
import Link from "next/link";
import type { Database } from "@/types/database.types";
import type { TibiaCharacter } from "@/types/character.types";

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
    if (vocation.toLowerCase().includes('druid')) return '🍃'
    if (vocation.toLowerCase().includes('knight')) return '⚔️'
    if (vocation.toLowerCase().includes('paladin')) return '🏹'
    if (vocation.toLowerCase().includes('sorcerer')) return '🔥'
    if (vocation.toLowerCase().includes('monk')) return '🥋'
    return '👤'
  }

  const getVocationColor = (vocation: string): string => {
    if (vocation.toLowerCase().includes('druid')) return 'bg-green-500'
    if (vocation.toLowerCase().includes('knight')) return 'bg-red-500'
    if (vocation.toLowerCase().includes('paladin')) return 'bg-yellow-500'
    if (vocation.toLowerCase().includes('sorcerer')) return 'bg-blue-500'
    if (vocation.toLowerCase().includes('monk')) return 'bg-orange-500'
    return 'bg-gray-500'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Avatar compacto do personagem */}
          {record.character ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full ${getVocationColor(record.character.vocation)} flex items-center justify-center shadow-sm`}>
                <span className="text-sm text-white" role="img" aria-label={record.character.vocation}>
                  {getVocationIcon(record.character.vocation)}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-gray-600 dark:text-gray-400">❓</span>
            </div>
          )}
          
          <Typography variant="h4" className="line-clamp-1 flex-1 min-w-0">
            {summary.title}
          </Typography>
        </div>
        
        <span
          className={`px-2 py-1 text-xs rounded flex-shrink-0 ml-2 ${
            record.is_public
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {record.is_public ? "Público" : "Privado"}
        </span>
      </div>
      
      {/* Informação compacta do personagem - sempre presente para layout consistente */}
      <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {record.character ? (
            <>
              <span>👤 {record.character.name}</span>
              <div className="flex items-center gap-2">
                <span>{record.character.vocation}</span>
                <span>•</span>
                <span>Lv. {record.character.level}</span>
                <span>•</span>
                <span>{record.character.world}</span>
              </div>
            </>
          ) : (
            <>
              <span>👤 Personagem não informado</span>
              <div className="flex items-center gap-2">
                <span>—</span>
              </div>
            </>
          )}
        </div>
      </div>

      <Typography variant="small" className="mb-3">
        {summary.subtitle}
      </Typography>

      {summary.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {summary.stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <Typography variant="caption">{stat.label}</Typography>
              <Typography variant="p" className="font-bold">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </Typography>
            </div>
          ))}
        </div>
      )}

      <Typography variant="small" className="text-gray-500 mb-3">
        Criado em: {formatDateTime(record.created_at)}
      </Typography>

      <div className="flex gap-2">
        <Link
          href={`/detalhe/${record.id}`}
          className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Ver Detalhes
        </Link>

        {record.is_public && (
          <Link
            href={`/detalhe-publico/${record.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Link Público
          </Link>
        )}
      </div>
    </Card>
  );
}
