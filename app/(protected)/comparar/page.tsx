/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ComparisonHistory } from "@/components/ui/ComparisonHistory";
import { ComparisonHistoryService } from "@/services/comparison-history.service";
import { formatDateOnly } from "@/utils/date";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  character_id: string | null;
  character?: {
    id: string;
    name: string;
    level: number;
    vocation: string;
    world: string;
    sex: string;
  } | null;
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

// Helper functions para personagem
const getVocationIcon = (vocation: string): string => {
  if (vocation.toLowerCase().includes('druid')) return '🍃'
  if (vocation.toLowerCase().includes('knight')) return '⚔️'
  if (vocation.toLowerCase().includes('paladin')) return '🏹'
  if (vocation.toLowerCase().includes('sorcerer')) return '🔥'
  if (vocation.toLowerCase().includes('monk')) return '🥋'
  return '👤'
}

const getVocationColor = (vocation: string): string => {
  if (vocation.toLowerCase().includes('druid')) return 'bg-green-500'
  if (vocation.toLowerCase().includes('knight')) return 'bg-red-500'
  if (vocation.toLowerCase().includes('paladin')) return 'bg-yellow-500'
  if (vocation.toLowerCase().includes('sorcerer')) return 'bg-blue-500'
  if (vocation.toLowerCase().includes('monk')) return 'bg-orange-500'
  return 'bg-gray-500'
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    try {
      // Buscar registros públicos
      const { data: publicRecords } = await supabase
        .from("records")
        .select(`
          *,
          character:characters(
            id,
            name,
            level,
            vocation,
            world,
            sex
          )
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      let allRecords = publicRecords || [];

      // Se usuário logado, buscar também seus registros privados
      if (user) {
        const { data: userRecords } = await supabase
          .from("records")
          .select(`
            *,
            character:characters(
              id,
              name,
              level,
              vocation,
              world,
              sex
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (userRecords) {
          // Evitar duplicatas (registros públicos do próprio usuário)
          const uniqueUserRecords = userRecords.filter(
            (userRecord) =>
              !allRecords.some((record) => record.id === userRecord.id)
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
      } else if (prev.length < 4) {
        // Máximo 4 registros para comparação
        return [...prev, recordId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedRecords.length >= 2) {
      // Obter nomes dos registros selecionados para salvar no histórico
      const recordNames = selectedRecords.map((recordId) => {
        const record = records.find((r) => r.id === recordId);
        if (record) {
          const preview = getRecordPreview(record.data);
          return preview.title;
        }
        return "Registro";
      });

      // Salvar no histórico
      ComparisonHistoryService.addComparison(selectedRecords, recordNames);

      const compareParams = selectedRecords.join(",");
      router.push(`/comparar/resultado?ids=${compareParams}`);
    }
  };

  const handleSelectFromHistory = (recordIds: string[]) => {
    setSelectedRecords(recordIds);
  };

  const getFilterStats = () => {
    const publicCount = records.filter((r) => r.is_public).length;
    const myCount = user
      ? records.filter((r) => r.user_id === user.id).length
      : 0;

    return { publicCount, myCount, totalCount: records.length };
  };

  const stats = getFilterStats();

  if (loading) {
    return <PageSkeleton showStats={false} recordCount={9} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Typography variant="h1">Comparar Registros</Typography>
        <Typography variant="lead" className="mt-2">
          Selecione registros para comparar e analisar as diferenças
        </Typography>
      </div>

      {/* Histórico de Comparações */}
      <ComparisonHistory onSelectComparison={handleSelectFromHistory} />

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setFilter("todas")}
            variant={filter === "todas" ? "primary" : "secondary"}
          >
            Todas ({stats.totalCount})
          </Button>
          <Button
            onClick={() => setFilter("publicas")}
            variant={filter === "publicas" ? "primary" : "secondary"}
          >
            Públicas ({stats.publicCount})
          </Button>
          {user && (
            <Button
              onClick={() => setFilter("minhas")}
              variant={filter === "minhas" ? "primary" : "secondary"}
            >
              Minhas ({stats.myCount})
            </Button>
          )}
        </div>
      </div>

      {/* Barra de seleção */}
      {selectedRecords.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border dark:bg-blue-900 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="p" className="text-blue-900 font-medium">
                {selectedRecords.length} registro(s) selecionado(s)
              </Typography>
              <Typography variant="small" className="text-blue-700">
                {selectedRecords.length >= 2
                  ? "Clique em prosseguir para comparar"
                  : `Selecione mais ${
                      2 - selectedRecords.length
                    } registro(s) para comparar`}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedRecords([])}
                variant="secondary"
                size="sm"
              >
                Limpar
              </Button>
              <Button
                onClick={handleCompare}
                disabled={selectedRecords.length < 2}
                variant="primary"
              >
                Prosseguir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de registros */}
      {filteredRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <Typography variant="p">
              Nenhum registro encontrado para o filtro selecionado.
            </Typography>
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
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Avatar compacto do personagem */}
                        {record.character ? (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full ${getVocationColor(record.character.vocation)} flex items-center justify-center shadow-sm`}>
                              <span className="text-sm text-white" role="img" aria-label={record.character.vocation}>
                                {getVocationIcon(record.character.vocation)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-600 dark:text-gray-400">❓</span>
                          </div>
                        )}
                        
                        <Typography variant="h4" className="line-clamp-1 flex-1 min-w-0">
                          {preview.title}
                        </Typography>
                      </div>
                      
                      {preview.type === "game-session" && (
                        <span className="ml-2 text-2xl flex-shrink-0">🎮</span>
                      )}
                    </div>
                    
                    {/* Informação compacta do personagem - sempre presente para layout consistente */}
                    <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        {record.character ? (
                          <>
                            <span>👤 {record.character.name}</span>
                            <div className="flex items-center gap-2">
                              <span>{record.character.vocation}</span>
                              <span>•</span>
                              <span>Lv. {record.character.level}</span>
                              <span>•</span>
                              <span>{record.character.world}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span>👤 Personagem não informado</span>
                            <div className="flex items-center gap-2">
                              <span>—</span>
                            </div>
                          </>
                        )}
                      </div>
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
                          className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center"
                        >
                          <span className="text-lg mr-1">{highlight.icon}</span>
                          <Typography variant="caption">
                            {highlight.label}
                          </Typography>
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
                    <span
                      className={`font-medium ${
                        isSelected ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
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
          <Typography variant="h3" className="text-blue-900 mb-2">
            📊 Como Comparar
          </Typography>
          <Typography variant="small" className="text-blue-800">
            Selecione de 2 a 4 registros clicando nos cards. Os registros
            selecionados aparecerão destacados e numerados. Clique em
            &quot;Prosseguir&quot; para ver a comparação detalhada.
          </Typography>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <Typography variant="h3" className="text-green-900 mb-2">
            🔍 Filtros Disponíveis
          </Typography>
          <Typography variant="small" className="text-green-800">
            Use os filtros para encontrar registros específicos:
            &quot;Públicas&quot; mostra registros compartilhados,
            &quot;Minhas&quot; mostra seus registros privados, e
            &quot;Todas&quot; mostra ambos.
          </Typography>
        </Card>
      </div>
    </div>
  );
}
