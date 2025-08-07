import { RecordCard } from "./RecordCard";
import { LoadingState, EmptyState, NoResultsState } from "./RecordStates";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

interface RecordsListProps {
  records: Record[];
  filteredRecords: Record[];
  loading: boolean;
}

export function RecordsList({ records, filteredRecords, loading }: RecordsListProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (records.length === 0) {
    return <EmptyState />;
  }

  if (filteredRecords.length === 0) {
    return <NoResultsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecords.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}