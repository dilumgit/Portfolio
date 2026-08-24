import { getAllExperience } from '@/lib/actions/experience'
import { ExperienceClient } from '@/components/admin/experience-client'

export default async function AdminExperiencePage() {
  const experience = await getAllExperience()
  return <ExperienceClient experience={experience} />
}
