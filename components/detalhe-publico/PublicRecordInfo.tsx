import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordInfoProps {
  record: Record;
}

export function PublicRecordInfo({ record }: PublicRecordInfoProps) {
  return (
    <Card>
      <div className="mb-4">
        <Typography variant="h2" className="mb-2">
          Informações
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" className="font-medium">
              ID do Registro:
            </Typography>
            <Typography variant="caption" className="font-mono">
              {record.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" className="font-medium">
              Criado em:
            </Typography>
            <Typography variant="small">
              {new Date(record.created_at).toLocaleString("pt-BR")}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}