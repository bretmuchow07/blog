import React from 'react';
import Link from 'next/link';
import { getPostsByTag } from '@/lib/posts';
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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All articles</span>
        </Link>
      </div>

      <header className="space-y-2 pb-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="topic-dot bg-[var(--accent-magenta)]" />
          <span>Topic Filter</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--text-primary)]">
          Articles tagged with <span className="text-[var(--accent)]">#{decodedTag}</span>
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Showing {posts.length} {posts.length === 1 ? 'entry' : 'entries'}.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="divide-y divide-[var(--border-color)]">
          {posts.map((post, idx) => (
            <PostCard key={post.slug} post={post} index={idx} />
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
