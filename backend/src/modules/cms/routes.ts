import { Elysia } from 'elysia'
import { authPlugin, requireAuth } from '../auth/routes'
import { cmsProjectRoutes } from '../public/projectRoutes'
import { cmsProfileRoutes } from '../public/profileRoutes'
import { cmsPostRoutes } from '../public/postRoutes'
import { cmsMediaRoutes } from '../public/mediaRoutes'

/**
 * CMS routes â€” /api/cms/*
 * All routes require Bearer JWT token (admin only).
 */
export const cmsRoutes = new Elysia()
  .use(authPlugin)
  // Auth guard for ALL CMS routes
  .onBeforeHandle(({ currentAdmin, set }) => {
    return requireAuth({ currentAdmin, set })
  })
  .use(cmsProjectRoutes)
  .use(cmsProfileRoutes)
  .use(cmsPostRoutes)
  .use(cmsMediaRoutes)
