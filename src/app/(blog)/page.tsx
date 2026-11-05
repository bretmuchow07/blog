import React from 'react';
import Link from 'next/link';
import { getAllPosts, getAllTags } from '@/lib/posts';
import BlogSearch from '@/components/blog/BlogSearch';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = featuredPost ? posts.filter((p) => p.slug !== featuredPost.slug) : posts;

  const featuredDate = featuredPost?.pub_date
    ? new Date(featuredPost.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-12">
      {/* Masthead with Blueprint Dot-Grid */}
      <header className="relative pt-8 sm:pt-12 pb-10 border-b border-[var(--border-color)] overflow-hidden">
        {/* Faint Dot-Grid Background that fades toward bottom edge */}
        <div
          className="absolute inset-0 bg-dot-grid pointer-events-none -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
          aria-hidden="true"
        />

        <div className="space-y-3 max-w-2xl">
          <h1 className="font-display text-4xl sm:text-6xl text-[var(--text-primary)] tracking-tight leading-[1.05]">
            BRET&apos;S CORNER
          </h1>
          <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Articles, notes, and essays on software architecture, design, and ideas.
          </p>
        </div>
      </header>

      {/* Featured Spotlight Card */}
      {featuredPost && (
        <section className="space-y-3">
          <article className="group relative p-6 sm:p-8 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-color)] hover:border-[var(--border-accent)] transition-all">
            <div className="space-y-3">
              {/* Header Strip with PINNED Micro-Stamp & Metadata */}
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] flex-wrap">
                <StatusBadge type="PINNED" />

                <span className="topic-dot bg-[var(--accent)] ml-1" />

                {featuredPost.pub_date && (
                  <time dateTime={new Date(featuredPost.pub_date).toISOString()}>
                    {featuredDate}
                  </time>
                )}

                {featuredPost.readingTime && (
                  <>
                    <span>•</span>
                    <span>{featuredPost.readingTime}</span>
                  </>
                )}

                {featuredPost.series && (
                  <>
                    <span>•</span>
                    <span className="text-[var(--accent)] font-medium">{featuredPost.series}</span>
                  </>
                )}
              </div>

              {/* Title & Link */}
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  className="focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded-sm flex items-center justify-between gap-4"
                >
                  <span>{featuredPost.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </Link>
              </h2>

              {/* Summary */}
              <p className="text-sm sm:text-base font-sans text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-2xl">
                {featuredPost.description}
              </p>

              {/* Tags */}
              {featuredPost.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                      className="px-2.5 py-0.5 rounded-sm text-xs font-mono bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        </section>
      )}

      {/* Chronological Index & Live Search */}
      <section className="space-y-6">
        <div className="text-xs font-mono text-[var(--text-muted)] tracking-wider uppercase flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <span>Chronological Index</span>
          <span>{posts.length} entries</span>
        </div>

        <BlogSearch initialPosts={regularPosts} availableTags={tags} />
      </section>
    </div>
  );
}
