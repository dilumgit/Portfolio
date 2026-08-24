import { getAllContactMessages } from '@/lib/actions/content'
import { ContactClient } from '@/components/admin/contact-client'

export default async function AdminContactPage() {
  const messages = await getAllContactMessages()
  return <ContactClient messages={messages} />
}
