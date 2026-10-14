'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/portfolio'

export async function uploadProfileImage(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  try {
    const supabase = createAdminClient()
    const file = formData.get('file') as File

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
      }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds the 5MB limit.' }
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `profile/avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const bucketName = 'profile-images'

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage upload error:', error.message)
      return { success: false, error: `Upload failed: ${error.message}` }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path)

    // Automatically update the profile record in Supabase
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, profile_image_url')
      .limit(1)
      .maybeSingle()

    if (existingProfile?.id) {
      // Remove previous image from storage if it was hosted in profile-images
      if (
        existingProfile.profile_image_url &&
        existingProfile.profile_image_url.includes('/profile-images/')
      ) {
        try {
          const oldPath = existingProfile.profile_image_url.split('/profile-images/')[1]
          if (oldPath) {
            await supabase.storage.from(bucketName).remove([oldPath])
          }
        } catch {
          // Non-blocking cleanup
        }
      }

      await supabase
        .from('profiles')
        .update({
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
    }

    revalidatePath('/')
    revalidatePath('/admin/profile')

    return {
      success: true,
      data: { url: publicUrl },
      message: 'Profile image uploaded successfully',
    }
  } catch (err: any) {
    console.error('Unexpected error in uploadProfileImage:', err)
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while uploading image.',
    }
  }
}

export async function removeProfileImage(): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  try {
    const supabase = createAdminClient()

    const { data: existingProfile, error: fetchErr } = await supabase
      .from('profiles')
      .select('id, profile_image_url')
      .limit(1)
      .maybeSingle()

    if (fetchErr) {
      return { success: false, error: fetchErr.message }
    }

    if (existingProfile?.profile_image_url) {
      const bucketName = 'profile-images'
      if (existingProfile.profile_image_url.includes('/profile-images/')) {
        const oldPath = existingProfile.profile_image_url.split('/profile-images/')[1]
        if (oldPath) {
          await supabase.storage.from(bucketName).remove([oldPath])
        }
      } else if (existingProfile.profile_image_url.includes('/portfolio-images/')) {
        const oldPath = existingProfile.profile_image_url.split('/portfolio-images/')[1]
        if (oldPath) {
          await supabase.storage.from('portfolio-images').remove([oldPath])
        }
      }

      await supabase
        .from('profiles')
        .update({
          profile_image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
    }

    revalidatePath('/')
    revalidatePath('/admin/profile')

    return { success: true, message: 'Profile image removed successfully' }
  } catch (err: any) {
    console.error('Unexpected error in removeProfileImage:', err)
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while removing image.',
    }
  }
}

export async function uploadImage(
  formData: FormData,
  bucket: string = 'portfolio-images'
): Promise<ActionResult<{ url: string }>> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

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
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

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
    .from('resume')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('resume')
    .getPublicUrl(data.path)

  return {
    success: true,
    data: { url: publicUrl, name: file.name, size: file.size },
  }
}

export async function deleteFile(
  path: string,
  bucket: string = 'portfolio-images'
): Promise<ActionResult> {
  const auth = await verifyAdmin()
  if (!auth.authorized) {
    return { success: false, error: auth.error }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
