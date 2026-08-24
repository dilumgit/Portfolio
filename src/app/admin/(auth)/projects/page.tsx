import { getAllProjects } from '@/lib/actions/projects'
import { ProjectsClient } from '@/components/admin/projects-client'

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()
  return <ProjectsClient projects={projects as any} />
}
