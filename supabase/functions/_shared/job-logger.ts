import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SupabaseClient = ReturnType<typeof createClient>
type JobStatus = 'success' | 'failed'

export async function startJob(supabase: SupabaseClient, name: string): Promise<number> {
  const { data } = await supabase
    .from('job_runs')
    .insert({ job_name: name, status: 'running' })
    .select('id')
    .single()
  return data?.id as number
}

export async function finishJob(
  supabase: SupabaseClient,
  id: number,
  status: JobStatus,
  rowsAffected: number,
  errorMsg?: string
): Promise<void> {
  await supabase
    .from('job_runs')
    .update({
      status,
      finished_at: new Date().toISOString(),
      rows_affected: rowsAffected,
      error_msg: errorMsg ?? null,
    })
    .eq('id', id)
}
