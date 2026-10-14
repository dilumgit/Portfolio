export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Layers,
  Star,
  CheckCircle2,
  FileText,
  BookOpen,
  User,
  Users,
  Lightbulb,
  Trophy,
} from 'lucide-react'
import { Navigation } from '@/components/portfolio/navigation'
import { Footer } from '@/components/portfolio/footer'
import { Button } from '@/components/ui/button'
import { getProfile, getSocialLinks } from '@/lib/actions/profile'
import { getProjectBySlug } from '@/lib/actions/projects'
import { getActiveResume } from '@/lib/actions/content'
import { formatDateRange, cn } from '@/lib/utils'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
    }
  }

  const title = `${project.title} | Projects`
  const description =
    project.short_description ||
    project.full_description?.slice(0, 160) ||
    'Project details'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: project.image_url ? [{ url: project.image_url }] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const [profile, socialLinks, resume, project] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getActiveResume(),
    getProjectBySlug(params.slug),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navigation profile={profile} resume={resume} />

      <main className="pt-24 pb-20 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Project Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {project.category && (
                <span className="badge-primary text-xs uppercase tracking-wider font-semibold">
                  {project.category}
                </span>
              )}
              {project.status && (
                <span
                  className={cn(
                    'badge text-xs',
                    project.status === 'Completed'
                      ? 'badge-success'
                      : project.status === 'In Progress'
                      ? 'badge-warning'
                      : 'badge-secondary'
                  )}
                >
                  {project.status}
                </span>
              )}
              {project.is_featured && (
                <span className="badge-primary text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-violet-400" />
                  Featured Project
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {project.title}
            </h1>

            {project.short_description && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {project.short_description}
              </p>
            )}

            {/* Meta and Date */}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span>
                  {formatDateRange(project.start_date, project.end_date)}
                </span>
              </div>
            )}

            {/* Quick Actions / External Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.live_url && (
                <Button variant="gradient" size="lg" className="gap-2" asChild>
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}

              {project.github_url && (
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                </Button>
              )}

              {project.paper_url && (
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a
                    href={project.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Research Paper
                  </a>
                </Button>
              )}

              {project.documentation_url && (
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a
                    href={project.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4" />
                    Documentation
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Main Showcase Image */}
          {project.image_url && (
            <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden border border-border/80 bg-secondary/30 shadow-2xl">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left/Main Column: Descriptions & Highlights */}
            <div className="lg:col-span-2 space-y-10">
              {/* Full Description */}
              {project.full_description && (
                <div className="glass-card p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-400" />
                    Overview
                  </h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    {project.full_description.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.key_features && project.key_features.length > 0 && (
                <div className="glass-card p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Key Features
                  </h2>
                  <ul className="space-y-3">
                    {project.key_features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                        <span className="text-muted-foreground leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="glass-card p-6 sm:p-8 space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    Engineering Deep Dive
                  </h2>

                  {project.challenges && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                        Challenges Faced
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.solutions && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                        Implemented Solutions
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Results and Impact */}
              {project.results && (
                <div className="glass-card p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Results & Impact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Additional Project Images Gallery */}
              {project.project_images && project.project_images.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Project Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.project_images.map((img) => (
                      <div
                        key={img.id}
                        className="relative h-60 rounded-xl overflow-hidden border border-border bg-secondary/30 group"
                      >
                        <Image
                          src={img.image_url}
                          alt={img.caption || project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 via-background/60 to-transparent">
                            <p className="text-xs text-foreground font-medium truncate">
                              {img.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column / Sidebar Info */}
            <div className="space-y-6">
              {/* Tech Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="badge-secondary text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Role & Team */}
              {(project.my_role || project.team_info) && (
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    Role & Contribution
                  </h3>
                  {project.my_role && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        My Role
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {project.my_role}
                      </p>
                    </div>
                  )}
                  {project.team_info && (
                    <div className="space-y-1 pt-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Team
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.team_info}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Share & Connect */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-bold text-base">Interested in this project?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have questions about the architecture, implementation, or want to collaborate?
                </p>
                <Button variant="gradient" className="w-full" asChild>
                  <Link href="/#contact">Get In Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  )
}
