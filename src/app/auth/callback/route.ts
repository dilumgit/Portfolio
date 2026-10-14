import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/admin/reset-password'
  const errorParam = searchParams.get('error')
  const errorDesc = searchParams.get('error_description')

  // If Supabase already provided an error in query params
  if (errorParam || errorDesc) {
    const message = errorDesc || errorParam || 'Email verification link is invalid or expired.'
    return NextResponse.redirect(
      `${origin}/admin/reset-password?error=${encodeURIComponent(message)}`
    )
  }

  const supabase = await createClient()

  // 1. Verify token_hash if provided (standard Supabase email link flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('Error verifying token hash:', error.message)
    return NextResponse.redirect(
      `${origin}/admin/reset-password?error=${encodeURIComponent(error.message)}`
    )
  }

  // 2. Exchange PKCE code if provided
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('Error exchanging PKCE code:', error.message)
  }

  // 3. Fallback: check if the session is already authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // If unauthenticated and no valid token/code, redirect to reset-password with message
  return NextResponse.redirect(
    `${origin}/admin/reset-password?error=${encodeURIComponent(
      'The password reset link is invalid or has expired. Please request a new one.'
    )}`
  )
}
