import { getProfile } from '@/lib/actions/profile'
import { ProfileForm } from '@/components/admin/profile-form'
import { PageHeader } from '@/components/admin/shared'

export default async function AdminProfilePage() {
  const profile = await getProfile()

  return (
    <div>
      <PageHeader
        title="Edit Profile"
        description="Update your personal information, hero section, and social links"
      />
      <div className="max-w-4xl">
        <div className="glass-card p-8">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
