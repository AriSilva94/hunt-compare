'use client'

import { useState, useCallback } from 'react'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    options: ConfirmOptions
    resolver?: (value: boolean) => void
  }>({
    isOpen: false,
    options: { title: '', message: '' }
  })

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolver: resolve
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }))
    if (confirmState.resolver) {
      confirmState.resolver(true)
    }
  }, [confirmState.resolver])

  const handleCancel = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }))
    if (confirmState.resolver) {
      confirmState.resolver(false)
    }
  }, [confirmState.resolver])

  return {
    confirm,
    confirmProps: {
      isOpen: confirmState.isOpen,
      ...confirmState.options,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }
  }
}