/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface PublicRecord {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

async function getPublicRecords(): Promise<PublicRecord[]> {
  const supabase = await createClient();

  const { data: records, error } = await supabase
    .from("records")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public records:", error);
    return [];
  }

  return records || [];
}

export default async function RegistrosPublicosPage() {
  const publicRecords = await getPublicRecords();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registros Públicos</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore todos os registros compartilhados publicamente
        </p>
      </div>

      {publicRecords.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">
            Ainda não há registros públicos disponíveis.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicRecords.map((record) => (
            <Link
              key={record.id}
              href={`/detalhe-publico/${record.id}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Registro #{record.id.slice(0, 8)}
                  </h3>
                  <span className="inline-flex px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    Público
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Publicado em:{" "}
                  {new Date(record.created_at).toLocaleDateString("pt-BR")}
                </p>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Prévia dos dados:</strong>
                  </p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {JSON.stringify(record.data).slice(0, 100)}...
                  </p>
                </div>

                <div className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Ver detalhes →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Card className="bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Sobre os Registros Públicos
          </h2>
          <p className="text-blue-800">
            Os registros públicos são dados compartilhados por usuários que
            decidiram torná-los acessíveis a todos. Qualquer pessoa pode
            visualizar estes registros sem necessidade de autenticação.
          </p>
        </Card>
      </div>
    </div>
  );
}
