import { notFound } from "next/navigation";
import { recordsService } from "@/services/records.service";
import { Card } from "@/components/ui/Card";
import { JsonViewer } from "@/components/ui/JsonViewer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalhePublicoPage({ params }: PageProps) {
  // Await params antes de usar
  const resolvedParams = await params;
  const record = await recordsService.getPublicRecord(resolvedParams.id);

  if (!record) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registro Público</h1>
        <p className="mt-2 text-lg text-gray-600">
          {record.data._metadata?.title || `Registro #${record.id.slice(0, 8)}`}
        </p>
        {record.data._metadata?.description && (
          <p className="mt-1 text-gray-600">
            {record.data._metadata.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  ID do Registro:
                </span>
                <p className="text-gray-900 font-mono text-xs">{record.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <p className="text-gray-900">
                  {new Date(record.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <JsonViewer data={record.data} title="Visualização dos Dados" />
      </div>
    </div>
  );
}
