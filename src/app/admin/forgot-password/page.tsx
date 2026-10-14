'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const origin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : ''

      const redirectTo = `${origin}/auth/callback?next=/admin/reset-password`

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        }
      )

      if (resetError) {
        setError(resetError.message)
      } else {
        setIsSubmitted(true)
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
    } finally {
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
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your admin email to receive a recovery link
              </p>
            </div>
          </div>

          {isSubmitted ? (
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
                  Check your email
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We have sent a password reset link to{' '}
                  <span className="font-medium text-foreground">{email}</span>.
                  Click the link in the email to set a new password.
                </p>
                <p className="text-xs text-muted-foreground pt-2">
                  Didn’t receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                >
                  Send another link
                </Button>

                <Button variant="ghost" className="w-full gap-2 text-sm" asChild>
                  <Link href="/admin/login">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="admin-reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-reset-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                    autoFocus
                  />
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
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Link...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground">
            This verification link will expire in 24 hours.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
