/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // Função para extrair informações relevantes do registro
  const getRecordSummary = (data: any) => {
    // Para sessões de jogo
    if (data["Session start"]) {
      return {
        type: "game-session",
        title: data._metadata?.title || `Sessão de ${data["Session start"]}`,
        subtitle: `Duração: ${data["Session length"]} | Raw XP: ${data["Raw XP Gain"]}`,
        stats: [
          {
            label: "Monstros",
            value:
              data["Killed Monsters"]?.reduce(
                (sum: number, m: any) => sum + m.Count,
                0
              ) || 0,
          },
          { label: "Loot", value: data["Loot"] },
          { label: "Balance", value: data["Balance"] },
        ],
      };
    }

    // Para outros tipos de dados
    return {
      type: "generic",
      title: data._metadata?.title || "Registro JSON",
      subtitle:
        data._metadata?.description ||
        `${Object.keys(data).length} propriedades`,
      stats: [],
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Gerencie seus registros de dados
        </p>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold text-blue-600">
                {records.length}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>

        <Card className="bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registros Públicos</p>
              <p className="text-2xl font-bold text-green-600">
                {records.filter((r) => r.is_public).length}
              </p>
            </div>
            <span className="text-3xl">🌐</span>
          </div>
        </Card>

        <Card className="bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registros Privados</p>
              <p className="text-2xl font-bold text-purple-600">
                {records.filter((r) => !r.is_public).length}
              </p>
            </div>
            <span className="text-3xl">🔒</span>
          </div>
        </Card>

        <Card className="bg-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Último Registro</p>
              <p className="text-sm font-medium text-amber-600">
                {records.length > 0
                  ? new Date(records[0].created_at).toLocaleDateString("pt-BR")
                  : "Nenhum"}
              </p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Este sistema permite que você gerencie registros JSON de forma
              simples e segura.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <p className="font-medium">Crie registros</p>
                  <p className="text-sm">
                    Adicione dados JSON como sessões de jogos, relatórios ou
                    qualquer estrutura
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔐</span>
                <div>
                  <p className="font-medium">Controle a privacidade</p>
                  <p className="text-sm">
                    Defina se o registro será público ou privado
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="font-medium">Visualize seus dados</p>
                  <p className="text-sm">
                    Veja estatísticas detalhadas e informações formatadas
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔗</span>
                <div>
                  <p className="font-medium">Compartilhe facilmente</p>
                  <p className="text-sm">
                    Gere links públicos para compartilhar seus registros
                  </p>
                </div>
              </div>
            </div>
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <span className="mr-2">+</span>
            Novo Registro
          </Link>
        </div>

        {records.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-gray-500 mb-4">
                Você ainda não possui registros. Que tal criar o primeiro?
              </p>
              <Link
                href="/cadastro"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Criar Primeiro Registro
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => {
              const summary = getRecordSummary(record.data);

              return (
                <Card
                  key={record.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {summary.title}
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

                  <p className="text-sm text-gray-600 mb-3">
                    {summary.subtitle}
                  </p>

                  {/* Estatísticas rápidas para sessões de jogo */}
                  {summary.stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {summary.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="text-center p-2 bg-gray-50 rounded"
                        >
                          <p className="text-xs text-gray-600">{stat.label}</p>
                          <p className="text-sm font-bold text-gray-900">
                            {typeof stat.value === "number"
                              ? stat.value.toLocaleString()
                              : stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mb-3">
                    Criado em:{" "}
                    {new Date(record.created_at).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(record.created_at).toLocaleTimeString("pt-BR")}
                  </p>

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
