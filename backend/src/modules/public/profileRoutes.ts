import { Elysia, t } from 'elysia'
import { eq } from 'drizzle-orm'
import { createHash } from 'crypto'
import { db } from '../../lib/db'
import { profile } from '../../db/schema'
import { ok } from '../../index'
import * as Minio from 'minio'

// ── MinIO client ──────────────────────────────────────────────────────────────
const minioClient = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT  ?? 'localhost',
  port:      Number(process.env.MINIO_PORT ?? 9000),
  useSSL:    process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_USER      ?? 'minioadmin',
  secretKey: process.env.MINIO_PASSWORD  ?? 'minioadmin123',
})

const BUCKET = process.env.MINIO_BUCKET ?? 'portfolio-media'

async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) {
      await minioClient.makeBucket(BUCKET, 'us-east-1')
      // Set public read policy
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET}/*`],
        }],
      })
      await minioClient.setBucketPolicy(BUCKET, policy)
    }
  } catch {
    // MinIO might not be running — continue gracefully
  }
}

// Ensure bucket on startup
ensureBucket()

// ── Profile body schema ───────────────────────────────────────────────────────
const ProfileBody = t.Object({
  name:        t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  tagline:     t.Optional(t.Union([t.String(), t.Null()])),
  bio:         t.Optional(t.Union([t.String(), t.Null()])),
  email:       t.Optional(t.Union([t.String({ format: 'email' }), t.Null()])),
  githubUrl:   t.Optional(t.Union([t.String(), t.Null()])),
  linkedinUrl: t.Optional(t.Union([t.String(), t.Null()])),
  location:    t.Optional(t.Union([t.String({ maxLength: 100 }), t.Null()])),
  resumeUrl:   t.Optional(t.Union([t.String(), t.Null()])),
  avatarUrl:   t.Optional(t.Union([t.String(), t.Null()])),
})

// ── Public route — GET /api/profile ──────────────────────────────────────────
export const publicProfileRoutes = new Elysia()
  .get('/api/profile', async ({ set }) => {
    const rows = await db.select().from(profile).limit(1)
    if (!rows.length) {
      set.status = 404
      return { success: false, data: null, message: 'Profil belum dikonfigurasi' }
    }
    return ok(rows[0], 'Profil berhasil diambil')
  }, {
    detail: { tags: ['Public'], summary: 'Get public profile data' },
  })

// ── CMS routes — /api/cms/profile (admin only) ───────────────────────────────
export const cmsProfileRoutes = new Elysia()

  // PUT /api/cms/profile — update profile
  .put('/api/cms/profile', async ({ body, set }) => {
    const rows = await db.select().from(profile).limit(1)

    if (!rows.length) {
      // No profile yet — create one (upsert pattern)
      if (!body.name) {
        set.status = 400
        return { success: false, data: null, message: 'Field "name" diperlukan untuk profil baru' }
      }
      const [created] = await db.insert(profile).values({
        name:        body.name,
        tagline:     body.tagline ?? null,
        bio:         body.bio ?? null,
        email:       body.email ?? null,
        githubUrl:   body.githubUrl ?? null,
        linkedinUrl: body.linkedinUrl ?? null,
        location:    body.location ?? null,
        resumeUrl:   body.resumeUrl ?? null,
        avatarUrl:   body.avatarUrl ?? null,
        updatedAt:   new Date(),
      }).returning()
      set.status = 201
      return ok(created, 'Profil berhasil dibuat')
    }

    const existing = rows[0]
    const [updated] = await db.update(profile).set({
      name:        body.name        ?? existing.name,
      tagline:     body.tagline     !== undefined ? body.tagline     : existing.tagline,
      bio:         body.bio         !== undefined ? body.bio         : existing.bio,
      email:       body.email       !== undefined ? body.email       : existing.email,
      githubUrl:   body.githubUrl   !== undefined ? body.githubUrl   : existing.githubUrl,
      linkedinUrl: body.linkedinUrl !== undefined ? body.linkedinUrl : existing.linkedinUrl,
      location:    body.location    !== undefined ? body.location    : existing.location,
      resumeUrl:   body.resumeUrl   !== undefined ? body.resumeUrl   : existing.resumeUrl,
      avatarUrl:   body.avatarUrl   !== undefined ? body.avatarUrl   : existing.avatarUrl,
      updatedAt:   new Date(),
    }).where(eq(profile.id, existing.id)).returning()

    return ok(updated, 'Profil berhasil diupdate')
  }, {
    body: ProfileBody,
    detail: { tags: ['CMS'], summary: 'Update profile (upsert)' },
  })

  // POST /api/cms/profile/avatar — upload avatar to MinIO
  .post('/api/cms/profile/avatar', async ({ body, set }) => {
    const file = (body as { avatar: File }).avatar

    if (!file || typeof file.arrayBuffer !== 'function') {
      set.status = 400
      return { success: false, data: null, message: 'File avatar diperlukan' }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      set.status = 400
      return { success: false, data: null, message: 'Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.' }
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      set.status = 400
      return { success: false, data: null, message: 'Ukuran file maksimal 5MB' }
    }

    try {
      const buffer  = Buffer.from(await file.arrayBuffer())
      const ext     = file.type.split('/')[1] ?? 'jpg'
      const hash    = createHash('sha256').update(buffer).digest('hex').slice(0, 12)
      const filename = `avatars/${hash}.${ext}`

      await minioClient.putObject(BUCKET, filename, buffer, buffer.length, {
        'Content-Type': file.type,
      })

      const endpoint = process.env.MINIO_ENDPOINT ?? 'localhost'
      const port     = process.env.MINIO_PORT ?? '9000'
      const useSSL   = process.env.MINIO_USE_SSL === 'true'
      const proto    = useSSL ? 'https' : 'http'
      const avatarUrl = `${proto}://${endpoint}:${port}/${BUCKET}/${filename}`

      // Update avatar_url in profile
      const rows = await db.select().from(profile).limit(1)
      if (rows.length) {
        await db.update(profile).set({ avatarUrl, updatedAt: new Date() })
          .where(eq(profile.id, rows[0].id))
      }

      return ok({ avatarUrl }, 'Avatar berhasil diupload')
    } catch (err) {
      set.status = 500
      return {
        success: false,
        data: null,
        message: `Gagal upload avatar: ${(err as Error).message}`,
      }
    }
  }, {
    body: t.Object({
      avatar: t.File({ type: 'image/*', maxSize: '5m' }),
    }),
    detail: { tags: ['CMS'], summary: 'Upload avatar to MinIO — returns avatarUrl' },
  })
