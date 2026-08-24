'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Pencil, Code2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader, EmptyState, FormField, ToggleVisibility } from '@/components/admin/shared'
import { DeleteButton } from '@/components/admin/delete-button'
import {
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/lib/actions/skills'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { SkillCategory, Skill } from '@/types/portfolio'

type CategoryWithSkills = SkillCategory & { skills: Skill[] }

interface SkillsClientProps {
  categories: CategoryWithSkills[]
}

export function SkillsClient({ categories: initial }: SkillsClientProps) {
  const [categories, setCategories] = useState(initial)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(initial[0]?.id || null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState<string | null>(null)
  const [editingCat, setEditingCat] = useState<CategoryWithSkills | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isPending, startTransition] = useTransition()

  const [catForm, setCatForm] = useState({ name: '', description: '', is_visible: true, display_order: 0 })
  const [skillForm, setSkillForm] = useState({ name: '', level: '', years_of_experience: '', description: '', is_visible: true, display_order: 0 })

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await createSkillCategory({ ...catForm, description: catForm.description || null })
      if (result.success) {
        toast({ title: 'Category created', variant: 'success' as any })
        window.location.reload()
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteSkillCategory(id)
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast({ title: 'Category deleted', variant: 'success' as any })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
  }

  const handleAddSkill = (categoryId: string) => (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = {
        category_id: categoryId,
        name: skillForm.name,
        level: skillForm.level ? parseInt(skillForm.level) : null,
        years_of_experience: skillForm.years_of_experience ? parseInt(skillForm.years_of_experience) : null,
        description: skillForm.description || null,
        is_visible: skillForm.is_visible,
        display_order: skillForm.display_order,
      }

      let result
      if (editingSkill) {
        result = await updateSkill(editingSkill.id, data)
      } else {
        result = await createSkill(data)
      }

      if (result.success) {
        toast({ title: editingSkill ? 'Skill updated' : 'Skill added', variant: 'success' as any })
        window.location.reload()
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleDeleteSkill = async (id: string) => {
    const result = await deleteSkill(id)
    if (result.success) {
      setCategories((prev) =>
        prev.map((c) => ({ ...c, skills: c.skills.filter((s) => s.id !== id) }))
      )
      toast({ title: 'Skill deleted', variant: 'success' as any })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage skill categories and individual skills"
        action={
          <Button variant="gradient" onClick={() => { setShowCatForm(true); setEditingCat(null) }}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        }
      />

      {/* Category form */}
      {showCatForm && (
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold mb-4">New Skill Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Category Name" htmlFor="cat-name" required>
                <Input
                  id="cat-name"
                  placeholder="e.g. Machine Learning"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Description" htmlFor="cat-desc">
                <Input
                  id="cat-desc"
                  placeholder="Brief description"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                />
              </FormField>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCatForm(false)}>Cancel</Button>
              <Button type="submit" variant="gradient" size="sm" disabled={isPending}>Create</Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories list */}
      {categories.length === 0 ? (
        <EmptyState
          title="No skill categories"
          description="Create a skill category to start adding skills"
          action={
            <Button variant="gradient" onClick={() => setShowCatForm(true)}>
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="glass-card overflow-hidden">
              {/* Category header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-violet-400" />
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.skills.length} skills
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DeleteButton onDelete={() => handleDeleteCategory(category.id)} itemName={category.name} />
                  {expandedCategory === category.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Skills list */}
              {expandedCategory === category.id && (
                <div className="border-t border-border/50 p-5 space-y-4">
                  {/* Add skill form */}
                  {showSkillForm === category.id ? (
                    <form onSubmit={handleAddSkill(category.id)} className="glass-card p-4 space-y-4">
                      <h4 className="text-sm font-semibold">
                        {editingSkill ? 'Edit Skill' : 'Add Skill'}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField label="Skill Name" htmlFor="skill-name" required>
                          <Input
                            id="skill-name"
                            placeholder="e.g. Python"
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            required
                          />
                        </FormField>
                        <FormField label="Level (0-100)" htmlFor="skill-level">
                          <Input
                            id="skill-level"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            value={skillForm.level}
                            onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                          />
                        </FormField>
                        <FormField label="Years of Experience" htmlFor="skill-years">
                          <Input
                            id="skill-years"
                            type="number"
                            min="0"
                            placeholder="3"
                            value={skillForm.years_of_experience}
                            onChange={(e) => setSkillForm({ ...skillForm, years_of_experience: e.target.value })}
                          />
                        </FormField>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <ToggleVisibility
                            isVisible={skillForm.is_visible}
                            onChange={(v) => setSkillForm({ ...skillForm, is_visible: v })}
                          />
                          <span>Visible</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => { setShowSkillForm(null); setEditingSkill(null); setSkillForm({ name: '', level: '', years_of_experience: '', description: '', is_visible: true, display_order: 0 }) }}>Cancel</Button>
                        <Button type="submit" variant="gradient" size="sm" disabled={isPending}>
                          {editingSkill ? 'Update' : 'Add Skill'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSkillForm(category.id)
                        setEditingSkill(null)
                        setSkillForm({ name: '', level: '', years_of_experience: '', description: '', is_visible: true, display_order: 0 })
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </Button>
                  )}

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="relative group border border-border rounded-lg p-3 hover:border-violet-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{skill.name}</p>
                            {skill.level && (
                              <div className="mt-1 h-1 rounded-full bg-secondary/50 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {skill.level ? `${skill.level}%` : '—'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => {
                                setEditingSkill(skill)
                                setSkillForm({
                                  name: skill.name,
                                  level: skill.level?.toString() || '',
                                  years_of_experience: skill.years_of_experience?.toString() || '',
                                  description: skill.description || '',
                                  is_visible: skill.is_visible,
                                  display_order: skill.display_order,
                                })
                                setShowSkillForm(category.id)
                              }}
                              className="p-1 rounded text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
