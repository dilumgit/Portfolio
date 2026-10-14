import { Suspense } from 'react'
import Link from 'next/link'
import {
  Folder,
  Award,
  Code2,
  GraduationCap,
  FlaskConical,
  Briefcase,
  Trophy,
  MessageSquare,
  Plus,
  TrendingUp,
  User,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllProjects } from '@/lib/actions/projects'
import { getAllSkillCategories } from '@/lib/actions/skills'
import { getAllCertifications } from '@/lib/actions/certifications'
import { getAllEducation } from '@/lib/actions/education'
import {
  getAllResearch,
  getAllAchievements,
  getAllContactMessages,
} from '@/lib/actions/content'
import { getAllExperience } from '@/lib/actions/experience'
import { getProfile } from '@/lib/actions/profile'

async function DashboardStats() {
  const [
    projects,
    skillCategories,
    certifications,
    education,
    research,
    experience,
    achievements,
    messages,
    profile,
  ] = await Promise.all([
    getAllProjects(),
    getAllSkillCategories(),
    getAllCertifications(),
    getAllEducation(),
    getAllResearch(),
    getAllExperience(),
    getAllAchievements(),
    getAllContactMessages(),
    getProfile(),
  ])

  const totalSkills = skillCategories.reduce(
    (sum, cat) => sum + (cat.skills?.length || 0),
    0
  )
  const unreadMessages = messages.filter((m) => !m.is_read).length

  const stats = [
    { label: 'Projects', value: projects.length, icon: Folder, href: '/admin/projects', color: 'text-violet-400' },
    { label: 'Skills', value: totalSkills, icon: Code2, href: '/admin/skills', color: 'text-cyan-400' },
    { label: 'Certifications', value: certifications.length, icon: Award, href: '/admin/certifications', color: 'text-yellow-400' },
    { label: 'Education', value: education.length, icon: GraduationCap, href: '/admin/education', color: 'text-green-400' },
    { label: 'Research', value: research.length, icon: FlaskConical, href: '/admin/research', color: 'text-blue-400' },
    { label: 'Experience', value: experience.length, icon: Briefcase, href: '/admin/experience', color: 'text-orange-400' },
    { label: 'Achievements', value: achievements.length, icon: Trophy, href: '/admin/achievements', color: 'text-pink-400' },
    {
      label: 'Messages',
      value: unreadMessages,
      icon: MessageSquare,
      href: '/admin/contact',
      color: 'text-red-400',
      suffix: unreadMessages > 0 ? ' new' : '',
    },
  ]

  const quickActions = [
    { label: 'Manage Projects', href: '/admin/projects', icon: Folder },
    { label: 'Manage Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Manage Skills', href: '/admin/skills', icon: Code2 },
    { label: 'Edit Profile', href: '/admin/profile', icon: User },
    { label: 'View Portfolio', href: '/', icon: Eye, external: true },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.full_name || 'Administrator'} — manage your portfolio content
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/" target="_blank">
            <Eye className="w-4 h-4" />
            View Portfolio
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-violet-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold group-hover:text-violet-400 transition-colors">
                      {stat.value}
                      {stat.suffix || ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-violet-400 transition-colors">
                    {action.label}
                  </span>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Messages</CardTitle>
            <Link
              href="/admin/contact"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No messages yet
              </p>
            ) : (
              messages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-semibold text-sm shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{msg.name}</p>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {msg.subject || msg.message.slice(0, 40)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardStats />
    </Suspense>
  )
}
