import { getAllQualifications } from '@/lib/actions/content'
import { QualificationsClient } from '@/components/admin/qualifications-client'

export default async function AdminQualificationsPage() {
  const qualifications = await getAllQualifications()
  return <QualificationsClient qualifications={qualifications} />
}
