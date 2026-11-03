import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/posts';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  return { title: post ? `Edit — ${post.title}` : 'Edit Article' };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
            Edit Article
          </h1>
          <p className="text-sm font-mono text-[var(--text-muted)] mt-1">
            /{post.slug}
          </p>
        </div>
        {!post.draft && (
          <Link
            href={`/posts/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs border border-[var(--border-accent)] bg-[var(--accent-muted)] text-[var(--accent)] hover:underline"
          >
            <span>View live</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <PostForm
        action="update"
        initialValues={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags,
          series: post.series ?? undefined,
          featured: post.featured,
          draft: post.draft,
        }}
      />
    </div>
  );
}
