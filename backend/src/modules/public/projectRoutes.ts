import { Elysia, t } from 'elysia'
import { eq, and, ilike, sql, desc, asc, arrayContains } from 'drizzle-orm'
import slugify from 'slugify'
import { db } from '../../lib/db'
import { projects } from '../../db/schema'
import { ok } from '../../index'

//  ”€ ”€ Shared project body schema  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
const NullableStr = t.Optional(t.Union([t.String(), t.Null()]))

const ProjectBody = t.Object({
  title: t.String({ minLength: 1 }),
  description: NullableStr,
  content: NullableStr,
  thumbnailUrl: NullableStr,
  demoUrl: NullableStr,
  repoUrl: NullableStr,
  techStack: t.Optional(t.Array(t.String())),
  isFeatured: t.Optional(t.Boolean()),
  isPublished: t.Optional(t.Boolean()),
})

//  ”€ ”€ Public routes    /api/projects  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
export const publicProjectRoutes = new Elysia({ prefix: '/api/projects' })

  // GET /api/projects
  .get('/', async ({ query }) => {
    const page = Math.max(1, Number(query.page ?? 1))
    const limit = Math.min(50, Math.max(1, Number(query.limit ?? 6)))
    const offset = (page - 1) * limit
    const featured = query.featured === 'true'
    const tech = query.tech as string | undefined
    const search = query.search as string | undefined
    const sort = (query.sort ?? 'newest') as 'newest' | 'oldest'

    // Build WHERE conditions
    const conditions = [eq(projects.isPublished, true)]
    if (featured) conditions.push(eq(projects.isFeatured, true))
    if (tech) conditions.push(arrayContains(projects.techStack, [tech]))
    if (search) conditions.push(ilike(projects.title, `%${search}%`))

    const where = conditions.length === 1 ? conditions[0] : and(...conditions)

    // Count total
    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(projects)
      .where(where)

    const total = countRow?.total ?? 0
    const totalPages = Math.ceil(total / limit)

    // Fetch rows
    const rows = await db
      .select()
      .from(projects)
      .where(where)
      .orderBy(sort === 'newest' ? desc(projects.createdAt) : asc(projects.createdAt))
      .limit(limit)
      .offset(offset)

    return ok(rows, 'Projects berhasil diambil', { page, limit, total, totalPages })
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      featured: t.Optional(t.String()),
      tech: t.Optional(t.String()),
      search: t.Optional(t.String()),
      sort: t.Optional(t.String()),
    }),
    detail: { tags: ['Public'], summary: 'List published projects (paginated, filterable)' },
  })

  // GET /api/projects/:slug
  .get('/:slug', async ({ params, set }) => {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, params.slug), eq(projects.isPublished, true)))

    if (!project) {
      set.status = 404
      return { success: false, data: null, message: 'Project tidak ditemukan' }
    }

    return ok(project, 'Detail project')
  }, {
    detail: { tags: ['Public'], summary: 'Get project detail by slug' },
  })

//  ”€ ”€ CMS routes    /api/cms/projects (admin only)  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
export const cmsProjectRoutes = new Elysia({ prefix: '/api/cms/projects' })

  // GET /api/cms/projects    list all including drafts
  .get('/', async ({ query }) => {
    const page = Math.max(1, Number(query.page ?? 1))
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)))
    const offset = (page - 1) * limit
    const search = query.search as string | undefined

    const conditions = search ? [ilike(projects.title, `%${search}%`)] : []
    const where = conditions.length ? conditions[0] : undefined

    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(projects)
      .where(where)

    const total = countRow?.total ?? 0

    const rows = await db
      .select()
      .from(projects)
      .where(where)
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset)

    return ok(rows, 'CMS projects', { page, limit, total, totalPages: Math.ceil(total / limit) })
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      search: t.Optional(t.String()),
    }),
    detail: { tags: ['CMS'], summary: 'List all projects including drafts' },
  })

  // POST /api/cms/projects
  .post('/', async ({ body, set }) => {
    const slug = slugify(body.title, { lower: true, strict: true })

    // Check slug unique
    const [existing] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug))
    if (existing) {
      set.status = 409
      return { success: false, data: null, message: `Slug "${slug}" sudah ada. Gunakan judul yang berbeda.` }
    }

    const now = new Date()
    const [project] = await db.insert(projects).values({
      title: body.title,
      slug,
      description: body.description,
      content: body.content,
      thumbnailUrl: body.thumbnailUrl,
      demoUrl: body.demoUrl,
      repoUrl: body.repoUrl,
      techStack: body.techStack ?? [],
      isFeatured: body.isFeatured ?? false,
      isPublished: body.isPublished ?? false,
      publishedAt: body.isPublished ? now : undefined,
    }).returning()

    set.status = 201
    return ok(project, 'Project berhasil dibuat')
  }, {
    body: ProjectBody,
    detail: { tags: ['CMS'], summary: 'Create new project' },
  })

  // PUT /api/cms/projects/:id
  .put('/:id', async ({ params, body, set }) => {
    const [existing] = await db.select().from(projects).where(eq(projects.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Project tidak ditemukan' }
    }

    // If title changed, regenerate slug
    let slug = existing.slug
    if (body.title && body.title !== existing.title) {
      slug = slugify(body.title, { lower: true, strict: true })
      const [conflict] = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.slug, slug), sql`id != ${params.id}`))
      if (conflict) {
        set.status = 409
        return { success: false, data: null, message: `Slug "${slug}" sudah digunakan` }
      }
    }

    const published = body.isPublished ?? existing.isPublished
    const publishedAt = published && !existing.publishedAt ? new Date() : existing.publishedAt

    const [updated] = await db.update(projects).set({
      title: body.title ?? existing.title,
      slug,
      description: body.description !== undefined ? body.description : existing.description,
      content: body.content !== undefined ? body.content : existing.content,
      thumbnailUrl: body.thumbnailUrl !== undefined ? body.thumbnailUrl : existing.thumbnailUrl,
      demoUrl: body.demoUrl !== undefined ? body.demoUrl : existing.demoUrl,
      repoUrl: body.repoUrl !== undefined ? body.repoUrl : existing.repoUrl,
      techStack: body.techStack ?? existing.techStack,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
      isPublished: published,
      publishedAt,
      updatedAt: new Date(),
    }).where(eq(projects.id, params.id)).returning()

    return ok(updated, 'Project berhasil diupdate')
  }, {
    body: ProjectBody,
    detail: { tags: ['CMS'], summary: 'Update project by ID' },
  })

  // DELETE /api/cms/projects/:id
  .delete('/:id', async ({ params, set }) => {
    const [existing] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Project tidak ditemukan' }
    }

    await db.delete(projects).where(eq(projects.id, params.id))
    return ok({ id: params.id }, 'Project berhasil dihapus')
  }, {
    detail: { tags: ['CMS'], summary: 'Delete project by ID' },
  })

  // PATCH /api/cms/projects/:id/publish    toggle published
  .patch('/:id/publish', async ({ params, set }) => {
    const [existing] = await db.select().from(projects).where(eq(projects.id, params.id))
    if (!existing) {
      set.status = 404
      return { success: false, data: null, message: 'Project tidak ditemukan' }
    }

    const newPublished = !existing.isPublished
    const [updated] = await db.update(projects).set({
      isPublished: newPublished,
      publishedAt: newPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    }).where(eq(projects.id, params.id)).returning()

    return ok(updated, `Project ${newPublished ? 'dipublikasikan' : 'dijadikan draft'}`)
  }, {
    detail: { tags: ['CMS'], summary: 'Toggle project published status' },
  })
