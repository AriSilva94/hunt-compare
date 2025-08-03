'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Toast, ToastProps } from './Toast'

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onRemove'>[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>,
    document.body
  )
}