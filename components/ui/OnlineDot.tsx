interface OnlineDotProps {
  size?: number
}

export function OnlineDot({ size = 5 }: OnlineDotProps) {
  return (
    <span
      className="online-glow"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#40c860',
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  )
}
