'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createResearch, updateResearch, deleteResearch } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import type { Research } from '@/types/portfolio'

interface Props { research: Research[] }

const blank = { title: '', abstract: '', research_area: '', research_question: '', methodology: '', technologies: '', publication_status: 'In Progress', conference_journal: '', publication_date: '', paper_url: '', doi: '', github_url: '', dataset_url: '', description: '', is_visible: true, display_order: 0 }

export function ResearchClient({ research: initial }: Props) {
  const [research, setResearch] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => { setEditingId(null); setForm(blank); setShowForm(true) }
  const openEdit = (r: Research) => {
    setEditingId(r.id)
    setForm({ title: r.title, abstract: r.abstract || '', research_area: r.research_area || '', research_question: r.research_question || '', methodology: r.methodology || '', technologies: r.technologies?.join(', ') || '', publication_status: r.publication_status || 'In Progress', conference_journal: r.conference_journal || '', publication_date: r.publication_date || '', paper_url: r.paper_url || '', doi: r.doi || '', github_url: r.github_url || '', dataset_url: r.dataset_url || '', description: r.description || '', is_visible: r.is_visible, display_order: r.display_order })
    setShowForm(true)
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    startTransition(async () => {
      const data = { ...form, abstract: form.abstract || null, research_area: form.research_area || null, research_question: form.research_question || null, methodology: form.methodology || null, technologies: form.technologies ? form.technologies.split(',').map(t=>t.trim()).filter(Boolean) : null, conference_journal: form.conference_journal || null, publication_date: form.publication_date || null, paper_url: form.paper_url || null, doi: form.doi || null, github_url: form.github_url || null, dataset_url: form.dataset_url || null, description: form.description || null }
      const result = editingId ? await updateResearch(editingId, data) : await createResearch(data)
      if (result.success) { toast({ title: 'Saved', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleDelete = async (id: string) => {
    const r = await deleteResearch(id)
    if (r.success) { setResearch(p => p.filter(x => x.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: r.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Research" description="Manage research projects and publications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Research</Button>} />

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Research</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Title" htmlFor="res-title" required>
                <Input id="res-title" placeholder="Research title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </FormField>
              <FormField label="Research Area" htmlFor="res-area">
                <Input id="res-area" placeholder="Machine Learning, NLP..." value={form.research_area} onChange={e => setForm({...form, research_area: e.target.value})} />
              </FormField>
              <FormField label="Publication Status" htmlFor="res-status">
                <select id="res-status" className="form-input" value={form.publication_status} onChange={e => setForm({...form, publication_status: e.target.value})}>
                  {['In Progress','Under Review','Published','Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Conference/Journal" htmlFor="res-conf">
                <Input id="res-conf" placeholder="IEEE, NeurIPS..." value={form.conference_journal} onChange={e => setForm({...form, conference_journal: e.target.value})} />
              </FormField>
              <FormField label="Publication Date" htmlFor="res-date">
                <Input id="res-date" type="month" value={form.publication_date} onChange={e => setForm({...form, publication_date: e.target.value})} />
              </FormField>
              <FormField label="Technologies (comma-separated)" htmlFor="res-tech">
                <Input id="res-tech" placeholder="Python, PyTorch..." value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} />
              </FormField>
              <FormField label="Paper URL" htmlFor="res-paper">
                <Input id="res-paper" placeholder="https://arxiv.org/..." value={form.paper_url} onChange={e => setForm({...form, paper_url: e.target.value})} />
              </FormField>
              <FormField label="DOI" htmlFor="res-doi">
                <Input id="res-doi" placeholder="10.xxxx/..." value={form.doi} onChange={e => setForm({...form, doi: e.target.value})} />
              </FormField>
              <FormField label="GitHub URL" htmlFor="res-gh">
                <Input id="res-gh" placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} />
              </FormField>
            </div>
            <FormField label="Abstract" htmlFor="res-abstract">
              <Textarea id="res-abstract" placeholder="Research abstract..." className="min-h-[100px]" value={form.abstract} onChange={e => setForm({...form, abstract: e.target.value})} />
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

      {research.length === 0 ? (
        <EmptyState title="No research records" description="Add your research projects and publications" action={<Button variant="gradient" onClick={openCreate}><Plus className="w-4 h-4" />Add Research</Button>} />
      ) : (
        <div className="space-y-4">
          {research.map(r => (
            <div key={r.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h3 className="font-semibold truncate">{r.title}</h3>
                  </div>
                  {r.research_area && <p className="text-xs text-cyan-400 mt-1">{r.research_area}</p>}
                  {r.publication_status && <span className="badge-secondary text-xs mt-1 inline-block">{r.publication_status}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={r.is_visible ? 'badge-success text-xs' : 'badge-secondary text-xs'}>{r.is_visible ? 'Visible' : 'Hidden'}</span>
                  <Button variant="outline" size="sm" onClick={() => openEdit(r)}><Pencil className="w-3 h-3" /></Button>
                  <DeleteButton onDelete={() => handleDelete(r.id)} itemName={r.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
