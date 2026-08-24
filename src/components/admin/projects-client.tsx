'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Folder, Star, Eye, EyeOff, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import { createProject, updateProject, deleteProject } from '@/lib/actions/projects'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { Project, ProjectImage } from '@/types/portfolio'

type ProjectWithImages = Project & { project_images: ProjectImage[] }

interface ProjectsClientProps {
  projects: ProjectWithImages[]
}

const defaultForm = {
  title: '',
  short_description: '',
  full_description: '',
  image_url: '',
  category: '',
  technologies: '',
  github_url: '',
  live_url: '',
  documentation_url: '',
  paper_url: '',
  start_date: '',
  end_date: '',
  status: 'In Progress',
  is_featured: false,
  is_visible: true,
  display_order: 0,
  key_features: '',
  challenges: '',
  solutions: '',
  results: '',
  my_role: '',
  team_info: '',
}

export function ProjectsClient({ projects: initial }: ProjectsClientProps) {
  const [projects, setProjects] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEdit = (project: ProjectWithImages) => {
    setEditingId(project.id)
    setForm({
      title: project.title,
      short_description: project.short_description || '',
      full_description: project.full_description || '',
      image_url: project.image_url || '',
      category: project.category || '',
      technologies: project.technologies?.join(', ') || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      documentation_url: project.documentation_url || '',
      paper_url: project.paper_url || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      status: project.status || 'In Progress',
      is_featured: project.is_featured,
      is_visible: project.is_visible,
      display_order: project.display_order,
      key_features: project.key_features?.join('\n') || '',
      challenges: project.challenges || '',
      solutions: project.solutions || '',
      results: project.results || '',
      my_role: project.my_role || '',
      team_info: project.team_info || '',
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = {
        title: form.title,
        short_description: form.short_description || null,
        full_description: form.full_description || null,
        image_url: form.image_url || null,
        category: form.category || null,
        technologies: form.technologies ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean) : null,
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        documentation_url: form.documentation_url || null,
        paper_url: form.paper_url || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: form.status || null,
        is_featured: form.is_featured,
        is_visible: form.is_visible,
        display_order: form.display_order,
        key_features: form.key_features ? form.key_features.split('\n').filter(Boolean) : null,
        challenges: form.challenges || null,
        solutions: form.solutions || null,
        results: form.results || null,
        my_role: form.my_role || null,
        team_info: form.team_info || null,
      }

      let result
      if (editingId) {
        result = await updateProject(editingId, data)
      } else {
        result = await createProject(data)
      }

      if (result.success) {
        toast({ title: editingId ? 'Project updated' : 'Project created', variant: 'success' as any })
        window.location.reload()
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id)
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast({ title: 'Project deleted', variant: 'success' as any })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        action={
          <Button variant="gradient" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        }
      />

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6 mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField label="Project Title" htmlFor="proj-title" required>
                <Input
                  id="proj-title"
                  placeholder="My Amazing Project"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Category" htmlFor="proj-cat">
                <Input
                  id="proj-cat"
                  placeholder="Machine Learning, Web App, Research..."
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </FormField>

              <FormField label="Status" htmlFor="proj-status">
                <select
                  id="proj-status"
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Archived">Archived</option>
                </select>
              </FormField>

              <FormField label="Image URL" htmlFor="proj-image">
                <Input
                  id="proj-image"
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </FormField>

              <FormField
                label="Technologies"
                htmlFor="proj-tech"
                description="Comma-separated: Python, TensorFlow, React"
              >
                <Input
                  id="proj-tech"
                  placeholder="Python, TensorFlow, React"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                />
              </FormField>

              <FormField label="GitHub URL" htmlFor="proj-github">
                <Input
                  id="proj-github"
                  placeholder="https://github.com/..."
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                />
              </FormField>

              <FormField label="Live Demo URL" htmlFor="proj-live">
                <Input
                  id="proj-live"
                  placeholder="https://demo.example.com"
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                />
              </FormField>

              <FormField label="Research Paper URL" htmlFor="proj-paper">
                <Input
                  id="proj-paper"
                  placeholder="https://arxiv.org/..."
                  value={form.paper_url}
                  onChange={(e) => setForm({ ...form, paper_url: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Short Description" htmlFor="proj-short">
              <Textarea
                id="proj-short"
                placeholder="A brief one-paragraph description for the project card"
                className="min-h-[80px]"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              />
            </FormField>

            <FormField label="Full Description" htmlFor="proj-full">
              <Textarea
                id="proj-full"
                placeholder="Detailed description for the project detail page"
                className="min-h-[140px]"
                value={form.full_description}
                onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              />
            </FormField>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Key Features"
                htmlFor="proj-features"
                description="One feature per line"
              >
                <Textarea
                  id="proj-features"
                  placeholder="Real-time processing&#10;95% accuracy&#10;REST API"
                  className="min-h-[100px]"
                  value={form.key_features}
                  onChange={(e) => setForm({ ...form, key_features: e.target.value })}
                />
              </FormField>

              <FormField label="My Role" htmlFor="proj-role">
                <Textarea
                  id="proj-role"
                  placeholder="Lead developer, ML engineer..."
                  className="min-h-[100px]"
                  value={form.my_role}
                  onChange={(e) => setForm({ ...form, my_role: e.target.value })}
                />
              </FormField>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="rounded"
                />
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                Featured project
              </label>

              <div className="flex items-center gap-2 text-sm">
                <ToggleVisibility
                  isVisible={form.is_visible}
                  onChange={(v) => setForm({ ...form, is_visible: v })}
                />
                <span>{form.is_visible ? 'Visible' : 'Hidden'}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/50 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isPending}>
                {isPending ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Showcase your work by adding your first project"
          action={
            <Button variant="gradient" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add First Project
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card overflow-hidden group">
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-violet-900/40 to-cyan-900/40">
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover opacity-80"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {project.is_featured && (
                    <span className="badge-primary text-xs">
                      <Star className="w-3 h-3" />
                    </span>
                  )}
                  <span className={project.is_visible ? 'badge-success text-xs' : 'badge-secondary text-xs'}>
                    {project.is_visible ? 'Live' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  {project.category && (
                    <p className="text-xs text-violet-400">{project.category}</p>
                  )}
                  {project.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {project.short_description}
                    </p>
                  )}
                </div>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="badge-secondary text-xs">{t}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="badge-secondary text-xs">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(project)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <DeleteButton onDelete={() => handleDelete(project.id)} itemName={project.title} />
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
