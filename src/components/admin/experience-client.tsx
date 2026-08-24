'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createExperience, updateExperience, deleteExperience } from '@/lib/actions/experience'
import { toast } from '@/hooks/use-toast'
import { formatDateRange } from '@/lib/utils'
import type { Experience } from '@/types/portfolio'

interface Props { experience: Experience[] }

const blank = { job_title: '', company: '', company_logo_url: '', employment_type: 'Full-time', start_date: '', end_date: '', is_current: false, location: '', description: '', responsibilities: '', technologies: '', achievements: '', is_visible: true, display_order: 0 }

export function ExperienceClient({ experience: initial }: Props) {
  const [experience, setExperience] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (e: Experience) => {
    setEditingId(e.id)
    setForm({ job_title: e.job_title, company: e.company, company_logo_url: e.company_logo_url || '', employment_type: e.employment_type || 'Full-time', start_date: e.start_date || '', end_date: e.end_date || '', is_current: e.is_current, location: e.location || '', description: e.description || '', responsibilities: e.responsibilities?.join('\n') || '', technologies: e.technologies?.join(', ') || '', achievements: e.achievements?.join('\n') || '', is_visible: e.is_visible, display_order: e.display_order })
    setShowForm(true)
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const data = { ...form, company_logo_url: form.company_logo_url || null, location: form.location || null, description: form.description || null, employment_type: form.employment_type || null, start_date: form.start_date || null, end_date: form.end_date || null, responsibilities: form.responsibilities ? form.responsibilities.split('\n').filter(Boolean) : null, technologies: form.technologies ? form.technologies.split(',').map(t=>t.trim()).filter(Boolean) : null, achievements: form.achievements ? form.achievements.split('\n').filter(Boolean) : null }
      const result = editingId ? await updateExperience(editingId, data) : await createExperience(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteExperience(id)
    if (r.success) { setExperience(p => p.filter(e => e.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Experience" description="Manage your work history" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Experience</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Experience</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Job Title" htmlFor="exp-title" required>
                <Input id="exp-title" placeholder="Senior ML Engineer" value={form.job_title} onChange={e => setForm({...form, job_title: e.target.value})} required />
              </FormField>
              <FormField label="Company" htmlFor="exp-company" required>
                <Input id="exp-company" placeholder="TechCorp Inc." value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
              </FormField>
              <FormField label="Employment Type" htmlFor="exp-type">
                <select id="exp-type" className="form-input" value={form.employment_type} onChange={e => setForm({...form, employment_type: e.target.value})}>
                  {['Full-time','Part-time','Internship','Freelance','Research','Volunteer','Contract'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label="Location" htmlFor="exp-loc">
                <Input id="exp-loc" placeholder="City, Country" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </FormField>
              <FormField label="Start Date" htmlFor="exp-start">
                <Input id="exp-start" type="month" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
              </FormField>
              <FormField label="End Date" htmlFor="exp-end">
                <Input id="exp-end" type="month" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} disabled={form.is_current} />
              </FormField>
              <FormField label="Technologies (comma-separated)" htmlFor="exp-tech">
                <Input id="exp-tech" placeholder="Python, TensorFlow, React" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} />
              </FormField>
              <FormField label="Company Logo URL" htmlFor="exp-logo">
                <Input id="exp-logo" placeholder="https://..." value={form.company_logo_url} onChange={e => setForm({...form, company_logo_url: e.target.value})} />
              </FormField>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_current} onChange={e => setForm({...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date})} /> Currently working here</label>
            <FormField label="Description" htmlFor="exp-desc">
              <Textarea id="exp-desc" placeholder="Brief role description" className="min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </FormField>
            <FormField label="Responsibilities (one per line)" htmlFor="exp-resp">
              <Textarea id="exp-resp" placeholder="Led team of 5 engineers&#10;Improved model accuracy by 20%" className="min-h-[100px]" value={form.responsibilities} onChange={e => setForm({...form, responsibilities: e.target.value})} />
            </FormField>
            <FormField label="Key Achievements (one per line)" htmlFor="exp-ach">
              <Textarea id="exp-ach" placeholder="Published 2 research papers" className="min-h-[80px]" value={form.achievements} onChange={e => setForm({...form, achievements: e.target.value})} />
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

      {experience.length === 0 ? (
        <EmptyState title="No experience records" description="Add your work history" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Experience</Button>} />
      ) : (
        <div className="space-y-4">
          {experience.map(exp => (
            <div key={exp.id} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold">{exp.job_title}</h3>
                    <p className="text-sm text-violet-400">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{formatDateRange(exp.start_date, exp.end_date, exp.is_current)} {exp.location ? `· ${exp.location}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={exp.is_visible ? 'badge-success text-xs' : 'badge-secondary text-xs'}>{exp.is_visible ? 'Visible' : 'Hidden'}</span>
                    <Button variant="outline" size="sm" onClick={() => openEdit(exp)}><Pencil className="w-3 h-3" /></Button>
                    <DeleteButton onDelete={() => handleDelete(exp.id)} itemName={exp.job_title} />
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
