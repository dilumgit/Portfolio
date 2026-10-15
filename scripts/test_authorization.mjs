import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 1. Read environment config
let env = {}
try {
  const envFile = fs.readFileSync('.env.local', 'utf-8')
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      let value = match[2] || ''
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
      env[match[1]] = value.trim()
    }
  })
} catch (e) {
  console.log('No .env.local found, using process.env')
  env = process.env
}

const url = env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = env.ADMIN_EMAIL || 'dilkaru999@gmail.com'

console.log('====================================================')
console.log('🔒 PORTFOLIO CMS AUTHORIZATION & RLS TEST SUITE')
console.log('====================================================\n')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`)
    passed++
  } else {
    console.error(`❌ [FAIL] ${message}`)
    failed++
  }
}

// ----------------------------------------------------
// Section A: Simulated Unit Logic for assertAdmin() / verifyAdmin()
// ----------------------------------------------------
console.log('--- SECTION A: Server Authorization Guard Unit Logic ---')

function simulateAssertAdmin({ envAdminEmail, user, authError }) {
  const configuredAdminEmail = envAdminEmail?.trim().toLowerCase()
  if (!configuredAdminEmail) {
    throw new Error('Unauthorized: Administrator privileges required.')
  }
  if (authError || !user) {
    throw new Error('Unauthorized: Authentication required.')
  }
  const userEmail = user.email?.trim().toLowerCase()
  if (!userEmail || userEmail !== configuredAdminEmail) {
    throw new Error('Unauthorized: Administrator privileges required.')
  }
  return user
}

function simulateVerifyAdmin(params) {
  try {
    const user = simulateAssertAdmin(params)
    return { authorized: true, user }
  } catch (err) {
    return { authorized: false, error: err.message }
  }
}

// Test A1: Missing ADMIN_EMAIL must fail closed
try {
  simulateAssertAdmin({ envAdminEmail: undefined, user: { email: 'dilkaru999@gmail.com' } })
  assert(false, 'A1: Missing ADMIN_EMAIL must throw error')
} catch (e) {
  assert(e.message.includes('Administrator privileges required'), 'A1: Missing ADMIN_EMAIL throws error (fail-closed)')
}

// Test A2: Unauthenticated caller (null user) must be denied
const resA2 = simulateVerifyAdmin({ envAdminEmail: 'dilkaru999@gmail.com', user: null })
assert(!resA2.authorized && resA2.error.includes('Authentication required'), 'A2: Unauthenticated user is denied')

// Test A3: Different authenticated user (attacker) must be denied
const resA3 = simulateVerifyAdmin({
  envAdminEmail: 'dilkaru999@gmail.com',
  user: { email: 'attacker@example.com' }
})
assert(!resA3.authorized && resA3.error.includes('Administrator privileges required'), 'A3: Non-owner user is denied')

// Test A4: User with missing/null email must be denied
const resA4 = simulateVerifyAdmin({
  envAdminEmail: 'dilkaru999@gmail.com',
  user: { email: null }
})
assert(!resA4.authorized && resA4.error.includes('Administrator privileges required'), 'A4: User without email is denied')

// Test A5: Case-insensitive and trimmed owner match must be allowed
const resA5 = simulateVerifyAdmin({
  envAdminEmail: 'dilkaru999@gmail.com',
  user: { email: '  DILKARU999@GMAIL.COM  ' }
})
assert(resA5.authorized === true, 'A5: Case-insensitive/whitespace-trimmed owner is authorized')

// ----------------------------------------------------
// Section B: Real Database Row Level Security (RLS) Checks
// ----------------------------------------------------
console.log('\n--- SECTION B: Supabase Database RLS Checks ---')

const anon = createClient(url, anonKey)

async function runDatabaseChecks() {
  // Test B1: Anonymous public read (profiles)
  const { data: profData, error: profErr } = await anon.from('profiles').select('id, full_name').limit(1).maybeSingle()
  assert(!profErr && profData !== undefined, 'B1: Anonymous visitor can read public profile')

  // Test B2: Anonymous public read (education with is_visible=true)
  const { data: eduData, error: eduErr } = await anon.from('education').select('*').eq('is_visible', true)
  assert(!eduErr && Array.isArray(eduData), 'B2: Anonymous visitor can read visible education')

  // Test B3: Anonymous caller CANNOT mutate portfolio tables directly (RLS Deny)
  const { error: insertErr } = await anon.from('education').insert([{
    institution: 'Unauthorized School',
    degree: 'Fake Degree',
    is_visible: true
  }])
  assert(insertErr !== null, 'B3: Anonymous caller cannot insert into education (RLS blocks direct write)')

  // Test B4: Anonymous caller CANNOT read private contact_messages (RLS Deny)
  const { data: msgData, error: msgErr } = await anon.from('contact_messages').select('*')
  const isProtected = msgErr !== null || (Array.isArray(msgData) && msgData.length === 0)
  assert(isProtected, 'B4: Anonymous caller cannot retrieve private contact messages')

  // Test B5: Anonymous visitor CAN insert contact message (public contact form)
  const testMsg = {
    name: 'Auth Test Visitor',
    email: 'visitor@example.com',
    message: 'Testing public contact submission'
  }
  const { error: contactInsertErr } = await anon.from('contact_messages').insert([testMsg])
  assert(!contactInsertErr, 'B5: Anonymous visitor can submit contact form message')

  // Clean up test message with service key if available
  if (serviceKey) {
    const admin = createClient(url, serviceKey)
    await admin.from('contact_messages').delete().eq('email', 'visitor@example.com')
  }

  console.log('\n====================================================')
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`)
  console.log('====================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runDatabaseChecks()
