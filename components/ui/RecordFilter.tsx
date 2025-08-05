"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Typography } from "./Typography";
import { Button } from "./Button";
import { Input } from "./Input";

export type SortOption = 
  | "date-desc" 
  | "date-asc" 
  | "profit-desc" 
  | "profit-asc" 
  | "xp-desc" 
  | "xp-asc";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  sortBy: SortOption;
}

interface RecordFilterProps {
  onFilterChange: (filters: FilterState) => void;
  loading?: boolean;
}

export function RecordFilter({ onFilterChange, loading = false }: RecordFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    sortBy: "date-desc"
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      dateFrom: "",
      dateTo: "",
      sortBy: "date-desc"
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.sortBy !== "date-desc";

  const sortOptions = [
    { value: "date-desc", label: "📅 Data (mais recente)", icon: "📅" },
    { value: "date-asc", label: "📅 Data (mais antigo)", icon: "📅" },
    { value: "profit-desc", label: "💰 Maior Profit", icon: "💰" },
    { value: "profit-asc", label: "💸 Menor Profit", icon: "💸" },
    { value: "xp-desc", label: "⭐ Maior XP", icon: "⭐" },
    { value: "xp-asc", label: "📊 Menor XP", icon: "📊" },
  ];

  return (
    <Card className="mb-6 overflow-hidden">
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
                📅 A partir de {filters.dateFrom}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                📅 Até {filters.dateTo}
              </span>
            )}
            {filters.sortBy !== "date-desc" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
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
              <Input
                type="date"
                label="Data inicial"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
                disabled={loading}
                className="text-sm"
              />
              
              <Input
                type="date"
                label="Data final"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
                disabled={loading}
                className="text-sm"
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
                  onClick={() => handleFilterChange({ sortBy: option.value as SortOption })}
                  disabled={loading}
                  className={`flex items-center gap-2 p-3 text-left rounded-lg border transition-all duration-200 ${
                    filters.sortBy === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

          {/* Status bar */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {loading ? "🔄 Aplicando filtros..." : "✅ Filtros aplicados automaticamente"}
            </span>
            <span>
              {hasActiveFilters ? `${[filters.dateFrom, filters.dateTo, filters.sortBy !== "date-desc"].filter(Boolean).length} filtro(s) ativo(s)` : "Nenhum filtro ativo"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}