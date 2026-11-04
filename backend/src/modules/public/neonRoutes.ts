import { Elysia, t } from 'elysia'
import { ok } from '../../lib/response.js'
import {
  isNeonStorageAvailable,
  isNeonRealtimeAvailable,
  NEON_BUCKET,
  sealRealtimeQuery,
  getNeonRealtimeConfig,
  callHelloFunction,
  getNeonAuthConfig,
} from '../../lib/neon.js'
import { db } from '../../lib/db.js'
import { profile } from '../../db/schema.js'

export const neonRoutes = new Elysia({ prefix: '/api/neon' })

  // GET /api/neon/services — Overview of all wired Neon services
  .get('/services', async () => {
    let dbStatus = 'disconnected'
    try {
      const rows = await db.select().from(profile).limit(1)
      if (rows) dbStatus = 'connected'
    } catch {
      dbStatus = 'error'
    }

    return ok({
      branch: process.env.NEON_BRANCH ?? 'production',
      services: {
        postgres: {
          status: dbStatus,
          provider: 'Neon Lakebase Postgres (Serverless)',
          pooled: Boolean(process.env.DATABASE_URL?.includes('-pooler')),
        },
        objectStorage: {
          status: isNeonStorageAvailable ? 'configured' : 'disabled',
          bucket: NEON_BUCKET,
          endpoint: process.env.AWS_ENDPOINT_URL_S3 ?? null,
          region: process.env.AWS_REGION ?? 'ap-southeast-1',
        },
        auth: {
          status: process.env.NEON_AUTH_BASE_URL ? 'configured' : 'disabled',
          baseUrl: process.env.NEON_AUTH_BASE_URL ?? null,
          jwksUrl: process.env.NEON_AUTH_JWKS_URL ?? null,
        },
        realtime: {
          status: isNeonRealtimeAvailable ? 'configured' : 'disabled',
          url: process.env.NEON_REALTIME_URL ?? null,
        },
        functions: {
          status: process.env.NEON_FUNCTION_HELLO_BASE_URL ? 'deployed' : 'disabled',
          helloUrl: process.env.NEON_FUNCTION_HELLO_BASE_URL ?? null,
        },
        aiGateway: {
          status: 'unavailable (requires Neon paid plan)',
        },
      },
    }, 'Neon services overview')
  }, {
    detail: { tags: ['Neon'], summary: 'Inspect configured Neon services' },
  })

  // GET /api/neon/functions/hello — Test invocation of deployed Neon Function
  .get('/functions/hello', async ({ set }) => {
    try {
      const result = await callHelloFunction()
      return ok(result, 'Neon Function invoked successfully')
    } catch (err: any) {
      set.status = 502
      return { success: false, data: null, message: `Neon Function call failed: ${err.message}` }
    }
  }, {
    detail: { tags: ['Neon'], summary: 'Invoke deployed Neon Hello function' },
  })

  // POST /api/neon/realtime/seal — Seal a query for Neon Realtime
  .post('/realtime/seal', async ({ body, set }) => {
    try {
      const { sql, params } = body as { sql?: string; params?: unknown[] }
      const querySql = sql || 'SELECT id, name, tagline FROM profile'
      const sealed = await sealRealtimeQuery(querySql, params || [])
      return ok({
        ...sealed,
        realtimeUrl: process.env.NEON_REALTIME_URL,
      }, 'Neon Realtime sealed query generated')
    } catch (err: any) {
      set.status = 500
      return { success: false, data: null, message: `Sealing query failed: ${err.message}` }
    }
  }, {
    body: t.Optional(t.Object({
      sql: t.Optional(t.String()),
      params: t.Optional(t.Array(t.Any())),
    })),
    detail: { tags: ['Neon'], summary: 'Seal a query for client Realtime subscription' },
  })

  // GET /api/neon/auth/config — Neon Auth configuration
  .get('/auth/config', () => {
    return ok(getNeonAuthConfig(), 'Neon Auth configuration')
  }, {
    detail: { tags: ['Neon'], summary: 'Neon Auth JWKS and Base URL' },
  })

