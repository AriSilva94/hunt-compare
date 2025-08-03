interface ComparisonRecord {
  id: string;
  title: string;
  recordIds: string[];
  createdAt: string;
  recordNames: string[];
}

interface ComparisonHistory {
  comparisons: ComparisonRecord[];
}

const STORAGE_KEY = 'hunt-compare-history';
const MAX_HISTORY_ITEMS = 20;

export class ComparisonHistoryService {
  private static getHistory(): ComparisonHistory {
    if (typeof window === 'undefined') {
      return { comparisons: [] };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { comparisons: [] };
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return { comparisons: [] };
    }
  }

  private static saveHistory(history: ComparisonHistory): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }

  static addComparison(recordIds: string[], recordNames: string[]): void {
    const history = this.getHistory();
    
    // Verificar se já existe uma comparação idêntica
    const existingIndex = history.comparisons.findIndex(
      comp => comp.recordIds.length === recordIds.length && 
               comp.recordIds.every(id => recordIds.includes(id))
    );

    const comparisonRecord: ComparisonRecord = {
      id: crypto.randomUUID(),
      title: `Comparação de ${recordIds.length} registros`,
      recordIds: [...recordIds],
      recordNames: [...recordNames],
      createdAt: new Date().toISOString(),
    };

    // Se já existe, remove o antigo e adiciona o novo no topo
    if (existingIndex >= 0) {
      history.comparisons.splice(existingIndex, 1);
    }

    // Adiciona no início do array
    history.comparisons.unshift(comparisonRecord);

    // Limita o número de itens no histórico
    if (history.comparisons.length > MAX_HISTORY_ITEMS) {
      history.comparisons = history.comparisons.slice(0, MAX_HISTORY_ITEMS);
    }

    this.saveHistory(history);
  }

  static getComparisons(): ComparisonRecord[] {
    return this.getHistory().comparisons;
  }

  static removeComparison(comparisonId: string): void {
    const history = this.getHistory();
    history.comparisons = history.comparisons.filter(comp => comp.id !== comparisonId);
    this.saveHistory(history);
  }

  static clearHistory(): void {
    this.saveHistory({ comparisons: [] });
  }

  static formatComparisonUrl(recordIds: string[]): string {
    return `/comparar/resultado?ids=${recordIds.join(',')}`;
  }

  static async validateComparison(recordIds: string[]): Promise<{
    validIds: string[];
    invalidIds: string[];
    hasInvalidRecords: boolean;
  }> {
    try {
      // Buscar informações dos registros para validar permissões
      const response = await fetch('/api/records/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordIds }),
      });

      if (!response.ok) {
        throw new Error('Erro na validação');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao validar comparação:', error);
      return {
        validIds: [],
        invalidIds: recordIds,
        hasInvalidRecords: true,
      };
    }
  }

  static async cleanInvalidComparisons(): Promise<void> {
    const history = this.getHistory();
    const cleanedComparisons: ComparisonRecord[] = [];

    for (const comparison of history.comparisons) {
      const validation = await this.validateComparison(comparison.recordIds);
      
      if (validation.validIds.length >= 2) {
        // Se ainda tem pelo menos 2 registros válidos, manter a comparação
        if (validation.hasInvalidRecords) {
          // Atualizar com apenas os IDs válidos
          cleanedComparisons.push({
            ...comparison,
            recordIds: validation.validIds,
            title: `Comparação de ${validation.validIds.length} registros`,
          });
        } else {
          // Manter como está
          cleanedComparisons.push(comparison);
        }
      }
      // Se tem menos de 2 registros válidos, remove a comparação
    }

    this.saveHistory({ comparisons: cleanedComparisons });
  }
}