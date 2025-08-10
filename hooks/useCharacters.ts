'use client'

import { useState, useCallback, useEffect } from 'react'
import { SavedCharacter, TibiaCharacter } from '@/types/character.types'
import { charactersService, CharactersService } from '@/services/characters.service'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'huntcompare_characters'
const MAX_CHARACTERS = 5

export function useCharacters() {
  const [characters, setCharacters] = useState<SavedCharacter[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [useDatabase, setUseDatabase] = useState(false)

  // Verificar autenticação e carregar personagens
  useEffect(() => {
    const initializeCharacters = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Erro ao obter usuário:', userError)
        }

        setUser(user)

        if (user) {
          // Usuário logado - usar banco de dados
          setUseDatabase(true)
          await loadCharactersFromDatabase(user.id)
        } else {
          // Usuário não logado - usar localStorage
          setUseDatabase(false)
          loadCharactersFromStorage()
        }
      } catch (error) {
        console.error('Erro ao inicializar personagens:', error)
        // Fallback para localStorage
        loadCharactersFromStorage()
      } finally {
        setLoading(false)
      }
    }

    initializeCharacters()
  }, [])

  const loadCharactersFromDatabase = async (userId: string) => {
    try {
      const dbCharacters = await charactersService.getUserCharacters(userId)
      const savedCharacters = dbCharacters.map(CharactersService.databaseCharacterToSaved)
      setCharacters(savedCharacters)
      
      const selected = savedCharacters.find(c => c.isSelected)
      if (selected) {
        setSelectedCharacterId(selected.id)
      }
    } catch (error) {
      console.error('Erro ao carregar personagens do banco:', error)
      // Fallback para localStorage
      loadCharactersFromStorage()
    }
  }

  const loadCharactersFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SavedCharacter[]
        setCharacters(parsed)
        
        const selected = parsed.find(c => c.isSelected)
        if (selected) {
          setSelectedCharacterId(selected.id)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar personagens do storage:', error)
    }
  }

  // Salvar personagens no localStorage e forçar re-render
  const saveToStorage = useCallback((updatedCharacters: SavedCharacter[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacters))
      // Forçar re-render imediato
      setCharacters([...updatedCharacters])
    } catch (error) {
      console.error('Erro ao salvar personagens:', error)
    }
  }, [])

  // Adicionar novo personagem
  const addCharacter = useCallback(async (tibiaCharacter: TibiaCharacter): Promise<SavedCharacter | null> => {
    if (characters.length >= MAX_CHARACTERS) {
      return null // Limite atingido
    }

    // Verificar se personagem já existe
    const exists = characters.some(c => c.name.toLowerCase() === tibiaCharacter.name.toLowerCase())
    if (exists) {
      return null // Personagem já cadastrado
    }

    if (useDatabase && user) {
      try {
        // Salvar no banco de dados
        const createDto = CharactersService.tibiaCharacterToCreateDTO(tibiaCharacter)
        const dbCharacter = await charactersService.createCharacter(user.id, createDto)
        const savedCharacter = CharactersService.databaseCharacterToSaved(dbCharacter)
        
        const updatedCharacters = [...characters, savedCharacter]
        setCharacters(updatedCharacters)
        
        if (savedCharacter.isSelected) {
          setSelectedCharacterId(savedCharacter.id)
        }
        
        return savedCharacter
      } catch (error) {
        console.error('Erro ao salvar no banco:', error)
        throw error // Propagar erro para o componente
      }
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
        isSelected: characters.length === 0
      }

      const updatedCharacters = [...characters, newCharacter]
      saveToStorage(updatedCharacters)

      if (newCharacter.isSelected) {
        setSelectedCharacterId(newCharacter.id)
      }

      return newCharacter
    }
  }, [characters, useDatabase, user, saveToStorage])

  // Selecionar personagem
  const selectCharacter = useCallback(async (character: SavedCharacter) => {
    if (useDatabase && user) {
      try {
        await charactersService.setActiveCharacter(character.id, user.id)
        
        const updatedCharacters = characters.map(c => ({
          ...c,
          isSelected: c.id === character.id
        }))
        
        setCharacters(updatedCharacters)
        setSelectedCharacterId(character.id)
      } catch (error) {
        console.error('Erro ao definir personagem ativo no banco:', error)
        // Fallback para localStorage
        const updatedCharacters = characters.map(c => ({
          ...c,
          isSelected: c.id === character.id
        }))
        setSelectedCharacterId(character.id)
        saveToStorage(updatedCharacters)
      }
    } else {
      const updatedCharacters = characters.map(c => ({
        ...c,
        isSelected: c.id === character.id
      }))
      setSelectedCharacterId(character.id)
      saveToStorage(updatedCharacters)
    }
  }, [characters, useDatabase, user, saveToStorage])

  // Remover personagem
  const removeCharacter = useCallback(async (characterId: string) => {
    if (useDatabase && user) {
      try {
        await charactersService.deleteCharacter(characterId, user.id)
        
        const updatedCharacters = characters.filter(c => c.id !== characterId)
        setCharacters(updatedCharacters)
        
        // Se o personagem removido estava selecionado, selecionar o primeiro disponível
        if (selectedCharacterId === characterId) {
          const newSelected = updatedCharacters.find(c => c.isSelected)
          setSelectedCharacterId(newSelected?.id)
        }
      } catch (error) {
        console.error('Erro ao remover personagem do banco:', error)
        throw error
      }
    } else {
      const updatedCharacters = characters.filter(c => c.id !== characterId)
      
      // Se o personagem removido estava selecionado, selecionar o primeiro disponível
      if (selectedCharacterId === characterId) {
        const newSelected = updatedCharacters.length > 0 ? updatedCharacters[0] : undefined
        if (newSelected) {
          newSelected.isSelected = true
          setSelectedCharacterId(newSelected.id)
        } else {
          setSelectedCharacterId(undefined)
        }
      }

      saveToStorage(updatedCharacters)
    }
  }, [characters, selectedCharacterId, useDatabase, user, saveToStorage])

  // Obter personagem selecionado
  const selectedCharacter = characters.find(c => c.id === selectedCharacterId)

  return {
    characters,
    selectedCharacter,
    selectedCharacterId,
    loading,
    canAddMore: characters.length < MAX_CHARACTERS,
    addCharacter,
    selectCharacter,
    removeCharacter,
    maxCharacters: MAX_CHARACTERS
  }
}