"use client";

import { DashboardHeader } from "@/components/home/DashboardHeader";
import { StatisticsCards } from "@/components/home/StatisticsCards";
import { RecordsHeader } from "@/components/home/RecordsHeader";
import { RecordsList } from "@/components/home/RecordsList";
import { RecordFilter } from "@/components/ui/RecordFilter";
import { useRecords } from "@/hooks/useRecords";
import { useRecordFilters } from "@/hooks/useRecordFilters";

export default function HomePage() {
  const { records, loading, user } = useRecords();
  const { filteredRecords, totalBalance, handleFilterChange } = useRecordFilters(records);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader />
      <StatisticsCards records={records} loading={loading} />
      
      <div>
        <RecordsHeader />
        <RecordFilter
          onFilterChange={handleFilterChange}
          loading={loading}
          totalBalance={totalBalance}
          recordCount={filteredRecords.length}
        />
        <RecordsList
          records={records}
          filteredRecords={filteredRecords}
          loading={loading}
        />
      </div>
    </div>
  );
}
