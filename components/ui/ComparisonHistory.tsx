"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ComparisonHistoryService } from "@/services/comparison-history.service";
import Link from "next/link";

interface ComparisonRecord {
  id: string;
  title: string;
  recordIds: string[];
  createdAt: string;
  recordNames: string[];
}

interface ComparisonHistoryProps {
  onSelectComparison?: (recordIds: string[]) => void;
}

export function ComparisonHistory({ onSelectComparison }: ComparisonHistoryProps) {
  const [history, setHistory] = useState<ComparisonRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadHistory();
    // Limpar comparações inválidas periodicamente
    cleanInvalidComparisons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cleanInvalidComparisons = async () => {
    try {
      await ComparisonHistoryService.cleanInvalidComparisons();
      loadHistory(); // Recarregar após limpeza
    } catch (error) {
      console.error('Erro ao limpar comparações inválidas:', error);
    }
  };

  const loadHistory = () => {
    const comparisons = ComparisonHistoryService.getComparisons();
    setHistory(comparisons);
  };

  const handleRemoveComparison = (comparisonId: string) => {
    ComparisonHistoryService.removeComparison(comparisonId);
    loadHistory();
  };

  const handleClearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      ComparisonHistoryService.clearHistory();
      loadHistory();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) {
    return null;
  }

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🕒 Histórico de Comparações
          </h2>
          <p className="text-sm text-gray-600">
            Acesse rapidamente suas comparações anteriores
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedHistory.map((comparison) => (
          <div
            key={comparison.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">📊</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {comparison.recordNames.length > 0
                      ? comparison.recordNames.join(" vs ")
                      : comparison.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comparison.recordIds.length} registros • {formatDate(comparison.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onSelectComparison && (
                <button
                  onClick={() => onSelectComparison(comparison.recordIds)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Recarregar
                </button>
              )}
              <Link
                href={ComparisonHistoryService.formatComparisonUrl(comparison.recordIds)}
                className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
              >
                Ver Resultado
              </Link>
              <button
                onClick={() => handleRemoveComparison(comparison.id)}
                className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {history.length > 3 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
          >
            {isExpanded ? "Ver menos" : `Ver mais (${history.length - 3})`}
          </button>
        </div>
      )}
    </Card>
  );
}