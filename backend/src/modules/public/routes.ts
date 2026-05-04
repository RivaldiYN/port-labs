import { Elysia } from 'elysia'
import { publicProjectRoutes } from './projectRoutes'
import { publicProfileRoutes } from './profileRoutes'
import { publicPostRoutes } from './postRoutes'
import { publicMediaRoutes } from './mediaRoutes'

/**
 * Public routes â€” /api/*
 * Aggregates all public-facing endpoints.
 */
export const publicRoutes = new Elysia()
  .use(publicProjectRoutes)
  .use(publicProfileRoutes)
  .use(publicPostRoutes)
  .use(publicMediaRoutes)
