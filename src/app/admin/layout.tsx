// Root admin layout - shared by both login and authenticated pages
// Force dynamic to prevent static pre-rendering failures when Supabase env vars aren't set at build time
export const dynamic = 'force-dynamic'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
