"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log do erro crítico
    console.error("Erro crítico da aplicação:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="bg-white shadow-lg rounded-lg p-8">
              {/* Ícone de erro crítico */}
              <div className="mb-6">
                <span className="text-8xl">💥</span>
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Erro Crítico
              </h1>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                A aplicação encontrou um problema grave
              </h2>

              {/* Descrição */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ocorreu um erro inesperado que afetou toda a aplicação. 
                Por favor, recarregue a página ou tente novamente mais tarde.
              </p>

              {/* Detalhes em desenvolvimento */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Detalhes técnicos:
                  </h3>
                  <code className="text-xs text-red-700 break-all block">
                    {error.message}
                  </code>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-1">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Botões de ação */}
              <div className="space-y-3">
                <Button 
                  onClick={reset}
                  variant="primary"
                  fullWidth
                >
                  🔄 Tentar Novamente
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                  fullWidth
                >
                  🏠 Ir para Página Inicial
                </Button>
                
                <Button 
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  fullWidth
                >
                  ↻ Recarregar Página
                </Button>
              </div>

              {/* Informações de suporte */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Se o problema persistir, tente limpar o cache do navegador 
                  ou entre em contato com o suporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}