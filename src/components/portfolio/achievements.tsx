'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Achievement } from '@/types/portfolio'

interface AchievementsProps {
  achievements: Achievement[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Achievements({ achievements }: AchievementsProps) {
  if (!achievements.length) return null

  return (
    <section id="achievements" className="py-24 relative">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium">
              <Trophy className="w-3.5 h-3.5" />
              Achievements
            </div>
            <h2 className="section-title">
              Awards & <span className="gradient-text">Achievements</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Recognition, awards, and milestones throughout my journey
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {achievements.map((ach) => (
              <motion.div
                key={ach.id}
                whileHover={{ y: -4 }}
                className="glass-card p-6 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/20 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-orange-400 transition-colors">
                        {ach.title}
                      </h3>
                      {ach.organization && (
                        <p className="text-orange-400 text-xs mt-0.5">
                          {ach.organization}
                        </p>
                      )}
                    </div>
                  </div>

                  {ach.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {ach.date && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(ach.date)}
                      </span>
                    )}
                    {ach.category && (
                      <span className="badge-secondary text-xs">
                        {ach.category}
                      </span>
                    )}
                  </div>

                  {ach.url && (
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      View details →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
