import 'dotenv/config'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from './modules/auth/routes.js'
import { publicRoutes } from './modules/public/routes.js'
import { cmsRoutes } from './modules/cms/routes.js'

// Re-export helpers from lib/response � routes import directly from there to avoid circular deps
import { ok, fail } from './lib/response.js'
export { ok, fail }

// App — no node() adapter needed for Vercel serverless
const app = new Elysia()

  // Plugins
  .use(cors({
    origin: (request) => {
      const origin = request.headers.get('origin') ?? ''
      const allowed = [
        process.env.FRONTEND_URL,
        'https://port-labs.appwrite.network',
        'https://portaldilabs.me',
        'https://www.portaldilabs.me',
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean) as string[]

      // Allow any *.appwrite.network subdomain
      if (origin.endsWith('.appwrite.network')) return true

      return allowed.includes(origin)
    },
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
        description: 'REST API untuk Antigravity Portfolio - Rivaldi Yonathan Nainggolan',
        contact: { name: 'Rivaldi', email: 'aldinggln9@gmail.com' },
      },
      tags: [
        { name: 'Health', description: 'Server health check' },
        { name: 'Auth', description: 'Autentikasi admin (login, refresh, logout)' },
        { name: 'Public', description: 'Endpoint publik - profile, projects, posts' },
        { name: 'CMS', description: 'Content management - auth required' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  }))

  // Request logger — use WeakMap to avoid mutating readonly Request objects
  .onAfterResponse(({ request, set }) => {
    try {
      const method = (request.method ?? 'GET').padEnd(6)
      let pathname = request.url ?? '/'
      try { pathname = new URL(request.url).pathname } catch { /* relative url ok */ }
      const status = set.status ?? 200
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] ${method} ${pathname} -> ${status}`)
    } catch { /* never crash from logger */ }
  })

  // Global error handler
  .onError(({ code, error, set }) => {
    const timestamp = new Date().toISOString()
    const msg = (error as Error).message ?? String(error)

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

  // Health check
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

  // Routes
  .use(authRoutes)
  .use(publicRoutes)
  .use(cmsRoutes)

  // 404 fallback
  .get('*', ({ set }) => {
    set.status = 404
    return { success: false, data: null, message: 'Route tidak ditemukan' }
  })

const port = Number(process.env.PORT ?? 3000)

// Only start HTTP server when running locally (not on Vercel or Appwrite Functions serverless)
if (!process.env.VERCEL && !process.env.APPWRITE_FUNCTION_ID) {
  // Dynamically import node adapter only for local dev
  import('@elysiajs/node').then(({ node }) => {
    const localApp = new Elysia({ adapter: node() })
    localApp.use(app)
    localApp.listen(port)
    console.log('')
    console.log('====================================================')
    console.log('  Antigravity Portfolio API')
    console.log('====================================================')
    console.log(`  Server  : http://localhost:${port}`)
    console.log(`  Swagger : http://localhost:${port}/docs`)
    console.log(`  Health  : http://localhost:${port}/health`)
    console.log(`  Env     : ${process.env.NODE_ENV ?? 'development'}`)
    console.log('====================================================')
    console.log('')
  })
}

export { app }
export type App = typeof app
