/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

interface JsonViewerProps {
  data: any;
  title?: string;
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

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
        <Card className="bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">
            📊 Informações da Sessão
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Início</p>
              <p className="font-medium">{data["Session start"]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fim</p>
              <p className="font-medium">{data["Session end"]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duração</p>
              <p className="font-medium">{data["Session length"]}</p>
            </div>
          </div>
        </Card>

        {/* Estatísticas de Combate */}
        <Card className="bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">
            ⚔️ Estatísticas de Combate
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-gray-600">Dano Total</p>
              <p className="text-xl font-bold text-orange-600">
                {data["Damage"]}
              </p>
              <p className="text-xs text-gray-500">({data["Damage/h"]}/h)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cura Total</p>
              <p className="text-xl font-bold text-blue-600">
                {data["Healing"]}
              </p>
              <p className="text-xs text-gray-500">({data["Healing/h"]}/h)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Raw XP</p>
              <p className="text-xl font-bold text-purple-600">
                {data["Raw XP Gain"]}
              </p>
              <p className="text-xs text-gray-500">({data["Raw XP/h"]}/h)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Suprimentos Gastos</p>
              <p className="text-xl font-bold text-red-600">
                {data["Supplies"]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balanço</p>
              <p className="text-xl font-bold text-green-600">
                {data["Balance"]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loot</p>
              <p className="text-xl font-bold text-green-800">{data["Loot"]}</p>
            </div>
          </div>
        </Card>

        {/* Monstros Eliminados */}
        {data["Killed Monsters"] && data["Killed Monsters"].length > 0 && (
          <Card className="bg-red-50">
            <h3 className="text-lg font-semibold mb-3">
              👾 Monstros Eliminados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data["Killed Monsters"].map((monster: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-red-200"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center justify-start gap-2">
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
                      />
                      <p className="font-medium text-gray-900">
                        {monster.Name.charAt(0).toUpperCase() +
                          monster.Name.slice(1)}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <p className="text-2xl font-bold text-red-600">
                        {monster.Count}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right">
              <p className="text-sm text-gray-600">
                Total de monstros eliminados:
                <span className="font-bold text-lg ml-2">
                  {data["Killed Monsters"].reduce(
                    (sum: number, m: any) => sum + m.Count,
                    0
                  )}
                </span>
              </p>
            </div>
          </Card>
        )}

        {/* Itens Coletados */}
        {data["Looted Items"] && data["Looted Items"].length > 0 && (
          <Card className="bg-green-50">
            <h3 className="text-lg font-semibold mb-3">💎 Itens Coletados</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data["Looted Items"]
                  .sort((a: any, b: any) => b.Count - a.Count)
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded border border-green-200 flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-700">{item.Name}</span>
                      <span className="font-bold text-green-600 ml-2">
                        {item.Count}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-gray-600">
                Valor total do loot:
                <span className="font-bold text-lg ml-2 text-green-600">
                  {data["Loot"]}
                </span>
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderGenericJson = () => {
    return (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title || "Dados JSON"}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("formatted")}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === "formatted"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Formatado
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === "raw"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            JSON Raw
          </button>
        </div>
      </div>

      {viewMode === "formatted" && dataType === "game-session"
        ? renderGameSession()
        : renderGenericJson()}
    </div>
  );
}
