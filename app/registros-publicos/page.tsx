"use client";

import { PublicRecordsHeader } from "@/components/registros-publicos/PublicRecordsHeader";
import { PublicStatisticsCards } from "@/components/registros-publicos/PublicStatisticsCards";
import { PublicRecordsList } from "@/components/registros-publicos/PublicRecordsList";
import { PublicRecordsInfo } from "@/components/registros-publicos/PublicRecordsInfo";
import { RecordFilter } from "@/components/ui/RecordFilter";
import { usePublicRecords } from "@/hooks/usePublicRecords";
import { useRecordFilters } from "@/hooks/useRecordFilters";

export default function RegistrosPublicosPage() {
  const { records, loading } = usePublicRecords();
  const { filteredRecords, totalBalance, handleFilterChange } = useRecordFilters(records);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PublicRecordsHeader />
      <PublicStatisticsCards records={records} loading={loading} />
      
      <RecordFilter
        onFilterChange={handleFilterChange}
        loading={loading}
        totalBalance={totalBalance}
        recordCount={filteredRecords.length}
        isPublic={true}
      />

      <PublicRecordsList
        records={records}
        filteredRecords={filteredRecords}
        loading={loading}
      />

      <PublicRecordsInfo />
    </div>
  );
}
