import { getSiteSettings } from '@/lib/actions/content'
import { SettingsClient } from '@/components/admin/settings-client'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()
  return <SettingsClient settings={settings} />
}
