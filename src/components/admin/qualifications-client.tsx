'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createQualification, updateQualification, deleteQualification } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { Qualification } from '@/types/portfolio'

interface Props { qualifications: Qualification[] }
const blank = { name: '', institution: '', issuing_organization: '', issue_date: '', description: '', certificate_url: '', credential_id: '', logo_url: '', is_visible: true, display_order: 0 }

export function QualificationsClient({ qualifications: initial }: Props) {
  const [qualifications, setQualifications] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (q: Qualification) => {
    setEditingId(q.id)
    setForm({ name: q.name, institution: q.institution || '', issuing_organization: q.issuing_organization || '', issue_date: q.issue_date || '', description: q.description || '', certificate_url: q.certificate_url || '', credential_id: q.credential_id || '', logo_url: q.logo_url || '', is_visible: q.is_visible, display_order: q.display_order })
    setShowForm(true)
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const data = { ...form, institution: form.institution || null, issuing_organization: form.issuing_organization || null, issue_date: form.issue_date || null, description: form.description || null, certificate_url: form.certificate_url || null, credential_id: form.credential_id || null, logo_url: form.logo_url || null }
      const result = editingId ? await updateQualification(editingId, data) : await createQualification(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteQualification(id)
    if (r.success) { setQualifications(p => p.filter(q => q.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Qualifications" description="Manage degrees, diplomas, and professional qualifications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Qualification</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Qualification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Qualification Name" htmlFor="qual-name" required>
                <Input id="qual-name" placeholder="B.Sc. Computer Science" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </FormField>
              <FormField label="Institution" htmlFor="qual-inst">
                <Input id="qual-inst" placeholder="University name" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} />
              </FormField>
              <FormField label="Issuing Organization" htmlFor="qual-org">
                <Input id="qual-org" placeholder="Issuing authority" value={form.issuing_organization} onChange={e => setForm({...form, issuing_organization: e.target.value})} />
              </FormField>
              <FormField label="Issue Date" htmlFor="qual-date">
                <Input id="qual-date" type="month" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} />
              </FormField>
              <FormField label="Credential ID" htmlFor="qual-cid">
                <Input id="qual-cid" placeholder="ABC123" value={form.credential_id} onChange={e => setForm({...form, credential_id: e.target.value})} />
              </FormField>
              <FormField label="Certificate URL" htmlFor="qual-curl">
                <Input id="qual-curl" placeholder="https://..." value={form.certificate_url} onChange={e => setForm({...form, certificate_url: e.target.value})} />
              </FormField>
            </div>
            <FormField label="Description" htmlFor="qual-desc">
              <Textarea id="qual-desc" placeholder="Brief description" className="min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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

      {qualifications.length === 0 ? (
        <EmptyState title="No qualifications" description="Add your academic and professional qualifications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Qualification</Button>} />
      ) : (
        <div className="space-y-4">
          {qualifications.map(q => (
            <div key={q.id} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{q.name}</h3>
                    {q.institution && <p className="text-xs text-green-400">{q.institution}</p>}
                    {q.issue_date && <p className="text-xs text-muted-foreground">{formatDate(q.issue_date)}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(q)}><Pencil className="w-3 h-3" /></Button>
                    <DeleteButton onDelete={() => handleDelete(q.id)} itemName={q.name} />
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
