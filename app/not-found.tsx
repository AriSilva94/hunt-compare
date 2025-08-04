"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <Card className="p-8">
          {/* Ícone 404 */}
          <div className="mb-6">
            <span className="text-8xl">🔍</span>
          </div>

          {/* Título */}
          <Typography variant="h1" className="mb-2">404</Typography>
          <Typography variant="lead" className="mb-4">
            Página não encontrada
          </Typography>

          {/* Descrição */}
          <Typography variant="p" className="mb-8 leading-relaxed">
            Ops! A página que você está procurando não existe ou foi movida. 
            Verifique se o endereço está correto ou use os links abaixo para navegar.
          </Typography>

          {/* Botões de navegação */}
          <div className="space-y-3">
            <Link href="/home" className="block">
              <Button className="w-full">
                🏠 Voltar para Home
              </Button>
            </Link>
            
            <Link href="/comparar" className="block">
              <Button variant="secondary" className="w-full">
                📊 Comparar Registros
              </Button>
            </Link>
            
            <Link href="/cadastro" className="block">
              <Button variant="secondary" className="w-full">
                ➕ Criar Novo Registro
              </Button>
            </Link>
          </div>

          {/* Link adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Typography variant="small" className="mb-3">
              Precisa de ajuda? Veja nossas páginas principais:
            </Typography>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/registros-publicos" className="text-blue-600 hover:text-blue-800">
                Registros Públicos
              </Link>
              <span className="text-gray-300">•</span>
              <Button 
                onClick={() => window.history.back()} 
                variant="secondary"
                size="sm"
              >
                Voltar
              </Button>
            </div>
          </div>
        </Card>

        {/* Rodapé */}
        <div className="text-center">
          <Typography variant="caption">
            Hunt Compare - Análise de sessões de hunt do Tibia
          </Typography>
        </div>
      </div>
    </div>
  );
}