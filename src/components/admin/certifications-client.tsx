'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Award, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createCertification, updateCertification, deleteCertification } from '@/lib/actions/certifications'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { Certification } from '@/types/portfolio'

interface Props { certifications: Certification[] }

const blank = { name: '', issuing_organization: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', image_url: '', description: '', is_visible: true, display_order: 0 }

export function CertificationsClient({ certifications: initial }: Props) {
  const [certs, setCerts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (c: Certification) => {
    setEditingId(c.id)
    setForm({ name: c.name, issuing_organization: c.issuing_organization, issue_date: c.issue_date || '', expiry_date: c.expiry_date || '', credential_id: c.credential_id || '', credential_url: c.credential_url || '', image_url: c.image_url || '', description: c.description || '', is_visible: c.is_visible, display_order: c.display_order })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = { ...form, issue_date: form.issue_date || null, expiry_date: form.expiry_date || null, credential_id: form.credential_id || null, credential_url: form.credential_url || null, image_url: form.image_url || null, description: form.description || null }
      const result = editingId ? await updateCertification(editingId, data) : await createCertification(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteCertification(id)
    if (r.success) { setCerts(p => p.filter(c => c.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Certifications" description="Manage your professional certifications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Certification</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8 space-y-6">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit' : 'Add'} Certification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Certification Name" htmlFor="cert-name" required>
                <Input id="cert-name" placeholder="AWS Solutions Architect" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </FormField>
              <FormField label="Issuing Organization" htmlFor="cert-org" required>
                <Input id="cert-org" placeholder="Amazon Web Services" value={form.issuing_organization} onChange={e => setForm({...form, issuing_organization: e.target.value})} required />
              </FormField>
              <FormField label="Issue Date" htmlFor="cert-issue">
                <Input id="cert-issue" type="month" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} />
              </FormField>
              <FormField label="Expiry Date" htmlFor="cert-expiry">
                <Input id="cert-expiry" type="month" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} />
              </FormField>
              <FormField label="Credential ID" htmlFor="cert-cid">
                <Input id="cert-cid" placeholder="ABC123XYZ" value={form.credential_id} onChange={e => setForm({...form, credential_id: e.target.value})} />
              </FormField>
              <FormField label="Credential URL" htmlFor="cert-curl">
                <Input id="cert-curl" placeholder="https://..." value={form.credential_url} onChange={e => setForm({...form, credential_url: e.target.value})} />
              </FormField>
              <FormField label="Certificate Image URL" htmlFor="cert-img">
                <Input id="cert-img" placeholder="https://..." value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
              </FormField>
            </div>
            <FormField label="Description" htmlFor="cert-desc">
              <Textarea id="cert-desc" placeholder="Brief description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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

      {certs.length === 0 ? (
        <EmptyState title="No certifications" description="Add your professional certifications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Certification</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert.id} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{cert.name}</h3>
                    <p className="text-xs text-yellow-400">{cert.issuing_organization}</p>
                    {cert.issue_date && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{formatDate(cert.issue_date)}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cert.is_visible ? 'badge-success text-xs' : 'badge-secondary text-xs'}>{cert.is_visible ? 'Visible' : 'Hidden'}</span>
                    <Button variant="outline" size="sm" onClick={() => openEdit(cert)}><Pencil className="w-3 h-3" /></Button>
                    <DeleteButton onDelete={() => handleDelete(cert.id)} itemName={cert.name} />
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
