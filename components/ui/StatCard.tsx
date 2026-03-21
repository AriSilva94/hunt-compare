interface StatCardProps {
  label: string
  value: string
  color?: string
  highlight?: boolean
}

export function StatCard({ label, value, color, highlight = false }: StatCardProps) {
  const valueColor = color ?? (highlight ? '#40c860' : '#c07828')

  return (
    <div style={{ background: '#161210', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <span className="display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: '#6a5a44' }}>
        {label.toUpperCase()}
      </span>
      <span className="display-font mono-font" style={{ fontSize: '1.9rem', fontWeight: 700, lineHeight: 1, color: valueColor, letterSpacing: '0.04em' }}>
        {value}
      </span>
    </div>
  )
}
