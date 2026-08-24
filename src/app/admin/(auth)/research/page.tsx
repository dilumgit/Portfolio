import { getAllResearch } from '@/lib/actions/content'
import { PageHeader } from '@/components/admin/shared'
import { ResearchClient } from '@/components/admin/research-client'

export default async function AdminResearchPage() {
  const research = await getAllResearch()
  return <ResearchClient research={research} />
}
