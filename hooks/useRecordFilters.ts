/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FilterState } from "@/components/ui/RecordFilter";
import { isDateBetween } from "@/utils/date";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

export function useRecordFilters(records: Record[]) {
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  useEffect(() => {
    const total = filteredRecords.reduce((sum, record) => {
      const data = record.data as any;
      const balance =
        parseFloat(String(data.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
      return sum + balance;
    }, 0);
    setTotalBalance(total);
  }, [filteredRecords]);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...records];

    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter((record) =>
        isDateBetween(record.created_at, filters.dateFrom!, filters.dateTo!)
      );
    } else if (filters.dateFrom) {
      filtered = filtered.filter(
        (record) => new Date(record.created_at) >= filters.dateFrom!
      );
    } else if (filters.dateTo) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.created_at);
        const filterDate = new Date(filters.dateTo!);
        filterDate.setHours(23, 59, 59, 999);
        return recordDate <= filterDate;
      });
    }

    // Filtro por personagem
    if (filters.characterId) {
      filtered = filtered.filter((record) => 
        record.character_id === filters.characterId
      );
    }

    filtered.sort((a, b) => {
      const aData = a.data as any;
      const bData = b.data as any;

      switch (filters.sortBy) {
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "profit-desc": {
          const aBalance =
            parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          const bBalance =
            parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          return bBalance - aBalance;
        }
        case "profit-asc": {
          const aBalance =
            parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          const bBalance =
            parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          return aBalance - bBalance;
        }
        case "xp-desc": {
          const aXp =
            parseFloat(
              String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          const bXp =
            parseFloat(
              String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          return bXp - aXp;
        }
        case "xp-asc": {
          const aXp =
            parseFloat(
              String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          const bXp =
            parseFloat(
              String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          return aXp - bXp;
        }
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  };

  return {
    filteredRecords,
    totalBalance,
    handleFilterChange,
  };
}