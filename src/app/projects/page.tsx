export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Navigation } from '@/components/portfolio/navigation'
import { Projects } from '@/components/portfolio/projects'
import { Footer } from '@/components/portfolio/footer'
import { getProfile, getSocialLinks } from '@/lib/actions/profile'
import { getAllPublicProjects } from '@/lib/actions/projects'
import { getSiteSettings, getActiveResume } from '@/lib/actions/content'

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ])

  const name = profile?.full_name || 'Portfolio'
  const title = `Projects | ${name}`
  const description =
    settings['meta_description'] ||
    `Explore technical projects, machine learning models, and software engineering work by ${name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function ProjectsPage() {
  const [profile, socialLinks, resume, projects] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getActiveResume(),
    getAllPublicProjects(),
  ])

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navigation profile={profile} resume={resume} />

      <main className="pt-16 flex-1">
        <Projects projects={projects as any} featured={false} />
      </main>

      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  )
}
