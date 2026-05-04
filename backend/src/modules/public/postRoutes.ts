import { Elysia, t } from 'elysia'
import { eq, and, ilike, sql, desc, asc, arrayContains, arrayOverlaps } from 'drizzle-orm'
import slugify from 'slugify'
import { db } from '../../lib/db'
import { posts } from '../../db/schema'
import { ok } from '../../index'

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function autoExcerpt(content: string | null | undefined, max = 160): string | null {
  if (!content) return null
  const plain = content.replace(/[#*`>_\-\[\]()!]/g, '').replace(/\s+/g, ' ').trim()
  return plain.length > max ? plain.slice(0, max).trimEnd() + 'â€¦' : plain
}

// â”€â”€ Shared body schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NullableStr = t.Optional(t.Union([t.String(), t.Null()]))

const PostBody = t.Object({
  title:       t.String({ minLength: 1, maxLength: 200 }),
  excerpt:     NullableStr,
  content:     NullableStr,
  coverUrl:    NullableStr,
  tags:        t.Optional(t.Array(t.String())),
  isPublished: t.Optional(t.Boolean()),
})

// â”€â”€ Public routes â€” /api/posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const publicPostRoutes = new Elysia({ prefix: '/api/posts' })

  // GET /api/posts/tags â€” must be before /:slug
  .get('/tags', async () => {
    // Aggregate all distinct tags from published posts
    const rows = await db
      .select({ tags: posts.tags })
      .from(posts)
      .where(eq(posts.isPublished, true))

    const tagSet = new Set<string>()
    for (const row of rows) {
      for (const tag of row.tags ?? []) tagSet.add(tag)
    }
    const sorted = [...tagSet].sort()
    return ok(sorted, 'Tags berhasil diambil')
  }, {
    detail: { tags: ['Public'], summary: 'Get all unique tags from published posts' },
  })

  // GET /api/posts
  .get('/', async ({ query }) => {
    const page   = Math.max(1, Number(query.page  ?? 1))
    const limit  = Math.min(50, Math.max(1, Number(query.limit ?? 9)))
    const offset = (page - 1) * limit
    const search = query.search as string | undefined
    const tag    = query.tag    as string | undefined
    const sort   = (query.sort ?? 'newest') as 'newest' | 'oldest'

    // Base condition: only published
    const conditions: ReturnType<typeof eq>[] = [eq(posts.isPublished, true) as ReturnType<typeof eq>]

    // Full-text search using PostgreSQL to_tsvector + to_tsquery
    if (search) {
      const tsQuery = search.trim().split(/\s+/).join(' & ')
      conditions.push(
        sql`to_tsvector('english', coalesce(${posts.title},'') || ' ' || coalesce(${posts.content},'') || ' ' || coalesce(${posts.excerpt},'')) @@ to_tsquery('english', ${tsQuery + ':*'})` as unknown as ReturnType<typeof eq>
      )
    }

    // Filter by single tag
    if (tag) {
      conditions.push(arrayContains(posts.tags, [tag]) as unknown as ReturnType<typeof eq>)
    }

    // Filter by multiple tags (?tags=golang,react)
    const tagsParam = query.tags as string | undefined
    if (tagsParam) {
      const tagArr = tagsParam.split(',').map(t => t.trim()).filter(Boolean)
      if (tagArr.length) {
        conditions.push(arrayOverlaps(posts.tags, tagArr) as unknown as ReturnType<typeof eq>)
      }
    }

    const where = conditions.length === 1 ? conditions[0] : and(...conditions)

    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(posts)
      .where(where)

    const total      = countRow?.total ?? 0
    const totalPages = Math.ceil(total / limit)

    const rows = await db
      .select()
      .from(posts)
      .where(where)
      .orderBy(sort === 'newest' ? desc(posts.publishedAt) : asc(posts.publishedAt))
      .limit(limit)
      .offset(offset)

    return ok(rows, 'Posts berhasil diambil', { page, limit, total, totalPages })
  }, {
    query: t.Object({
      page:   t.Optional(t.String()),
      limit:  t.Optional(t.String()),
      search: t.Optional(t.String()),
      tag:    t.Optional(t.String()),
      tags:   t.Optional(t.String()),
      sort:   t.Optional(t.String()),
    }),
    detail: { tags: ['Public'], summary: 'List published posts (paginated, searchable, filterable)' },
  })

  // GET /api/posts/:slug
  .get('/:slug', async ({ params, set }) => {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, params.slug), eq(posts.isPublished, true)))

    if (!post) {
      set.status = 404
      return { success: false, data: null, message: 'Post tidak ditemukan' }
    }
    return ok(post, 'Detail post')
  }, {
    detail: { tags: ['Public'], summary: 'Get published post by slug' },
  })

