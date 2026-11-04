async function runTests() {
  const BASE = 'http://localhost:3000'
  console.log('====================================================')
  console.log('STARTING END-TO-END NEON SERVICES VERIFICATION')
  console.log('====================================================\n')

  let passed = 0
  let total = 0

  async function check(name: string, fn: () => Promise<void>) {
    total++
    try {
      await fn()
      console.log(`[PASS] ${name}`)
      passed++
    } catch (err: any) {
      console.error(`[FAIL] ${name}:`, err.message)
    }
  }

  // 1. Health
  await check('Health Check (/health)', async () => {
    const res = await fetch(`${BASE}/health`)
    const data = await res.json()
    if (!res.ok || data.data.status !== 'ok') throw new Error(JSON.stringify(data))
    console.log('   Response:', JSON.stringify(data))
  })

  // 2. Neon Postgres - Profile & Stats
  await check('Neon Postgres: GET /api/profile', async () => {
    const res = await fetch(`${BASE}/api/profile`)
    const data = await res.json()
    if (!res.ok || !data.data?.name) throw new Error(JSON.stringify(data))
    console.log(`   Profile Name: "${data.data.name}", Tagline: "${data.data.tagline}"`)
    console.log(`   Profile Stats: ${JSON.stringify(data.data.stats)}`)
    console.log(`   Skills count: ${data.data.skills?.length}`)
  })

  // 3. Neon Postgres - Projects
  await check('Neon Postgres: GET /api/projects', async () => {
    const res = await fetch(`${BASE}/api/projects`)
    const data = await res.json()
    if (!res.ok || !Array.isArray(data.data) || data.data.length === 0) throw new Error(JSON.stringify(data))
    console.log(`   Projects retrieved: ${data.data.length} projects`)
    data.data.forEach((p: any) => console.log(`   - ${p.title} (slug: ${p.slug})`))
  })

  // 4. Neon Postgres - Posts
  await check('Neon Postgres: GET /api/posts', async () => {
    const res = await fetch(`${BASE}/api/posts`)
    const data = await res.json()
    if (!res.ok || !Array.isArray(data.data)) throw new Error(JSON.stringify(data))
    console.log(`   Published posts: ${data.data.length} posts`)
    data.data.forEach((p: any) => console.log(`   - ${p.title}`))
  })

  // 5. Neon Postgres - Stats
  await check('Neon Postgres: GET /api/stats', async () => {
    const res = await fetch(`${BASE}/api/stats`)
    const data = await res.json()
    if (!res.ok || !data.data) throw new Error(JSON.stringify(data))
    console.log('   Stats retrieved:', JSON.stringify(data.data))
  })

  // 6. Neon Postgres - Auth Login
  let adminToken = ''
  await check('Neon Postgres: POST /auth/login (admin / admin123)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    })
    const data = await res.json()
    if (!res.ok || !data.data?.accessToken) throw new Error(JSON.stringify(data))
    adminToken = data.data.accessToken
    console.log(`   Admin Login OK! Token: ${adminToken.slice(0, 20)}...`)
    console.log(`   Admin User: ${data.data.user?.username} (${data.data.user?.email})`)
  })

  // 7. Neon Services Overview
  await check('Neon Services Status: GET /api/neon/services', async () => {
    const res = await fetch(`${BASE}/api/neon/services`)
    const data = await res.json()
    if (!res.ok || !data.data?.services) throw new Error(JSON.stringify(data))
    console.log('   Services State:', JSON.stringify(data.data.services, null, 2))
  })

  // 8. Neon Functions Call
  await check('Neon Functions: GET /api/neon/functions/hello', async () => {
    const res = await fetch(`${BASE}/api/neon/functions/hello`)
    const data = await res.json()
    if (!res.ok || data.data.text !== 'Hello from Neon Functions') throw new Error(JSON.stringify(data))
    console.log('   Neon Function Invocation Result:', JSON.stringify(data.data))
  })

  // 9. Neon Realtime Seal
  await check('Neon Realtime: POST /api/neon/realtime/seal', async () => {
    const res = await fetch(`${BASE}/api/neon/realtime/seal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: 'SELECT id, title, slug FROM projects' }),
    })
    const data = await res.json()
    if (!res.ok || !data.data?.capability) throw new Error(JSON.stringify(data))
    console.log('   Realtime sealed capability:', data.data.capability.slice(0, 40) + '...')
    console.log('   Realtime WebSocket URL:', data.data.realtimeUrl)
  })

  // 10. Neon Object Storage Upload
  await check('Neon Object Storage: POST /api/cms/media/upload', async () => {
    const formData = new FormData()
    const testBlob = new Blob(['PNG-TEST-CONTENT-FOR-NEON-STORAGE'], { type: 'image/png' })
    formData.append('file', testBlob, 'neon-test-image.png')

    const res = await fetch(`${BASE}/api/cms/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok || !data.data?.url) throw new Error(JSON.stringify(data))
    console.log('   Uploaded filename:', data.data.filename)
    console.log('   Storage URL:', data.data.url.slice(0, 80) + '...')
    console.log('   Upload message:', data.message)
  })

  // 11. Media List
  await check('Public Media List: GET /api/media', async () => {
    const res = await fetch(`${BASE}/api/media`)
    const data = await res.json()
    if (!res.ok || !Array.isArray(data.data)) throw new Error(JSON.stringify(data))
    console.log(`   Media items in Neon DB: ${data.data.length}`)
  })

  console.log('\n====================================================')
  console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED`)
  console.log('====================================================')

  if (passed !== total) process.exit(1)
}

runTests().catch(err => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
