import { Typography } from "@/components/ui/Typography";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordHeaderProps {
  record: Record;
}

export function PublicRecordHeader({ record }: PublicRecordHeaderProps) {
  return (
    <div className="mb-8">
      <Typography variant="h1">Registro Público</Typography>
      <Typography variant="lead" className="mt-2">
        {record.data._metadata?.title || `Registro #${record.id.slice(0, 8)}`}
      </Typography>
      {record.data._metadata?.description && (
        <Typography variant="p" className="mt-1">
          {record.data._metadata.description}
        </Typography>
      )}
    </div>
  );
}