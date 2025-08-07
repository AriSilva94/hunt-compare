import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateOnly } from "@/utils/date";
import { getPublicRecordPreview } from "@/utils/publicRecordPreview";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordCardProps {
  record: Record;
}

export function PublicRecordCard({ record }: PublicRecordCardProps) {
  const preview = getPublicRecordPreview(record.data);

  return (
    <Link href={`/detalhe-publico/${record.id}`} className="block">
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <Typography variant="h4" className="line-clamp-1 flex-1">
              {preview.title}
            </Typography>
            {preview.type === "game-session" && (
              <span className="ml-2 text-2xl">🎮</span>
            )}
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
