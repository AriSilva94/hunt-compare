interface BadgeProps {
  children: React.ReactNode
  variant?: 'online' | 'offline' | 'death' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    online: 'bg-green-900 text-green-300 border border-green-700',
    offline: 'bg-gray-800 text-gray-500 border border-gray-700',
    death: 'bg-red-900 text-red-300 border border-red-700',
    neutral: 'bg-gray-800 text-gray-300 border border-gray-700',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
