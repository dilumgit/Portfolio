'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type SkillCategoryInsert = Database['public']['Tables']['skill_categories']['Insert']
type SkillInsert = Database['public']['Tables']['skills']['Insert']

export async function getSkillCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*, skills(*)')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching skill categories:', error)
    return []
  }
  return data
}

export async function getAllSkillCategories() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllSkillCategories:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*, skills(*)')
    .order('display_order')

  if (error) {
    console.error('Error fetching skill categories:', error)
    return []
  }
  return data
}

export async function createSkillCategory(
  data: SkillCategoryInsert
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('skill_categories').insert([data])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/skills')
  return { success: true, message: 'Category created successfully' }
}

export async function updateSkillCategory(
  id: string,
  data: Partial<SkillCategoryInsert>
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('skill_categories')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Category updated successfully' }
}

export async function deleteSkillCategory(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function createSkill(data: SkillInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').insert([data])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/skills')
  return { success: true, message: 'Skill added successfully' }
}

export async function updateSkill(
  id: string,
  data: Partial<SkillInsert>
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('skills')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Skill updated successfully' }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
