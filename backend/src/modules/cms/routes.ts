import Elysia from 'elysia'

/**
 * CMS routes — admin-only CRUD for projects, posts, media, profile
 * Full implementation: ISSUE-006 to ISSUE-010
 */
export const cmsRoutes = new Elysia({ prefix: '/api/cms' })
  .get('/ping', () => ({ module: 'cms', status: 'stub — see ISSUE-006 to ISSUE-010' }))
