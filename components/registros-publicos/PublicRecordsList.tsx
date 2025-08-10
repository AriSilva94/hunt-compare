import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { PublicRecordCard } from "./PublicRecordCard";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface PublicRecordsListProps {
  records: Record[];
  filteredRecords: Record[];
  loading: boolean;
}

export function PublicRecordsList({ 
  records, 
  filteredRecords, 
  loading 
}: PublicRecordsListProps) {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <Typography variant="p">Carregando registros...</Typography>
        </div>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <Typography variant="p">
            Ainda não há registros públicos disponíveis.
          </Typography>
          <Typography variant="small" className="text-gray-400 mt-2">
            Seja o primeiro a compartilhar seus dados com a comunidade!
          </Typography>
        </div>
      </Card>
    );
  }

  if (filteredRecords.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <Typography variant="p" className="mb-4">
            Nenhum registro encontrado com os filtros aplicados.
          </Typography>
          <Typography variant="small" className="text-gray-500">
            Tente ajustar os filtros para ver mais resultados.
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredRecords.map((record) => (
        <PublicRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}