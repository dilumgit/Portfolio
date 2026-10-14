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

const url = env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', url)

const anonClient = createClient(url, anonKey)
const adminClient = createClient(url, serviceKey)

async function testAll() {
  console.log('\n--- TESTING ANON CLIENT (PUBLIC HOMEPAGE QUERIES) ---')

  const queries = [
    {
      name: 'profiles (limit 1 maybeSingle)',
      fn: (client) => client.from('profiles').select('*').order('created_at', { ascending: true }).limit(1).maybeSingle()
    },
    {
      name: 'social_links (is_visible=true)',
      fn: (client) => client.from('social_links').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'resume (is_active=true, limit 1 maybeSingle)',
      fn: (client) => client.from('resume').select('*').eq('is_active', true).limit(1).maybeSingle()
    },
    {
      name: 'education (is_visible=true)',
      fn: (client) => client.from('education').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'skill_categories with skills (is_visible=true)',
      fn: (client) => client.from('skill_categories').select('*, skills(*)').eq('is_visible', true).order('display_order')
    },
    {
      name: 'projects with project_images (featured & is_visible=true)',
      fn: (client) => client.from('projects').select('*, project_images(*)').eq('is_visible', true).eq('is_featured', true).order('display_order')
    },
    {
      name: 'research (is_visible=true)',
      fn: (client) => client.from('research').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'certifications (is_visible=true)',
      fn: (client) => client.from('certifications').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'experience (is_visible=true)',
      fn: (client) => client.from('experience').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'achievements (is_visible=true)',
      fn: (client) => client.from('achievements').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'services (is_visible=true)',
      fn: (client) => client.from('services').select('*').eq('is_visible', true).order('display_order')
    },
    {
      name: 'site_settings',
      fn: (client) => client.from('site_settings').select('*')
    }
  ]

  let errors = 0
  for (const q of queries) {
    try {
      const res = await q.fn(anonClient)
      if (res.error) {
        errors++
        console.error(`❌ [ANON ERROR] ${q.name}:`, JSON.stringify(res.error, null, 2))
      } else {
        const count = Array.isArray(res.data) ? `${res.data.length} rows` : (res.data ? 'object' : 'null (empty/safe)')
        console.log(`✅ [ANON OK] ${q.name}: ${count}`)
      }
    } catch (e) {
      errors++
      console.error(`💥 [ANON EXCEPTION] ${q.name}:`, e)
    }
  }

  console.log(`\nAnon client test summary: ${errors} errors.`)
}

testAll()
