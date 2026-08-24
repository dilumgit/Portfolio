import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Education = Database['public']['Tables']['education']['Row']
export type Qualification = Database['public']['Tables']['qualifications']['Row']
export type SkillCategory = Database['public']['Tables']['skill_categories']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectImage = Database['public']['Tables']['project_images']['Row']
export type Research = Database['public']['Tables']['research']['Row']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type Experience = Database['public']['Tables']['experience']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type Resume = Database['public']['Tables']['resume']['Row']

export type SkillWithCategory = Skill & {
  skill_categories: SkillCategory | null
}

export type ProjectWithImages = Project & {
  project_images: ProjectImage[]
}

export type SiteSettingsMap = Record<string, string>

export interface NavItem {
  label: string
  href: string
  isVisible: boolean
  order: number
}

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string }
