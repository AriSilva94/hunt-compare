import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatDateTime } from "@/utils/date";
import { getRecordSummary } from "@/utils/recordSummary";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface RecordCardProps {
  record: Record;
}

export function RecordCard({ record }: RecordCardProps) {
  const summary = getRecordSummary(record.data);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <Typography variant="h4" className="line-clamp-1">
          {summary.title}
        </Typography>
        <span
          className={`px-2 py-1 text-xs rounded ${
            record.is_public
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {record.is_public ? "Público" : "Privado"}
        </span>
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
