/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

type FilterType = "publicas" | "minhas" | "todas";

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
        { label: "XP Ganho", value: data["XP Gain"] || data["Raw XP Gain"], icon: "⭐" },
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

export default function CompararPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>("todas");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const applyFilter = useCallback(() => {
    let filtered = records;

    switch (filter) {
      case "publicas":
        filtered = records.filter((record) => record.is_public);
        break;
      case "minhas":
        filtered = user 
          ? records.filter((record) => record.user_id === user.id)
          : [];
        break;
      case "todas":
      default:
        filtered = records;
        break;
    }

    setFilteredRecords(filtered);
  }, [records, filter, user]);

  const loadRecords = async () => {
    const supabase = createClient();
    
    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    try {
      // Buscar registros públicos
      const { data: publicRecords } = await supabase
        .from("records")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      let allRecords = publicRecords || [];

      // Se usuário logado, buscar também seus registros privados
      if (user) {
        const { data: userRecords } = await supabase
          .from("records")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (userRecords) {
          // Evitar duplicatas (registros públicos do próprio usuário)
          const uniqueUserRecords = userRecords.filter(
            (userRecord) => !allRecords.some((record) => record.id === userRecord.id)
          );
          allRecords = [...allRecords, ...uniqueUserRecords];
        }
      }

      setRecords(allRecords);
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [records, filter, user, applyFilter]);

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId);
      } else if (prev.length < 4) { // Máximo 4 registros para comparação
        return [...prev, recordId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedRecords.length >= 2) {
      const compareParams = selectedRecords.join(",");
      router.push(`/comparar/resultado?ids=${compareParams}`);
    }
  };

  const getFilterStats = () => {
    const publicCount = records.filter(r => r.is_public).length;
    const myCount = user ? records.filter(r => r.user_id === user.id).length : 0;
    
    return { publicCount, myCount, totalCount: records.length };
  };

  const stats = getFilterStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Comparar Registros</h1>
        <p className="mt-2 text-lg text-gray-600">
          Selecione registros para comparar e analisar as diferenças
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("todas")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "todas"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todas ({stats.totalCount})
          </button>
          <button
            onClick={() => setFilter("publicas")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "publicas"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Públicas ({stats.publicCount})
          </button>
          {user && (
            <button
              onClick={() => setFilter("minhas")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "minhas"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Minhas ({stats.myCount})
            </button>
          )}
        </div>
      </div>

      {/* Barra de seleção */}
      {selectedRecords.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-900 font-medium">
                {selectedRecords.length} registro(s) selecionado(s)
              </p>
              <p className="text-blue-700 text-sm">
                {selectedRecords.length >= 2 
                  ? "Clique em prosseguir para comparar"
                  : `Selecione mais ${2 - selectedRecords.length} registro(s) para comparar`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRecords([])}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Limpar
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedRecords.length < 2}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedRecords.length >= 2
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Prosseguir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de registros */}
      {filteredRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500">
              Nenhum registro encontrado para o filtro selecionado.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            const preview = getRecordPreview(record.data);
            const isSelected = selectedRecords.includes(record.id);
            const isMyRecord = user && record.user_id === user.id;

            return (
              <div key={record.id} className="relative">
                <Card 
                  className={`hover:shadow-lg transition-all cursor-pointer h-full ${
                    isSelected 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "hover:-translate-y-1"
                  } ${
                    selectedRecords.length >= 4 && !isSelected
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (selectedRecords.length < 4 || isSelected) {
                      toggleRecordSelection(record.id);
                    }
                  }}
                >
                  {/* Indicadores */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-1">
                      {record.is_public && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Público
                        </span>
                      )}
                      {isMyRecord && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Meu
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {selectedRecords.indexOf(record.id) + 1}
                        </span>
                      </div>
                    )}
                  </div>

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
                    <span className={`font-medium ${
                      isSelected ? "text-blue-600" : "text-gray-600"
                    }`}>
                      {isSelected ? "Selecionado" : "Clique para selecionar"}
                    </span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Informações sobre comparação */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            📊 Como Comparar
          </h2>
          <p className="text-blue-800 text-sm">
            Selecione de 2 a 4 registros clicando nos cards. Os registros 
            selecionados aparecerão destacados e numerados. Clique em 
            &quot;Prosseguir&quot; para ver a comparação detalhada.
          </p>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            🔍 Filtros Disponíveis
          </h2>
          <p className="text-green-800 text-sm">
            Use os filtros para encontrar registros específicos: &quot;Públicas&quot; 
            mostra registros compartilhados, &quot;Minhas&quot; mostra seus registros 
            privados, e &quot;Todas&quot; mostra ambos.
          </p>
        </Card>
      </div>
    </div>
  );
}