// â”€â”€ CMS routes â€” /api/cms/posts (admin only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const cmsPostRoutes = new Elysia({ prefix: '/api/cms/posts' })

  // GET /api/cms/posts
  .get('/', async ({ query }) => {
    const page   = Math.max(1, Number(query.page  ?? 1))
    const limit  = Math.min(100, Math.max(1, Number(query.limit ?? 20)))
    const offset = (page - 1) * limit
    const search = query.search as string | undefined

    const conditions = search
      ? [ilike(posts.title, `%${search}%`)]
      : []
    const where = conditions.length ? conditions[0] : undefined

    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(posts)
      .where(where)

    const total = countRow?.total ?? 0

    const rows = await db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    return ok(rows, 'CMS posts', { page, limit, total, totalPages: Math.ceil(total / limit) })
  }, {
    query: t.Object({
      page:   t.Optional(t.String()),
      limit:  t.Optional(t.String()),
      search: t.Optional(t.String()),
    }),
    detail: { tags: ['CMS'], summary: 'List all posts including drafts (admin)' },
  })

  // POST /api/cms/posts
  .post('/', async ({ body, set }) => {
    const slug = slugify(body.title, { lower: true, strict: true })

    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug))
    if (existing) {
      set.status = 409
      return { success: false, data: null, message: `Slug "${slug}" sudah ada. Gunakan judul yang berbeda.` }
    }

    // Auto-generate excerpt if not provided
    const excerpt = body.excerpt ?? autoExcerpt(body.content)
    const now     = new Date()

    const [post] = await db.insert(posts).values({
      title:       body.title,
      slug,
      excerpt,
      content:     body.content ?? null,
      coverUrl:    body.coverUrl ?? null,
      tags:        body.tags ?? [],
      isPublished: body.isPublished ?? false,
      publishedAt: body.isPublished ? now : null,
    }).returning()

    set.status = 201
    return ok(post, 'Post berhasil dibuat')
  }, {
    body: PostBody,
    detail: { tags: ['CMS'], summary: 'Create new blog post' },
  })

  // PUT /api/cms/posts/:id
  .put('/:id', async ({ params, body, set }) => {
    const [existing] = await db.select().from(posts).where(eq(posts.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Post tidak ditemukan' }
    }

    // Regenerate slug if title changed
    let slug = existing.slug
    if (body.title && body.title !== existing.title) {
      slug = slugify(body.title, { lower: true, strict: true })
      const [conflict] = await db.select({ id: posts.id }).from(posts)
        .where(and(eq(posts.slug, slug), sql`id != ${params.id}`))
      if (conflict) {
        set.status = 409
        return { success: false, data: null, message: `Slug "${slug}" sudah digunakan` }
      }
    }

    const published   = body.isPublished ?? existing.isPublished
    const publishedAt = published && !existing.publishedAt ? new Date() : existing.publishedAt

    // Auto-generate excerpt if content changed and excerpt not provided
    const newContent = body.content !== undefined ? body.content : existing.content
    const newExcerpt = body.excerpt !== undefined
      ? (body.excerpt ?? autoExcerpt(newContent))
      : (existing.excerpt ?? autoExcerpt(newContent))

    const [updated] = await db.update(posts).set({
      title:       body.title     ?? existing.title,
      slug,
      excerpt:     newExcerpt,
      content:     newContent,
      coverUrl:    body.coverUrl  !== undefined ? body.coverUrl  : existing.coverUrl,
      tags:        body.tags      ?? existing.tags,
      isPublished: published,
      publishedAt,
      updatedAt:   new Date(),
    }).where(eq(posts.id, params.id)).returning()

    return ok(updated, 'Post berhasil diupdate')
  }, {
    body: PostBody,
    detail: { tags: ['CMS'], summary: 'Update post by ID' },
  })

  // DELETE /api/cms/posts/:id
  .delete('/:id', async ({ params, set }) => {
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Post tidak ditemukan' }
    }
    await db.delete(posts).where(eq(posts.id, params.id))
    return ok({ id: params.id }, 'Post berhasil dihapus')
  }, {
    detail: { tags: ['CMS'], summary: 'Delete post by ID' },
  })

  // PATCH /api/cms/posts/:id/publish â€” toggle
  .patch('/:id/publish', async ({ params, set }) => {
    const [existing] = await db.select().from(posts).where(eq(posts.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Post tidak ditemukan' }
    }

    const newPublished = !existing.isPublished
    const [updated] = await db.update(posts).set({
      isPublished: newPublished,
      publishedAt: newPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      updatedAt:   new Date(),
    }).where(eq(posts.id, params.id)).returning()

    return ok(updated, `Post ${newPublished ? 'dipublikasikan' : 'dijadikan draft'}`)
  }, {
    detail: { tags: ['CMS'], summary: 'Toggle post published status' },
  })
