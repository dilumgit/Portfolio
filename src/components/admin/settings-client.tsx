'use client'

import React, { useState, useTransition } from 'react'
import { Save, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, FormField } from '@/components/admin/shared'
import { updateSiteSettings } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'

interface Props { settings: Record<string, string> }

export function SettingsClient({ settings: initial }: Props) {
  const [settings, setSettings] = useState(initial)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const result = await updateSiteSettings(settings)
      if (result.success) toast({ title: 'Settings saved', variant: 'success' as any })
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const updateField = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <PageHeader title="Site Settings" description="Configure SEO, analytics, and global settings" />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
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
