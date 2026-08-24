import { getAllSkillCategories } from '@/lib/actions/skills'
import { SkillsClient } from '@/components/admin/skills-client'

export default async function AdminSkillsPage() {
  const categories = await getAllSkillCategories()
  return <SkillsClient categories={categories as any} />
}
