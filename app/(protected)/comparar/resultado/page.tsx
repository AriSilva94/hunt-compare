/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { weaponService } from "@/services/weapon.service";
import { WeaponDetails } from "@/types/weapon.types";
import { ComparisonChart } from "@/components/ui/ComparisonChart";
import { WeaponComparison } from "@/components/ui/WeaponComparison";
import { MetricInsights } from "@/components/ui/MetricInsights";
import { RecordLegend } from "@/components/ui/RecordLegend";
import { getRecordPrimaryColor } from "@/utils/recordColors";
import { ComparisonHistoryService } from "@/services/comparison-history.service";
import Link from "next/link";

interface Record {
  id: string;
  user_id: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface MetricFilter {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

interface ChartDataPoint {
  name: string;
  value: number;
  recordId: string;
  formatted?: string;
  fill?: string;
}

type ChartType = "bar" | "pie" | "line";

function parseSessionDuration(sessionLength: string): number {
  if (!sessionLength) return 0;

  const hoursMatch = sessionLength.match(/(\d+)h/);
  const minutesMatch = sessionLength.match(/(\d+)m/);

  let totalHours = 0;
  if (hoursMatch) totalHours += parseInt(hoursMatch[1]);
  if (minutesMatch) totalHours += parseInt(minutesMatch[1]) / 60;

  return totalHours;
}

function generateChartData(
  records: Record[],
  metric: string
): ChartDataPoint[] {
  const chartData = records.map((record, index) => {
    let value = 0;

    switch (metric) {
      case "xp":
        const xpGainValue = record.data["XP Gain"];

        if (xpGainValue !== undefined && xpGainValue !== null) {
          // Se for string, remover caracteres não numéricos
          if (typeof xpGainValue === "string") {
            const cleanValue = xpGainValue.replace(/[^0-9]/g, "");
            value = Number(cleanValue) || 0;
          } else {
            value = Number(xpGainValue) || 0;
          }
        } else {
          value = 0;
        }
        break;
      case "balance":
        // Remover caracteres não numéricos e converter
        const balanceStr = String(record.data["Balance"] || "0");
        value = Number(balanceStr.replace(/[^-0-9]/g, "")) || 0;
        break;
      case "monsters":
        const monsters = record.data["Killed Monsters"];
        if (Array.isArray(monsters)) {
          value = monsters.reduce(
            (sum: number, m: any) => sum + (Number(m.Count) || 0),
            0
          );
        }
        break;
      case "items":
        const items = record.data["Looted Items"];
        if (Array.isArray(items)) {
          value = items.reduce(
            (sum: number, item: any) => sum + (Number(item.Count) || 0),
            0
          );
        }
        break;
      case "xpPerHour":
        // Usar diretamente o campo "XP/h" se existir, senão calcular
        const xpPerHourField = record.data["XP/h"];
        if (xpPerHourField) {
          // Remover "k/h" e outros caracteres, converter
          const xpHourStr = String(xpPerHourField).replace(/[^0-9.]/g, "");
          value = Number(xpHourStr) || 0;
          // Se o valor original tinha "k", multiplicar por 1000
          if (String(xpPerHourField).includes("k")) {
            value = value * 1000;
          }
        } else {
          // Fallback: calcular baseado em XP Gain e duração
          const rawXP = Number(record.data["XP Gain"]) || 0;
          const duration = parseSessionDuration(
            record.data["Session length"] || ""
          );
          value = duration > 0 ? Math.round(rawXP / duration) : 0;
        }
        break;
      case "efficiency":
        const xp = Number(record.data["XP Gain"]) || 0;
        const time = parseSessionDuration(record.data["Session length"] || "");
        const profitRaw = String(record.data["Balance"] || "0");
        const profit = Number(profitRaw.replace(/[^-0-9]/g, "")) || 0;
        // Eficiência baseada em XP/hora + lucro normalizado
        const xpHour = time > 0 ? xp / time : 0;
        const profitHour = time > 0 ? profit / time : 0;
        value = Math.round(xpHour + profitHour * 0.1); // Peso menor para lucro
        break;
      default:
        value = 0;
    }

    return {
      name: getRecordTitle(record),
      value: typeof value === "number" && !isNaN(value) ? value : 0,
      recordId: record.id,
      formatted: value.toLocaleString(),
      fill: getRecordPrimaryColor(index),
    };
  });

  return chartData;
}

function getRecordTitle(record: Record): string {
  return (
    record.data._metadata?.title ||
    `Sessão de ${record.data["Session start"]}` ||
    "Registro"
  );
}

const AVAILABLE_METRICS: MetricFilter[] = [
  { id: "xp", label: "XP Ganho", icon: "⭐", active: true },
  { id: "xpPerHour", label: "XP/Hora", icon: "📈", active: true },
  { id: "balance", label: "Lucro/Prejuízo", icon: "💰", active: true },
  { id: "monsters", label: "Monstros Mortos", icon: "👾", active: false },
  { id: "items", label: "Itens Coletados", icon: "💎", active: false },
  { id: "efficiency", label: "Eficiência Geral", icon: "🚀", active: false },
];

const CHART_COLORS = {
  xp: "#3B82F6",
  xpPerHour: "#10B981",
  balance: "#F59E0B",
  monsters: "#EF4444",
  items: "#8B5CF6",
  efficiency: "#06B6D4",
};

export default function ResultadoComparacaoPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [weapons, setWeapons] = useState<WeaponDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetrics, setActiveMetrics] =
    useState<MetricFilter[]>(AVAILABLE_METRICS);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const searchParams = useSearchParams();
  const router = useRouter();

