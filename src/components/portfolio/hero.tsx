'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Download, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import type { Profile, SocialLink, Resume } from '@/types/portfolio'

interface HeroProps {
  profile: Profile | null
  socialLinks: SocialLink[]
  resume: Resume | null
}

export function Hero({ profile, socialLinks, resume }: HeroProps) {
  const socialIconMap: Record<string, React.ReactNode> = {
    github: <Github className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background bg-grid noise-overlay"
    >
      {/* Soft stationary ambient glows */}
      <div className="pointer-events-none absolute -top-28 -left-28 w-[500px] h-[500px] bg-violet-600/12 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-28 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-violet-950/15 via-background/40 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-screen py-24 sm:py-28">
          {/* Left Column: Text content (approx 55-60% width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300 text-xs sm:text-sm font-medium tracking-wide shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for opportunities</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
              >
                {profile?.hero_heading || (
                  <>
                    Hi! I&apos;m{' '}
                    <span className="gradient-text">
                      {profile?.full_name?.split(' ')[0] || 'Dilum'}
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
              >
                <span className="gradient-text">
                  {profile?.hero_subtitle ||
                    profile?.professional_title ||
                    'AI & ML Enthusiast'}
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              {profile?.hero_description ||
                profile?.tagline ||
                'Exploring AI and Machine Learning to build intelligent solutions'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Button
                size="lg"
                variant="gradient"
                className="h-12 px-7 text-base font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
                asChild
              >
                <a href={profile?.hero_cta_url || '#projects'}>
                  {profile?.hero_cta_text || 'View My Work'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 text-base font-semibold border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-300"
                asChild
              >
                {profile?.hero_secondary_cta_url ? (
                  <a href={profile.hero_secondary_cta_url}>
                    {profile?.hero_secondary_cta_text || 'Get In Touch'}
                  </a>
                ) : resume && profile?.hero_secondary_cta_text?.toLowerCase().includes('cv') ? (
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {profile.hero_secondary_cta_text}
                  </a>
                ) : (
                  <a href="#contact">
                    {profile?.hero_secondary_cta_text || 'Get In Touch'}
                  </a>
                )}
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3 pt-2"
            >
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/40 transition-all duration-200"
                  aria-label={link.platform}
                >
                  {socialIconMap[link.platform.toLowerCase()] || (
                    <span className="text-xs font-semibold uppercase px-1">
                      {link.platform.slice(0, 2)}
                    </span>
                  )}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Profile Image (approx 40-45% width, standing on its own) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center lg:justify-end items-center"
          >
            <div className="relative">
              {/* Soft ambient lighting glow behind portrait */}
              <div className="absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr from-violet-600/25 via-purple-600/15 to-cyan-500/20 blur-3xl opacity-75 pointer-events-none" />

              {/* Clean portrait container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[390px] lg:h-[390px] xl:w-[430px] xl:h-[430px] rounded-full overflow-hidden border border-white/15 bg-secondary/30 shadow-2xl shadow-violet-950/40">
                {profile?.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={profile.full_name || 'Profile'}
                    fill
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 390px, 430px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600/80 via-purple-700/80 to-cyan-600/80 flex items-center justify-center">
                    <span className="text-6xl sm:text-7xl font-bold text-white tracking-wider">
                      {getInitials(profile?.full_name || 'DK')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-1.5 text-xs font-medium tracking-widest uppercase"
            aria-label="Scroll to About section"
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

