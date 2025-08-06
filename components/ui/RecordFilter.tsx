"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Typography } from "./Typography";
import { Button } from "./Button";
import { DatePicker } from "./DatePicker";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "profit-desc"
  | "profit-asc"
  | "xp-desc"
  | "xp-asc";

export interface FilterState {
  dateFrom: Date | null;
  dateTo: Date | null;
  sortBy: SortOption;
}

interface RecordFilterProps {
  onFilterChange: (filters: FilterState) => void;
  loading?: boolean;
  totalBalance?: number;
  recordCount?: number;
}

export function RecordFilter({
  onFilterChange,
  loading = false,
  totalBalance = 0,
  recordCount = 0,
}: RecordFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: null,
    dateTo: null,
    sortBy: "date-desc",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      dateFrom: null,
      dateTo: null,
      sortBy: "date-desc",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.dateFrom || filters.dateTo || filters.sortBy !== "date-desc";

  const sortOptions = [
    { value: "date-desc", label: "📅 Data (mais recente)", icon: "📅" },
    { value: "date-asc", label: "📅 Data (mais antigo)", icon: "📅" },
    { value: "profit-desc", label: "💰 Maior Profit", icon: "💰" },
    { value: "profit-asc", label: "💸 Menor Profit", icon: "💸" },
    { value: "xp-desc", label: "⭐ Maior XP", icon: "⭐" },
    { value: "xp-asc", label: "📊 Menor XP", icon: "📊" },
  ];

  return (
    <Card className="mb-6">
      {/* Header compacto sempre visível */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <Typography variant="h4" className="font-semibold">
              Filtros & Ordenação
            </Typography>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Typography variant="small" className="text-blue-600 font-medium">
                Filtros ativos
              </Typography>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={clearFilters}
              disabled={loading}
              size="sm"
              className="text-xs"
            >
              Limpar
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            size="sm"
            className="text-xs"
          >
            {isExpanded ? "Recolher" : "Expandir"}
          </Button>
        </div>
      </div>

      {/* Preview dos filtros ativos quando recolhido */}
      {!isExpanded && hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {filters.dateFrom && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                📅 A partir de {filters.dateFrom.toLocaleDateString("pt-BR")}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                📅 Até {filters.dateTo.toLocaleDateString("pt-BR")}
              </span>
            )}
            {filters.sortBy !== "date-desc" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-6">
          {/* Seção de Filtros por Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📅</span>
              <Typography variant="h4" className="font-medium">
                Filtrar por Período
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                value={filters.dateFrom}
                onChange={(date: Date | null) =>
                  handleFilterChange({ dateFrom: date })
                }
                disabled={loading}
                placeholder="Selecione a data inicial"
              />

              <DatePicker
                value={filters.dateTo}
                onChange={(date: Date | null) =>
                  handleFilterChange({ dateTo: date })
                }
                disabled={loading}
                placeholder="Selecione a data final"
              />
            </div>
          </div>

          {/* Seção de Ordenação */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <Typography variant="h4" className="font-medium">
                Ordenação
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handleFilterChange({ sortBy: option.value as SortOption })
                  }
                  disabled={loading}
                  className={`flex items-center gap-2 p-3 text-left rounded-lg border transition-all duration-200 ${
                    filters.sortBy === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${
                    loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <Typography variant="small" className="flex-1">
                    {option.label.replace(option.icon + " ", "")}
                  </Typography>
                  {filters.sortBy === option.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Somatória do Balance */}
          {recordCount > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <Typography variant="h4" className="font-semibold">
                    Total Balance
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography
                    variant="h3"
                    className={`font-bold ${
                      totalBalance >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {totalBalance.toLocaleString("pt-BR")}
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {recordCount} registro{recordCount !== 1 ? "s" : ""}{" "}
                    filtrado{recordCount !== 1 ? "s" : ""}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Status bar */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {loading
                ? "🔄 Aplicando filtros..."
                : "✅ Filtros aplicados automaticamente"}
            </span>
            <span>
              {hasActiveFilters
                ? `${
                    [
                      filters.dateFrom,
                      filters.dateTo,
                      filters.sortBy !== "date-desc",
                    ].filter(Boolean).length
                  } filtro(s) ativo(s)`
                : "Nenhum filtro ativo"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
