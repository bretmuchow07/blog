import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import { z } from 'zod';

const PostInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  content: z.string(),
  tags: z.array(z.string().min(1).max(50)).default([]),
  series: z.string().max(100).optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = PostInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const post = await createPost(parsed.data);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/posts]', err);
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}
