import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ─── posts ────────────────────────────────────────────────────────────────────
// Central content table. All blog articles live here.
// tags column stores a JSON-encoded string array: '["tag1","tag2"]'
// ─────────────────────────────────────────────────────────────────────────────
export const posts = pgTable(
  'posts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),

    // Raw Markdown / MDX body stored as a plain string
    content: text('content').notNull().default(''),

    // JSON-encoded string array e.g. '["nextjs","design"]'
    tags: text('tags').notNull().default('[]'),

    // Optional series grouping (e.g. "Vibe Coding Series")
    series: text('series'),

    featured: boolean('featured').notNull().default(false),
    draft: boolean('draft').notNull().default(true),

    // Null until explicitly published
    pub_date: timestamp('pub_date', { withTimezone: true }),

    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('posts_slug_idx').on(table.slug),
    index('posts_pub_date_idx').on(table.pub_date),
    index('posts_draft_idx').on(table.draft),
  ]
);

// ─── TypeScript types inferred from schema ────────────────────────────────────
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
