/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { WeaponDetails } from "@/types/weapon.types";
import { useCharacters } from "@/hooks/useCharacters";
import { SavedCharacter } from "@/types/character.types";

interface RecordEditorProps {
  record: {
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
  };
  weaponDetail: WeaponDetails | null;
  selectedPerks: { [level: number]: number | null };
  onSave: (updatedData: {
    is_public?: boolean;
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
  const [selectedPerks, setSelectedPerks] = useState(initialSelectedPerks);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    record.character_id
  );
  const [isSaving, setIsSaving] = useState(false);

  const { characters, loading: charactersLoading } = useCharacters();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {};

      // Verificar se houve mudança na visibilidade
      if (isPublic !== record.is_public) {
        updateData.is_public = isPublic;
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
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-4">
        {/* Seleção de Personagem */}
        <div className="p-4 bg-white rounded-lg border">
          <Typography variant="h4" className="mb-3 dark:text-gray-900">
            👤 Personagem do Registro
          </Typography>

          {charactersLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ) : characters.length > 0 ? (
            <>
              <div className="mb-3">
                <select
                  value={selectedCharacterId || ""}
                  onChange={(e) =>
                    setSelectedCharacterId(e.target.value || null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  <option value="">Nenhum personagem selecionado</option>
                  {characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name} - {character.vocation} (Lv.{" "}
                      {character.level}) - {character.world}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview do personagem selecionado */}
              {selectedCharacterId &&
                (() => {
                  const character = characters.find(
                    (c) => c.id === selectedCharacterId
                  );
                  return character ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            character.vocation.toLowerCase().includes("druid")
                              ? "bg-green-500"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("knight")
                              ? "bg-red-500"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("paladin")
                              ? "bg-yellow-500"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("sorcerer")
                              ? "bg-blue-500"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("monk")
                              ? "bg-orange-500"
                              : "bg-gray-500"
                          } flex items-center justify-center`}
                        >
                          <span className="text-sm text-white">
                            {character.vocation.toLowerCase().includes("druid")
                              ? "🍃"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("knight")
                              ? "⚔️"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("paladin")
                              ? "🏹"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("sorcerer")
                              ? "🔥"
                              : character.vocation
                                  .toLowerCase()
                                  .includes("monk")
                              ? "🥋"
                              : "👤"}
                          </span>
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            className="font-semibold dark:text-white"
                          >
                            {character.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500 dark:text-white"
                          >
                            {" "}
                            {character.vocation} • Lv. {character.level} •{" "}
                            {character.world}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

              {selectedCharacterId !== record.character_id && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <strong className="text-blue-800">ℹ️ Info:</strong>
                  <span className="text-blue-700 ml-1">
                    O personagem associado a este registro será alterado.
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <Typography variant="small" className="text-yellow-700">
                ⚠️ Você não tem personagens cadastrados. Vá para a página
                inicial para adicionar um personagem.
              </Typography>
            </div>
          )}
        </div>

        {/* Toggle de Visibilidade */}
        <div className="p-4 bg-white rounded-lg border">
          <Typography variant="h4" className="mb-3 dark:text-gray-900">
            🔒 Visibilidade
          </Typography>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="w-4 h-4 text-blue-600"
              />
              <Typography variant="small">
                <span className="font-medium">Privado</span>
                <span className="text-gray-600 ml-1">
                  - Apenas você pode ver
                </span>
              </Typography>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="w-4 h-4 text-blue-600"
              />
              <Typography variant="small">
                <span className="font-medium">Público</span>
                <span className="text-gray-600 ml-1">
                  - Qualquer pessoa pode ver
                </span>
              </Typography>
            </label>
          </div>

          {isPublic !== record.is_public && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong className="text-yellow-800">⚠️ Atenção:</strong>
              <span className="text-yellow-700 ml-1">
                {isPublic
                  ? "Este registro ficará visível publicamente e poderá ser usado em comparações por outros usuários."
                  : "Este registro ficará privado e será removido automaticamente de comparações públicas existentes."}
              </span>
            </div>
          )}
        </div>

        {/* Proficiências da Arma */}
        {weaponDetail && (
          <div className="p-4 bg-white rounded-lg border">
            <Typography variant="h4" className="mb-3 dark:text-gray-900">
              ⚔️ Proficiências da Arma
            </Typography>
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <Typography variant="h4" className="dark:text-gray-900">
                  {weaponDetail.name}
                </Typography>
                <Typography variant="small">
                  Ajuste as proficiências selecionadas
                </Typography>
              </div>
              <ProficiencyTable
                proficiencies={weaponDetail.proficiencies}
                selectedPerks={selectedPerks}
                onPerkChange={handlePerkChange}
                isDisabled={false}
              />
            </div>

            {JSON.stringify(selectedPerks) !==
              JSON.stringify(initialSelectedPerks) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <strong className="text-blue-800">ℹ️ Info:</strong>
                <span className="text-blue-700 ml-1">
                  As proficiências selecionadas foram alteradas e afetarão os
                  cálculos nas comparações.
                </span>
              </div>
            )}
          </div>
        )}

        {!weaponDetail && record.data.weaponDetail && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <Typography variant="small">
              ⚠️ Não foi possível carregar os detalhes da arma para edição das
              proficiências.
            </Typography>
          </div>
        )}
      </div>
    </Card>
  );
}
