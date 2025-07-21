/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export default function DetalhePage({ params }: { params: { id: string } }) {
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecord() {
      try {
        const response = await fetch(`/api/records/${params.id}`);
        if (!response.ok) {
          throw new Error("Record not found");
        }
        const data = await response.json();
        setRecord(data);
      } catch (error) {
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchRecord();
  }, [params.id]);

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/detalhe-publico/${record?.id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!record) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalhes do Registro
            </h1>
            <p className="mt-2 text-lg text-gray-600">ID: {record.id}</p>
          </div>
          <Link href="/home">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              <h3 className="font-medium text-gray-700 mb-2">Link Público</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/detalhe-publico/${record.id}`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <Button
                  size="sm"
                  onClick={copyPublicLink}
                  className="whitespace-nowrap"
                >
                  {copySuccess ? "Copiado!" : "Copiar Link"}
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

        <Card>
          <h2 className="text-xl font-semibold mb-4">Dados JSON</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              {JSON.stringify(record.data, null, 2)}
            </code>
          </pre>
        </Card>
      </div>
    </div>
  );
}
