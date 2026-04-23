import { Elysia, t } from 'elysia'
import { eq, desc, sql } from 'drizzle-orm'
import { randomBytes } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import * as Minio from 'minio'
import { db } from '../../lib/db'
import { media } from '../../db/schema'
import { ok } from '../../index'

// ── Serialize any thrown value to a readable string ───────────────────────────
function errMsg(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try { return JSON.stringify(err) } catch { return String(err) }
}

// ── MinIO client ──────────────────────────────────────────────────────────────
let minioAvailable = false

const minioClient = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT  ?? 'localhost',
  port:      Number(process.env.MINIO_PORT ?? 9000),
  useSSL:    process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_USER     ?? 'minioadmin',
  secretKey: process.env.MINIO_PASSWORD ?? 'minioadmin123',
})

const BUCKET = process.env.MINIO_BUCKET ?? 'portfolio-media'

async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) {
      await minioClient.makeBucket(BUCKET, 'us-east-1')
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${BUCKET}/*`] }],
      })
      await minioClient.setBucketPolicy(BUCKET, policy)
    }
    minioAvailable = true
    console.log('[Media] MinIO connected — bucket:', BUCKET)
  } catch (e) {
    console.warn('[Media] MinIO tidak tersedia, fallback ke disk lokal:', errMsg(e))
    minioAvailable = false
  }
}
ensureBucket()

// ── Local disk fallback ───────────────────────────────────────────────────────
const UPLOAD_DIR  = join(process.cwd(), 'uploads')
const PUBLIC_BASE = process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 3000}`

async function saveLocally(objectName: string, buffer: Buffer): Promise<string> {
  const dir = join(UPLOAD_DIR, 'media')
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })
  const filename = objectName.replace('media/', '')
  await writeFile(join(dir, filename), buffer)
  return `${PUBLIC_BASE}/uploads/media/${filename}`
}

function buildMinioUrl(objectName: string) {
  const endpoint = process.env.MINIO_ENDPOINT ?? 'localhost'
  const port     = process.env.MINIO_PORT ?? '9000'
  const proto    = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'
  return `${proto}://${endpoint}:${port}/${BUCKET}/${objectName}`
}

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
  'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf',
}

// ── CMS Media routes ──────────────────────────────────────────────────────────
export const cmsMediaRoutes = new Elysia({ prefix: '/api/cms/media' })

  // GET /api/cms/media
  .get('/', async ({ query }) => {
    const page   = Math.max(1, Number(query.page  ?? 1))
    const limit  = Math.min(100, Math.max(1, Number(query.limit ?? 24)))
    const offset = (page - 1) * limit

    const [countRow] = await db.select({ total: sql<number>`COUNT(*)::int` }).from(media)
    const total = countRow?.total ?? 0

    const rows = await db.select().from(media).orderBy(desc(media.uploadedAt)).limit(limit).offset(offset)
    return ok(rows, 'Media list', { page, limit, total, totalPages: Math.ceil(total / limit) })
  }, {
    query: t.Object({ page: t.Optional(t.String()), limit: t.Optional(t.String()) }),
    detail: { tags: ['CMS'], summary: 'List all uploaded media' },
  })

  // POST /api/cms/media/upload
  .post('/upload', async ({ body, set }) => {
    const file = (body as { file: File }).file

    if (!file || typeof file.arrayBuffer !== 'function') {
      set.status = 400
      return { success: false, data: null, message: 'File diperlukan' }
    }

    // Normalize mime type
    const mime = file.type || 'application/octet-stream'
    const ext  = ALLOWED_TYPES[mime]
    if (!ext) {
      set.status = 400
      return { success: false, data: null, message: `Format tidak didukung (${mime}). Gunakan JPG, PNG, WebP, GIF, atau PDF.` }
    }

    const MAX = 5 * 1024 * 1024
    if (file.size > MAX) {
      set.status = 400
      return { success: false, data: null, message: 'Ukuran file maksimal 5MB' }
    }

    try {
      const buffer     = Buffer.from(await file.arrayBuffer())
      const timestamp  = Date.now()
      const random     = randomBytes(4).toString('hex')
      const safeName   = (file.name || `file.${ext}`).replace(/[^a-z0-9._-]/gi, '_').toLowerCase()
      const objectName = `media/${timestamp}-${random}-${safeName}`

      let url: string
      let storage: string

      if (minioAvailable) {
        await minioClient.putObject(BUCKET, objectName, buffer, buffer.length, { 'Content-Type': mime })
        url = buildMinioUrl(objectName)
        storage = 'MinIO'
        console.log('[Media] Uploaded to MinIO:', objectName)
      } else {
        url = await saveLocally(objectName, buffer)
        storage = 'disk lokal'
        console.log('[Media] Saved to disk (MinIO unavailable):', url)
      }

      const [row] = await db.insert(media).values({
        filename:     objectName,
        originalName: file.name || safeName,
        mimeType:     mime,
        sizeBytes:    file.size,
        url,
        altText:      null,
      }).returning()

      set.status = 201
      return ok(row, `File berhasil diupload (${storage})`)
    } catch (err) {
      console.error('[Media] Upload error:', err)
      set.status = 500
      return { success: false, data: null, message: `Upload gagal: ${errMsg(err)}` }
    }
  }, {
    body: t.Object({ file: t.File({ maxSize: '5m' }) }),
    detail: { tags: ['CMS'], summary: 'Upload file to MinIO or local disk and save metadata' },
  })

  // PATCH /api/cms/media/:id — update alt text
  .patch('/:id', async ({ params, body, set }) => {
    const [row] = await db.select().from(media).where(eq(media.id, params.id))
    if (!row) { set.status = 404; return { success: false, data: null, message: 'Media tidak ditemukan' } }
    const [updated] = await db.update(media).set({ altText: (body as { altText: string | null }).altText ?? null }).where(eq(media.id, params.id)).returning()
    return ok(updated, 'Alt text diupdate')
  }, {
    body: t.Object({ altText: t.Optional(t.Union([t.String(), t.Null()])) }),
    detail: { tags: ['CMS'], summary: 'Update media alt text' },
  })

  // DELETE /api/cms/media/:id — cascade delete MinIO + DB
  .delete('/:id', async ({ params, set }) => {
    const [row] = await db.select().from(media).where(eq(media.id, params.id))
    if (!row) { set.status = 404; return { success: false, data: null, message: 'Media tidak ditemukan' } }

    if (minioAvailable) {
      try { await minioClient.removeObject(BUCKET, row.filename) }
      catch (e) { console.warn('[Media] MinIO delete failed (non-fatal):', errMsg(e)) }
    }

    await db.delete(media).where(eq(media.id, params.id))
    return ok({ id: params.id }, 'Media berhasil dihapus')
  }, {
    detail: { tags: ['CMS'], summary: 'Delete media from MinIO (if available) and DB' },
  })

// ── Public media route — GET /api/media (images only) ─────────────────────────
export const publicMediaRoutes = new Elysia({ prefix: '/api/media' })
  .get('/', async ({ query }) => {
    const limit  = Math.min(50, Math.max(1, Number(query.limit ?? 20)))
    const page   = Math.max(1, Number(query.page ?? 1))
    const offset = (page - 1) * limit

    const rows = await db.select().from(media)
      .where(sql`mime_type LIKE 'image/%'`)
      .orderBy(desc(media.uploadedAt))
      .limit(limit).offset(offset)

    return ok(rows, 'Public media gallery')
  }, {
    query: t.Object({ page: t.Optional(t.String()), limit: t.Optional(t.String()) }),
    detail: { tags: ['Public'], summary: 'List public image media' },
  })
