import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Asserts that the current request is from an authenticated administrator.
 * Throws an Error with 'Unauthorized' if the session is invalid or the user's email
 * does not match the configured ADMIN_EMAIL.
 *
 * Returns the authenticated Supabase User object upon success.
 */
export async function assertAdmin(): Promise<User> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: Authentication required.')
  }

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (configuredAdminEmail) {
    const userEmail = user.email?.trim().toLowerCase()
    if (!userEmail || userEmail !== configuredAdminEmail) {
      throw new Error('Unauthorized: Administrator privileges required.')
    }
  }

  return user
}

/**
 * Safe helper for Server Actions that return an ActionResult.
 * Returns { authorized: true, user } if valid, or { authorized: false, error } if unauthorized.
 */
export async function verifyAdmin(): Promise<
  | { authorized: true; user: User }
  | { authorized: false; error: string }
> {
  try {
    const user = await assertAdmin()
    return { authorized: true, user }
  } catch (err: any) {
    return {
      authorized: false,
      error: err?.message || 'Unauthorized: Administrator privileges required.',
    }
  }
}
