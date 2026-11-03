import React from 'react';
import Link from 'next/link';
import { getAllPosts, getAllTags } from '@/lib/posts';
import BlogSearch from '@/components/blog/BlogSearch';
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
      {/* Architectural Masthead */}
      <header className="space-y-4 pb-8 border-b border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
              Writing
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Articles, notes, and essays on software, design, and whatever else is on my mind.
            </p>
          </div>
        </div>
      </header>

      {/* Featured Spotlight Card */}
      {featuredPost && (
        <section className="space-y-3">
          <div className="text-xs font-mono text-[var(--text-muted)] tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            <span>Featured Article</span>
          </div>

          <article className="group relative p-6 sm:p-8 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-color)] hover:border-[var(--border-accent)] transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
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

              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                <Link href={`/posts/${featuredPost.slug}`} className="focus:outline-none flex items-center justify-between gap-4">
                  <span>{featuredPost.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-2xl">
                {featuredPost.description}
              </p>

              {featuredPost.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                      className="px-2.5 py-0.5 rounded text-xs font-mono bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
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

      {/* Search & Remaining Articles */}
      <section className="space-y-6">
        <div className="text-xs font-mono text-[var(--text-muted)] tracking-wider uppercase flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <span>All Articles</span>
          <span>{posts.length} entries</span>
        </div>

        <BlogSearch initialPosts={regularPosts} availableTags={tags} />
      </section>
    </div>
  );
}
