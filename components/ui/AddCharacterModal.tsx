'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, User } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Typography } from './Typography'

export interface AddCharacterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (characterName: string) => Promise<void>
  loading?: boolean
}

export function AddCharacterModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: AddCharacterModalProps) {
  const [mounted, setMounted] = useState(false)
  const [characterName, setCharacterName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setCharacterName('')
      setError('')
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedName = characterName.trim()
    
    if (!trimmedName) {
      setError('Nome do personagem é obrigatório')
      return
    }

    if (trimmedName.length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres')
      return
    }

    if (trimmedName.length > 29) {
      setError('Nome deve ter no máximo 29 caracteres')
      return
    }

    setError('')
    
    try {
      await onSubmit(trimmedName)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar personagem'
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <User className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3" />
                <Typography variant="lead" className="font-semibold">
                  Adicionar Personagem
                </Typography>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* Input */}
            <div className="mb-6">
              <Input
                label="Nome do Personagem"
                placeholder="Digite o nome do personagem"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                error={error}
                disabled={loading}
                maxLength={29}
                autoFocus
              />
            </div>

            {/* Info text */}
            <Typography variant="small" className="mb-6 text-gray-500 dark:text-gray-400">
              Você pode cadastrar até 5 personagens.
            </Typography>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
                className="order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !characterName.trim()}
                className="order-1 sm:order-2"
              >
                {loading ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}