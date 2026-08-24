'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Calendar, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  PageHeader,
  EmptyState,
  FormField,
  ToggleVisibility,
} from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/lib/actions/education'
import { toast } from '@/hooks/use-toast'
import { formatDateRange } from '@/lib/utils'
import type { Education } from '@/types/portfolio'

interface EducationClientProps {
  education: Education[]
}

interface EducationFormData {
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  grade: string
  location: string
  logo_url: string
  is_visible: boolean
  display_order: number
}

const defaultForm: EducationFormData = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  grade: '',
  location: '',
  logo_url: '',
  is_visible: true,
  display_order: 0,
}

export function EducationClient({ education: initialEducation }: EducationClientProps) {
  const [education, setEducation] = useState(initialEducation)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EducationFormData>(defaultForm)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setShowForm(true)
  }

  const openEdit = (edu: Education) => {
    setEditingId(edu.id)
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date || '',
      end_date: edu.end_date || '',
      is_current: edu.is_current,
      description: edu.description || '',
      grade: edu.grade || '',
      location: edu.location || '',
      logo_url: edu.logo_url || '',
      is_visible: edu.is_visible,
      display_order: edu.display_order,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        field_of_study: form.field_of_study || null,
        description: form.description || null,
        grade: form.grade || null,
        location: form.location || null,
        logo_url: form.logo_url || null,
      }

      let result
      if (editingId) {
        result = await updateEducation(editingId, data)
      } else {
        result = await createEducation(data)
      }

      if (result.success) {
        toast({
          title: editingId ? 'Education updated' : 'Education added',
          description: result.message,
          variant: 'success' as any,
        })
        // Refresh via page reload to get latest data
        window.location.reload()
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteEducation(id)
    if (result.success) {
      setEducation((prev) => prev.filter((e) => e.id !== id))
      toast({ title: 'Education deleted', variant: 'success' as any })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageHeader
        title="Education"
        description="Manage your educational background and academic history"
        action={
          <Button variant="gradient" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        }
      />

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField label="Institution" htmlFor="edu-institution" required>
                <Input
                  id="edu-institution"
                  placeholder="University of ..."
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Degree" htmlFor="edu-degree" required>
                <Input
                  id="edu-degree"
                  placeholder="B.Sc. / M.Sc. / PhD ..."
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Field of Study" htmlFor="edu-field">
                <Input
                  id="edu-field"
                  placeholder="Computer Science"
                  value={form.field_of_study}
                  onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
                />
              </FormField>

              <FormField label="Location" htmlFor="edu-location">
                <Input
                  id="edu-location"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </FormField>

              <FormField label="Start Date" htmlFor="edu-start">
                <Input
                  id="edu-start"
                  type="month"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </FormField>

              <FormField label="End Date" htmlFor="edu-end" description="Leave blank if currently enrolled">
                <Input
                  id="edu-end"
                  type="month"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  disabled={form.is_current}
                />
              </FormField>

              <FormField label="GPA / Grade" htmlFor="edu-grade">
                <Input
                  id="edu-grade"
                  placeholder="3.8 / 4.0"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                />
              </FormField>

              <FormField label="Logo URL" htmlFor="edu-logo">
                <Input
                  id="edu-logo"
                  placeholder="https://..."
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                />
              </FormField>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(e) => setForm({ ...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date })}
                  className="rounded"
                />
                Currently enrolled
              </label>

              <div className="flex items-center gap-2 text-sm">
                <ToggleVisibility
                  isVisible={form.is_visible}
                  onChange={(v) => setForm({ ...form, is_visible: v })}
                />
                <span>{form.is_visible ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>

            <FormField label="Description" htmlFor="edu-description">
              <Textarea
                id="edu-description"
                placeholder="Describe your studies, achievements..."
                className="min-h-[100px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </FormField>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isPending}>
                {isPending ? 'Saving...' : editingId ? 'Update' : 'Add Education'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {education.length === 0 ? (
        <EmptyState
          title="No education records"
          description="Add your educational background to showcase your academic journey"
          action={
            <Button variant="gradient" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add First Education
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="glass-card p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-violet-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-violet-400">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-xs text-muted-foreground">{edu.field_of_study}</p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={edu.is_visible ? 'badge-success' : 'badge-secondary'}>
                      {edu.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(edu)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <DeleteButton
                      onDelete={() => handleDelete(edu.id)}
                      itemName={edu.degree}
                    />
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
