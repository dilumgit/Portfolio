'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export async function getProfile() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }
    return data
  } catch (err: any) {
    console.error('Unexpected error fetching profile:', err?.message || err)
    return null
  }
}

export async function upsertProfile(
  formData: Partial<ProfileInsert>
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient()

    // Query existing profile using admin client to guarantee access
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('Error querying profile:', fetchError.message)
      return { success: false, error: `Database error: ${fetchError.message}` }
    }

    let result
    if (existing?.id) {
      result = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      result = await supabase
        .from('profiles')
        .insert([formData as ProfileInsert])
    }

    if (result.error) {
      console.error('Error updating profile in Supabase:', result.error.message)
      return { success: false, error: result.error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (err: any) {
    console.error('Unexpected error in upsertProfile:', err)
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while saving profile.',
    }
  }
}

export async function getSocialLinks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching social links:', error)
    return []
  }
  return data
}

export async function getAllSocialLinks() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching social links:', error)
    return []
  }
  return data
}

export async function upsertSocialLink(
  data: Database['public']['Tables']['social_links']['Insert']
): Promise<ActionResult> {
  const supabase = createAdminClient()

  const result = data.id
    ? await supabase
        .from('social_links')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', data.id)
    : await supabase.from('social_links').insert([data])

  if (result.error) {
    return { success: false, error: result.error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('social_links').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
