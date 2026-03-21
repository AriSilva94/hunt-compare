export const CALMERA_WORLD_ID = 1
export const USER_AGENT = 'CalmTracker/1.0'

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err) return JSON.stringify(err)
  return String(err)
}
