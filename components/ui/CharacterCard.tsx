'use client'

import { SavedCharacter } from '@/types/character.types'
import { Typography } from './Typography'
import { Check, Trash2 } from 'lucide-react'

interface CharacterCardProps {
  character: SavedCharacter
  onClick: (character: SavedCharacter) => void
  onDelete?: (characterId: string) => void
  isSelected?: boolean
}

const vocationStyles: Record<string, { 
  bg: string
  border: string
  text: string
  icon: string
  selectedBg: string
}> = {
  "None": {
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
    icon: "👤",
    selectedBg: "bg-gray-100 dark:bg-gray-700"
  },
  "Druid": {
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
    icon: "🍃",
    selectedBg: "bg-green-100 dark:bg-green-800/50"
  },
  "Knight": {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-700",
    text: "text-red-700 dark:text-red-300",
    icon: "⚔️",
    selectedBg: "bg-red-100 dark:bg-red-800/50"
  },
  "Paladin": {
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    border: "border-yellow-200 dark:border-yellow-700",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: "🏹",
    selectedBg: "bg-yellow-100 dark:bg-yellow-800/50"
  },
  "Sorcerer": {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    icon: "🔥",
    selectedBg: "bg-blue-100 dark:bg-blue-800/50"
  },
  "Monk": {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    border: "border-orange-200 dark:border-orange-700",
    text: "text-orange-700 dark:text-orange-300",
    icon: "🥋",
    selectedBg: "bg-orange-100 dark:bg-orange-800/50"
  }
}

export function CharacterCard({ character, onClick, onDelete, isSelected = false }: CharacterCardProps) {
  // Função para detectar a vocação base
  const getVocationStyle = (vocation: string) => {
    if (vocation.toLowerCase().includes('druid')) {
      return vocationStyles["Druid"]
    }
    if (vocation.toLowerCase().includes('knight')) {
      return vocationStyles["Knight"]
    }
    if (vocation.toLowerCase().includes('paladin')) {
      return vocationStyles["Paladin"]
    }
    if (vocation.toLowerCase().includes('sorcerer')) {
      return vocationStyles["Sorcerer"]
    }
    if (vocation.toLowerCase().includes('monk')) {
      return vocationStyles["Monk"]
    }
    return vocationStyles[vocation] || vocationStyles["None"]
  }
  
  const style = getVocationStyle(character.vocation)
  
  return (
    <div
      onClick={() => onClick(character)}
      className={`
        relative p-2 rounded-md transition-all duration-300 cursor-pointer hover:shadow-sm
        ${style.bg}
        hover:scale-[1.005] active:scale-[0.995]
        ${isSelected ? 'border-2 border-transparent' : `border-2 ${style.border}`}
      `}
    >
      {/* Borda animada usando ::before pseudo-elemento */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
            backgroundSize: '300% 300%',
            animation: 'borderGradient 2s ease infinite',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            padding: '2px'
          }}
        />
      )}
      
      {/* Adicionar animação CSS */}
      {isSelected && (
        <style jsx>{`
          @keyframes borderGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}

      {/* Botão de excluir - canto superior direito */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evitar trigger do onClick do card
            onDelete(character.id);
          }}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer shadow-sm"
          title="Excluir personagem"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Header com ícone da vocação */}
      <div className="flex items-center mb-2">
        <span className="text-xl mr-1.5" role="img" aria-label={character.vocation}>
          {style.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Typography 
              variant="lead" 
              className={`font-semibold truncate ${style.text} text-sm leading-tight`}
            >
              {character.name}
            </Typography>
            {isSelected && (
              <div className="bg-blue-500 text-white rounded-full p-1 shadow-sm flex-shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
          <Typography 
            variant="small" 
            className={`opacity-80 ${style.text} text-xs leading-tight`}
          >
            {character.world}
          </Typography>
        </div>
      </div>

      {/* Informações do personagem */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
            Vocação
          </Typography>
          <Typography variant="small" className={`font-medium ${style.text} text-xs`}>
            {character.vocation}
          </Typography>
        </div>
        
        <div className="flex justify-between items-center">
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
            Level
          </Typography>
          <Typography variant="small" className={`font-bold ${style.text} text-xs`}>
            {character.level.toLocaleString()}
          </Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
            Sexo
          </Typography>
          <Typography variant="small" className={`font-medium ${style.text} text-xs`}>
            {character.sex === 'male' ? '♂️ Masculino' : character.sex === 'female' ? '♀️ Feminino' : character.sex}
          </Typography>
        </div>
      </div>

      {/* Data de adição */}
      <div className="mt-2 pt-1.5 border-t border-gray-200 dark:border-gray-600">
        <Typography variant="caption" className="text-gray-400 dark:text-gray-500 text-xs leading-tight">
          Adicionado em {new Date(character.addedAt).toLocaleDateString('pt-BR')}
        </Typography>
      </div>

    </div>
  )
}