'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createService, updateService, deleteService } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import type { Service } from '@/types/portfolio'

interface Props { services: Service[] }
const blank = { title: '', description: '', icon: '', is_visible: true, display_order: 0 }

export function ServicesClient({ services: initial }: Props) {
  const [services, setServices] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (s: Service) => { setEditingId(s.id); setForm({ title: s.title, description: s.description || '', icon: s.icon || '', is_visible: s.is_visible, display_order: s.display_order }); setShowForm(true) }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const data = { ...form, description: form.description || null, icon: form.icon || null }
      const result = editingId ? await updateService(editingId, data) : await createService(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteService(id)
    if (r.success) { setServices(p => p.filter(s => s.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Services / Expertise" description="Manage areas of expertise displayed on your portfolio" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Service</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Service</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Title" htmlFor="svc-title" required>
                <Input id="svc-title" placeholder="Machine Learning" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </FormField>
              <FormField label="Icon (emoji)" htmlFor="svc-icon" description="Use an emoji or icon name">
                <Input id="svc-icon" placeholder="🤖" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} />
              </FormField>
            </div>
            <FormField label="Description" htmlFor="svc-desc">
              <Textarea id="svc-desc" placeholder="Brief description of this service/area" className="min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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

      {services.length === 0 ? (
        <EmptyState title="No services" description="Add your areas of expertise" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Service</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <div key={s.id} className="glass-card p-5 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon || '⚡'}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{s.title}</h3>
                    {s.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}><Pencil className="w-3 h-3" /></Button>
                  <DeleteButton onDelete={() => handleDelete(s.id)} itemName={s.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
