/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { charactersService, CharactersService } from "@/services/characters.service";
import { TibiaCharacter } from "@/types/character.types";
import type { Database } from "@/types/database.types";

type Record = Database["public"]["Tables"]["records"]["Row"] & {
  character?: {
    id: string;
    name: string;
    level: number;
    vocation: string;
    world: string;
    sex: string;
  } | null;
};

interface SavedCharacter {
  id: string;
  name: string;
  level: number;
  vocation: string;
  world: string;
  sex: string;
  addedAt: string;
  isSelected: boolean;
}

interface HomeData {
  user: any;
  records: Record[];
  characters: SavedCharacter[];
  selectedCharacterId?: string;
  canAddMore: boolean;
  loading: boolean;
}

/**
 * Hook unificado para dados da página /home
 * Centraliza todas as requisições para evitar race conditions e múltiplos loadings
 */
export function useHomeData() {
  const [data, setData] = useState<HomeData>({
    user: null,
    records: [],
    characters: [],
    selectedCharacterId: undefined,
    canAddMore: true,
    loading: true
  });

  // Carregamento inicial unificado
  useEffect(() => {
    async function fetchAllData() {
      try {
        const supabase = createClient();
        
        // 1. Uma única verificação de autenticação
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Erro ao obter usuário:', userError);
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        if (!user) {
          setData(prev => ({ ...prev, user: null, loading: false }));
          return;
        }

        // 2. Executar requisições paralelas usando Promise.all para melhor performance
        const [recordsResponse, dbCharacters] = await Promise.all([
          supabase
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
            .order("created_at", { ascending: false }),
          charactersService.getUserCharactersWithRefresh(user.id)
        ]);

        // 3. Processar dados das requisições
        const records = recordsResponse.data || [];
        const characters = dbCharacters.map(CharactersService.databaseCharacterToSaved);
        const selected = characters.find(c => c.isSelected);
        const selectedCharacterId = selected?.id;

        // 4. Update único e final do estado
        setData({
          user,
          records,
          characters,
          selectedCharacterId,
          canAddMore: characters.length < 5,
          loading: false
        });

      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
        
        // Fallback para localStorage em caso de erro nas requisições
        let fallbackCharacters: SavedCharacter[] = [];
        try {
          const saved = localStorage.getItem('huntcompare_characters');
          if (saved) {
            const parsed = JSON.parse(saved) as SavedCharacter[];
            fallbackCharacters = parsed;
          }
        } catch (storageError) {
          console.error('Erro ao carregar fallback do localStorage:', storageError);
        }
        
        const selected = fallbackCharacters.find(c => c.isSelected);
        
        setData(prev => ({
          ...prev,
          characters: fallbackCharacters,
          selectedCharacterId: selected?.id,
          canAddMore: fallbackCharacters.length < 5,
          loading: false
        }));
      }
    }

    fetchAllData();
  }, []);

  // Função para adicionar personagem
  const addCharacter = useCallback(async (tibiaCharacter: TibiaCharacter): Promise<SavedCharacter | null> => {
    if (data.characters.length >= 5) {
      return null; // Limite atingido
    }

    // Verificar se personagem já existe
    const exists = data.characters.some(c => 
      c.name.toLowerCase() === tibiaCharacter.name.toLowerCase()
    );
    if (exists) {
      return null; // Personagem já cadastrado
    }

    try {
      if (data.user) {
        // Salvar no banco de dados
        const createDto = CharactersService.tibiaCharacterToCreateDTO(tibiaCharacter);
        const dbCharacter = await charactersService.createCharacter(data.user.id, createDto);
        const savedCharacter = CharactersService.databaseCharacterToSaved(dbCharacter);
        
        // Atualizar estado local
        const updatedCharacters = [...data.characters, savedCharacter];
        setData(prev => ({
          ...prev,
          characters: updatedCharacters,
          selectedCharacterId: savedCharacter.isSelected ? savedCharacter.id : prev.selectedCharacterId,
          canAddMore: updatedCharacters.length < 5
        }));
        
        return savedCharacter;
      } else {
        // Fallback para localStorage
        const newCharacter: SavedCharacter = {
          id: Math.random().toString(36).substring(2, 9),
          name: tibiaCharacter.name,
          level: tibiaCharacter.level,
          vocation: tibiaCharacter.vocation,
          world: tibiaCharacter.world,
          sex: tibiaCharacter.sex,
          addedAt: new Date().toISOString(),
          isSelected: data.characters.length === 0
        };

        const updatedCharacters = [...data.characters, newCharacter];
        
        // Salvar no localStorage
        localStorage.setItem('huntcompare_characters', JSON.stringify(updatedCharacters));
        
        // Atualizar estado
        setData(prev => ({
          ...prev,
          characters: updatedCharacters,
          selectedCharacterId: newCharacter.isSelected ? newCharacter.id : prev.selectedCharacterId,
          canAddMore: updatedCharacters.length < 5
        }));

        return newCharacter;
      }
    } catch (error) {
      console.error('Erro ao adicionar personagem:', error);
      throw error;
    }
  }, [data.characters, data.user]);

  // Função para selecionar personagem
  const selectCharacter = useCallback(async (character: SavedCharacter) => {
    try {
      if (data.user) {
        await charactersService.setActiveCharacter(character.id, data.user.id);
      }
      
      const updatedCharacters = data.characters.map(c => ({
        ...c,
        isSelected: c.id === character.id
      }));

      if (!data.user) {
        // Salvar no localStorage se não estiver logado
        localStorage.setItem('huntcompare_characters', JSON.stringify(updatedCharacters));
      }
      
      setData(prev => ({
        ...prev,
        characters: updatedCharacters,
        selectedCharacterId: character.id
      }));
    } catch (error) {
      console.error('Erro ao selecionar personagem:', error);
      // Fallback para localStorage
      const updatedCharacters = data.characters.map(c => ({
        ...c,
        isSelected: c.id === character.id
      }));
      
      localStorage.setItem('huntcompare_characters', JSON.stringify(updatedCharacters));
      setData(prev => ({
        ...prev,
        characters: updatedCharacters,
        selectedCharacterId: character.id
      }));
    }
  }, [data.characters, data.user]);

  // Função para remover personagem
  const removeCharacter = useCallback(async (characterId: string) => {
    try {
      if (data.user) {
        await charactersService.deleteCharacter(characterId, data.user.id);
      }
      
      const updatedCharacters = data.characters.filter(c => c.id !== characterId);
      
      // Se o personagem removido estava selecionado, selecionar o primeiro disponível
      let newSelectedId = data.selectedCharacterId;
      if (data.selectedCharacterId === characterId) {
        const newSelected = updatedCharacters.find(c => c.isSelected) || updatedCharacters[0];
        newSelectedId = newSelected?.id;
      }

      if (!data.user) {
        // Salvar no localStorage se não estiver logado
        localStorage.setItem('huntcompare_characters', JSON.stringify(updatedCharacters));
      }
      
      setData(prev => ({
        ...prev,
        characters: updatedCharacters,
        selectedCharacterId: newSelectedId,
        canAddMore: updatedCharacters.length < 5
      }));
    } catch (error) {
      console.error('Erro ao remover personagem:', error);
      throw error;
    }
  }, [data.characters, data.user, data.selectedCharacterId]);

  return {
    // Estados
    ...data,
    
    // Ações
    addCharacter,
    selectCharacter,
    removeCharacter
  };
}