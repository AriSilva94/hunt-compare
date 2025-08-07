import { Typography } from "@/components/ui/Typography";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordHeaderProps {
  record: Record;
}

export function PublicRecordHeader({ record }: PublicRecordHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = record.data as any;
  
  return (
    <div className="mb-8">
      <Typography variant="h1">Registro Público</Typography>
      <Typography variant="lead" className="mt-2">
        {data?._metadata?.title || `Registro #${record.id.slice(0, 8)}`}
      </Typography>
      {data?._metadata?.description && (
        <Typography variant="p" className="mt-1">
          {data._metadata.description}
        </Typography>
      )}
    </div>
  );
}