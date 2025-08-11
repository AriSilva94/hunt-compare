/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { WeaponDetails } from "@/types/weapon.types";
import { useCharacters } from "@/hooks/useCharacters";
import { BookOpen } from "lucide-react";

interface RecordEditorProps {
  record: {
    id: string;
    user_id: string;
    data: any;
    is_public: boolean;
    has_bestiary: boolean;
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
  };
  weaponDetail: WeaponDetails | null;
  selectedPerks: { [level: number]: number | null };
  onSave: (updatedData: {
    is_public?: boolean;
    has_bestiary?: boolean;
    data?: any;
    character_id?: string | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export function RecordEditor({
  record,
  weaponDetail,
  selectedPerks: initialSelectedPerks,
  onSave,
  onCancel,
}: RecordEditorProps) {
  const [isPublic, setIsPublic] = useState(record.is_public);
  const [hasBestiary, setHasBestiary] = useState(record.has_bestiary);
  const [selectedPerks, setSelectedPerks] = useState(initialSelectedPerks);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    record.character_id
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  const { characters, loading: charactersLoading } = useCharacters();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {};

      // Verificar se houve mudança na visibilidade
      if (isPublic !== record.is_public) {
        updateData.is_public = isPublic;
      }

      // Verificar se houve mudança no bestiário
      if (hasBestiary !== record.has_bestiary) {
        updateData.has_bestiary = hasBestiary;
      }

      // Verificar se houve mudança no personagem
      if (selectedCharacterId !== record.character_id) {
        updateData.character_id = selectedCharacterId;
      }

      // Verificar se houve mudança nas proficiências
      const originalPerks = record.data.weaponDetail?.proficiencies || {};
      const hasPerksChanged =
        JSON.stringify(originalPerks) !== JSON.stringify(selectedPerks);

      if (hasPerksChanged && weaponDetail) {
        const updatedData = {
          ...record.data,
          weaponDetail: {
            ...record.data.weaponDetail,
            proficiencies: selectedPerks,
          },
        };
        updateData.data = updatedData;
      }

      if (Object.keys(updateData).length > 0) {
        await onSave(updateData);
      } else {
        onCancel(); // Nenhuma mudança, apenas cancela
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePerkChange = (
    level: number,
    selectedProficiency: number | null
  ) => {
    setSelectedPerks((prev) => ({
      ...prev,
      [level]: selectedProficiency,
    }));
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <Typography variant="h4" className="text-blue-900">
          ✏️ Editando Registro
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="mb-3">
        <div className="flex border-b border-blue-200">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "basic"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            📝 Básico
          </button>
          {weaponDetail && (
            <button
              onClick={() => setActiveTab("advanced")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "advanced"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              ⚔️ Proficiências
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "basic" ? (
        <div className="space-y-3">
          {/* Grid Layout para desktop - 3 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Seleção de Personagem - Compacto */}
            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border">
              <Typography
                variant="small"
                className="font-medium mb-2 dark:text-white flex items-center gap-2"
              >
                👤 Personagem
              </Typography>

              {charactersLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ) : characters.length > 0 ? (
                <>
                  <select
                    value={selectedCharacterId || ""}
                    onChange={(e) =>
                      setSelectedCharacterId(e.target.value || null)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSaving}
                  >
                    <option value="">Selecionar personagem</option>
                    {characters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name} ({character.level})
                      </option>
                    ))}
                  </select>

                  {/* Preview compacto */}
                  {selectedCharacterId &&
                    (() => {
                      const character = characters.find(
                        (c) => c.id === selectedCharacterId
                      );
                      return character ? (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded border text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs">
                              👤
                            </div>
                            <div>
                              <div className="font-medium">
                                {character.name}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {character.vocation} Lv.{character.level} •{" "}
                                {character.world}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}

                  {selectedCharacterId !== record.character_id && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <span className="text-blue-800 font-medium">ℹ️</span>
                      <span className="text-blue-700 ml-1">
                        Personagem será alterado
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <span className="text-yellow-700">
                    ⚠️ Nenhum personagem cadastrado
                  </span>
                </div>
              )}
            </div>

            {/* Toggle de Bestiário - Compacto */}
            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border">
              <Typography
                variant="small"
                className="font-medium mb-2 dark:text-white flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4 text-amber-600" />
                Bestiário
              </Typography>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bestiary"
                    checked={!hasBestiary}
                    onChange={() => setHasBestiary(false)}
                    className="w-3 h-3 text-blue-600"
                  />
                  <Typography variant="caption">
                    <span className="font-medium">Sem bestiário</span>
                    <span className="text-gray-500 ml-1 text-xs">
                      - Dados normais
                    </span>
                  </Typography>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bestiary"
                    checked={hasBestiary}
                    onChange={() => setHasBestiary(true)}
                    className="w-3 h-3 text-blue-600"
                  />
                  <Typography variant="caption">
                    <span className="font-medium">Com bestiário</span>
                    <span className="text-gray-500 ml-1 text-xs">
                      - Dados incluem bestiário
                    </span>
                  </Typography>
                </label>
              </div>

              {hasBestiary !== record.has_bestiary && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                  <span className="text-amber-800 font-medium">📖</span>
                  <span className="text-amber-700 ml-1">
                    {hasBestiary ? "Com bestiário" : "Sem bestiário"}
                  </span>
                </div>
              )}
            </div>

            {/* Toggle de Visibilidade - Compacto */}
            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border">
              <Typography
                variant="small"
                className="font-medium mb-2 dark:text-white flex items-center gap-2"
              >
                🔒 Visibilidade
              </Typography>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="w-3 h-3 text-blue-600"
                  />
                  <Typography variant="caption">
                    <span className="font-medium">Privado</span>
                    <span className="text-gray-500 ml-1 text-xs">
                      - Apenas você
                    </span>
                  </Typography>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="w-3 h-3 text-blue-600"
                  />
                  <Typography variant="caption">
                    <span className="font-medium">Público</span>
                    <span className="text-gray-500 ml-1 text-xs">
                      - Todos podem ver
                    </span>
                  </Typography>
                </label>
              </div>

              {isPublic !== record.is_public && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <span className="text-yellow-800 font-medium">⚠️</span>
                  <span className="text-yellow-700 ml-1">
                    {isPublic ? "Ficará público" : "Ficará privado"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Aba Avançado - Proficiências */
        <div className="space-y-3">
          {weaponDetail ? (
            <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border">
              <div className="text-center mb-3">
                <Typography
                  variant="p"
                  className="font-medium dark:text-gray-900"
                >
                  {weaponDetail.name}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Ajuste as proficiências selecionadas
                </Typography>
              </div>

              <ProficiencyTable
                proficiencies={weaponDetail.proficiencies}
                selectedPerks={selectedPerks}
                onPerkChange={handlePerkChange}
                isDisabled={false}
              />

              {JSON.stringify(selectedPerks) !==
                JSON.stringify(initialSelectedPerks) && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <span className="text-blue-800 font-medium">ℹ️</span>
                  <span className="text-blue-700 ml-1">
                    Proficiências alteradas
                  </span>
                </div>
              )}
            </div>
          ) : record.data.weaponDetail ? (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <Typography variant="small">
                ⚠️ Não foi possível carregar os detalhes da arma
              </Typography>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border text-center">
              <Typography variant="small" className="text-gray-600">
                Este registro não possui proficiências de arma
              </Typography>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
