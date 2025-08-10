import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateOnly } from "@/utils/date";
import { getPublicRecordPreview } from "@/utils/publicRecordPreview";
import Link from "next/link";
import type { Database } from "@/types/database.types";
import type { TibiaCharacter } from "@/types/character.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface RecordData {
  character?: TibiaCharacter;
}

interface PublicRecordCardProps {
  record: Record;
}

export function PublicRecordCard({ record }: PublicRecordCardProps) {
  const recordData = record.data as RecordData;
  const preview = getPublicRecordPreview(record.data);

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
    <Link href={`/detalhe-publico/${record.id}`} className="block">
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Avatar compacto do personagem */}
              {recordData.character ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${getVocationColor(recordData.character.vocation)} flex items-center justify-center shadow-sm`}>
                    <span className="text-sm text-white" role="img" aria-label={recordData.character.vocation}>
                      {getVocationIcon(recordData.character.vocation)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-600 dark:text-gray-400">❓</span>
                </div>
              )}
              
              <Typography variant="h4" className="line-clamp-1 flex-1 min-w-0">
                {preview.title}
              </Typography>
            </div>
            
            {preview.type === "game-session" && (
              <span className="ml-2 text-2xl flex-shrink-0">🎮</span>
            )}
          </div>
          
          {/* Informação compacta do personagem - sempre presente para layout consistente */}
          <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              {recordData.character ? (
                <>
                  <span>👤 {recordData.character.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{recordData.character.vocation}</span>
                    <span>•</span>
                    <span>Lv. {recordData.character.level}</span>
                    <span>•</span>
                    <span>{recordData.character.world}</span>
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
          
          <Typography variant="small" className="line-clamp-2">
            {preview.description}
          </Typography>
        </div>

        {preview.highlights.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {preview.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center"
              >
                <span className="text-lg mr-1">{highlight.icon}</span>
                <Typography variant="caption">
                  {highlight.label}
                </Typography>{" "}
                <Typography variant="p" className="font-bold">
                  {highlight.value}
                </Typography>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <Typography variant="small" className="text-gray-500">
            {formatDateOnly(record.created_at)}
          </Typography>
          <Typography
            variant="small"
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            Ver detalhes →
          </Typography>
        </div>
      </Card>
    </Link>
  );
}
