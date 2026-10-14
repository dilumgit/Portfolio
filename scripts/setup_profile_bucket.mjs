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

async function setupBucket() {
  const { data: buckets } = await admin.storage.listBuckets()
  console.log('Existing buckets:', buckets.map(b => b.name))

  const profileBucketExists = buckets.some(b => b.name === 'profile-images')
  if (!profileBucketExists) {
    console.log('Creating profile-images bucket...')
    const { data, error } = await admin.storage.createBucket('profile-images', {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    })
    console.log('Bucket created:', { data, error })
  } else {
    console.log('profile-images bucket already exists!')
  }

  // Test admin upload of a dummy image
  const dummyBuffer = Buffer.from('fake-image-bytes-png')
  const testPath = `profile/test-${Date.now()}.png`
  const { data: uploadRes, error: uploadErr } = await admin.storage
    .from('profile-images')
    .upload(testPath, dummyBuffer, { contentType: 'image/png', upsert: true })

  console.log('Test upload:', { uploadRes, uploadErr })

  const { data: { publicUrl } } = admin.storage.from('profile-images').getPublicUrl(testPath)
  console.log('Public URL:', publicUrl)

  // Verify anon cannot delete
  const { error: anonDeleteErr } = await anon.storage.from('profile-images').remove([testPath])
  console.log('Anon delete error (should fail or have no effect):', anonDeleteErr)

  // Admin delete
  const { error: adminDeleteErr } = await admin.storage.from('profile-images').remove([testPath])
  console.log('Admin delete error:', adminDeleteErr)
}

setupBucket()
