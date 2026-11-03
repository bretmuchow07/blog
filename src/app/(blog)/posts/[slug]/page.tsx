import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import ReadingProgress from '@/components/blog/ReadingProgress';
import CodeBlock from '@/components/blog/CodeBlock';
import { MDXRemote } from 'next-mdx-remote/rsc';
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

// Dynamic — posts come from the DB at runtime, not built statically
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

const mdxComponents = {
  pre: (props: any) => <CodeBlock {...props} />,
  h1: (props: any) => (
    <h1
      className="font-sans font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mt-12 mb-4 tracking-tight"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="font-sans font-bold text-xl sm:text-2xl text-[var(--text-primary)] mt-10 mb-3 tracking-tight"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="font-sans font-semibold text-lg text-[var(--text-primary)] mt-8 mb-2"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="font-sans text-base text-[var(--text-secondary)] leading-relaxed mb-6"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-outside pl-5 space-y-2 mb-6 text-[var(--text-secondary)]" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-outside pl-5 space-y-2 mb-6 text-[var(--text-secondary)]" {...props} />
  ),
  blockquote: (props: any) => (
    <div className="my-6 p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)] font-sans italic text-sm leading-relaxed">
      <blockquote {...props} />
    </div>
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6 border border-[var(--border-color)] rounded-md">
      <table className="w-full text-left font-mono text-xs border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="p-3 bg-[var(--surface-subtle)] border-b border-[var(--border-color)] text-[var(--text-primary)] font-semibold" {...props} />
  ),
  td: (props: any) => (
    <td className="p-3 border-b border-[var(--border-color)] text-[var(--text-secondary)]" {...props} />
  ),
  a: ({ href, children, ...props }: any) => {
    const isExternal = typeof href === 'string' && (href.startsWith('http://') || href.startsWith('https://'));
    return (
      <a
        href={href}
        className="text-[var(--accent)] hover:underline underline-offset-4 decoration-1 font-medium transition-colors"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-10 border-[var(--border-color)]" />,
  img: ({ src, alt, ...props }: any) => (
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
  code: ({ className, children, ...props }: any) => {
    if (className?.startsWith('language-')) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded font-mono text-[0.88em] bg-[var(--surface-subtle)] text-[var(--accent)] border border-[var(--border-color)]"
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

  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <ReadingProgress />

      {post.draft && (
        <div className="p-3 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-xs flex items-center justify-between">
          <span>⚠️ Draft Preview — This article is not published.</span>
          <Link href={`/admin/posts/${post.id}/edit`} className="underline hover:text-white">
            Open in Editor →
          </Link>
        </div>
      )}

      {/* Back Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 pb-8 border-b border-[var(--border-color)]">
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
              <span className="text-[var(--accent)] font-medium">{post.series}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[var(--text-primary)] tracking-tight leading-tight">
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
                className="px-2.5 py-0.5 rounded text-xs font-mono bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Table of Contents (for structured multi-heading articles) */}
      <TableOfContents headings={headings} />

      {/* Article Body */}
      <section className="py-2">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
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
              ],
            },
          }}
        />
      </section>

      {/* Prev / Next Navigation */}
      {(prevPost || nextPost) && (
        <section className="pt-8 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)] transition-all group flex flex-col justify-between"
            >
              <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Previous Article
              </span>
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
              <span className="text-xs font-mono text-[var(--text-muted)] flex items-center justify-end gap-1 mb-1">
                Next Article
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-sm font-sans font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </section>
      )}

      {/* Author Card Footer */}
      <footer className="p-6 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
        <div>
          <div className="font-semibold text-sm text-[var(--text-primary)] mb-0.5">
            Bret Muchoni
          </div>
          <div>Software developer, writer &amp; builder. Publishing on tech, life, ideas, and whatever comes next.</div>
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
