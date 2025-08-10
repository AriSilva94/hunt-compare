"use client";

import { useState, useEffect } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { Typography } from "@/components/ui/Typography";
import { ChevronDown, User } from "lucide-react";

interface CharacterSelectorProps {
  onCharacterChange?: (characterId: string | undefined) => void;
}

export function CharacterSelector({ onCharacterChange }: CharacterSelectorProps) {
  const { characters, selectedCharacterId } = useCharacters();
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(
    selectedCharacterId
  );

  // Sincronizar com o personagem globalmente selecionado
  useEffect(() => {
    setLocalSelectedId(selectedCharacterId);
  }, [selectedCharacterId]);

  // Notificar mudanças do personagem selecionado
  useEffect(() => {
    onCharacterChange?.(localSelectedId);
  }, [localSelectedId, onCharacterChange]);

  const selectedCharacter = characters.find((c) => c.id === localSelectedId);
  const availableCharacters = characters.filter(
    (c) => c.id !== localSelectedId
  );

  if (characters.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <User className="w-4 h-4" />
          <Typography variant="small">Nenhum personagem cadastrado</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Typography
        variant="small"
        className="text-gray-600 dark:text-gray-400 mb-2"
      >
        Personagem para este registro
      </Typography>

      {/* Selector atual */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {selectedCharacter ? (
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${getVocationColor(
                selectedCharacter.vocation
              )}`}
            ></div>
            <div className="text-left">
              <Typography variant="small" className="font-medium">
                {selectedCharacter.name}{" "}
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-500 dark:text-gray-400"
              >
                {selectedCharacter.vocation} • Lv. {selectedCharacter.level}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>Selecionar personagem</span>
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && availableCharacters.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {availableCharacters.map((character) => (
            <button
              key={character.id}
              onClick={() => {
                setLocalSelectedId(character.id);
                setIsOpen(false);
              }}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div
                className={`w-3 h-3 rounded-full ${getVocationColor(
                  character.vocation
                )}`}
              ></div>
              <div className="text-left">
                <Typography variant="small" className="font-medium">
                  {character.name}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 dark:text-gray-400"
                >
                  {character.vocation} • Lv. {character.level}
                </Typography>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Indicador de que é temporário */}
      {localSelectedId !== selectedCharacterId && (
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          Seleção temporária para este registro
        </div>
      )}
    </div>
  );
}

// Função helper para cores das vocações
function getVocationColor(vocation: string): string {
  if (vocation.toLowerCase().includes("druid")) return "bg-green-500";
  if (vocation.toLowerCase().includes("knight")) return "bg-red-500";
  if (vocation.toLowerCase().includes("paladin")) return "bg-yellow-500";
  if (vocation.toLowerCase().includes("sorcerer")) return "bg-blue-500";
  if (vocation.toLowerCase().includes("monk")) return "bg-orange-500";
  return "bg-gray-500";
}
