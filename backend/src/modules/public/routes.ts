import Elysia from 'elysia'

/**
 * Public routes — profile, projects, posts, experiences, skills
 * Full implementation: ISSUE-006, ISSUE-007, ISSUE-008, ISSUE-010
 */
export const publicRoutes = new Elysia({ prefix: '/api' })
  .get('/ping', () => ({ module: 'public', status: 'stub — see ISSUE-006 to ISSUE-010' }))
