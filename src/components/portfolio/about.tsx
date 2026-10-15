'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Globe, Github, Linkedin, User } from 'lucide-react'
import Image from 'next/image'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types/portfolio'

interface AboutProps {
  profile: Profile | null
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function About({ profile }: AboutProps) {
  if (!profile) return null

  const contactItems = [
    profile.location && {
      icon: MapPin,
      label: 'Location',
      value: profile.location,
      href: null,
    },
    profile.email && {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
    profile.website && {
      icon: Globe,
      label: 'Website',
      value: profile.website,
      href: profile.website,
    },
    profile.github_url && {
      icon: Github,
      label: 'GitHub',
      value: profile.github_url.replace('https://github.com/', '@'),
      href: profile.github_url,
    },
    profile.linkedin_url && {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: profile.linkedin_url,
    },
  ].filter(Boolean)

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.15 }}
          className="space-y-16"
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
              <User className="w-3.5 h-3.5" />
              About Me
            </div>
            <h2 className="section-title">
              Who I <span className="gradient-text">Am</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Profile card */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="glass-card p-8 text-center space-y-6">
                {/* Avatar */}
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 opacity-75" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-background">
                    {profile.profile_image_url ? (
                      <Image
                        src={profile.profile_image_url}
                        alt={profile.full_name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {getInitials(profile.full_name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold">{profile.full_name}</h3>
                  <p className="text-violet-400 text-sm font-medium mt-1">
                    {profile.professional_title}
                  </p>
                  {profile.tagline && (
                    <p className="text-muted-foreground text-xs mt-2">
                      {profile.tagline}
                    </p>
                  )}
                </div>

                {/* Contact info */}
                <div className="space-y-3 text-left">
                  {contactItems.map((item) => {
                    if (!item) return null
                    const Icon = item.icon
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors truncate"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-muted-foreground truncate">
                            {item.value}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* About text */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-2 space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">
                  A passionate{' '}
                  <span className="gradient-text">AI/ML Engineer</span>{' '}
                  dedicated to intelligent systems
                </h3>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {profile.about_me ? (
                    profile.about_me.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        Welcome to my portfolio! I&apos;m passionate about the intersection of
                        artificial intelligence, machine learning, and software engineering.
                        My journey in technology has been driven by a deep curiosity about
                        how intelligent systems can solve complex real-world problems.
                      </p>
                      <p>
                        I specialize in developing and deploying machine learning models,
                        building data pipelines, and creating AI-powered applications.
                        My research interests span across deep learning, natural language
                        processing, computer vision, and generative AI.
                      </p>
                      <p>
                        When I&apos;m not coding or conducting research, I enjoy exploring
                        new technologies, contributing to open-source projects, and
                        sharing knowledge with the community.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Key highlights */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Focus Areas', value: 'AI · ML · Software Engineering' },
                  { label: 'Interests', value: 'Research · Generative AI · NLP' },
                  { label: 'Approach', value: 'Data-driven · Research-backed' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="glass-card p-4 space-y-1"
                  >
                    <p className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
