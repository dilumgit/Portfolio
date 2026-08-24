'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react'
import Image from 'next/image'
import { formatDateRange, getInitials } from '@/lib/utils'
import type { Experience } from '@/types/portfolio'

interface ExperienceProps {
  experience: Experience[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const employmentTypeColors: Record<string, string> = {
  'Full-time': 'badge-success',
  'Part-time': 'badge-warning',
  Internship: 'badge-primary',
  Freelance: 'badge-secondary',
  Research: 'badge-primary',
  Volunteer: 'badge-secondary',
}

export function ExperienceSection({ experience }: ExperienceProps) {
  if (!experience.length) return null

  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
              <Briefcase className="w-3.5 h-3.5" />
              Experience
            </div>
            <h2 className="section-title">
              Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subtitle mx-auto">
              My work experience and professional development
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-8 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-background ring-2 ring-violet-500/30 ${
                      exp.is_current ? 'bg-green-500 ring-green-500/30' : 'bg-violet-500'
                    }`}
                  />

                  <div className="glass-card p-6 hover:border-violet-500/30 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      {/* Company logo */}
                      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border bg-secondary/50 flex items-center justify-center">
                        {exp.company_logo_url ? (
                          <Image
                            src={exp.company_logo_url}
                            alt={exp.company}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-violet-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-violet-400 transition-colors">
                              {exp.job_title}
                            </h3>
                            <p className="text-violet-400 font-medium text-sm">
                              {exp.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {exp.employment_type && (
                              <span
                                className={
                                  employmentTypeColors[exp.employment_type] ||
                                  'badge-secondary'
                                }
                              >
                                {exp.employment_type}
                              </span>
                            )}
                            {exp.is_current && (
                              <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">
                                Current
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {(exp.start_date || exp.end_date) && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDateRange(
                                exp.start_date,
                                exp.end_date,
                                exp.is_current
                              )}
                            </span>
                          )}
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </span>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {exp.description}
                          </p>
                        )}

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="space-y-1">
                            {exp.responsibilities.map((resp, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <span className="text-violet-400 shrink-0">▸</span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-1 border-l-2 border-violet-500/30 pl-3">
                            <p className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                              Key Achievements
                            </p>
                            {exp.achievements.map((ach, i) => (
                              <p
                                key={i}
                                className="text-sm text-muted-foreground"
                              >
                                🏆 {ach}
                              </p>
                            ))}
                          </div>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.technologies.map((tech) => (
                              <span key={tech} className="badge-secondary text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
