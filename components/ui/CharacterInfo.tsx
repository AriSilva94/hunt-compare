'use client'

import { Typography } from './Typography'

interface Character {
  id: string
  name: string
  level: number
  vocation: string
  world: string
  sex: string
}

interface CharacterInfoProps {
  character: Character | null | undefined
  className?: string
}

// Função helper para cores das vocações
function getVocationColor(vocation: string): string {
  if (vocation.toLowerCase().includes('druid')) return 'bg-green-500'
  if (vocation.toLowerCase().includes('knight')) return 'bg-red-500'
  if (vocation.toLowerCase().includes('paladin')) return 'bg-yellow-500'
  if (vocation.toLowerCase().includes('sorcerer')) return 'bg-blue-500'
  if (vocation.toLowerCase().includes('monk')) return 'bg-orange-500'
  return 'bg-gray-500'
}

// Função helper para ícones das vocações
function getVocationIcon(vocation: string): string {
  if (vocation.toLowerCase().includes('druid')) return '🍃'
  if (vocation.toLowerCase().includes('knight')) return '⚔️'
  if (vocation.toLowerCase().includes('paladin')) return '🏹'
  if (vocation.toLowerCase().includes('sorcerer')) return '🔥'
  if (vocation.toLowerCase().includes('monk')) return '🥋'
  return '👤'
}

export function CharacterInfo({ character, className = '' }: CharacterInfoProps) {
  if (!character) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-lg">❓</span>
          </div>
          <div>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              Personagem não informado
            </Typography>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-3">
        Personagem do registro
      </Typography>
      
      <div className="flex items-center gap-4">
        {/* Avatar com ícone da vocação */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full ${getVocationColor(character.vocation)} flex items-center justify-center shadow-md`}>
            <span className="text-lg text-white" role="img" aria-label={character.vocation}>
              {getVocationIcon(character.vocation)}
            </span>
          </div>
          
          {/* Indicador de sexo */}
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
            <span className="text-xs">
              {character.sex === 'male' ? '♂️' : character.sex === 'female' ? '♀️' : '❓'}
            </span>
          </div>
        </div>
        
        {/* Informações do personagem */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Typography variant="lead" className="font-semibold truncate">
              {character.name}
            </Typography>
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Vocação:</span>
                <span className="ml-1 font-medium">{character.vocation}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Level:</span>
                <span className="ml-1 font-bold">{character.level.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Mundo:</span>
              <span className="ml-1">{character.world}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}