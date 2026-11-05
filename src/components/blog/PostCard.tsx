import React from 'react';
import Link from 'next/link';
import type { PostWithTags } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: PostWithTags;
  index?: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const formattedDate = post.pub_date
    ? new Date(post.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const rowNumber = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;

  // Check if article is less than 14 days old
  const isNew = post.pub_date
    ? Date.now() - new Date(post.pub_date).getTime() < 14 * 24 * 60 * 60 * 1000
    : false;

  const primaryTag = post.tags?.[0] || post.series || 'Article';

  return (
    <article className="group py-6 border-b border-[var(--border-color)] last:border-b-0 transition-colors">
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Monospaced Row Numeral */}
        {rowNumber && (
          <span className="font-mono text-lg sm:text-xl font-medium text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors select-none pt-0.5 w-6 sm:w-8 shrink-0 text-right">
            {rowNumber}
          </span>
        )}

        <div className="flex-1 space-y-2">
          {/* Metadata Strip with Topic Dot and optional Status Badge */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] flex-wrap">
            <span className="topic-dot bg-[var(--accent)]" />
            <span className="text-[var(--text-secondary)]">{primaryTag}</span>

            {formattedDate && (
              <>
                <span>•</span>
                <time dateTime={new Date(post.pub_date!).toISOString()}>{formattedDate}</time>
              </>
            )}

            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime}</span>
              </>
            )}

            {isNew && <StatusBadge type="NEW" className="ml-1" />}
          </div>

          {/* Title with 4px hover shift and sliding arrow */}
          <h2 className="text-lg sm:text-xl font-sans font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-2 transition-transform duration-200 motion-safe:group-hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded-sm"
            >
              <span>{post.title}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[var(--accent)] shrink-0" />
            </Link>
          </h2>

          {/* Summary */}
          <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-2xl">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                  className="px-2 py-0.5 font-mono text-xs rounded-sm bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
