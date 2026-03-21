import type { CSSProperties } from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'online' | 'offline' | 'death' | 'neutral'
  className?: string
}

const STYLES: Record<string, CSSProperties> = {
  online: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '2px 9px', background: '#0d2515', border: '1px solid #1a5c28',
    color: '#40c860', fontSize: '0.65rem', letterSpacing: '0.1em',
    fontFamily: 'var(--font-display-var, serif)', whiteSpace: 'nowrap',
  },
  offline: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '2px 9px', background: '#111', border: '1px solid #2a2018',
    color: '#6a5a44', fontSize: '0.65rem', letterSpacing: '0.1em',
    fontFamily: 'var(--font-display-var, serif)', whiteSpace: 'nowrap',
  },
  death: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '2px 9px', background: '#1a0808', border: '1px solid #4a1010',
    color: '#b82020', fontSize: '0.65rem', letterSpacing: '0.1em',
    fontFamily: 'var(--font-display-var, serif)', whiteSpace: 'nowrap',
  },
  neutral: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '2px 9px', background: '#161210', border: '1px solid #2a2018',
    color: '#6a5a44', fontSize: '0.65rem', letterSpacing: '0.1em',
    fontFamily: 'var(--font-display-var, serif)', whiteSpace: 'nowrap',
  },
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span style={STYLES[variant]} className={className}>
      {variant === 'online' && (
        <span
          className="online-glow"
          style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#40c860', flexShrink: 0, display: 'inline-block' }}
        />
      )}
      {variant === 'death' && <span>☠</span>}
      {children}
    </span>
  )
}
