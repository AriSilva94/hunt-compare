import { useState, useEffect } from 'react';

interface UseHomeLoadingProps {
  recordsLoading: boolean;
  charactersLoading: boolean;
  user: any;
}

/**
 * @deprecated Use useHomeData instead - this hook is no longer needed
 * Hook para gerenciar o estado de loading unificado da página home
 * Evita o "pisca-pisca" sincronizando múltiplos loadings
 */
export function useHomeLoading({ recordsLoading, charactersLoading, user }: UseHomeLoadingProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

  // Determina se ainda está no carregamento inicial
  const isLoading = isInitialLoad && (recordsLoading || charactersLoading);

  useEffect(() => {
    // Se não há usuário, não precisa carregar nada
    if (!user) {
      setIsInitialLoad(false);
      return;
    }

    // Marca como "dados carregados" quando ambos terminam de carregar
    if (!recordsLoading && !charactersLoading && !hasDataLoaded) {
      setHasDataLoaded(true);
      setIsInitialLoad(false);
    }
  }, [recordsLoading, charactersLoading, user, hasDataLoaded]);

  // Reset quando usuário muda (logout/login)
  useEffect(() => {
    if (user && !hasDataLoaded) {
      setIsInitialLoad(true);
    }
  }, [user, hasDataLoaded]);

  return {
    isLoading,
    hasDataLoaded
  };
}