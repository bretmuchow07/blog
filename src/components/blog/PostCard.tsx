import React from 'react';
import Link from 'next/link';
import type { PostWithTags } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: PostWithTags;
  index?: number;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.pub_date
    ? new Date(post.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <article className="group py-6 border-b border-[var(--border-color)] last:border-b-0 space-y-2.5 transition-colors">
      {/* Date, Reading Time & Series Metadata */}
      <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
        {formattedDate && (
          <time dateTime={new Date(post.pub_date!).toISOString()}>{formattedDate}</time>
        )}
        {post.readingTime && (
          <>
            <span>•</span>
            <span>{post.readingTime}</span>
          </>
        )}
        {post.series && (
          <>
            <span>•</span>
            <span className="text-[var(--text-secondary)]">{post.series}</span>
          </>
        )}
      </div>

      {/* Post Title & Direct Link */}
      <h2 className="text-xl sm:text-2xl font-sans font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
        <Link href={`/posts/${post.slug}`} className="focus:outline-none inline-flex items-center gap-2">
          <span>{post.title}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[var(--accent)]" />
        </Link>
      </h2>

      {/* Description */}
      <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-2xl">
        {post.description}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="pt-1.5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="px-2 py-0.5 font-mono text-xs rounded bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
