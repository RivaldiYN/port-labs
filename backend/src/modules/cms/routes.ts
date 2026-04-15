import { Elysia } from 'elysia'
import { authPlugin, requireAuth } from '../auth/routes'
import { cmsProjectRoutes } from '../public/projectRoutes'

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
