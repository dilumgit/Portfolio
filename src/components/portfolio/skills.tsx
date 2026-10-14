'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SkillCategory, Skill } from '@/types/portfolio'

interface SkillsProps {
  categories: (SkillCategory & { skills: Skill[] })[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function SkillCard({ skill }: { skill: Skill }) {
  const level = skill.level || 0
  const levelLabel =
    level >= 90
      ? 'Expert'
      : level >= 75
      ? 'Advanced'
      : level >= 60
      ? 'Intermediate'
      : 'Beginner'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 group hover:border-violet-500/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-sm group-hover:text-violet-400 transition-colors">
          {skill.name}
        </span>
        {typeof skill.level === 'number' && skill.level > 0 && (
          <span className="text-xs text-muted-foreground">{levelLabel}</span>
        )}
      </div>

      {typeof skill.level === 'number' && skill.level > 0 && (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
            />
          </div>
          <p className="text-right text-xs text-muted-foreground">
            {skill.level}%
          </p>
        </div>
      )}

      {skill.years_of_experience && (
        <p className="text-xs text-muted-foreground mt-1">
          {skill.years_of_experience}y exp
        </p>
      )}
    </motion.div>
  )
}

export function Skills({ categories }: SkillsProps) {
  const visibleCategories = (categories || []).filter(
    (c) => c.skills && c.skills.filter((s) => s.is_visible).length > 0
  )

  const [activeCategory, setActiveCategory] = useState<string | null>(
    visibleCategories[0]?.id || null
  )

  if (!visibleCategories.length) return null

  const currentCategory =
    visibleCategories.find((c) => c.id === activeCategory) || visibleCategories[0]

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.15 }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
              <Code2 className="w-3.5 h-3.5" />
              Skills
            </div>
            <h2 className="section-title">
              Technical <span className="gradient-text-blue">Expertise</span>
            </h2>
            <p className="section-subtitle mx-auto">
              A comprehensive overview of my technical skills and proficiency levels
            </p>
          </motion.div>

          {/* Category tabs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/25'
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-violet-500/30'
                )}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-60">
                  ({category.skills.filter((s) => s.is_visible).length})
                </span>
              </button>
            ))}
          </motion.div>

          {/* Skills grid */}
          {currentCategory && (
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {currentCategory.description && (
                <p className="text-center text-muted-foreground text-sm">
                  {currentCategory.description}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentCategory.skills
                  .filter((s) => s.is_visible)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
              </div>
            </motion.div>
          )}

          {/* All categories overview */}
          <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCategories.map((category) => (
              <div key={category.id} className="glass-card p-5 space-y-3">
                <h4 className="font-semibold text-sm text-violet-400">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills
                    .filter((s) => s.is_visible)
                    .slice(0, 8)
                    .map((skill) => (
                      <span key={skill.id} className="badge-secondary text-xs">
                        {skill.name}
                      </span>
                    ))}
                  {category.skills.filter((s) => s.is_visible).length > 8 && (
                    <span className="badge-secondary text-xs">
                      +{category.skills.filter((s) => s.is_visible).length - 8} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
