'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResult } from '@/types/portfolio'

export async function uploadImage(
  formData: FormData,
  bucket: string = 'portfolio'
): Promise<ActionResult<{ url: string }>> {
  const supabase = createAdminClient()
  const file = formData.get('file') as File

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type. Only images are allowed.' }
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { success: false, error: 'File size exceeds 5MB limit.' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { success: true, data: { url: publicUrl } }
}

export async function uploadResume(
  formData: FormData
): Promise<ActionResult<{ url: string; name: string; size: number }>> {
  const supabase = createAdminClient()
  const file = formData.get('file') as File

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only PDF and Word documents are allowed.' }
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return { success: false, error: 'File size exceeds 10MB limit.' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `resume-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(data.path)

  return {
    success: true,
    data: { url: publicUrl, name: file.name, size: file.size },
  }
}

export async function deleteFile(
  path: string,
  bucket: string = 'portfolio'
): Promise<ActionResult> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
