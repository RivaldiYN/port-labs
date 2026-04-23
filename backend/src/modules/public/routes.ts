import { Elysia } from 'elysia'
import { publicProjectRoutes } from './projectRoutes'
import { publicProfileRoutes } from './profileRoutes'

/**
 * Public routes — /api/*
 * Aggregates all public-facing endpoints.
 */
export const publicRoutes = new Elysia()
  .use(publicProjectRoutes)
  .use(publicProfileRoutes)
