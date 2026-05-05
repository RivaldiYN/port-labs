import { Elysia } from 'elysia'
import { publicProjectRoutes } from './projectRoutes.js'
import { publicProfileRoutes } from './profileRoutes.js'
import { publicPostRoutes } from './postRoutes.js'
import { publicMediaRoutes } from './mediaRoutes.js'

/**
 * Public routes — /api/*
 * Aggregates all public-facing endpoints.
 */
export const publicRoutes = new Elysia()
  .use(publicProjectRoutes)
  .use(publicProfileRoutes)
  .use(publicPostRoutes)
  .use(publicMediaRoutes)
