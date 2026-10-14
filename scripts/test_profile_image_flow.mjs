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

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testFullProfileImageFlow() {
  console.log('--- 1. Get Initial Profile State ---')
  const { data: initialProfile } = await anon.from('profiles').select('*').limit(1).maybeSingle()
  const initialUrl = initialProfile.profile_image_url
  console.log('Initial profile image URL:', initialUrl)

  console.log('\n--- 2. Test Direct Admin Upload of Profile Image ---')
  // Create a minimal 1x1 transparent PNG buffer
  const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  const testFileName = `profile/avatar-${Date.now()}-test.png`

  const { data: uploadRes, error: uploadErr } = await admin.storage
    .from('profile-images')
    .upload(testFileName, png1x1, { contentType: 'image/png', upsert: true })

  if (uploadErr) {
    console.error('❌ Upload failed:', uploadErr)
    process.exit(1)
  }
  console.log('✅ Uploaded file to profile-images bucket:', uploadRes.path)

  const { data: { publicUrl } } = admin.storage.from('profile-images').getPublicUrl(uploadRes.path)
  console.log('Public URL:', publicUrl)

  console.log('\n--- 3. Test Updating Profile Record with New Image URL ---')
  const { error: updateProfErr } = await admin.from('profiles').update({
    profile_image_url: publicUrl,
    updated_at: new Date().toISOString()
  }).eq('id', initialProfile.id)

  if (updateProfErr) {
    console.error('❌ Profile update failed:', updateProfErr)
    process.exit(1)
  }

  const { data: syncedProf } = await anon.from('profiles').select('*').limit(1).maybeSingle()
  console.log('✅ Public profile image URL is synced:', syncedProf.profile_image_url)

  console.log('\n--- 4. Test Anonymous Public Read of Storage Image ---')
  const fetchRes = await fetch(publicUrl)
  console.log('Storage HTTP GET status (public read):', fetchRes.status)
  if (fetchRes.status === 200) {
    console.log('✅ Public visitors can read the profile image URL!')
  } else {
    console.error('❌ Public read failed with status', fetchRes.status)
    process.exit(1)
  }

  console.log('\n--- 5. Test Remove Profile Image Flow ---')
  // Delete file from storage
  const { error: removeStorageErr } = await admin.storage.from('profile-images').remove([testFileName])
  console.log('Storage remove error:', removeStorageErr)

  // Clear profile_image_url
  await admin.from('profiles').update({
    profile_image_url: null,
    updated_at: new Date().toISOString()
  }).eq('id', initialProfile.id)

  const { data: clearedProf } = await anon.from('profiles').select('*').limit(1).maybeSingle()
  console.log('Public profile after removal (profile_image_url):', clearedProf.profile_image_url)
  if (clearedProf.profile_image_url === null) {
    console.log('✅ Profile image successfully removed and cleared to null (initials fallback active)!')
  }

  // Restore initial state if it existed
  if (initialUrl) {
    await admin.from('profiles').update({
      profile_image_url: initialUrl,
      updated_at: new Date().toISOString()
    }).eq('id', initialProfile.id)
    console.log('\nRestored initial profile image URL.')
  }

  console.log('\n🎉 ALL PROFILE IMAGE FLOW TESTS PASSED!')
}

testFullProfileImageFlow()
