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

function getRecordPreview(data: any) {
  // Para sessões de jogo
  if (data["Session start"] && data["Killed Monsters"]) {
    const totalMonsters =
      data["Killed Monsters"]?.reduce(
        (sum: number, m: any) => sum + m.Count,
        0
      ) || 0;
    const totalItems =
      data["Looted Items"]?.reduce(
        (sum: number, item: any) => sum + item.Count,
        0
      ) || 0;

    return {
      type: "game-session",
      title: data._metadata?.title || `Sessão de ${data["Session start"]}`,
      description:
        data._metadata?.description || `${data["Session length"]} de jogo`,
      highlights: [
        { label: "Raw XP", value: data["Raw XP Gain"], icon: "⭐" },
        {
          label: "Monstros",
          value: totalMonsters.toLocaleString(),
          icon: "👾",
        },
        { label: "Itens", value: totalItems.toLocaleString(), icon: "💎" },
        { label: "Lucro", value: data["Balance"], icon: "💰" },
      ],
    };
  }

  // Para outros tipos
  return {
    type: "generic",
    title: data._metadata?.title || "Registro de Dados",
    description:
      data._metadata?.description || `${Object.keys(data).length} propriedades`,
    highlights: [],
  };
}

export default async function RegistrosPublicosPage() {
  const publicRecords = await getPublicRecords();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registros Públicos</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore todos os registros compartilhados publicamente pela comunidade
        </p>
      </div>

      {/* Estatísticas dos registros públicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold text-blue-600">
                {publicRecords.length}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>

        <Card className="bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sessões de Jogo</p>
              <p className="text-2xl font-bold text-green-600">
                {publicRecords.filter((r) => r.data["Session start"]).length}
              </p>
            </div>
            <span className="text-3xl">🎮</span>
          </div>
        </Card>

        <Card className="bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outros Registros</p>
              <p className="text-2xl font-bold text-purple-600">
                {publicRecords.filter((r) => !r.data["Session start"]).length}
              </p>
            </div>
            <span className="text-3xl">📁</span>
          </div>
        </Card>
      </div>

      {publicRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500">
              Ainda não há registros públicos disponíveis.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Seja o primeiro a compartilhar seus dados com a comunidade!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicRecords.map((record) => {
            const preview = getRecordPreview(record.data);

            return (
              <Link
                key={record.id}
                href={`/detalhe-publico/${record.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-1 flex-1">
                        {preview.title}
                      </h3>
                      {preview.type === "game-session" && (
                        <span className="ml-2 text-2xl">🎮</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {preview.description}
                    </p>
                  </div>

                  {preview.highlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {preview.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-2 rounded text-center"
                        >
                          <span className="text-lg mr-1">{highlight.icon}</span>
                          <p className="text-xs text-gray-600">
                            {highlight.label}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {highlight.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-500">
                      {new Date(record.created_at).toLocaleDateString("pt-BR")}
                    </p>
                    <span className="text-blue-600 font-medium hover:text-blue-800">
                      Ver detalhes →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            📊 Sobre os Registros Públicos
          </h2>
          <p className="text-blue-800 text-sm">
            Os registros públicos são dados compartilhados por usuários que
            decidiram torná-los acessíveis a todos. Qualquer pessoa pode
            visualizar estes registros sem necessidade de autenticação.
          </p>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            🔗 Como Compartilhar
          </h2>
          <p className="text-green-800 text-sm">
            Para tornar seus registros públicos, marque a opção &quot;Tornar
            este registro público&quot; ao criar um novo registro. Você receberá
            um link único que pode ser compartilhado com qualquer pessoa.
          </p>
        </Card>
      </div>
    </div>
  );
}
