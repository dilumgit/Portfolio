'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import type { ActionResult } from '@/types/portfolio'
import type { Database } from '@/types/database'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export async function getFeaturedProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
  return data
}

export async function getAllPublicProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('is_visible', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single()

  if (error) {
    return null
  }
  return data
}

export async function getAllProjects() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .order('display_order')

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function createProject(
  data: Omit<ProjectInsert, 'slug'>
): Promise<ActionResult<{ id: string; slug: string }>> {
  const supabase = createAdminClient()
  const slug = slugify(data.title)

  const { data: project, error } = await supabase
    .from('projects')
    .insert([{ ...data, slug }])
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  return { success: true, data: { id: project.id, slug: project.slug } }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectInsert>
): Promise<ActionResult> {
  const supabase = createAdminClient()

  const updateData = { ...data, updated_at: new Date().toISOString() }
  if (data.title) {
    updateData.slug = slugify(data.title)
  }

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  return { success: true, message: 'Project updated successfully' }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  return { success: true, message: 'Project deleted successfully' }
}

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  caption?: string
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('project_images').insert([
    {
      project_id: projectId,
      image_url: imageUrl,
      caption: caption || null,
      display_order: 0,
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}

export async function deleteProjectImage(id: string): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}
