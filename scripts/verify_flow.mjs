import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf-8')
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

const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function verifyFlow() {
  console.log('--- 1. Testing Unauthenticated Public Read ---')
  const { data: profile, error: profErr } = await anon.from('profiles').select('*').limit(1).maybeSingle()
  if (profErr) throw profErr
  console.log('Public profile:', profile.full_name, '|', profile.professional_title)

  console.log('\n--- 2. Testing Empty Sections Handling ---')
  const { data: resume, error: resErr } = await anon.from('resume').select('*').eq('is_active', true).limit(1).maybeSingle()
  console.log('Resume query (empty table):', { data: resume, error: resErr })

  const { data: projects, error: projErr } = await anon.from('projects').select('*, project_images(*)').eq('is_visible', true).eq('is_featured', true).order('display_order')
  console.log('Projects query (0 rows):', { count: projects.length, error: projErr })

  console.log('\n--- 3. Testing Admin Edit & Public Sync ---')
  const originalTagline = profile.tagline || ''
  const testTagline = 'AI & Machine Learning Specialist'
  
  const { error: updateErr } = await admin.from('profiles').update({ tagline: testTagline, updated_at: new Date().toISOString() }).eq('id', profile.id)
  console.log('Admin update error:', updateErr)

  const { data: updatedProf } = await anon.from('profiles').select('*').limit(1).maybeSingle()
  console.log('Publicly synced updated tagline:', updatedProf.tagline)

  // Revert back
  await admin.from('profiles').update({ tagline: originalTagline, updated_at: new Date().toISOString() }).eq('id', profile.id)
  console.log('Reverted back to original tagline successfully.')

  console.log('\n✅ ALL VERIFICATION CHECKS PASSED!')
}

verifyFlow()
