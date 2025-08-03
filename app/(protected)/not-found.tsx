"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ProtectedNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="text-center py-16">
        {/* Ícone */}
        <div className="mb-8">
          <span className="text-9xl">📝</span>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Registro não encontrado
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          O registro que você está procurando não existe, foi removido ou você não tem permissão para visualizá-lo.
        </p>

        {/* Possíveis causas */}
        <div className="mb-8 text-left max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Possíveis causas:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              O registro foi excluído pelo proprietário
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              O registro foi tornado privado
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              O link está incorreto ou expirado
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              Você não tem permissão para visualizar este registro
            </li>
          </ul>
        </div>

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/home">
            <Button className="w-full sm:w-auto">
              🏠 Meus Registros
            </Button>
          </Link>
          
          <Link href="/registros-publicos">
            <Button variant="secondary" className="w-full sm:w-auto">
              🌐 Registros Públicos
            </Button>
          </Link>
          
          <Link href="/cadastro">
            <Button variant="secondary" className="w-full sm:w-auto">
              ➕ Criar Registro
            </Button>
          </Link>
        </div>

        {/* Dica adicional */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            💡 <strong>Dica:</strong> Verifique se você está logado com a conta correta ou 
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              volte à página anterior
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}