  const loadRecords = useCallback(async () => {
    const ids = searchParams.get("ids");
    if (!ids) {
      setError("Nenhum registro especificado para comparação");
      setLoading(false);
      return;
    }

    const recordIds = ids.split(",");
    if (recordIds.length < 2) {
      setError(
        "É necessário selecionar pelo menos 2 registros para comparação"
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: fetchedRecords, error: fetchError } = await supabase
        .from("records")
        .select("*")
        .in("id", recordIds);

      if (fetchError) throw fetchError;

      if (!fetchedRecords || fetchedRecords.length === 0) {
        setError("Nenhum registro encontrado");
        setLoading(false);
        return;
      }

      // Verificar permissões - usuário pode ver registros públicos ou seus próprios
      const allowedRecords = fetchedRecords.filter(
        (record) => record.is_public || (user && record.user_id === user.id)
      );

      // Verificar se alguns registros ficaram inacessíveis
      const inaccessibleCount = fetchedRecords.length - allowedRecords.length;
      if (inaccessibleCount > 0) {
        console.warn(
          `${inaccessibleCount} registro(s) tornaram-se inacessíveis`
        );
      }

      if (allowedRecords.length < 2) {
        setError(
          `Você não tem permissão para visualizar registros suficientes para comparação. ${
            inaccessibleCount > 0
              ? `${inaccessibleCount} registro(s) podem ter sido tornados privados.`
              : ""
          }`
        );
        setLoading(false);
        return;
      }

      // Se alguns registros ficaram inacessíveis mas ainda temos o suficiente para comparação
      if (inaccessibleCount > 0 && allowedRecords.length >= 2) {
        // Atualizar a URL com apenas os registros válidos
        const validIds = allowedRecords.map((r) => r.id);
        const newUrl = `/comparar/resultado?ids=${validIds.join(",")}`;
        if (window.location.pathname + window.location.search !== newUrl) {
          window.history.replaceState({}, "", newUrl);
        }
      }

      // Ordenar na mesma ordem dos IDs fornecidos
      const orderedRecords = recordIds
        .map((id) => allowedRecords.find((record) => record.id === id))
        .filter(Boolean) as Record[];

      setRecords(orderedRecords);

      // Salvar no histórico com os nomes dos registros
      const recordNames = orderedRecords.map((record) =>
        getRecordTitle(record)
      );
      ComparisonHistoryService.addComparison(recordIds, recordNames);

      // Carregar informações das armas
      await loadWeaponDetails(orderedRecords);
    } catch (err) {
      console.error("Erro ao carregar registros:", err);
      setError("Erro ao carregar dados para comparação");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const loadWeaponDetails = async (records: Record[]) => {
    const weaponDetails: WeaponDetails[] = [];

    for (const record of records) {
      if (record.data.weaponDetail?.id) {
        try {
          const weapon = await weaponService.getWeaponById(
            Number(record.data.weaponDetail.id)
          );
          if (weapon) {
            weaponDetails.push(weapon);
          } else {
            weaponDetails.push(null as any);
          }
        } catch {
          weaponDetails.push(null as any);
        }
      } else {
        weaponDetails.push(null as any);
      }
    }

    setWeapons(weaponDetails);
  };

  const toggleMetric = (metricId: string) => {
    setActiveMetrics((prev) =>
      prev.map((metric) =>
        metric.id === metricId ? { ...metric, active: !metric.active } : metric
      )
    );
  };

  const getValueFormatter = (metricId: string) => {
    switch (metricId) {
      case "balance":
        return (value: number) =>
          `${value >= 0 ? "+" : ""}${value.toLocaleString()} gp`;
      case "xp":
      case "xpPerHour":
        return (value: number) =>
          `${value.toLocaleString()} XP${metricId === "xpPerHour" ? "/h" : ""}`;
      case "monsters":
        return (value: number) => `${value.toLocaleString()} monstros`;
      case "items":
        return (value: number) => `${value.toLocaleString()} itens`;
      case "efficiency":
        return (value: number) => `${value.toLocaleString()} pts`;
      default:
        return (value: number) => value.toLocaleString();
    }
  };

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <Typography variant="p" className="mt-4">
            Carregando comparação...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <span className="text-6xl mb-4 block">⚠️</span>
          <Typography variant="p" className="text-red-600 font-medium mb-4">
            {error}
          </Typography>
          <Link
            href="/comparar"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar para seleção
          </Link>
        </Card>
      </div>
    );
  }

  const weaponInfo = records.map((record, index) => ({
    recordId: record.id,
    recordName: getRecordTitle(record),
    weaponDetail: weapons[index],
    hasWeapon: !!record.data.weaponDetail?.id,
    selectedProficiencies: record.data.weaponDetail?.proficiencies,
  }));

  const activeCharts = activeMetrics.filter((m) => m.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/comparar"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar
          </Link>
          <Typography variant="h1">Comparação Detalhada</Typography>
        </div>
        <Typography variant="lead">
          Análise comparativa de {records.length} registros selecionados
        </Typography>
      </div>

      {/* Legenda de cores */}
      <RecordLegend records={records} getRecordTitle={getRecordTitle} />

      {/* Controles de filtros */}
      <div className="mb-8">
        <Card>
          <div className="mb-4">
            <Typography variant="h3" className="mb-2">
              🎛️ Filtros de Análise
            </Typography>
            <Typography variant="small">
              Selecione as métricas que deseja visualizar nos gráficos
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {activeMetrics.map((metric) => (
              <Button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                variant={metric.active ? "primary" : "secondary"}
                size="sm"
              >
                <span className="mr-1">{metric.icon}</span>
                {metric.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Typography variant="small" className="mr-2">
              Tipo de gráfico:
            </Typography>
            {(["bar", "line", "pie"] as ChartType[]).map((type) => (
              <Button
                key={type}
                onClick={() => setChartType(type)}
                variant={chartType === type ? "primary" : "secondary"}
                size="sm"
              >
                {type === "bar" ? "📊" : type === "line" ? "📈" : "🥧"}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Comparação de armas */}
      <div className="mb-8">
        <WeaponComparison weapons={weaponInfo} />
      </div>

      {/* Gráficos de comparação */}
      <div className="space-y-6">
        {activeCharts.map((metric) => {
          const chartData = generateChartData(records, metric.id);

          return (
            <ComparisonChart
              key={metric.id}
              data={chartData}
              title={`${metric.icon} ${metric.label}`}
              type={chartType}
              color={CHART_COLORS[metric.id as keyof typeof CHART_COLORS]}
              height={350}
              valueFormatter={getValueFormatter(metric.id)}
              useRecordColors={true}
            />
          );
        })}
      </div>

      {/* Insights automáticos */}
      <div className="mt-12">
        <MetricInsights records={records} />
      </div>

      {/* Ações */}
      <div className="mt-8 flex gap-4">
        <Button onClick={() => router.back()} variant="secondary">
          Voltar
        </Button>
        <Link
          href="/comparar"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nova Comparação
        </Link>
      </div>
    </div>
  );
}
