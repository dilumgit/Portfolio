import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load environment variables from .env.local
let envFile = ''
try {
  envFile = fs.readFileSync('.env.local', 'utf-8')
} catch {
  console.error('❌ Could not read .env.local')
  process.exit(1)
}

const env = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let value = match[2] || ''
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    env[match[1]] = value.trim()
  }
})

const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = env.ADMIN_EMAIL

if (!url || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const newPassword = process.argv[2]
if (!newPassword || newPassword.length < 6) {
  console.error('❌ Please provide a password of at least 6 characters:')
  console.error('   Usage: node scripts/set_admin_password.mjs "YourNewPassword123!"')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function run() {
  console.log('Connecting to Supabase Admin Auth...')
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.error('❌ Failed to list users:', error.message)
    process.exit(1)
  }

  const users = data.users || []
  if (users.length === 0) {
    console.error('❌ No users found in Supabase Auth.')
    process.exit(1)
  }

  // Find user by ADMIN_EMAIL or fallback to first user
  let user = users.find(
    u => u.email?.toLowerCase() === adminEmail?.toLowerCase()
  )

  if (!user) {
    console.log(`⚠️ User with email ${adminEmail} not found. Using first available user: ${users[0].email}`)
    user = users[0]
  }

  console.log(`Setting new password for: ${user.email} (ID: ${user.id})...`)

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      password: newPassword,
      email_confirm: true,
    }
  )

  if (updateError) {
    console.error('❌ Failed to update password:', updateError.message)
    process.exit(1)
  }

  console.log('\n======================================================')
  console.log(`✅ SUCCESS! Password updated for ${user.email}`)
  console.log('======================================================')
  console.log('You can now log in immediately without any email verification:')
  console.log('👉 URL: http://localhost:3000/admin/login')
  console.log(`👉 Email: ${user.email}`)
  console.log(`👉 Password: ${newPassword}`)
  console.log('======================================================\n')
}

run()
