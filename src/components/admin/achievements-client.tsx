'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createAchievement, updateAchievement, deleteAchievement } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { Achievement } from '@/types/portfolio'

interface Props { achievements: Achievement[] }
const blank = { title: '', description: '', date: '', organization: '', image_url: '', certificate_url: '', url: '', category: '', is_visible: true, display_order: 0 }

export function AchievementsClient({ achievements: initial }: Props) {
  const [achievements, setAchievements] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (a: Achievement) => {
    setEditingId(a.id)
    setForm({ title: a.title, description: a.description || '', date: a.date || '', organization: a.organization || '', image_url: a.image_url || '', certificate_url: a.certificate_url || '', url: a.url || '', category: a.category || '', is_visible: a.is_visible, display_order: a.display_order })
    setShowForm(true)
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const data = { ...form, description: form.description || null, date: form.date || null, organization: form.organization || null, image_url: form.image_url || null, certificate_url: form.certificate_url || null, url: form.url || null, category: form.category || null }
      const result = editingId ? await updateAchievement(editingId, data) : await createAchievement(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteAchievement(id)
    if (r.success) { setAchievements(p => p.filter(a => a.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Achievements" description="Manage awards and recognitions" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Achievement</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Achievement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Title" htmlFor="ach-title" required>
                <Input id="ach-title" placeholder="Best Research Award" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </FormField>
              <FormField label="Organization" htmlFor="ach-org">
                <Input id="ach-org" placeholder="IEEE Conference" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} />
              </FormField>
              <FormField label="Date" htmlFor="ach-date">
                <Input id="ach-date" type="month" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </FormField>
              <FormField label="Category" htmlFor="ach-cat">
                <Input id="ach-cat" placeholder="Research, Competition..." value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </FormField>
              <FormField label="URL" htmlFor="ach-url">
                <Input id="ach-url" placeholder="https://..." value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
              </FormField>
            </div>
            <FormField label="Description" htmlFor="ach-desc">
              <Textarea id="ach-desc" placeholder="Describe this achievement..." className="min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </FormField>
            <div className="flex items-center gap-3">
              <ToggleVisibility isVisible={form.is_visible} onChange={v => setForm({...form, is_visible: v})} />
              <span className="text-sm">{form.is_visible ? 'Visible' : 'Hidden'}</span>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={isPending}>{isPending ? 'Saving...' : editingId ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </div>
      )}

      {achievements.length === 0 ? (
        <EmptyState title="No achievements" description="Add your awards and recognitions" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Achievement</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {achievements.map(a => (
            <div key={a.id} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{a.title}</h3>
                    {a.organization && <p className="text-xs text-orange-400">{a.organization}</p>}
                    {a.date && <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(a)}><Pencil className="w-3 h-3" /></Button>
                    <DeleteButton onDelete={() => handleDelete(a.id)} itemName={a.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
