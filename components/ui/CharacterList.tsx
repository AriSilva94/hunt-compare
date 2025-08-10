"use client";

import { useState, useEffect } from "react";
import { SavedCharacter } from "@/types/character.types";
import { CharacterCard } from "./CharacterCard";
import { ConfirmDialog } from "./ConfirmDialog";
import { ToastContainer } from "./ToastContainer";
import { Typography } from "./Typography";
import { useToast } from "@/hooks/useToast";
import { Users } from "lucide-react";

interface CharacterListProps {
  characters: SavedCharacter[];
  onCharacterSelect: (character: SavedCharacter) => void;
  onCharacterRemove?: (characterId: string) => void;
  selectedCharacterId?: string;
  loading?: boolean;
}

export function CharacterList({
  characters,
  onCharacterSelect,
  onCharacterRemove,
  selectedCharacterId,
  loading = false,
}: CharacterListProps) {
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(
    selectedCharacterId
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] =
    useState<SavedCharacter | null>(null);
  const { success, toasts, removeToast } = useToast();

  useEffect(() => {
    setLocalSelectedId(selectedCharacterId);
  }, [selectedCharacterId]);

  const handleCharacterClick = (character: SavedCharacter) => {
    // Só executar se não for o personagem já selecionado
    if (character.id !== localSelectedId) {
      setLocalSelectedId(character.id);
      onCharacterSelect(character);

      // Mostrar toast elegante informando sobre a seleção
      success(
        "Personagem Selecionado!",
        `${character.name} foi definido como personagem ativo.`
      );
    }
  };

  const handleDeleteClick = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      setCharacterToDelete(character);
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (characterToDelete && onCharacterRemove) {
      onCharacterRemove(characterToDelete.id);
      setIsConfirmOpen(false);
      setCharacterToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setCharacterToDelete(null);
  };

  // Durante loading, não mostra estado vazio (será handled pelo loading unificado)
  if (loading) {
    return null;
  }

  if (characters.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <Typography
            variant="lead"
            className="text-gray-500 dark:text-gray-400 mb-2"
          >
            Nenhum personagem cadastrado
          </Typography>
          <Typography variant="p" className="text-gray-400 dark:text-gray-500">
            Clique em &quot;Adicionar Personagem&quot; para começar
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <Typography variant="h3">Seus Personagens</Typography>
        </div>
        <Typography
          variant="small"
          className="text-gray-500 dark:text-gray-400"
        >
          {characters.length}/5 personagens
        </Typography>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={handleCharacterClick}
            onDelete={onCharacterRemove ? handleDeleteClick : undefined}
            isSelected={character.id === localSelectedId}
          />
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Excluir Personagem"
        message={
          characterToDelete
            ? `Tem certeza que deseja excluir o personagem "${characterToDelete.name}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
