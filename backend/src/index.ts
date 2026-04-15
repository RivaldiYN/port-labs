import 'dotenv/config'
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from './modules/auth/routes'
import { publicRoutes } from './modules/public/routes'
import { cmsRoutes } from './modules/cms/routes'

// ── Response format helper ─────────────────────────────────────────────────
export function ok<T>(data: T, message = 'OK', meta?: Record<string, unknown>) {
  return { success: true, data, message, ...(meta ? { meta } : {}) }
}

export function fail(message: string, status = 400) {
  return { success: false, data: null, message, status }
}

// ── App ────────────────────────────────────────────────────────────────────
const app = new Elysia({ adapter: node() })

  // ── Plugins ───────────────────────────────────────────────────────────────
  .use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }))

  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    exp: '15m',
  }))

  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'Antigravity Portfolio API',
        version: '1.0.0',
        description: 'REST API untuk Antigravity Portfolio — Rivaldi Yonathan Nainggolan',
        contact: { name: 'Rivaldi', email: 'aldinggln9@gmail.com' },
      },
      tags: [
        { name: 'Health',  description: 'Server health check' },
        { name: 'Auth',   description: 'Autentikasi admin (login, refresh, logout)' },
        { name: 'Public', description: 'Endpoint publik — profile, projects, posts' },
        { name: 'CMS',    description: 'Content management — auth required' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  }))

  // ── Request logger ─────────────────────────────────────────────────────────
  .onRequest(({ request }) => {
    const start = Date.now()
    // Attach start time for response hook
    ;(request as Request & { _start?: number })._start = start
  })

  .onAfterResponse(({ request, set }) => {
    const start = (request as Request & { _start?: number })._start ?? Date.now()
    const duration = Date.now() - start
    const method = request.method.padEnd(6)
    const url = new URL(request.url).pathname
    const status = set.status ?? 200
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${method} ${url} → ${status} (${duration}ms)`)
  })

  // ── Global error handler ───────────────────────────────────────────────────
  .onError(({ code, error, set }) => {
    const timestamp = new Date().toISOString()
    const msg = (error as Error).message ?? String(error)

    // Log error
    console.error(`[${timestamp}] ERROR ${code}:`, msg)

    switch (code) {
      case 'NOT_FOUND':
        set.status = 404
        return { success: false, data: null, message: 'Route tidak ditemukan', code }

      case 'VALIDATION':
        set.status = 422
        return { success: false, data: null, message: 'Validasi gagal', code, detail: msg }

      case 'PARSE':
        set.status = 400
        return { success: false, data: null, message: 'Request body tidak valid', code }

      case 'INTERNAL_SERVER_ERROR':
      default:
        set.status = 500
        return {
          success: false,
          data: null,
          message: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan server'
            : msg,
          code,
        }
    }
  })

  // ── Health check ───────────────────────────────────────────────────────────
  .get('/health', () => {
    return ok({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV ?? 'development',
      uptime: Math.floor(process.uptime()),
    }, 'Server is running')
  }, {
    detail: { tags: ['Health'], summary: 'Health check endpoint' },
  })

  // ── Routes ─────────────────────────────────────────────────────────────────
  .use(authRoutes)
  .use(publicRoutes)
  .use(cmsRoutes)

  // ── 404 fallback ───────────────────────────────────────────────────────────
  .get('*', ({ set }) => {
    set.status = 404
    return { success: false, data: null, message: 'Route tidak ditemukan' }
  })

  .listen(Number(process.env.PORT ?? 3000))

const port = app.server?.port ?? process.env.PORT ?? 3000
console.log('')
console.log('╔══════════════════════════════════════════════════╗')
console.log('║       🚀 Antigravity Portfolio API               ║')
console.log('╠══════════════════════════════════════════════════╣')
console.log(`║  Server  : http://localhost:${String(port).padEnd(21)}║`)
console.log(`║  Swagger : http://localhost:${port}/docs          ║`)
console.log(`║  Health  : http://localhost:${port}/health        ║`)
console.log(`║  Env     : ${(process.env.NODE_ENV ?? 'development').padEnd(38)}║`)
console.log('╚══════════════════════════════════════════════════╝')
console.log('')

export type App = typeof app
