'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Download, ChevronRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import type { Profile, SocialLink, Resume } from '@/types/portfolio'

interface HeroProps {
  profile: Profile | null
  socialLinks: SocialLink[]
  resume: Resume | null
}

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(text.slice(0, currentText.length + 1))
          if (currentText.length === text.length) {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          setCurrentText(text.slice(0, currentText.length - 1))
          if (currentText.length === 0) {
            setIsDeleting(false)
            setCurrentIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, texts])

  return (
    <span className="gradient-text">
      {currentText}
      <span className="animate-blink border-r-2 border-violet-400 ml-0.5">&nbsp;</span>
    </span>
  )
}

const FloatingOrb = ({
  className,
  delay = 0,
}: {
  className: string
  delay?: number
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
    animate={{
      y: [-20, 20, -20],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
)

export function Hero({ profile, socialLinks, resume }: HeroProps) {
  const typewriterTexts = profile?.hero_subtitle
    ? [profile.hero_subtitle]
    : [
        'AI & ML Engineer',
        'Research Enthusiast',
        'Software Developer',
        'Data Scientist',
      ]

  const socialIconMap: Record<string, React.ReactNode> = {
    github: <Github className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid noise-overlay"
    >
      {/* Gradient orbs */}
      <FloatingOrb
        className="w-96 h-96 bg-violet-600 -top-20 -left-20"
        delay={0}
      />
      <FloatingOrb
        className="w-80 h-80 bg-cyan-600 -bottom-10 -right-10"
        delay={3}
      />
      <FloatingOrb
        className="w-64 h-64 bg-blue-600 top-1/2 left-1/3"
        delay={6}
      />

      {/* Radial gradient center glow */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-24">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for opportunities</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                {profile?.hero_heading || (
                  <>
                    Hi, I&apos;m{' '}
                    <span className="gradient-text">
                      {profile?.full_name || 'Your Name'}
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-semibold text-muted-foreground h-10"
              >
                <TypewriterText texts={typewriterTexts} />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              {profile?.hero_description ||
                profile?.tagline ||
                'Passionate about building intelligent systems that solve real-world problems. Specializing in machine learning, AI research, and software engineering.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" variant="gradient" asChild>
                <a
                  href={profile?.hero_cta_url || '#projects'}
                >
                  {profile?.hero_cta_text || 'View My Work'}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </Button>

              {resume ? (
                <Button size="lg" variant="outline" asChild>
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="w-4 h-4" />
                    {profile?.hero_secondary_cta_text || 'Download CV'}
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant="outline" asChild>
                  <a href="#contact">
                    {profile?.hero_secondary_cta_text || 'Get In Touch'}
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                  aria-label={link.platform}
                >
                  {socialIconMap[link.platform.toLowerCase()] || (
                    <span className="text-xs font-medium">
                      {link.platform.charAt(0)}
                    </span>
                  )}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Profile image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-violet-500/30 blur-xl animate-glow-pulse" />

              {/* Ring border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 opacity-75" />

              {/* Profile image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-background">
                {profile?.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {getInitials(profile?.full_name || 'YN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating tech badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-card px-3 py-2 text-xs font-medium text-cyan-400 border-cyan-500/20"
              >
                🤖 AI/ML
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 glass-card px-3 py-2 text-xs font-medium text-violet-400 border-violet-500/20"
              >
                💻 Software Dev
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
