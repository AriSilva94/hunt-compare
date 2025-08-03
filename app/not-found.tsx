import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>

          {/* Descrição */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Ops! A página que você está procurando não existe ou foi movida. 
            Verifique se o endereço está correto ou use os links abaixo para navegar.
          </p>

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
            <p className="text-sm text-gray-500 mb-3">
              Precisa de ajuda? Veja nossas páginas principais:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/registros-publicos" className="text-blue-600 hover:text-blue-800">
                Registros Públicos
              </Link>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => window.history.back()} 
                className="text-blue-600 hover:text-blue-800"
              >
                Voltar
              </button>
            </div>
          </div>
        </Card>

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Hunt Compare - Análise de sessões de hunt do Tibia
          </p>
        </div>
      </div>
    </div>
  );
}