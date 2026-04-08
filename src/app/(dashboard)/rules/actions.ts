'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addRule(formData: FormData) {
  const actionType = formData.get('action_type') as string
  const verdict = formData.get('verdict') as string

  if (!actionType || !verdict) return
  if (actionType.length > 200) return
  if (verdict !== 'allow' && verdict !== 'block') return

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!project) redirect('/dashboard')

  await supabase
    .from('rules')
    .upsert(
      { project_id: project.id, action_type: actionType.trim(), verdict },
      { onConflict: 'project_id,action_type' }
    )

  revalidatePath('/rules')
}

export async function deleteRule(formData: FormData) {
  const ruleId = formData.get('rule_id') as string
  if (!ruleId) return

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify rule belongs to user's project
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!project) redirect('/dashboard')

  await supabase
    .from('rules')
    .delete()
    .eq('id', ruleId)
    .eq('project_id', project.id)

  revalidatePath('/rules')
}
