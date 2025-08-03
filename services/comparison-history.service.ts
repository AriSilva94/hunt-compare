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
}