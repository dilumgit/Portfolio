'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type CertInsert = Database['public']['Tables']['certifications']['Insert']

export async function getCertifications() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching certifications:', error)
    return []
  }
  return data
}

export async function getAllCertifications() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllCertifications:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching certifications:', error)
    return []
  }
  return data
}

export async function createCertification(
  data: CertInsert
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').insert([data])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/certifications')
  return { success: true, message: 'Certification added successfully' }
}

export async function updateCertification(
  id: string,
  data: Partial<CertInsert>
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('certifications')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/certifications')
  return { success: true, message: 'Certification updated successfully' }
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/certifications')
  return { success: true, message: 'Certification deleted successfully' }
}
