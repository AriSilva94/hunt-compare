/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { RecordFilter, FilterState } from "@/components/ui/RecordFilter";
import { formatDateOnly, isDateBetween } from "@/utils/date";
import Link from "next/link";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"];

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
        {
          label: "XP Ganho",
          value: data["XP Gain"] || data["Raw XP Gain"],
          icon: "⭐",
        },
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

export default function RegistrosPublicosPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data } = await supabase
        .from("records")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (data) {
        setRecords(data);
        setFilteredRecords(data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Calcular somatória do Balance sempre que filteredRecords mudar
  useEffect(() => {
    const total = filteredRecords.reduce((sum, record) => {
      const data = record.data as any;
      const balance =
        parseFloat(String(data.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
      return sum + balance;
    }, 0);
    setTotalBalance(total);
  }, [filteredRecords]);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...records];

    // Filtro por data
    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter((record) =>
        isDateBetween(record.created_at, filters.dateFrom!, filters.dateTo!)
      );
    } else if (filters.dateFrom) {
      filtered = filtered.filter(
        (record) => new Date(record.created_at) >= filters.dateFrom!
      );
    } else if (filters.dateTo) {
      filtered = filtered.filter((record) => {
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
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "profit-desc": {
          const aBalance =
            parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          const bBalance =
            parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          return bBalance - aBalance;
        }
        case "profit-asc": {
          const aBalance =
            parseFloat(String(aData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          const bBalance =
            parseFloat(String(bData.Balance || 0).replace(/[^\d.-]/g, "")) || 0;
          return aBalance - bBalance;
        }
        case "xp-desc": {
          const aXp =
            parseFloat(
              String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          const bXp =
            parseFloat(
              String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          return bXp - aXp;
        }
        case "xp-asc": {
          const aXp =
            parseFloat(
              String(aData["XP Gain"] || aData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          const bXp =
            parseFloat(
              String(bData["XP Gain"] || bData["Raw XP Gain"] || 0).replace(
                /[^\d.-]/g,
                ""
              )
            ) || 0;
          return aXp - bXp;
        }
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Typography variant="h1">Registros Públicos</Typography>
        <Typography variant="lead" className="mt-2">
          Explore todos os registros compartilhados publicamente pela comunidade
        </Typography>
      </div>

      {/* Estatísticas dos registros públicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Total de Registros</Typography>
              <Typography
                variant="h3"
                className="text-blue-600 dark:text-blue-400"
              >
                {loading ? "..." : records.length}
              </Typography>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>

        <Card className="bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Sessões de Jogo</Typography>
              <Typography
                variant="h3"
                className="text-green-600 dark:text-green-400"
              >
                {loading
                  ? "..."
                  : records.filter((r) => r.data["Session start"]).length}
              </Typography>
            </div>
            <span className="text-3xl">🎮</span>
          </div>
        </Card>

        <Card className="bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small">Outros Registros</Typography>
              <Typography
                variant="h3"
                className="text-purple-600 dark:text-purple-400"
              >
                {loading
                  ? "..."
                  : records.filter((r) => !r.data["Session start"]).length}
              </Typography>
            </div>
            <span className="text-3xl">📁</span>
          </div>
        </Card>
      </div>

      {/* Componente de Filtro */}
      <RecordFilter
        onFilterChange={handleFilterChange}
        loading={loading}
        totalBalance={totalBalance}
        recordCount={filteredRecords.length}
        isPublic={true}
      />

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <Typography variant="p">Carregando registros...</Typography>
          </div>
        </Card>
      ) : records.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <Typography variant="p">
              Ainda não há registros públicos disponíveis.
            </Typography>
            <Typography variant="small" className="text-gray-400 mt-2">
              Seja o primeiro a compartilhar seus dados com a comunidade!
            </Typography>
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
                      <Typography variant="h4" className="line-clamp-1 flex-1">
                        {preview.title}
                      </Typography>
                      {preview.type === "game-session" && (
                        <span className="ml-2 text-2xl">🎮</span>
                      )}
                    </div>
                    <Typography variant="small" className="line-clamp-2">
                      {preview.description}
                    </Typography>
                  </div>

                  {preview.highlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {preview.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-2 rounded text-center"
                        >
                          <span className="text-lg mr-1">{highlight.icon}</span>
                          <Typography variant="caption">
                            {highlight.label}
                          </Typography>{" "}
                          <Typography variant="p" className="font-bold">
                            {highlight.value}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <Typography variant="small" className="text-gray-500">
                      {formatDateOnly(record.created_at)}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      Ver detalhes →
                    </Typography>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <Typography variant="h3" className="text-blue-900 mb-2">
            📊 Sobre os Registros Públicos
          </Typography>
          <Typography variant="small" className="text-blue-800">
            Os registros públicos são dados compartilhados por usuários que
            decidiram torná-los acessíveis a todos. Qualquer pessoa pode
            visualizar estes registros sem necessidade de autenticação.
          </Typography>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <Typography variant="h3" className="text-green-900 mb-2">
            🔗 Como Compartilhar
          </Typography>
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
