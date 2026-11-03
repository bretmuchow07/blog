import { eq, and, desc, sql, asc } from 'drizzle-orm';
import readingTime from 'reading-time';
import { db } from '@/db';
import { posts, type Post, type NewPost } from '@/db/schema';
import type { PostWithTags } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { Post, PostWithTags };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateReadingTime(content: string): string {
  try {
    const fn = (readingTime as any)?.default || readingTime;
    if (typeof fn === 'function') {
      const res = fn(content || '');
      if (res?.text) return res.text;
    }
  } catch {
    // fallback below
  }
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hydrate(post: Post): PostWithTags {
  return {
    ...post,
    tags: parseTags(post.tags),
    readingTime: calculateReadingTime(post.content || ''),
  };
}

function logDbError(context: string, error: unknown) {
  const cause = (error as { cause?: { message?: string } })?.cause?.message;
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${context}:`, cause || message);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<PostWithTags[]> {
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.draft, false))
      .orderBy(desc(posts.pub_date));
    return rows.map(hydrate);
  } catch (error) {
    logDbError('[getAllPosts] Database query failed', error);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
  includeDrafts: boolean = false
): Promise<PostWithTags | null> {
  try {
    const conditions = [eq(posts.slug, slug)];
    if (!includeDrafts) {
      conditions.push(eq(posts.draft, false));
    }

    const row = await db
      .select()
      .from(posts)
      .where(and(...conditions))
      .limit(1);
    return row[0] ? hydrate(row[0]) : null;
  } catch (error) {
    logDbError(`[getPostBySlug] Database query failed for slug "${slug}"`, error);
    return null;
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const rows = await db
      .select({ tags: posts.tags })
      .from(posts)
      .where(eq(posts.draft, false));

    const tagSet = new Set<string>();
    for (const row of rows) {
      for (const tag of parseTags(row.tags)) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  } catch (error) {
    logDbError('[getAllTags] Database query failed', error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<PostWithTags[]> {
  try {
    // Postgres JSON containment: tags JSON array contains the given string
    const rows = await db
      .select()
      .from(posts)
      .where(
        sql`${posts.draft} = false AND ${posts.tags}::jsonb ? ${tag}`
      )
      .orderBy(desc(posts.pub_date));
    return rows.map(hydrate);
  } catch (error) {
    logDbError(`[getPostsByTag] Database query failed for tag "${tag}"`, error);
    return [];
  }
}

// Admin: fetch all posts regardless of draft status
export async function getAllPostsAdmin(): Promise<PostWithTags[]> {
  try {
    const rows = await db
      .select()
      .from(posts)
      .orderBy(asc(posts.draft), desc(posts.updated_at));
    return rows.map(hydrate);
  } catch (error) {
    logDbError('[getAllPostsAdmin] Database query failed', error);
    return [];
  }
}

export async function getPostById(id: string): Promise<PostWithTags | null> {
  try {
    const row = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    return row[0] ? hydrate(row[0]) : null;
  } catch (error) {
    logDbError(`[getPostById] Database query failed for id "${id}"`, error);
    return null;
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export interface PostInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  series?: string;
  featured?: boolean;
  draft?: boolean;
}

export async function createPost(data: PostInput): Promise<PostWithTags> {
  const newPost: NewPost = {
    ...data,
    tags: JSON.stringify(data.tags),
    series: data.series ?? null,
    featured: data.featured ?? false,
    draft: data.draft ?? true,
    pub_date: null,
  };
  const [row] = await db.insert(posts).values(newPost).returning();
  return hydrate(row);
}

export async function updatePost(
  id: string,
  data: Partial<PostInput>
): Promise<PostWithTags> {
  const patch: Partial<NewPost> = {
    ...data,
    tags: data.tags !== undefined ? JSON.stringify(data.tags) : undefined,
    updated_at: new Date(),
  };
  const [row] = await db
    .update(posts)
    .set(patch)
    .where(eq(posts.id, id))
    .returning();
  return hydrate(row);
}

export async function publishPost(id: string): Promise<void> {
  await db
    .update(posts)
    .set({ draft: false, pub_date: new Date(), updated_at: new Date() })
    .where(eq(posts.id, id));
}

export async function unpublishPost(id: string): Promise<void> {
  await db
    .update(posts)
    .set({ draft: true, pub_date: null, updated_at: new Date() })
    .where(eq(posts.id, id));
}

export async function deletePost(id: string): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id));
}
