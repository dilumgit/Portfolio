'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type ExperienceInsert = Database['public']['Tables']['experience']['Insert']

export async function getExperience() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching experience:', error)
    return []
  }
  return data
}

export async function getAllExperience() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order')

  if (error) return []
  return data
}

export async function createExperience(
  data: ExperienceInsert
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('experience').insert([data])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/experience')
  return { success: true, message: 'Experience added successfully' }
}

export async function updateExperience(
  id: string,
  data: Partial<ExperienceInsert>
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('experience')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/experience')
  return { success: true, message: 'Experience updated successfully' }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('experience').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/experience')
  return { success: true }
}
