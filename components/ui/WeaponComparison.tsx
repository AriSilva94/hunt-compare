"use client";

import { WeaponDetails } from "@/types/weapon.types";
import { getRecordColor } from "@/utils/recordColors";
import { ProficiencyIcon } from "@/components/ui/ProficiencyIcon";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";

interface WeaponInfo {
  recordId: string;
  recordName: string;
  weaponDetail: WeaponDetails | null;
  hasWeapon: boolean;
  selectedProficiencies?: Record<string, number>;
}

interface WeaponComparisonProps {
  weapons: WeaponInfo[];
}

export function WeaponComparison({ weapons }: WeaponComparisonProps) {
  // Função para analisar diferenças nas proficiências
  const analyzeProficiencyDifferences = () => {
    const weaponsWithProficiencies = weapons.filter(
      (w) => w.hasWeapon && w.weaponDetail?.proficiencies
    );
    if (weaponsWithProficiencies.length < 2) return {};

    const levelDifferences: Record<string, boolean> = {};

    // Obter todos os níveis únicos
    const allLevels = new Set<number>();
    weaponsWithProficiencies.forEach((weapon) => {
      if (weapon.weaponDetail?.proficiencies) {
        weapon.weaponDetail.proficiencies.forEach((prof) => {
          allLevels.add(prof.level);
        });
      }
    });

    // Para cada nível, verificar se há diferenças nas seleções
    allLevels.forEach((level) => {
      const selections = weaponsWithProficiencies.map((weapon) =>
        weapon.selectedProficiencies
          ? weapon.selectedProficiencies[level.toString()]
          : null
      );

      // Verificar se há diferenças (excluindo null/undefined)
      const validSelections = selections.filter(
        (s) => s !== null && s !== undefined
      );
      const hasConflict =
        validSelections.length > 1 && new Set(validSelections).size > 1;

      levelDifferences[level.toString()] = hasConflict;
    });

    return levelDifferences;
  };

  const proficiencyDifferences = analyzeProficiencyDifferences();

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <Typography variant="h4" className="mb-4 flex items-center gap-2">
        ⚔️ Comparação de Armas
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {weapons.map((weapon, index) => {
          const recordColor = getRecordColor(index);

          return (
            <div
              key={weapon.recordId}
              className="border-2 rounded-lg p-4 relative"
              style={{
                backgroundColor: recordColor.light,
                borderColor: recordColor.primary,
              }}
            >
              {/* Barra lateral colorida */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: recordColor.primary }}
              />

              <div className="pl-2">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{
                      backgroundColor: recordColor.primary,
                      borderColor: recordColor.dark,
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <Typography variant="h4" className="truncate">
                    {weapon.recordName}
                  </Typography>
                </div>

                {weapon.hasWeapon && weapon.weaponDetail ? (
                  <div className="space-y-3">
                    {/* Imagem da arma */}
                    <div className="flex justify-center">
                      <Image
                        unoptimized
                        src={`https://pdscifxfuisrczpvofat.supabase.co/storage/v1/object/public/weapon-proficiency/${weapon.weaponDetail.slug}.gif`}
                        alt={weapon.weaponDetail.name}
                        width={32}
                        height={32}
                        className="pixelated"
                      />
                    </div>

                    {/* Nome da arma */}
                    <div className="text-center">
                      <Typography variant="p" className="font-semibold">
                        {weapon.weaponDetail.name}
                      </Typography>
                      <Typography variant="caption">
                        {weapon.weaponDetail.vocation || "Todas as vocações"}
                      </Typography>
                    </div>

                    {/* Proficiências */}
                    {weapon.weaponDetail.proficiencies &&
                      weapon.weaponDetail.proficiencies.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <Typography variant="caption" className="font-medium">
                              Árvore de Habilidades:
                            </Typography>
                            {/* Indicador de diferenças não visíveis */}
                            {(() => {
                              const levels = Object.keys(
                                weapon.weaponDetail.proficiencies.reduce(
                                  (acc, prof) => {
                                    if (!acc[prof.level]) acc[prof.level] = [];
                                    acc[prof.level].push(prof);
                                    return acc;
                                  },
                                  {} as Record<
                                    number,
                                    typeof weapon.weaponDetail.proficiencies
                                  >
                                )
                              ).sort((a, b) => Number(a) - Number(b));

                              const hiddenLevels = levels.slice(2);
                              const hasHiddenConflicts = hiddenLevels.some(
                                (level) => proficiencyDifferences[level]
                              );

                              return (
                                hasHiddenConflicts && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-orange-500 text-xs">
                                      ⚠️
                                    </span>
                                    <Typography variant="caption" className="text-orange-600 font-medium">
                                      Diferenças abaixo
                                    </Typography>
                                  </div>
                                )
                              );
                            })()}
                          </div>
                          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {/* Agrupar proficiências por nível */}
                            {Object.entries(
                              weapon.weaponDetail.proficiencies.reduce(
                                (acc, prof) => {
                                  if (!acc[prof.level]) acc[prof.level] = [];
                                  acc[prof.level].push(prof);
                                  return acc;
                                },
                                {} as Record<
                                  number,
                                  typeof weapon.weaponDetail.proficiencies
                                >
                              )
                            ).map(([level, proficienciesForLevel]) => {
                              // Verificar se este nível foi selecionado pelo usuário
                              const selectedOptionIndex =
                                weapon.selectedProficiencies
                                  ? weapon.selectedProficiencies[level]
                                  : null;

                              const hasConflict = proficiencyDifferences[level];

                              return (
                                <div
                                  key={level}
                                  className={`p-2 rounded-lg relative z-0 border-2 ${
                                    hasConflict
                                      ? "bg-orange-50 border-orange-300"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span
                                      className={`text-sm font-semibold px-2 py-1 rounded flex items-center gap-1 ${
                                        hasConflict
                                          ? "text-orange-800 bg-orange-100"
                                          : "text-gray-800 bg-gray-100"
                                      }`}
                                    >
                                      {hasConflict && (
                                        <span className="text-orange-600">
                                          ⚠️
                                        </span>
                                      )}
                                      Nível {level}
                                      {hasConflict && (
                                        <Typography variant="caption" className="text-orange-600 ml-1">
                                          (Diferente)
                                        </Typography>
                                      )}
                                    </span>
                                  </div>

                                  {/* Opções de proficiência com imagens */}
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {proficienciesForLevel.map(
                                      (prof, optionIndex) => {
                                        const isSelected =
                                          selectedOptionIndex === optionIndex;

                                        return (
                                          <div
                                            key={optionIndex}
                                            className={`p-2 rounded-lg border-2 transition-all flex-shrink-0 min-w-fit ${
                                              isSelected
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 bg-gray-100 opacity-70"
                                            }`}
                                          >
                                            {prof.icons &&
                                            Array.isArray(prof.icons) &&
                                            prof.icons.length >= 2 ? (
                                              <ProficiencyIcon
                                                icons={prof.icons}
                                                isSelected={isSelected}
                                                description={prof.description}
                                              />
                                            ) : (
                                              <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                                                <Typography variant="caption">
                                                  📝
                                                </Typography>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>

                                  {/* Se não há proficiências com ícones, mostrar apenas a descrição */}
                                  {proficienciesForLevel.length === 0 && (
                                    <div className="text-center p-4">
                                      <Typography variant="small">📝 Nenhuma opção disponível</Typography>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Indicador de scroll adicional */}
                          {(() => {
                            const levels = Object.keys(
                              weapon.weaponDetail.proficiencies.reduce(
                                (acc, prof) => {
                                  if (!acc[prof.level]) acc[prof.level] = [];
                                  acc[prof.level].push(prof);
                                  return acc;
                                },
                                {} as Record<
                                  number,
                                  typeof weapon.weaponDetail.proficiencies
                                >
                              )
                            );

                            return (
                              levels.length > 2 && (
                                <div className="mt-2 text-center">
                                  <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    <span>↓</span>
                                    <span>
                                      +{levels.length - 2} níveis abaixo
                                    </span>
                                  </div>
                                </div>
                              )
                            );
                          })()}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    {/* Ícone elegante de arma vazia */}
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      {/* Pequeno ícone de espada no canto */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">⚔️</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Typography variant="small" className="font-medium">
                        Sem arma configurada
                      </Typography>
                      <Typography variant="caption" className="max-w-48 mx-auto leading-relaxed">
                        Este registro não possui informações de arma e
                        proficiências
                      </Typography>
                    </div>

                    {/* Decoração sutil */}
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Análise de diferenças nas proficiências */}
      {Object.values(proficiencyDifferences).some(Boolean) && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <Typography variant="h4" className="text-orange-900 mb-2 flex items-center gap-2">
            ⚠️ Diferenças nas Habilidades Detectadas
          </Typography>
          <Typography variant="small" className="text-orange-800 mb-3">
            Os jogadores fizeram escolhas diferentes nos seguintes níveis:
          </Typography>
          <div className="flex flex-wrap gap-2">
            {Object.entries(proficiencyDifferences)
              .filter(([, hasDiff]) => hasDiff)
              .map(([level]) => (
                <span
                  key={level}
                  className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded"
                >
                  Nível {level}
                </span>
              ))}
          </div>
          <Typography variant="caption" className="text-orange-700 mt-2">
            💡 Níveis destacados em laranja mostram onde há divergências entre
            as builds dos jogadores
          </Typography>
        </div>
      )}

      {/* Resumo comparativo */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <Typography variant="h4" className="text-blue-900 mb-2">
          📊 Resumo Comparativo
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <Typography variant="p" className="text-blue-700 font-medium">Com Arma:</Typography>
            <Typography variant="p" className="text-blue-900">
              {weapons.filter((w) => w.hasWeapon).length} de {weapons.length}
            </Typography>
          </div>

          <div>
            <Typography variant="p" className="text-blue-700 font-medium">Tipos Únicos:</Typography>
            <Typography variant="p" className="text-blue-900">
              {
                new Set(
                  weapons
                    .filter(
                      (w) => w.hasWeapon && w.weaponDetail?.classification
                    )
                    .map((w) => w.weaponDetail!.classification)
                ).size
              }
            </Typography>
          </div>

          <div>
            <Typography variant="p" className="text-blue-700 font-medium">Vocações:</Typography>
            <Typography variant="p" className="text-blue-900">
              {
                new Set(
                  weapons
                    .filter((w) => w.hasWeapon && w.weaponDetail?.vocation)
                    .map((w) => w.weaponDetail!.vocation)
                ).size
              }
            </Typography>
          </div>

          <div>
            <Typography variant="p" className="text-blue-700 font-medium">Armas Diferentes:</Typography>
            <Typography variant="p" className="text-blue-900">
              {
                new Set(
                  weapons
                    .filter((w) => w.hasWeapon && w.weaponDetail?.name)
                    .map((w) => w.weaponDetail!.name)
                ).size
              }
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
