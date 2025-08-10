import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";

interface EmptyStateProps {
  children?: never;
}

interface NoResultsStateProps {
  children?: never;
}

export function EmptyState({}: EmptyStateProps) {
  return (
    <Card>
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">📝</span>
        <Typography variant="p" className="mb-4">
          Você ainda não possui registros. Que tal criar o primeiro?
        </Typography>
        <Link
          href="/cadastro"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Criar Primeiro Registro
        </Link>
      </div>
    </Card>
  );
}

export function NoResultsState({}: NoResultsStateProps) {
  return (
    <Card>
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🔍</span>
        <Typography variant="p" className="mb-4">
          Nenhum registro encontrado com os filtros aplicados.
        </Typography>
        <Typography variant="small" className="text-gray-500">
          Tente ajustar os filtros para ver mais resultados.
        </Typography>
      </div>
    </Card>
  );
}