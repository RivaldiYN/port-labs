import { Elysia } from 'elysia'
import { eq, sql } from 'drizzle-orm'
import { db } from '../../lib/db.js'
import { projects, experiences } from '../../db/schema.js'
import { ok } from '../../lib/response.js'

/**
 * GET /api/stats
 * Returns dynamically computed portfolio stats:
 *  - totalProjects  : count of all published projects
 *  - yearsExperience: total accumulated years across all experience records
 *                     (sums durations; current roles use today as end date)
 */
export const publicStatsRoutes = new Elysia()
  .get('/api/stats', async () => {
    // 1. Count all published projects
    const [projectsRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(projects)
      .where(eq(projects.isPublished, true))

    const totalProjects = projectsRow?.total ?? 0

    // 2. Fetch all experience records to compute total accumulated years
    const allExperiences = await db
      .select({
        startDate: experiences.startDate,
        endDate: experiences.endDate,
        isCurrent: experiences.isCurrent,
      })
      .from(experiences)

    let totalMs = 0
    const now = new Date()

    for (const exp of allExperiences) {
      const start = new Date(exp.startDate)
      const end = exp.isCurrent || !exp.endDate ? now : new Date(exp.endDate)
      const ms = end.getTime() - start.getTime()
      if (ms > 0) totalMs += ms
    }

    const yearsExperience = Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25))

    return ok(
      { totalProjects, yearsExperience },
      'Stats berhasil diambil'
    )
  }, {
    detail: { tags: ['Public'], summary: 'Get computed portfolio stats (project count & total years experience)' },
  })
