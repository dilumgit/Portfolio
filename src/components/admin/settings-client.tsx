'use client'

import React, { useState, useTransition } from 'react'
import { Save, Settings, Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PageHeader, FormField } from '@/components/admin/shared'
import { updateSiteSettings } from '@/lib/actions/content'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface Props { settings: Record<string, string> }

export function SettingsClient({ settings: initial }: Props) {
  const [settings, setSettings] = useState(initial)
  const [isPending, startTransition] = useTransition()

  // Password reset state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const result = await updateSiteSettings(settings)
      if (result.success) toast({ title: 'Settings saved', variant: 'success' as any })
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      })
      return
    }

    setIsUpdatingPassword(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        toast({
          title: 'Error updating password',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Password Updated!',
          description: 'Your new password is now active. You can log in with it next time.',
          variant: 'success' as any,
        })
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to update password.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const updateField = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader title="Site Settings" description="Configure SEO, analytics, and admin security settings" />

      {/* Security & Password */}
      <div className="glass-card p-6 space-y-6 border-violet-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Admin Password & Security</h2>
            <p className="text-sm text-muted-foreground">
              Set or update your admin password so you can log in directly without email verification
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings-new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="settings-new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="settings-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEO */}
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">SEO Settings</h2>
            <p className="text-sm text-muted-foreground">Metadata for search engines and social sharing</p>
          </div>

          <FormField label="Site Title" htmlFor="set-title">
            <Input id="set-title" placeholder="Your Name | AI & ML Engineer" value={settings.site_title || ''} onChange={e => updateField('site_title', e.target.value)} />
          </FormField>

          <FormField label="Meta Description" htmlFor="set-desc" description="Short description for search engine results (max 160 chars)">
            <Textarea id="set-desc" placeholder="Personal portfolio of..." className="min-h-[80px]" value={settings.meta_description || ''} onChange={e => updateField('meta_description', e.target.value)} maxLength={160} />
            <p className="text-xs text-muted-foreground text-right">{(settings.meta_description || '').length}/160</p>
          </FormField>

          <FormField label="Keywords" htmlFor="set-keywords" description="Comma-separated SEO keywords">
            <Input id="set-keywords" placeholder="AI, Machine Learning, Python, Research" value={settings.meta_keywords || ''} onChange={e => updateField('meta_keywords', e.target.value)} />
          </FormField>

          <FormField label="Site URL" htmlFor="set-url" description="Your deployed portfolio URL">
            <Input id="set-url" placeholder="https://yourname.vercel.app" value={settings.site_url || ''} onChange={e => updateField('site_url', e.target.value)} />
          </FormField>
        </div>

        {/* Analytics */}
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Analytics</h2>
            <p className="text-sm text-muted-foreground">Connect analytics services</p>
          </div>

          <FormField label="Google Analytics ID" htmlFor="set-ga" description="e.g. G-XXXXXXXXXX">
            <Input id="set-ga" placeholder="G-XXXXXXXXXX" value={settings.google_analytics_id || ''} onChange={e => updateField('google_analytics_id', e.target.value)} />
          </FormField>
        </div>

        {/* Contact settings */}
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Contact Form</h2>
            <p className="text-sm text-muted-foreground">Configure contact form behavior</p>
          </div>

          <FormField label="Notification Email" htmlFor="set-notif-email" description="Email address to receive contact form submissions">
            <Input id="set-notif-email" type="email" placeholder="you@example.com" value={settings.notification_email || ''} onChange={e => updateField('notification_email', e.target.value)} />
          </FormField>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gradient" size="lg" disabled={isPending}>
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Settings</>}
          </Button>
        </div>
      </form>
    </div>
  )
}

