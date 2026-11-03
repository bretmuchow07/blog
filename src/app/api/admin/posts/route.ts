import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import { z } from 'zod';

const PostInputSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  series: z.string().optional(),
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
