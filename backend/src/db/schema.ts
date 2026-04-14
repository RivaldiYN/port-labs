import {
  pgTable, uuid, varchar, text, boolean,
  smallint, integer, timestamp, date, check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const profile = pgTable('profile', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        varchar('name', { length: 100 }).notNull(),
  tagline:     text('tagline'),
  bio:         text('bio'),
  avatarUrl:   text('avatar_url'),
  resumeUrl:   text('resume_url'),
  email:       varchar('email', { length: 150 }),
  githubUrl:   text('github_url'),
  linkedinUrl: text('linkedin_url'),
  location:    varchar('location', { length: 100 }),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const skills = pgTable('skills', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        varchar('name', { length: 80 }).notNull(),
  category:    varchar('category', { length: 50 }),
  iconUrl:     text('icon_url'),
  proficiency: smallint('proficiency'),
  sortOrder:   smallint('sort_order').default(0),
}, (table) => [
  check('proficiency_range', sql`${table.proficiency} BETWEEN 1 AND 5`),
])

export const projects = pgTable('projects', {
  id:           uuid('id').primaryKey().defaultRandom(),
  title:        varchar('title', { length: 150 }).notNull(),
  slug:         varchar('slug', { length: 170 }).unique().notNull(),
  description:  text('description'),
  content:      text('content'),
  thumbnailUrl: text('thumbnail_url'),
  demoUrl:      text('demo_url'),
  repoUrl:      text('repo_url'),
  techStack:    text('tech_stack').array(),
  isFeatured:   boolean('is_featured').default(false),
  isPublished:  boolean('is_published').default(false),
  publishedAt:  timestamp('published_at', { withTimezone: true }),
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const posts = pgTable('posts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       varchar('title', { length: 200 }).notNull(),
  slug:        varchar('slug', { length: 220 }).unique().notNull(),
  excerpt:     text('excerpt'),
  content:     text('content'),
  coverUrl:    text('cover_url'),
  tags:        text('tags').array(),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const experiences = pgTable('experiences', {
  id:          uuid('id').primaryKey().defaultRandom(),
  company:     varchar('company', { length: 120 }).notNull(),
  role:        varchar('role', { length: 120 }).notNull(),
  description: text('description'),
  techStack:   text('tech_stack').array(),
  startDate:   date('start_date').notNull(),
  endDate:     date('end_date'),
  isCurrent:   boolean('is_current').default(false),
  sortOrder:   smallint('sort_order').default(0),
})

export const media = pgTable('media', {
  id:           uuid('id').primaryKey().defaultRandom(),
  filename:     varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  mimeType:     varchar('mime_type', { length: 80 }),
  sizeBytes:    integer('size_bytes'),
  url:          text('url').notNull(),
  altText:      text('alt_text'),
  uploadedAt:   timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  username:     varchar('username', { length: 60 }).unique().notNull(),
  email:        varchar('email', { length: 150 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const refreshTokens = pgTable('refresh_tokens', {
  id:        uuid('id').primaryKey().defaultRandom(),
  adminId:   uuid('admin_id').references(() => adminUsers.id, { onDelete: 'cascade' }),
  token:     text('token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// Type exports
export type Profile       = typeof profile.$inferSelect
export type NewProfile    = typeof profile.$inferInsert
export type Skill         = typeof skills.$inferSelect
export type NewSkill      = typeof skills.$inferInsert
export type Project       = typeof projects.$inferSelect
export type NewProject    = typeof projects.$inferInsert
export type Post          = typeof posts.$inferSelect
export type NewPost       = typeof posts.$inferInsert
export type Experience    = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert
export type Media         = typeof media.$inferSelect
export type NewMedia      = typeof media.$inferInsert
export type AdminUser     = typeof adminUsers.$inferSelect
export type NewAdminUser  = typeof adminUsers.$inferInsert
export type RefreshToken    = typeof refreshTokens.$inferSelect
export type NewRefreshToken = typeof refreshTokens.$inferInsert
