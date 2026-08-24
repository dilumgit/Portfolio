'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type EducationInsert = Database['public']['Tables']['education']['Insert']

export async function getEducation() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching education:', error)
    return []
  }
  return data
}

export async function getAllEducation() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching education:', error)
    return []
  }
  return data
}

export async function createEducation(
  data: EducationInsert
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('education').insert([data])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/education')
  return { success: true, message: 'Education added successfully' }
}

export async function updateEducation(
  id: string,
  data: Partial<EducationInsert>
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('education')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/education')
  return { success: true, message: 'Education updated successfully' }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('education').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/education')
  return { success: true, message: 'Education deleted successfully' }
}
