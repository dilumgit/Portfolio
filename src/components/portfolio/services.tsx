'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import type { Service } from '@/types/portfolio'

interface ServicesProps {
  services: Service[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const defaultIcons: Record<string, string> = {
  'Machine Learning': '🤖',
  'Artificial Intelligence': '🧠',
  'Software Engineering': '💻',
  'Data Science': '📊',
  'Data Mining': '⛏️',
  'Generative AI': '✨',
  'Agentic AI': '🦾',
  'NLP': '💬',
  'Computer Vision': '👁️',
  'Research': '🔬',
  'Web Development': '🌐',
  'Deep Learning': '🔮',
}

export function Services({ services }: ServicesProps) {
  if (!services.length) return null

  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
              <Layers className="w-3.5 h-3.5" />
              Services
            </div>
            <h2 className="section-title">
              Areas of <span className="gradient-text">Expertise</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Domains where I can contribute value and drive impact
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card p-6 text-center hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 group"
              >
                <div className="text-4xl mb-4">
                  {service.icon || defaultIcons[service.title] || '⚡'}
                </div>
                <h3 className="font-semibold text-sm group-hover:text-violet-400 transition-colors mb-2">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
