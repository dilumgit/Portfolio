'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type ResearchInsert = Database['public']['Tables']['research']['Insert']
type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
type ServiceInsert = Database['public']['Tables']['services']['Insert']
type QualificationInsert = Database['public']['Tables']['qualifications']['Insert']
type ContactInsert = Database['public']['Tables']['contact_messages']['Insert']
type ResumeInsert = Database['public']['Tables']['resume']['Insert']

// --- Research ---
export async function getResearch() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  if (error) return []
  return data
}

export async function getAllResearch() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllResearch:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('research')
    .select('*')
    .order('display_order')

  if (error) return []
  return data
}

export async function createResearch(data: ResearchInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('research').insert([data])
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/research')
  revalidatePath('/admin/research')
  return { success: true, message: 'Research added successfully' }
}

export async function updateResearch(id: string, data: Partial<ResearchInsert>): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('research').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/research')
  return { success: true }
}

export async function deleteResearch(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('research').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/research')
  return { success: true }
}

// --- Achievements ---
export async function getAchievements() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  if (error) return []
  return data
}

export async function getAllAchievements() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllAchievements:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('achievements').select('*').order('display_order')
  if (error) return []
  return data
}

export async function createAchievement(data: AchievementInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('achievements').insert([data])
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/achievements')
  return { success: true, message: 'Achievement added successfully' }
}

export async function updateAchievement(id: string, data: Partial<AchievementInsert>): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('achievements').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('achievements').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

// --- Services ---
export async function getServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  if (error) return []
  return data
}

export async function getAllServices() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllServices:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('services').select('*').order('display_order')
  if (error) return []
  return data
}

export async function createService(data: ServiceInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('services').insert([data])
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/services')
  return { success: true, message: 'Service added successfully' }
}

export async function updateService(id: string, data: Partial<ServiceInsert>): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function deleteService(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

// --- Qualifications ---
export async function getQualifications() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('qualifications')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')
  if (error) return []
  return data
}

export async function getAllQualifications() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllQualifications:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('qualifications').select('*').order('display_order')
  if (error) return []
  return data
}

export async function createQualification(data: QualificationInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('qualifications').insert([data])
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/qualifications')
  return { success: true, message: 'Qualification added successfully' }
}

export async function updateQualification(id: string, data: Partial<QualificationInsert>): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('qualifications').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function deleteQualification(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('qualifications').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

// --- Contact ---
export async function submitContactMessage(data: ContactInsert): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert([data])
  if (error) return { success: false, error: error.message }
  return { success: true, message: 'Message sent successfully!' }
}

export async function getAllContactMessages() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllContactMessages:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/contact')
  return { success: true }
}

export async function deleteContactMessage(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/contact')
  return { success: true }
}

// --- Resume ---
export async function getActiveResume() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()
    if (error) {
      console.error('Error fetching active resume:', error.message)
      return null
    }
    return data
  } catch (err: any) {
    console.error('Unexpected error fetching active resume:', err?.message || err)
    return null
  }
}

export async function getAllResumes() {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    console.error('Unauthorized access to getAllResumes:', auth.error)
    return []
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('resume').select('*').order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function createResume(data: ResumeInsert): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  // Deactivate all existing
  await supabase.from('resume').update({ is_active: false }).neq('id', 'none')
  const { error } = await supabase.from('resume').insert([{ ...data, is_active: true }])
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/resume')
  return { success: true, message: 'Resume uploaded successfully' }
}

export async function setActiveResume(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  await supabase.from('resume').update({ is_active: false }).neq('id', id)
  const { error } = await supabase.from('resume').update({ is_active: true }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function deleteResume(id: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('resume').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/resume')
  return { success: true }
}

// --- Site Settings ---
export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error || !data) return {}
  return Object.fromEntries(data.map((s) => [s.key, s.value || '']))
}

export async function updateSiteSetting(key: string, value: string): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert([{ key, value, updated_at: new Date().toISOString() }], { onConflict: 'key' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function updateSiteSettings(settings: Record<string, string>): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true, message: 'Settings saved successfully' }
}
