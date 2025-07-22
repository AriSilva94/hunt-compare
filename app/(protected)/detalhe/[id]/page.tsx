/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JsonViewer } from "@/components/ui/JsonViewer";
import Link from "next/link";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetalhePage({ params }: PageProps) {
  // Use a função 'use' do React para resolver a Promise
  const resolvedParams = use(params);

  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecord() {
      try {
        const response = await fetch(`/api/records/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Record not found");
        }
        const data = await response.json();
        setRecord(data);
      } catch (error) {
        console.error("Erro ao buscar registro:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchRecord();
  }, [resolvedParams.id]);

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/detalhe-publico/${record?.id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const response = await fetch(`/api/records/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir registro");
      }

      router.push("/home");
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      alert("Erro ao excluir registro");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!record) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {record.data._metadata?.title || "Detalhes do Registro"}
            </h1>
            <p className="mt-2 text-lg text-gray-600">ID: {record.id}</p>
            {record.data._metadata?.description && (
              <p className="mt-1 text-gray-600">
                {record.data._metadata.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete} size="sm">
              Excluir
            </Button>
            <Link href="/home">
              <Button variant="secondary">Voltar</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Informações do Registro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <p className="text-gray-900">
                  {new Date(record.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Atualizado em:
                </span>
                <p className="text-gray-900">
                  {new Date(record.updated_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Visibilidade:</span>
                <p className="text-gray-900">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded ${
                      record.is_public
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.is_public ? "Público" : "Privado"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {record.is_public && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                🔗 Link Público
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/detalhe-publico/${record.id}`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  size="sm"
                  onClick={copyPublicLink}
                  className="whitespace-nowrap"
                >
                  {copySuccess ? "✓ Copiado!" : "Copiar Link"}
                </Button>
                <Link
                  href={`/detalhe-publico/${record.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="secondary">
                    Abrir
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Compartilhe este link com qualquer pessoa para visualizar este
                registro
              </p>
            </div>
          )}
        </Card>

        <JsonViewer
          data={record.data}
          title="Visualização Completa dos Dados"
        />

        {/* Botão adicional para download do JSON */}
        <Card className="bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700">Exportar Dados</h3>
              <p className="text-sm text-gray-600">
                Baixe os dados em formato JSON
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const dataStr = JSON.stringify(record.data, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const exportFileDefaultName = `registro-${record.id.slice(
                  0,
                  8
                )}.json`;

                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
              }}
            >
              Baixar JSON
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
