# DATABASE.md — Content Models & Database Schema

## 1. Storage Architecture

`blog.bretmuchoni.dev` uses **PostgreSQL** locally (managed via Drizzle ORM) for dynamic post authoring, publishing workflows, and content management.

* **ORM:** Drizzle ORM (`drizzle-orm` + `drizzle-kit`)
* **Local Database Name:** `BlogDb`
* **Naming Standards:** Strictly standard SQL `snake_case` for database tables and column names, mapped cleanly to TypeScript camelCase via Drizzle.
* **Migration Strategy:** Version-controlled SQL migrations generated in `drizzle/migrations/` via `npm run db:generate`.

---

## 2. Table Schemas (`src/db/schema.ts`)

### `posts` Table

The central table storing all blog posts and drafting state:

```sql
CREATE TABLE "posts" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "tags" text DEFAULT '[]' NOT NULL,
  "series" text,
  "featured" boolean DEFAULT false NOT NULL,
  "draft" boolean DEFAULT true NOT NULL,
  "pub_date" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
CREATE INDEX "posts_pub_date_idx" ON "posts" USING btree ("pub_date");
CREATE INDEX "posts_draft_idx" ON "posts" USING btree ("draft");
```

### TypeScript / Drizzle Definition

```typescript
export const posts = pgTable(
  'posts',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content').notNull().default(''),
    tags: text('tags').notNull().default('[]'),
    series: text('series'),
    featured: boolean('featured').notNull().default(false),
    draft: boolean('draft').notNull().default(true),
    pub_date: timestamp('pub_date', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('posts_slug_idx').on(table.slug),
    index('posts_pub_date_idx').on(table.pub_date),
    index('posts_draft_idx').on(table.draft),
  ]
);
```

---

## 3. Database Workflow Commands

* `npm run db:generate` — Generate SQL migration files in `drizzle/migrations/` based on schema changes.
* `npm run db:migrate` — Execute pending migrations against the connected PostgreSQL database.
* `npm run db:seed` — Populate `BlogDb` with initial posts (`scripts/seed.ts`).
* `npm run db:studio` — Launch Drizzle Studio browser interface for visual inspection.
