"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { AddCharacterModal } from "@/components/ui/AddCharacterModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { characterService } from "@/services/character.service";
import { useToast } from "@/hooks/useToast";
import { TibiaCharacter } from "@/types/character.types";
import { User } from "lucide-react";
import Link from "next/link";

interface RecordsHeaderProps {
  canAddMore: boolean;
  onAddCharacter: (character: TibiaCharacter) => Promise<boolean>;
  onCharacterAdded?: () => void;
}

export function RecordsHeader({
  canAddMore,
  onAddCharacter,
  onCharacterAdded,
}: RecordsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError, toasts, removeToast } = useToast();

  const handleAddCharacter = async (characterName: string) => {
    setIsLoading(true);
    try {
      const validationResult = await characterService.validateCharacter(
        characterName
      );

      if (!validationResult.isValid || !validationResult.character) {
        throw new Error(validationResult.error || "Personagem inválido");
      }

      // Tentar adicionar o personagem via callback do componente pai
      const wasAdded = await onAddCharacter(validationResult.character);

      if (!wasAdded) {
        if (!canAddMore) {
          throw new Error("Você já atingiu o limite de 5 personagens");
        } else {
          throw new Error("Este personagem já está cadastrado");
        }
      }

      setIsModalOpen(false);
      success(
        "Personagem adicionado!",
        `${validationResult.character.name} foi adicionado aos seus personagens.`
      );

      // Notificar componente pai se necessário
      onCharacterAdded?.();
    } catch (error) {
      console.error("Erro ao adicionar personagem:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao adicionar personagem";

      // Se é erro de limite ou duplicação, mostrar toast em vez de erro no modal
      if (
        errorMessage.includes("limite") ||
        errorMessage.includes("já está cadastrado")
      ) {
        showError("Não foi possível adicionar", errorMessage);
        setIsModalOpen(false);
      } else {
        // Para outros erros, deixar o modal tratar
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <Typography variant="h2">Seus Registros</Typography>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!canAddMore}
            className={`px-4 py-2 rounded-lg transition-colors inline-flex items-center ${
              canAddMore
                ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
            }`}
            title={!canAddMore ? "Limite de 5 personagens atingido" : ""}
          >
            <User className="w-4 h-4 mr-2" />
            Adicionar Personagem
          </button>

          <Link
            href="/cadastro"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors inline-flex items-center"
          >
            <span className="mr-2">+</span>
            Novo Registro
          </Link>
        </div>
      </div>

      <AddCharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCharacter}
        loading={isLoading}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
