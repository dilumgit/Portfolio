'use client'

import React, { useState, useTransition } from 'react'
import { FileText, Upload, Trash2, CheckCircle, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader, EmptyState } from '@/components/admin/shared'
import { createResume, setActiveResume, deleteResume } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { Resume } from '@/types/portfolio'

interface Props { resumes: Resume[] }

export function ResumeClient({ resumes: initial }: Props) {
  const [resumes, setResumes] = useState(initial)
  const [fileUrl, setFileUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!fileUrl || !fileName) return
    startTransition(async () => {
      const result = await createResume({ file_url: fileUrl, file_name: fileName, file_size: null })
      if (result.success) { toast({ title: 'Resume added', variant: 'success' as any }); window.location.reload() }
      else toast({ title: 'Error', description: result.error, variant: 'destructive' })
    })
  }

  const handleSetActive = async (id: string) => {
    const result = await setActiveResume(id)
    if (result.success) {
      setResumes(p => p.map(r => ({ ...r, is_active: r.id === id })))
      toast({ title: 'Active resume updated', variant: 'success' as any })
    } else toast({ title: 'Error', description: result.error, variant: 'destructive' })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteResume(id)
    if (result.success) { setResumes(p => p.filter(r => r.id !== id)); toast({ title: 'Deleted', variant: 'success' as any }) }
    else toast({ title: 'Error', description: result.error, variant: 'destructive' })
  }

  return (
    <div>
      <PageHeader title="Resume / CV" description="Manage your downloadable CV files" />

      {/* Add resume form */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Resume</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your CV to Supabase Storage and paste the public URL below, or use any direct URL to your CV file.
        </p>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name <span className="text-destructive">*</span></label>
              <Input placeholder="My_CV_2024.pdf" value={fileName} onChange={e => setFileName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File URL <span className="text-destructive">*</span></label>
              <Input placeholder="https://supabase.co/storage/v1/..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" variant="gradient" disabled={isPending || !fileUrl || !fileName}>
            <Upload className="w-4 h-4" />
            {isPending ? 'Adding...' : 'Add Resume'}
          </Button>
        </form>
      </div>

      {/* Resume list */}
      {resumes.length === 0 ? (
        <EmptyState title="No resumes" description="Add your CV using the form above" />
      ) : (
        <div className="space-y-4">
          {resumes.map(r => (
            <div key={r.id} className={`glass-card p-5 flex items-center gap-4 transition-all ${r.is_active ? 'border-green-500/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.is_active ? 'bg-green-500/10 border border-green-500/20' : 'bg-secondary/50'}`}>
                <FileText className={`w-5 h-5 ${r.is_active ? 'text-green-400' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{r.file_name}</h3>
                  {r.is_active && <span className="badge-success text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" />Active</span>}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <ExternalLink className="w-4 h-4" />
                </a>
                {!r.is_active && (
                  <Button variant="outline" size="sm" onClick={() => handleSetActive(r.id)}>Set Active</Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
