'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Certification } from '@/types/portfolio'

interface CertificationsProps {
  certifications: Certification[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Certifications({ certifications }: CertificationsProps) {
  if (!certifications.length) return null

  return (
    <section id="certifications" className="py-24 relative">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium">
              <Award className="w-3.5 h-3.5" />
              Certifications
            </div>
            <h2 className="section-title">
              Professional <span className="gradient-text">Certifications</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Industry certifications and professional development credentials
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ y: -4 }}
                className="glass-card p-6 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 flex flex-col gap-4"
              >
                {/* Header with logo and org */}
                <div className="flex items-start gap-4">
                  {cert.image_url ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-white/10 shrink-0">
                      <Image
                        src={cert.image_url}
                        alt={cert.issuing_organization}
                        width={56}
                        height={56}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-yellow-400 text-xs font-medium mt-1">
                      {cert.issuing_organization}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  {cert.issue_date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Issued: {formatDate(cert.issue_date)}
                        {cert.expiry_date &&
                          ` · Expires: ${formatDate(cert.expiry_date)}`}
                      </span>
                    </div>
                  )}

                  {cert.credential_id && (
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {cert.credential_id}
                    </p>
                  )}

                  {cert.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Credential link */}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors mt-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify Credential
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
