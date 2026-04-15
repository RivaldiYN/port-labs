import { Elysia } from 'elysia'
import { publicProjectRoutes } from './projectRoutes'

/**
 * Public routes — /api/*
 * Aggregates all public-facing endpoints.
 */
export const publicRoutes = new Elysia()
  .use(publicProjectRoutes)
