'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'
import Image from 'next/image'
import { formatDateRange, getInitials, sortEducationReverseChronological } from '@/lib/utils'
import type { Education } from '@/types/portfolio'

interface EducationSectionProps {
  education: Education[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function EducationSection({ education }: EducationSectionProps) {
  if (!education.length) return null

  const sortedEducation = [...education].sort(sortEducationReverseChronological)

  return (
    <section id="education" className="py-24 relative">
      {/* Background accent */}
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
              <GraduationCap className="w-3.5 h-3.5" />
              Education
            </div>
            <h2 className="section-title">
              Academic <span className="gradient-text">Background</span>
            </h2>
            <p className="section-subtitle mx-auto">
              My educational journey and academic achievements
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />

            <div className="space-y-8">
              {sortedEducation.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-violet-500 border-2 border-background ring-2 ring-violet-500/30" />

                  <div className="glass-card p-6 hover:border-violet-500/30 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border bg-secondary/50 flex items-center justify-center">
                        {edu.logo_url ? (
                          <Image
                            src={edu.logo_url}
                            alt={edu.institution}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-violet-400">
                            {getInitials(edu.institution)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-violet-400 transition-colors">
                              {edu.degree}
                            </h3>
                            <p className="text-violet-400 font-medium text-sm">
                              {edu.institution}
                            </p>
                          </div>
                          {edu.is_current && (
                            <span className="badge-primary shrink-0">Current</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {edu.field_of_study && (
                            <span>{edu.field_of_study}</span>
                          )}
                          {(edu.start_date || edu.end_date) && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDateRange(
                                edu.start_date,
                                edu.end_date,
                                edu.is_current
                              )}
                            </span>
                          )}
                          {edu.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {edu.location}
                            </span>
                          )}
                          {edu.grade && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5" />
                              GPA: {edu.grade}
                            </span>
                          )}
                        </div>

                        {edu.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {edu.description}
                          </p>
                        )}

                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="space-y-1">
                            {edu.achievements.map((achievement, i) => (
                              <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-violet-400 shrink-0">▸</span>
                                {achievement}
                              </p>
                            ))}
                          </div>
                        )}

                        {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {edu.relevant_coursework.map((course) => (
                              <span key={course} className="badge-secondary text-xs">
                                {course}
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
