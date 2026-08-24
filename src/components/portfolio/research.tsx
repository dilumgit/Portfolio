'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, ExternalLink, Github, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Research } from '@/types/portfolio'

interface ResearchSectionProps {
  research: Research[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const statusColors: Record<string, string> = {
  Published: 'badge-success',
  'Under Review': 'badge-warning',
  'In Progress': 'badge-primary',
  Completed: 'badge-success',
}

export function ResearchSection({ research }: ResearchSectionProps) {
  if (!research.length) return null

  return (
    <section id="research" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
              <FlaskConical className="w-3.5 h-3.5" />
              Research
            </div>
            <h2 className="section-title">
              Research <span className="gradient-text-blue">Work</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Academic research, publications, and ongoing investigations
            </p>
          </motion.div>

          {/* Research cards */}
          <div className="space-y-6">
            {research.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  {item.image_url && (
                    <div className="lg:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-secondary/50">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        width={192}
                        height={144}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.research_area && (
                          <p className="text-cyan-400 text-sm font-medium">
                            {item.research_area}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.publication_status && (
                          <span
                            className={
                              statusColors[item.publication_status] ||
                              'badge-secondary'
                            }
                          >
                            {item.publication_status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Abstract */}
                    {item.abstract && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {item.abstract}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {item.conference_journal && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {item.conference_journal}
                        </span>
                      )}
                      {item.publication_date && (
                        <span>{formatDate(item.publication_date)}</span>
                      )}
                      {item.doi && (
                        <span className="font-mono">DOI: {item.doi}</span>
                      )}
                    </div>

                    {/* Technologies */}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span key={tech} className="badge-secondary text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      {item.paper_url && (
                        <a
                          href={item.paper_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Read Paper
                        </a>
                      )}
                      {item.github_url && (
                        <a
                          href={item.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
