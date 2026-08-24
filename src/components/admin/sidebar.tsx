'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Award,
  Code2,
  Folder,
  FlaskConical,
  Briefcase,
  Trophy,
  Layers,
  FileText,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  ChevronLeft,
  Cpu,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Qualifications', href: '/admin/qualifications', icon: Award },
  { label: 'Skills', href: '/admin/skills', icon: Code2 },
  { label: 'Projects', href: '/admin/projects', icon: Folder },
  { label: 'Research', href: '/admin/research', icon: FlaskConical },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { label: 'Services', href: '/admin/services', icon: Layers },
  { label: 'Resume', href: '/admin/resume', icon: FileText },
  { label: 'Contact', href: '/admin/contact', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-bold text-sm">Portfolio CMS</p>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'admin-sidebar-item',
                    isActive && 'active',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border/50 p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'admin-sidebar-item',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'View Portfolio' : undefined}
        >
          <Eye className="w-4 h-4 shrink-0 text-violet-400" />
          {!isCollapsed && (
            <span className="text-violet-400">View Portfolio</span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            'admin-sidebar-item w-full',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0 text-destructive" />
          {!isCollapsed && (
            <span className="text-destructive">Logout</span>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen sticky top-0 border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <ChevronLeft
            className={cn(
              'w-3 h-3 transition-transform',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>

        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border/50 z-50 md:hidden"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
