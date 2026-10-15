'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Folder,
  Github,
  ExternalLink,
  Star,
  ArrowRight,
  Filter,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn, truncateText } from '@/lib/utils'
import type { Project, ProjectImage } from '@/types/portfolio'

interface ProjectsProps {
  projects: (Project & { project_images: ProjectImage[] })[]
  featured?: boolean
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function ProjectCard({
  project,
}: {
  project: Project & { project_images: ProjectImage[] }
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group glass-card overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col"
    >
      {/* Project image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-900/40 to-cyan-900/40">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              <Folder />
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Featured badge */}
        {project.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 badge-primary text-xs">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}

        {/* Status */}
        {project.status && (
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'badge text-xs',
                project.status === 'Completed'
                  ? 'badge-success'
                  : project.status === 'In Progress'
                  ? 'badge-warning'
                  : 'badge-secondary'
              )}
            >
              {project.status}
            </span>
          </div>
        )}

        {/* Category */}
        {project.category && (
          <div className="absolute bottom-3 left-3">
            <span className="badge-secondary text-xs">{project.category}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-violet-400 transition-colors">
            {project.title}
          </h3>
          {project.short_description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncateText(project.short_description, 120)}
            </p>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="badge-secondary text-xs">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="badge-secondary text-xs">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                aria-label="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                aria-label="Live Demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function Projects({ projects, featured = false }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All')

  if (!projects.length) return null

  const categories = [
    'All',
    ...Array.from(
      new Set(projects.map((p) => p.category).filter(Boolean) as string[])
    ),
  ]

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const hasFeatured = projects.some((p) => p.is_featured)

  const displayProjects = featured
    ? (hasFeatured ? projects.filter((p) => p.is_featured) : projects).slice(0, 6)
    : filteredProjects

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
              <Folder className="w-3.5 h-3.5" />
              {featured
                ? hasFeatured
                  ? 'Featured Projects'
                  : 'Recent Projects'
                : 'Projects'}
            </div>
            <h2 className="section-title">
              {featured ? (
                hasFeatured ? (
                  <>
                    Featured <span className="gradient-text">Work</span>
                  </>
                ) : (
                  <>
                    Recent <span className="gradient-text">Projects</span>
                  </>
                )
              ) : (
                <>
                  All <span className="gradient-text">Projects</span>
                </>
              )}
            </h2>
            <p className="section-subtitle mx-auto">
              {featured
                ? hasFeatured
                  ? 'Highlighted projects showcasing my technical expertise'
                  : 'Recent technical projects and development work'
                : 'A comprehensive collection of projects and experiments'}
            </p>
          </motion.div>

          {/* Filter tabs (non-featured only) */}
          {!featured && categories.length > 2 && (
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    activeFilter === cat
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat === 'All' && <Filter className="w-3.5 h-3.5" />}
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {/* Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>

          {/* View all link */}
          {featured && projects.length > 3 && (
            <motion.div variants={fadeInUp} className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
