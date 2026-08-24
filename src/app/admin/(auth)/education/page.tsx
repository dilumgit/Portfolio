import { getAllEducation } from '@/lib/actions/education'
import { EducationClient } from '@/components/admin/education-client'

export default async function AdminEducationPage() {
  const education = await getAllEducation()
  return <EducationClient education={education} />
}
