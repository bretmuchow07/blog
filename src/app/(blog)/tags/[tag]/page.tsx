import React from 'react';
import Link from 'next/link';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import { ArrowLeft } from 'lucide-react';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export const dynamic = 'force-dynamic';

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All articles</span>
        </Link>
      </div>

      <header className="space-y-2 pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--text-primary)]">
          Articles tagged with <span className="text-[var(--accent)]">#{decodedTag}</span>
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}.
        </p>
      </header>

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm font-mono text-[var(--text-muted)]">
          No articles found with this tag.
        </div>
      )}
    </div>
  );
}
