import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import ReadingProgress from '@/components/blog/ReadingProgress';
import CodeBlock from '@/components/blog/CodeBlock';
import StatusBadge from '@/components/ui/StatusBadge';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import TableOfContents, { type TocHeading } from '@/components/blog/TableOfContents';

function extractHeadings(content: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const cleanText = match[2].trim().replace(/[*_`]/g, '');
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    headings.push({ id, text: cleanText, level });
  }

  return headings;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const authed = await isAuthenticated();
  const post = await getPostBySlug(slug, authed);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} — Bret Muchoni`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.pub_date ? new Date(post.pub_date).toISOString() : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

const markdownComponents: Components = {
  pre: ({ node, ...props }: any) => <CodeBlock {...props} />,
  h1: ({ node, ...props }: any) => (
    <h1
      className="font-sans font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mt-12 mb-4 tracking-tight"
      {...props}
    />
  ),
  h2: ({ node, id, children, ...props }: any) => (
    <h2
      id={id}
      className="group font-sans font-bold text-xl sm:text-2xl text-[var(--text-primary)] mt-10 mb-3 tracking-tight flex items-baseline gap-2"
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          aria-label="Section permalink"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-opacity"
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: ({ node, id, children, ...props }: any) => (
    <h3
      id={id}
      className="group font-sans font-semibold text-lg text-[var(--text-primary)] mt-8 mb-2 flex items-baseline gap-2"
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          aria-label="Section permalink"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-opacity"
        >
          #
        </a>
      )}
    </h3>
  ),
  p: ({ node, ...props }: any) => (
    <p
      className="font-sans text-base text-[var(--text-primary)] leading-[1.7] mb-6"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-outside pl-5 space-y-2 mb-6 text-[var(--text-primary)]" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-outside pl-5 space-y-2 mb-6 text-[var(--text-primary)]" {...props} />
  ),
  // Pull-quote with large magenta opening quotation glyph and no vertical borders
  blockquote: ({ node, children, ...props }: any) => (
    <div className="pull-quote border-0 my-8">
      <blockquote className="border-0 pl-0 italic font-sans text-lg sm:text-xl text-[var(--text-primary)] leading-relaxed" {...props}>
        {children}
      </blockquote>
    </div>
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-6 border border-[var(--border-color)] rounded-md">
      <table className="w-full text-left font-mono text-xs border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th className="p-3 bg-[var(--surface-subtle)] border-b border-[var(--border-color)] text-[var(--text-primary)] font-semibold" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="p-3 border-b border-[var(--border-color)] text-[var(--text-secondary)]" {...props} />
  ),
  a: ({ node, href, children, ...props }: any) => {
    const isExternal =
      typeof href === 'string' &&
      (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'));
    return (
      <a
        href={href}
        className="text-[var(--accent)] hover:underline underline-offset-4 decoration-1 font-medium focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-10 border-[var(--border-color)]" />,
  img: ({ node, src, alt, ...props }: any) => (
    <figure className="my-8 space-y-2.5">
      <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--surface-subtle)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || 'Visual illustration'}
          loading="lazy"
          className="w-full h-auto object-cover max-h-[520px]"
          {...props}
        />
      </div>
      {alt && (
        <figcaption className="text-center font-mono text-xs text-[var(--text-muted)]">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  code: ({ node, className, children, ...props }: any) => {
    if (className?.startsWith('language-')) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded-sm font-mono text-[0.88em] bg-[var(--surface-subtle)] text-[var(--accent)] border border-[var(--border-color)]"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const authed = await isAuthenticated();
  const post = await getPostBySlug(slug, authed);

  if (!post) notFound();

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const headings = extractHeadings(post.content);

  const formattedDate = post.pub_date
    ? new Date(post.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const prevDate = prevPost?.pub_date
    ? new Date(prevPost.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const nextDate = nextPost?.pub_date
    ? new Date(nextPost.pub_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const primaryTopic = post.tags?.[0] || post.series || 'Essay';

  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <ReadingProgress />

      {post.draft && (
        <div className="p-3 rounded-md border border-[var(--accent-yellow)]/40 bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge type="DRAFT" />
            <span>Unpublished Draft Preview</span>
          </div>
          <Link href={`/admin/posts/${post.id}/edit`} className="underline hover:text-white">
            Open in Editor →
          </Link>
        </div>
      )}

      {/* Back Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 pb-8 border-b border-[var(--border-color)]">
        {/* Metadata Strip with Topic Dot */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] flex-wrap">
          <span className="topic-dot bg-[var(--accent)]" />
          <span className="text-[var(--text-secondary)] font-medium">{primaryTopic}</span>

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

          {post.series && (
            <>
              <span>•</span>
              <span className="text-[var(--accent)] font-medium">{post.series}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[var(--text-primary)] tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg font-sans text-[var(--text-secondary)] leading-relaxed">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
      </header>

      {/* Table of Contents */}
      <TableOfContents headings={headings} />

      {/* Article Body — Quiet, High-Contrast Reading Column */}
      <section className="py-2 text-[var(--text-primary)]">
        <Markdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
                  h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
                  h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
                  h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
                  code: [...(defaultSchema.attributes?.code || []), 'className'],
                  span: [...(defaultSchema.attributes?.span || []), 'className'],
                },
              },
            ],
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ]}
        >
          {post.content}
        </Markdown>
      </section>

      {/* Sequential Post Navigation */}
      {(prevPost || nextPost) && (
        <section className="pt-8 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
                <span className="flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <ArrowLeft className="w-3 h-3" />
                  Previous Article
                </span>
                {prevDate && <span>{prevDate}</span>}
              </div>
              <span className="text-sm font-sans font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)] transition-all group flex flex-col justify-between text-right"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-2">
                {nextDate && <span>{nextDate}</span>}
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                  Next Article
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <span className="text-sm font-sans font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </section>
      )}

      {/* Footer Colophon Card */}
      <footer className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
        <div>
          <div className="font-semibold text-sm text-[var(--text-primary)] mb-0.5">
            Bret Muchoni
          </div>
          <div className="text-[var(--text-secondary)]">Software developer, writer &amp; builder.</div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            All articles
          </Link>
          <span>•</span>
          <a
            href="https://bretmuchoni.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--accent)] hover:underline"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </article>
  );
}
