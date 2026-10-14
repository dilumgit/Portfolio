'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, Heart, ExternalLink } from 'lucide-react'
import type { Profile, SocialLink } from '@/types/portfolio'

interface FooterProps {
  profile: Profile | null
  socialLinks: SocialLink[]
}

export function Footer({ profile, socialLinks }: FooterProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const year = new Date().getFullYear()

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Research', href: '#research' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="border-t border-border/50 py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {profile?.full_name?.charAt(0) || 'P'}
              </div>
              <span className="font-semibold">
                {profile?.full_name || 'Portfolio'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {profile?.tagline ||
                'AI & ML Engineer passionate about building intelligent systems.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={isHomePage ? link.href : `/${link.href}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all"
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
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.location && `📍 ${profile.location}`}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {year} {profile?.full_name || 'Portfolio'}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with{' '}
              <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> using
              Next.js & Supabase
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
