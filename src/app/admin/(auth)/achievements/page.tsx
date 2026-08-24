import { getAllAchievements } from '@/lib/actions/content'
import { AchievementsClient } from '@/components/admin/achievements-client'

export default async function AdminAchievementsPage() {
  const achievements = await getAllAchievements()
  return <AchievementsClient achievements={achievements} />
}
