import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { compare } from 'bcryptjs'
import { randomBytes, createHash } from 'crypto'
import { eq, and, gt } from 'drizzle-orm'
import { db } from '../../lib/db'
import { adminUsers, refreshTokens } from '../../db/schema'
import { ok } from '../../index'

//  ”€ ”€ Rate limiter (in-memory, per IP)  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true // allowed
  }
  if (entry.count >= MAX_ATTEMPTS) return false // blocked
  entry.count++
  return true
}

//  ”€ ”€ Helpers  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
function generateRefreshToken(): string {
  return randomBytes(64).toString('hex')
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

//  ”€ ”€ Auth plugin (derive currentAdmin into context)  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
export const authPlugin = new Elysia({ name: 'auth-plugin' })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    exp: '15m',
  }))
  .derive({ as: 'global' }, async ({ jwt, headers, set }) => {
    const authHeader = headers['authorization'] ?? ''
    if (!authHeader.startsWith('Bearer ')) {
      return { currentAdmin: null }
    }
    const token = authHeader.slice(7)
    const payload = await jwt.verify(token)
    if (!payload || typeof payload.sub !== 'string') {
      return { currentAdmin: null }
    }
    const [admin] = await db
      .select({ id: adminUsers.id, username: adminUsers.username, email: adminUsers.email })
      .from(adminUsers)
      .where(eq(adminUsers.id, payload.sub))
    return { currentAdmin: admin ?? null }
  })

//  ”€ ”€ requireAuth guard  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requireAuth({ currentAdmin, set }: { currentAdmin: unknown; set: any }) {
  if (!currentAdmin) {
    set.status = 401
    return { success: false, data: null, message: 'Tidak terautentikasi    token diperlukan', code: 'UNAUTHORIZED' }
  }
}

//  ”€ ”€ Auth routes  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    exp: '15m',
  }))
  .use(authPlugin)

  // POST /auth/login  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  .post('/login', async ({ body, jwt, set, request }) => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? '0.0.0.0'

    // Rate limit
    if (!checkRateLimit(ip)) {
      set.status = 429
      return { success: false, data: null, message: 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.', code: 'RATE_LIMIT' }
    }

    const { username, password } = body

    // Find admin by username or email
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))

    const INVALID_MSG = 'Username atau password salah'

    if (!admin) {
      set.status = 401
      return { success: false, data: null, message: INVALID_MSG, code: 'INVALID_CREDENTIALS' }
    }

    const valid = await compare(password, admin.passwordHash)
    if (!valid) {
      set.status = 401
      return { success: false, data: null, message: INVALID_MSG, code: 'INVALID_CREDENTIALS' }
    }

    // Generate tokens
    const accessToken = await jwt.sign({ sub: admin.id, username: admin.username })
    const rawRefresh = generateRefreshToken()
    const hashedRefresh = hashToken(rawRefresh)
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)

    // Store refresh token (delete old ones for this admin first for cleanliness)
    await db.insert(refreshTokens).values({
      adminId: admin.id,
      token: hashedRefresh,
      expiresAt,
    })

    return ok({
      accessToken,
      refreshToken: rawRefresh,
      expiresIn: 900, // 15 minutes in seconds
      admin: { id: admin.id, username: admin.username, email: admin.email },
    }, 'Login berhasil')
  }, {
    body: t.Object({
      username: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
    detail: { tags: ['Auth'], summary: 'Login admin    returns accessToken + refreshToken' },
  })

  // POST /auth/refresh  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  .post('/refresh', async ({ body, jwt, set }) => {
    const { refreshToken: rawToken } = body
    const hashed = hashToken(rawToken)
    const now = new Date()

    // Find valid token in DB
    const [record] = await db
      .select({ id: refreshTokens.id, adminId: refreshTokens.adminId, expiresAt: refreshTokens.expiresAt })
      .from(refreshTokens)
      .where(and(
        eq(refreshTokens.token, hashed),
        gt(refreshTokens.expiresAt, now),
      ))

    if (!record || !record.adminId) {
      set.status = 401
      return { success: false, data: null, message: 'Refresh token tidak valid atau kadaluarsa', code: 'INVALID_REFRESH_TOKEN' }
    }

    // Get admin
    const [admin] = await db
      .select({ id: adminUsers.id, username: adminUsers.username, email: adminUsers.email })
      .from(adminUsers)
      .where(eq(adminUsers.id, record.adminId))

    if (!admin) {
      set.status = 401
      return { success: false, data: null, message: 'Admin tidak ditemukan', code: 'ADMIN_NOT_FOUND' }
    }

    // Rotate: delete old, insert new refresh token
    await db.delete(refreshTokens).where(eq(refreshTokens.id, record.id))

    const newAccessToken = await jwt.sign({ sub: admin.id, username: admin.username })
    const newRawRefresh = generateRefreshToken()
    const newHashedRefresh = hashToken(newRawRefresh)
    const newExpiresAt = new Date(Date.now() + REFRESH_TTL_MS)

    await db.insert(refreshTokens).values({
      adminId: admin.id,
      token: newHashedRefresh,
      expiresAt: newExpiresAt,
    })

    return ok({
      accessToken: newAccessToken,
      refreshToken: newRawRefresh,
      expiresIn: 900,
    }, 'Token diperbarui')
  }, {
    body: t.Object({ refreshToken: t.String({ minLength: 1 }) }),
    detail: { tags: ['Auth'], summary: 'Refresh access token    rotates refresh token' },
  })

  // POST /auth/logout  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  .post('/logout', async ({ body, set }) => {
    const { refreshToken: rawToken } = body
    const hashed = hashToken(rawToken)

    await db.delete(refreshTokens).where(eq(refreshTokens.token, hashed))

    set.status = 200
    return ok(null, 'Logout berhasil')
  }, {
    body: t.Object({ refreshToken: t.String({ minLength: 1 }) }),
    detail: { tags: ['Auth'], summary: 'Logout    revoke refresh token' },
  })

  // GET /auth/me  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  .get('/me', async ({ currentAdmin, set }) => {
    const guard = requireAuth({ currentAdmin, set })
    if (guard) return guard

    return ok(currentAdmin, 'Info admin')
  }, {
    detail: { tags: ['Auth'], summary: 'Get current admin info    requires Bearer token' },
  })

  // GET /auth/ping (stub override)  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
  .get('/ping', () => ({ module: 'auth', status: 'ok    see ISSUE-005  œ…' }))
