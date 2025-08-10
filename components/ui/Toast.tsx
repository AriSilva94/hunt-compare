'use client'

import { useCallback, useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Typography } from './Typography'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onRemove: (id: string) => void
}

const toastStyles = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

export function Toast({ id, type, title, message, duration = 5000, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = iconMap[type]

  const handleRemove = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(id)
    }, 300)
  }, [id, onRemove])

  useEffect(() => {
    setIsVisible(true)
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleRemove])

  return (
    <div
      className={`
        relative flex items-start p-4 mb-3 border rounded-lg shadow-lg transition-all duration-300 ease-in-out
        ${toastStyles[type]}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
      
      <div className="flex-grow">
        <Typography variant="small" className="font-semibold">{title}</Typography>
        {message && <Typography variant="small" className="mt-1 opacity-90">{message}</Typography>}
      </div>

      <button
        onClick={handleRemove}
        className="ml-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}