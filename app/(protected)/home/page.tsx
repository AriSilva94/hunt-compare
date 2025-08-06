/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { RecordFilter, FilterState } from "@/components/ui/RecordFilter";
import { formatDateOnly, formatDateTime, isDateBetween } from "@/utils/date";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

export default function HomePage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      setUser(user);
      
      const { data } = await supabase
        .from("records")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setRecords(data);
        setFilteredRecords(data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...records];

    // Filtro por data
    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter(record => 
        isDateBetween(record.created_at, filters.dateFrom!, filters.dateTo!)
      );
    } else if (filters.dateFrom) {
      filtered = filtered.filter(record => 
        new Date(record.created_at) >= filters.dateFrom!
      );
    } else if (filters.dateTo) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.created_at);
        const filterDate = new Date(filters.dateTo!);
        filterDate.setHours(23, 59, 59, 999); // Final do dia
        return recordDate <= filterDate;
      });
    }

    // Ordenação
    filtered.sort((a, b) => {
      const aData = a.data as any;
      const bData = b.data as any;

      switch (filters.sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "profit-desc": {
          const aBalance = parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, '')) || 0;
          const bBalance = parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, '')) || 0;
          return bBalance - aBalance;
        }
        case "profit-asc": {
          const aBalance = parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, '')) || 0;
          const bBalance = parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, '')) || 0;
          return aBalance - bBalance;
        }
        case "xp-desc": {
          const aXp = parseFloat(String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(/[^\d.-]/g, '')) || 0;
          const bXp = parseFloat(String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(/[^\d.-]/g, '')) || 0;
          return bXp - aXp;
        }
        case "xp-asc": {
          const aXp = parseFloat(String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(/[^\d.-]/g, '')) || 0;
          const bXp = parseFloat(String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(/[^\d.-]/g, '')) || 0;
          return aXp - bXp;
        }
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  };

  if (!user) return null;

  // Função para extrair informações relevantes do registro
  const getRecordSummary = (data: any) => {
    // Para sessões de jogo
    if (data["Session start"]) {
      return {
        type: "game-session",
        title: data._metadata?.title || `Sessão de ${data["Session start"]}`,
        subtitle: `Duração: ${data["Session length"]} | XP Ganho: ${
          data["XP Gain"] || data["Raw XP Gain"]
        }`,
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
        <Typography variant="h1">Dashboard</Typography>
        <Typography variant="lead" className="mt-2">
          Gerencie seus registros de dados
        </Typography>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Total de Registros</Typography>
              <Typography variant="h3" className="text-blue-600">
                {loading ? "..." : records.length}
              </Typography>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>

        <Card className="bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Registros Públicos</Typography>
              <Typography variant="h3" className="text-green-600">
                {loading ? "..." : records.filter((r) => r.is_public).length}
              </Typography>
            </div>
            <span className="text-3xl">🌐</span>
          </div>
        </Card>

        <Card className="bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Registros Privados</Typography>
              <Typography variant="h3" className="text-purple-600">
                {loading ? "..." : records.filter((r) => !r.is_public).length}
              </Typography>
            </div>
            <span className="text-3xl">🔒</span>
          </div>
        </Card>

        <Card className="bg-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Último Registro</Typography>
              <Typography
                variant="small"
                className="font-medium text-amber-600"
              >
                {loading 
                  ? "..." 
                  : records.length > 0
                  ? formatDateOnly(records[0].created_at)
                  : "Nenhum"}
              </Typography>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <Typography variant="h2" className="mb-4">
            Como funciona?
          </Typography>
          <div className="space-y-4">
            <Typography variant="p">
              Este sistema permite que você gerencie registros JSON de forma
              simples e segura.
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <Typography variant="p" className="font-medium">
                    Crie registros
                  </Typography>
                  <Typography variant="small">
                    Adicione dados JSON como sessões de jogos, relatórios ou
                    qualquer estrutura
                  </Typography>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔐</span>
                <div>
                  <Typography variant="p" className="font-medium">
                    Controle a privacidade
                  </Typography>
                  <Typography variant="small">
                    Defina se o registro será público ou privado
                  </Typography>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <Typography variant="p" className="font-medium">
                    Visualize seus dados
                  </Typography>
                  <Typography variant="small">
                    Veja estatísticas detalhadas e informações formatadas
                  </Typography>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔗</span>
                <div>
                  <Typography variant="p" className="font-medium">
                    Compartilhe facilmente
                  </Typography>
                  <Typography variant="small">
                    Gere links públicos para compartilhar seus registros
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h2">Seus Registros</Typography>
          <Link
            href="/cadastro"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <span className="mr-2">+</span>
            Novo Registro
          </Link>
        </div>

        {/* Componente de Filtro */}
        <RecordFilter onFilterChange={handleFilterChange} loading={loading} />

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <Typography variant="p">Carregando registros...</Typography>
            </div>
          </Card>
        ) : records.length === 0 ? (
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
        ) : filteredRecords.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => {
              const summary = getRecordSummary(record.data);

              return (
                <Card
                  key={record.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Typography variant="h4" className="line-clamp-1">
                      {summary.title}
                    </Typography>
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

                  <Typography variant="small" className="mb-3">
                    {summary.subtitle}
                  </Typography>

                  {/* Estatísticas rápidas para sessões de jogo */}
                  {summary.stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {summary.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="text-center p-2 bg-gray-50 rounded"
                        >
                          <Typography variant="caption">
                            {stat.label}
                          </Typography>
                          <Typography variant="p" className="font-bold">
                            {typeof stat.value === "number"
                              ? stat.value.toLocaleString()
                              : stat.value}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  )}

                  <Typography variant="small" className="text-gray-500 mb-3">
                    Criado em: {formatDateTime(record.created_at)}
                  </Typography>

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
