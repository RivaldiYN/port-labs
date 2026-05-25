import { Elysia } from 'elysia'
import { eq, sql, min } from 'drizzle-orm'
import { db } from '../../lib/db.js'
import { projects, experiences } from '../../db/schema.js'
import { ok } from '../../index.js'

/**
 * GET /api/stats
 * Returns dynamically computed portfolio stats:
 *  - totalProjects  : count of all published projects
 *  - yearsExperience: years since the earliest experience start_date (rounded down)
 */
export const publicStatsRoutes = new Elysia()
  .get('/api/stats', async () => {
    // 1. Count all published projects
    const [projectsRow] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(projects)
      .where(eq(projects.isPublished, true))

    const totalProjects = projectsRow?.total ?? 0

    // 2. Find the earliest experience start_date to compute years of experience
    const [expRow] = await db
      .select({ earliest: min(experiences.startDate) })
      .from(experiences)

    let yearsExperience = 0
    if (expRow?.earliest) {
      const start = new Date(expRow.earliest)
      const now = new Date()
      yearsExperience = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    }

    return ok(
      { totalProjects, yearsExperience },
      'Stats berhasil diambil'
    )
  }, {
    detail: { tags: ['Public'], summary: 'Get computed portfolio stats (project count & years experience)' },
  })
