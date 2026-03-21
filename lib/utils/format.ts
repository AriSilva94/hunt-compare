export function fmtXP(n: number): string {
  if (n <= 0) return n.toLocaleString()
  if (n >= 1_000_000) return `+${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `+${Math.round(n / 1_000)}k`
  return `+${n.toLocaleString()}`
}

export function fmtXPLarge(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return n.toLocaleString()
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return 'just now'
}
