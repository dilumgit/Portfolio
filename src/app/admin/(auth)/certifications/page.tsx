import { getAllCertifications } from '@/lib/actions/certifications'
import { CertificationsClient } from '@/components/admin/certifications-client'

export default async function AdminCertificationsPage() {
  const certs = await getAllCertifications()
  return <CertificationsClient certifications={certs} />
}
