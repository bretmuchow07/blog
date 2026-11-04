import { NextRequest, NextResponse } from 'next/server';
import { updatePost, publishPost, unpublishPost, deletePost } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import { z } from 'zod';

const PatchSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500).optional(),
  content: z.string().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  series: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = PatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Handle publish/unpublish transitions
    if (parsed.data.draft === false) {
      await publishPost(id);
    } else if (parsed.data.draft === true) {
      await unpublishPost(id);
    }

    const post = await updatePost(id, parsed.data);
    return NextResponse.json(post);
  } catch (err) {
    console.error(`[PATCH /api/admin/posts/${id}]`, err);
    return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[DELETE /api/admin/posts/${id}]`, err);
    return NextResponse.json({ error: 'Failed to delete post.' }, { status: 500 });
  }
}
