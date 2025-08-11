/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";

interface JsonViewerProps {
  data: any;
  title?: string;
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (monsterName: string) => {
    setImageErrors(prev => new Set(prev).add(monsterName));
  };

  // Detecta o tipo de dados
  const dataType = detectDataType(data);

  function detectDataType(data: any): string {
    if (data["Session start"] && data["Killed Monsters"]) return "game-session";
    if (data._metadata?.type) return data._metadata.type;
    return "generic";
  }

  const renderGameSession = () => {
    return (
      <div className="space-y-6">
        {/* Informações da Sessão */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <Typography variant="h4" className="mb-3">
            📊 Informações da Sessão
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Typography variant="small">Início</Typography>
              <Typography variant="p" className="font-medium">
                {data["Session start"]}
              </Typography>
            </div>
            <div>
              <Typography variant="small">Fim</Typography>
              <Typography variant="p" className="font-medium">
                {data["Session end"]}
              </Typography>
            </div>
            <div>
              <Typography variant="small">Duração</Typography>
              <Typography variant="p" className="font-medium">
                {data["Session length"]}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Estatísticas de Combate */}
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <Typography variant="h4" className="mb-3">
            ⚔️ Estatísticas de Combate
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Typography variant="small">Dano Total</Typography>
              <Typography
                variant="p"
                className="text-xl font-bold text-orange-600"
              >
                {data["Damage"]}
              </Typography>
              <Typography variant="caption">({data["Damage/h"]}/h)</Typography>
            </div>
            <div>
              <Typography variant="small">XP Ganho</Typography>
              <Typography
                variant="p"
                className="text-xl font-bold text-purple-600"
              >
                {data["XP Gain"]}
              </Typography>
              <Typography variant="caption">
                ({data["XP/h"] || data["Raw XP/h"]}/h)
              </Typography>
            </div>
            <div>
              <Typography variant="small">Raw XP</Typography>
              <Typography
                variant="p"
                className="text-xl font-bold text-blue-600"
              >
                {data["Raw XP Gain"]}
              </Typography>
              <Typography variant="caption">({data["Raw XP/h"]}/h)</Typography>
            </div>
            <div>
              <Typography variant="small">Suprimentos Gastos</Typography>
              <Typography
                variant="p"
                className="text-xl font-bold text-red-600"
              >
                {data["Supplies"]}
              </Typography>
            </div>
            <div>
              <Typography variant="small">Balance</Typography>
              <Typography
                variant="p"
                className="text-xl font-bold text-green-600"
              >
                {data["Balance"]}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Monstros Eliminados */}
        {data["Killed Monsters"] && data["Killed Monsters"].length > 0 && (
          <Card className="bg-red-50 dark:bg-gray-800">
            <Typography variant="h4" className="mb-3">
              👾 Monstros Eliminados
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data["Killed Monsters"].map((monster: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-red-200 dark:border-red-900"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center justify-start gap-2">
                      {imageErrors.has(monster.Name) ? (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-2xl">
                          ❓
                        </div>
                      ) : (
                        <Image
                          unoptimized
                          src={`https://pdscifxfuisrczpvofat.supabase.co/storage/v1/object/public/imagens-tibia/${monster.Name.toLowerCase().replace(
                            /\s+/g,
                            "_"
                          )}.gif`}
                          alt={monster.Name}
                          className="w-12 h-12 object-contain"
                          width={16}
                          height={16}
                          onError={() => handleImageError(monster.Name)}
                        />
                      )}
                      <Typography variant="p" className="font-medium">
                        {monster.Name.charAt(0).toUpperCase() +
                          monster.Name.slice(1)}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      <Typography
                        variant="p"
                        className="text-2xl font-bold text-red-600 dark:text-red-500"
                      >
                        {monster.Count}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right">
              <Typography variant="small">
                Total de monstros eliminados:
                <span className="font-bold text-lg ml-2 text-red-600 dark:text-red-500">
                  {data["Killed Monsters"].reduce(
                    (sum: number, m: any) => sum + m.Count,
                    0
                  )}
                </span>
              </Typography>
            </div>
          </Card>
        )}

        {/* Itens Coletados */}
        {data["Looted Items"] && data["Looted Items"].length > 0 && (
          <Card className="bg-green-50 dark:bg-gray-800">
            <Typography variant="h4" className="mb-3">
              💎 Itens Coletados
            </Typography>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data["Looted Items"]
                  .sort((a: any, b: any) => b.Count - a.Count)
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 p-2 rounded border border-green-200 dark:border-green-800 flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.Name}
                      </span>
                      <span className="font-bold text-green-600 ml-2">
                        {item.Count}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
              <Typography variant="small">
                Valor total do loot:
                <span className="font-bold text-lg ml-2 text-green-600">
                  {data["Loot"]}
                </span>
              </Typography>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderGenericJson = () => {
    return (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm text-gray-900 dark:text-gray-100">
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center md:justify-between items-center mb-4 gap-4 md:gap-0">
        <Typography variant="h3">{title || "Dados JSON"}</Typography>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("formatted")}
            variant={viewMode === "formatted" ? "primary" : "secondary"}
            size="sm"
          >
            Formatado
          </Button>
          <Button
            onClick={() => setViewMode("raw")}
            variant={viewMode === "raw" ? "primary" : "secondary"}
            size="sm"
          >
            JSON Raw
          </Button>
        </div>
      </div>

      {viewMode === "formatted" && dataType === "game-session"
        ? renderGameSession()
        : renderGenericJson()}
    </div>
  );
}
