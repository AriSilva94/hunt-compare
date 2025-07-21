import { recordsService } from "@/services/records.service";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const records = await recordsService.getUserRecords(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <p className="mt-2 text-lg text-gray-600">
          Bem-vindo ao sistema de gerenciamento de registros
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Este sistema permite que você gerencie registros JSON de forma
              simples e segura.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Crie registros com dados JSON personalizados</li>
              <li>Defina se o registro será público ou privado</li>
              <li>Visualize e gerencie todos os seus registros</li>
              <li>Compartilhe registros públicos com qualquer pessoa</li>
            </ul>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Seus Registros
          </h2>
          <Link
            href="/cadastro"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Novo Registro
          </Link>
        </div>

        {records.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              Você ainda não possui registros. Crie seu primeiro registro!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Card
                key={record.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Registro #{record.id.slice(0, 8)}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      record.is_public
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.is_public ? "Público" : "Privado"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Criado em:{" "}
                  {new Date(record.created_at).toLocaleDateString("pt-BR")}
                </p>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 truncate">
                    {JSON.stringify(record.data).slice(0, 100)}...
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/detalhe/${record.id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalhes
                  </Link>

                  {record.is_public && (
                    <Link
                      href={`/detalhe-publico/${record.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Link Público
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
