import { getAllServices } from '@/lib/actions/content'
import { ServicesClient } from '@/components/admin/services-client'

export default async function AdminServicesPage() {
  const services = await getAllServices()
  return <ServicesClient services={services} />
}
