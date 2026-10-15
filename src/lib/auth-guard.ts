import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Asserts that the current request is from the authenticated portfolio owner.
 * Strictly enforces a fail-closed model:
 * 1. ADMIN_EMAIL must be configured in the environment.
 * 2. The user must be authenticated via Supabase Auth (server-verified session).
 * 3. The user's email must match ADMIN_EMAIL (case-insensitive, trimmed).
 *
 * If any condition fails, an unauthorized error is thrown immediately.
 * Returns the authenticated Supabase User object upon success.
 */
export async function assertAdmin(): Promise<User> {
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!configuredAdminEmail) {
    console.error('CRITICAL SECURITY CONFIGURATION: ADMIN_EMAIL is not set in the environment.')
    throw new Error('Unauthorized: Administrator privileges required.')
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: Authentication required.')
  }

  const userEmail = user.email?.trim().toLowerCase()
  if (!userEmail || userEmail !== configuredAdminEmail) {
    console.warn(`Unauthorized access denied: ${user.email || 'unknown'} is not the authorized owner (${configuredAdminEmail}).`)
    throw new Error('Unauthorized: Administrator privileges required.')
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
