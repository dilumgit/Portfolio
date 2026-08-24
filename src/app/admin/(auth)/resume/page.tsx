import { getAllResumes } from '@/lib/actions/content'
import { ResumeClient } from '@/components/admin/resume-client'

export default async function AdminResumePage() {
  const resumes = await getAllResumes()
  return <ResumeClient resumes={resumes} />
}
