import 'dotenv/config'
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { authRoutes } from './modules/auth/routes'
import { publicRoutes } from './modules/public/routes'
import { cmsRoutes } from './modules/cms/routes'

// â”€â”€ Response format helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ok<T>(data: T, message = 'OK', meta?: Record<string, unknown>) {
  return { success: true, data, message, ...(meta ? { meta } : {}) }
}

export function fail(message: string, status = 400) {
  return { success: false, data: null, message, status }
}

// â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const app = new Elysia({ adapter: node() })

  // â”€â”€ Plugins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  .use(cors({
    origin: process.env.NODE_ENV === 'production' ? true : true,
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
        description: 'REST API untuk Antigravity Portfolio â€” Rivaldi Yonathan Nainggolan',
        contact: { name: 'Rivaldi', email: 'aldinggln9@gmail.com' },
      },
      tags: [
        { name: 'Health',  description: 'Server health check' },
        { name: 'Auth',   description: 'Autentikasi admin (login, refresh, logout)' },
        { name: 'Public', description: 'Endpoint publik â€” profile, projects, posts' },
        { name: 'CMS',    description: 'Content management â€” auth required' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  }))

  // â”€â”€ Request logger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    console.log(`[${timestamp}] ${method} ${url} â†’ ${status} (${duration}ms)`)
  })

  // â”€â”€ Global error handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Health check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  .use(authRoutes)
  .use(publicRoutes)
  .use(cmsRoutes)

  // â”€â”€ Static files â€” local disk uploads fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  .use(staticPlugin({ assets: 'uploads', prefix: '/uploads' }))

  // â”€â”€ 404 fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  .get('*', ({ set }) => {
    set.status = 404
    return { success: false, data: null, message: 'Route tidak ditemukan' }
  })

const port = Number(process.env.PORT ?? 3000)

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port)
  console.log('')
  console.log('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—')
  console.log('â•‘       ðŸš€ Antigravity Portfolio API               â•‘')
  console.log('â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£')
  console.log(`â•‘  Server  : http://localhost:${String(port).padEnd(21)}â•‘`)
  console.log(`â•‘  Swagger : http://localhost:${port}/docs          â•‘`)
  console.log(`â•‘  Health  : http://localhost:${port}/health        â•‘`)
  console.log(`â•‘  Env     : ${(process.env.NODE_ENV ?? 'development').padEnd(38)}â•‘`)
  console.log('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•')
  console.log('')
}

export { app }
export type App = typeof app
