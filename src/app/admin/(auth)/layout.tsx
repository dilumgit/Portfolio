import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const userEmail = user.email?.trim().toLowerCase()
  if (!adminEmail || !userEmail || userEmail !== adminEmail) {
    console.error(`Unauthorized admin dashboard access attempt by ${user.email || 'unknown'}`)
    redirect('/admin/login?error=Unauthorized')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 md:p-8 md:pl-10">
          {children}
        </div>
      </main>
    </div>
  )
}
