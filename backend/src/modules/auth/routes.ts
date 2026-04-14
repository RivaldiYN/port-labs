import Elysia from 'elysia'

/**
 * Auth routes — Login, refresh token, logout, me
 * Full implementation: ISSUE-005
 */
export const authRoutes = new Elysia({ prefix: '/auth' })
  .get('/ping', () => ({ module: 'auth', status: 'stub — see ISSUE-005' }))
