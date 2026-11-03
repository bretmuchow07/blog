import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/posts';

export const metadata = { title: 'Admin — Articles' };

export default async function AdminPage() {
  const posts = await getAllPostsAdmin();
  const published = posts.filter((p) => !p.draft);
  const drafts = posts.filter((p) => p.draft);

  return (
    <div className="space-y-10">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
        <div>
          <h1 className="text-2xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
            Articles
          </h1>
          <p className="text-sm font-sans text-[var(--text-secondary)] mt-1">
            Manage drafts, schedule updates, and publish content to the live blog.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="font-mono text-xs font-medium px-4 py-2 rounded-md bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity"
        >
          + New Article
        </Link>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Drafts ({drafts.length})
            </span>
          </div>
          <div className="space-y-2">
            {drafts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Published */}
      {published.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Published ({published.length})
            </span>
          </div>
          <div className="space-y-2">
            {published.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="py-20 text-center rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] space-y-3">
          <p className="text-sm font-sans text-[var(--text-secondary)]">No articles created yet.</p>
          <Link
            href="/admin/new"
            className="inline-block font-mono text-xs text-[var(--accent)] hover:underline"
          >
            Create your first article →
          </Link>
        </div>
      )}
    </div>
  );
}

function PostRow({ post }: { post: Awaited<ReturnType<typeof getAllPostsAdmin>>[number] }) {
  return (
    <Link
      href={`/admin/posts/${post.id}/edit`}
      className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-elevated)] transition-all group"
    >
      <div className="space-y-1">
        <h2 className="font-sans text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
          <span>/{post.slug}</span>
          {post.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{post.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span
          className={`font-mono text-xs px-2.5 py-0.5 rounded border ${
            post.draft
              ? 'border-[var(--border-color)] bg-[var(--surface-subtle)] text-[var(--text-muted)]'
              : 'border-[var(--border-accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
          }`}
        >
          {post.draft ? 'Draft' : 'Live'}
        </span>
        <span className="font-mono text-xs text-[var(--text-muted)] hidden sm:inline">
          {post.updated_at
            ? new Date(post.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </span>
      </div>
    </Link>
  );
}
