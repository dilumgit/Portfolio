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

function sortEducationReverseChronological(a, b) {
  const aIsOngoing = !!a.is_current || !a.end_date
  const bIsOngoing = !!b.is_current || !b.end_date

  if (aIsOngoing && !bIsOngoing) return -1
  if (!aIsOngoing && bIsOngoing) return 1

  if (aIsOngoing && bIsOngoing) {
    const aStart = a.start_date || ''
    const bStart = b.start_date || ''
    if (aStart !== bStart) {
      return bStart.localeCompare(aStart)
    }
  } else {
    const aEnd = a.end_date || ''
    const bEnd = b.end_date || ''
    if (aEnd !== bEnd) {
      return bEnd.localeCompare(aEnd)
    }

    const aStart = a.start_date || ''
    const bStart = b.start_date || ''
    if (aStart !== bStart) {
      return bStart.localeCompare(aStart)
    }
  }

  return (a.display_order ?? 0) - (b.display_order ?? 0)
}

async function testEducationOrder() {
  console.log('--- 1. Fetching Public Education Records ---')
  const { data, error } = await anon
    .from('education')
    .select('*')
    .eq('is_visible', true)
    .order('is_current', { ascending: false })
    .order('end_date', { ascending: false, nullsFirst: true })
    .order('start_date', { ascending: false, nullsFirst: true })
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching education:', error)
    process.exit(1)
  }

  const sorted = [...data].sort(sortEducationReverseChronological)
  console.log('Public Education Order:')
  sorted.forEach((edu, idx) => {
    console.log(`  ${idx + 1}. ${edu.degree} | ${edu.institution} | ${edu.start_date || ''} - ${edu.is_current ? 'Present' : (edu.end_date || '')}`)
  })

  if (sorted[0]?.degree?.includes('Information Technology') && sorted[1]?.degree?.includes('Advanced Level')) {
    console.log('✅ Current education (B.Sc.) is correctly ranked #1 above completed education (A/L)!')
  } else {
    console.error('❌ Order is not as expected!')
    process.exit(1)
  }

  console.log('\n--- 2. Testing Future & Mixed Scenario Simulation ---')
  const testList = [
    { degree: 'G.C.E. Advanced Level', start_date: '2008-01', end_date: '2021-10', is_current: false },
    { degree: 'B.Sc. (Hons) Information Technology', start_date: '2023-01', end_date: null, is_current: true },
    { degree: 'MSc Artificial Intelligence', start_date: '2028-09', end_date: null, is_current: true },
    { degree: 'Diploma in Software Engineering', start_date: '2021-11', end_date: '2022-12', is_current: false }
  ]

  const simulatedSorted = [...testList].sort(sortEducationReverseChronological)
  console.log('Simulated Order (MSc added):')
  simulatedSorted.forEach((edu, idx) => {
    console.log(`  ${idx + 1}. ${edu.degree} (${edu.start_date} - ${edu.is_current ? 'Present' : edu.end_date})`)
  })

  if (
    simulatedSorted[0].degree === 'MSc Artificial Intelligence' &&
    simulatedSorted[1].degree === 'B.Sc. (Hons) Information Technology' &&
    simulatedSorted[2].degree === 'Diploma in Software Engineering' &&
    simulatedSorted[3].degree === 'G.C.E. Advanced Level'
  ) {
    console.log('✅ Future records simulation passed completely!')
  } else {
    console.error('❌ Simulation order mismatch!')
    process.exit(1)
  }
}

testEducationOrder()
