export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Navigation } from '@/components/portfolio/navigation'
import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { EducationSection } from '@/components/portfolio/education'
import { Skills } from '@/components/portfolio/skills'
import { Projects } from '@/components/portfolio/projects'
import { ResearchSection } from '@/components/portfolio/research'
import { ExperienceSection } from '@/components/portfolio/experience'
import { Certifications } from '@/components/portfolio/certifications'
import { Achievements } from '@/components/portfolio/achievements'
import { Services } from '@/components/portfolio/services'
import { Contact } from '@/components/portfolio/contact'
import { Footer } from '@/components/portfolio/footer'
import { getProfile, getSocialLinks } from '@/lib/actions/profile'
import { getEducation } from '@/lib/actions/education'
import { getSkillCategories } from '@/lib/actions/skills'
import { getFeaturedProjects } from '@/lib/actions/projects'
import { getExperience } from '@/lib/actions/experience'
import {
  getResearch,
  getAchievements,
  getServices,
  getSiteSettings,
  getActiveResume,
} from '@/lib/actions/content'
import { getCertifications } from '@/lib/actions/certifications'

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ])

  const title =
    settings['site_title'] ||
    profile?.full_name
      ? `${profile?.full_name} | ${profile?.professional_title || 'Portfolio'}`
      : 'Personal Portfolio'

  const description =
    settings['meta_description'] ||
    profile?.tagline ||
    profile?.about_me?.slice(0, 160) ||
    'Personal portfolio website'

  return {
    title,
    description,
    keywords: settings['meta_keywords']?.split(',').map((k) => k.trim()) || [],
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    profile,
    socialLinks,
    resume,
    education,
    skillCategories,
    featuredProjects,
    research,
    certifications,
    experience,
    achievements,
    services,
  ] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getActiveResume(),
    getEducation(),
    getSkillCategories(),
    getFeaturedProjects(),
    getResearch(),
    getCertifications(),
    getExperience(),
    getAchievements(),
    getServices(),
  ])

  return (
    <div className="min-h-screen">
      <Navigation profile={profile} resume={resume} />

      <main>
        <Hero profile={profile} socialLinks={socialLinks} resume={resume} />
        <About profile={profile} />
        <EducationSection education={education} />
        <Skills categories={skillCategories as any} />
        <Projects projects={featuredProjects as any} featured />
        <ResearchSection research={research} />
        <ExperienceSection experience={experience} />
        <Certifications certifications={certifications} />
        <Achievements achievements={achievements} />
        <Services services={services} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  )
}
