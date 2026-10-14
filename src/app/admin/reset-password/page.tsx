'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lock,
  Eye,
  EyeOff,
  Cpu,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }

    const supabase = createClient()

    const verifySession = async () => {
      try {
        // 1. Try to get verified user directly
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setIsAuthenticated(true)
          setUserEmail(user.email || null)
          setIsVerifying(false)
          return
        }

        // 2. Fallback to active session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setIsAuthenticated(true)
          setUserEmail(session.user?.email || null)
          setIsVerifying(false)
          return
        }

        // 3. Listen for auth state change (in case of hash token recovery)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setIsAuthenticated(true)
            setUserEmail(session.user?.email || null)
            setIsVerifying(false)
          }
        })

        // Wait up to 1.8 seconds for auth verification
        const timeout = setTimeout(() => {
          setIsVerifying(false)
        }, 1800)

        return () => {
          subscription.unsubscribe()
          clearTimeout(timeout)
        }
      } catch (err: any) {
        console.error('Session verification error:', err)
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [searchParams])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        setIsLoading(false)
      } else {
        setIsSuccess(true)
        setIsLoading(false)
        // Automatically redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard')
          router.refresh()
        }, 2000)
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="glass-card p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Set New Password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {userEmail
                  ? `Setting password for ${userEmail}`
                  : 'Enter and confirm your new admin password'}
              </p>
            </div>
          </div>

          {isVerifying ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Verifying your recovery session...
              </p>
            </div>
          ) : isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  Password Updated Successfully!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your new password is now active. You will be able to log in
                  directly with your password going forward.
                </p>
              </div>

              <Button
                variant="gradient"
                className="w-full gap-2"
                onClick={() => {
                  router.push('/admin/dashboard')
                  router.refresh()
                }}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : !isAuthenticated ? (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  Recovery Session Required
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {error ||
                    'Please click the verification link sent to your email, or request a fresh password reset link.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="gradient" className="w-full" asChild>
                  <Link href="/admin/forgot-password">
                    Request New Reset Link
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <Link href="/admin/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="admin-new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                size="lg"
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving New Password...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save New Password</span>
                  </div>
                )}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Once saved, you can log in with this password from any device.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
