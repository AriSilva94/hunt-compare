"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log do erro para debugging
    console.error("Erro capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <Card className="p-8">
          {/* Ícone de erro */}
          <div className="mb-6">
            <span className="text-8xl">⚠️</span>
          </div>

          {/* Título */}
          <Typography variant="h1" className="mb-2">
            Algo deu errado
          </Typography>
          <Typography variant="h3" className="mb-4">
            Ocorreu um erro inesperado
          </Typography>

          {/* Descrição */}
          <Typography variant="p" className="mb-6 leading-relaxed">
            Desculpe, encontramos um problema técnico. Você pode tentar recarregar 
            a página ou voltar para a página inicial.
          </Typography>

          {/* Detalhes do erro em desenvolvimento */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <Typography variant="small" className="font-medium text-red-800 mb-2">
                Detalhes do erro (desenvolvimento):
              </Typography>
              <code className="text-xs text-red-700 break-all">
                {error.message}
              </code>
              {error.digest && (
                <Typography variant="caption" className="text-red-600 mt-1">
                  ID: {error.digest}
                </Typography>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              🔄 Tentar Novamente
            </Button>
            
            <Link href="/home" className="block">
              <Button variant="secondary" className="w-full">
                🏠 Voltar para Home
              </Button>
            </Link>
          </div>

          {/* Links adicionais */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Typography variant="small" className="mb-3">
              Outras opções:
            </Typography>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/comparar" className="text-blue-600 hover:text-blue-800">
                Comparar Registros
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/registros-publicos" className="text-blue-600 hover:text-blue-800">
                Registros Públicos
              </Link>
              <span className="text-gray-300">•</span>
              <Button 
                onClick={() => window.location.reload()} 
                variant="secondary"
                size="sm"
              >
                Recarregar Página
              </Button>
            </div>
          </div>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center">
          <Typography variant="caption" className="text-gray-400 mb-2">
            Se o problema persistir, tente limpar o cache do navegador
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            Hunt Compare - Análise de sessões de hunt do Tibia
          </Typography>
        </div>
      </div>
    </div>
  );
}