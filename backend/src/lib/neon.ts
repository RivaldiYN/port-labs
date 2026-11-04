import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createRealtime, rawSql } from '@neon/realtime/server'

// ── NEON OBJECT STORAGE ───────────────────────────────────────
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const endpoint = process.env.AWS_ENDPOINT_URL_S3
const region = process.env.AWS_REGION || 'ap-southeast-1'
export const NEON_BUCKET = process.env.NEON_BUCKET || 'assets'

export const isNeonStorageAvailable = Boolean(accessKeyId && secretAccessKey && endpoint)

export const s3Client = isNeonStorageAvailable
  ? new S3Client({
      forcePathStyle: true, // Neon requires path-style addressing
      endpoint,
      region,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null

export async function uploadToNeonStorage(key: string, buffer: Buffer, contentType: string) {
  if (!s3Client) throw new Error('Neon Object Storage is not configured')
  await s3Client.send(
    new PutObjectCommand({
      Bucket: NEON_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )
  // Presigned URL for reliable reading across environments
  return await getSignedNeonUrl(key, 7 * 24 * 3600) // 7 days
}

export async function getSignedNeonUrl(key: string, expiresIn = 3600) {
  if (!s3Client) throw new Error('Neon Object Storage is not configured')
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: NEON_BUCKET,
      Key: key,
    }),
    { expiresIn }
  )
}

export async function getNeonObjectStream(key: string) {
  if (!s3Client) throw new Error('Neon Object Storage is not configured')
  return await s3Client.send(
    new GetObjectCommand({
      Bucket: NEON_BUCKET,
      Key: key,
    })
  )
}

export async function deleteFromNeonStorage(key: string) {
  if (!s3Client) return
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: NEON_BUCKET,
      Key: key,
    })
  )
}

// ── NEON REALTIME ─────────────────────────────────────────────
const realtimeSecret = process.env.NEON_REALTIME_SECRET
export const isNeonRealtimeAvailable = Boolean(realtimeSecret)

export const realtime = isNeonRealtimeAvailable
  ? createRealtime({
      secret: realtimeSecret!,
      db: 'neondb',
    })
  : null

export async function sealRealtimeQuery(sqlString: string, params: unknown[] = []) {
  if (!realtime) throw new Error('Neon Realtime is not configured')
  const query = rawSql(sqlString, params as any)
  return await realtime.seal({ query })
}

export function getNeonRealtimeConfig() {
  return {
    url: process.env.NEON_REALTIME_URL ?? null,
    available: isNeonRealtimeAvailable,
  }
}

// ── NEON FUNCTIONS ────────────────────────────────────────────
export async function callHelloFunction() {
  const baseUrl = process.env.NEON_FUNCTION_HELLO_BASE_URL
  if (!baseUrl) throw new Error('NEON_FUNCTION_HELLO_BASE_URL is not set')
  const res = await fetch(baseUrl)
  const text = await res.text()
  return { status: res.status, text }
}

// ── NEON AUTH ─────────────────────────────────────────────────
export function getNeonAuthConfig() {
  return {
    baseUrl: process.env.NEON_AUTH_BASE_URL ?? null,
    jwksUrl: process.env.NEON_AUTH_JWKS_URL ?? null,
    available: Boolean(process.env.NEON_AUTH_BASE_URL),
  }
}

