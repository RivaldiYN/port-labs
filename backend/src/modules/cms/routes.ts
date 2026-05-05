import { Elysia } from 'elysia'
import { authPlugin, requireAuth } from '../auth/routes.js'
import { cmsProjectRoutes } from '../public/projectRoutes.js'
import { cmsProfileRoutes } from '../public/profileRoutes.js'
import { cmsPostRoutes } from '../public/postRoutes.js'
import { cmsMediaRoutes } from '../public/mediaRoutes.js'

/**
 * CMS routes — /api/cms/*
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
