"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ComparisonHistoryService } from "@/services/comparison-history.service";
import { useConfirm } from "@/hooks/useConfirm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Typography } from "@/components/ui/Typography";
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
  const { confirm, confirmProps } = useConfirm();

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

  const handleClearHistory = async () => {
    const confirmed = await confirm({
      title: "Limpar histórico",
      message: "Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.",
      confirmText: "Limpar",
      cancelText: "Cancelar"
    });
    
    if (confirmed) {
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
          <Typography variant="lead" className="font-semibold flex items-center gap-2">
            🕒 Histórico de Comparações
          </Typography>
          <Typography variant="small">
            Acesse rapidamente suas comparações anteriores
          </Typography>
        </div>
        {history.length > 0 && (
          <Button
            onClick={handleClearHistory}
            variant="danger"
            size="sm"
          >
            Limpar Histórico
          </Button>
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
                  <Typography variant="small" className="font-medium truncate">
                    {comparison.recordNames.length > 0
                      ? comparison.recordNames.join(" vs ")
                      : comparison.title}
                  </Typography>
                  <Typography variant="caption">
                    {comparison.recordIds.length} registros • {formatDate(comparison.createdAt)}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onSelectComparison && (
                <Button
                  onClick={() => onSelectComparison(comparison.recordIds)}
                  variant="primary"
                  size="sm"
                >
                  Recarregar
                </Button>
              )}
              <Link
                href={ComparisonHistoryService.formatComparisonUrl(comparison.recordIds)}
                className="text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
              >
                <Typography variant="caption">Ver Resultado</Typography>
              </Link>
              <Button
                onClick={() => handleRemoveComparison(comparison.id)}
                variant="danger"
                size="sm"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>

      {history.length > 3 && (
        <div className="mt-3 text-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="secondary"
            size="sm"
          >
            {isExpanded ? "Ver menos" : `Ver mais (${history.length - 3})`}
          </Button>
        </div>
      )}
    <ConfirmDialog {...confirmProps} />
    </Card>
  );
}