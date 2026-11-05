'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { PostWithTags } from '@/lib/types';
import {
  Search,
  X,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Plus,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminArticleListProps {
  initialPosts: PostWithTags[];
}

export default function AdminArticleList({ initialPosts }: AdminArticleListProps) {
  const [postsList, setPostsList] = useState<PostWithTags[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft' | 'pinned'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute stats
  const totalCount = postsList.length;
  const liveCount = postsList.filter((p) => !p.draft).length;
  const draftCount = postsList.filter((p) => p.draft).length;
  const pinnedCount = postsList.filter((p) => p.featured).length;

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      // Status filter
      if (statusFilter === 'live' && post.draft) return false;
      if (statusFilter === 'draft' && !post.draft) return false;
      if (statusFilter === 'pinned' && !post.featured) return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [postsList, statusFilter, searchQuery]);

  async function handleDelete(id: string) {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Failed to delete article.');
      }

      setPostsList((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting article. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCopySlug(slug: string, id: string) {
    const url = `https://blog.bretmuchoni.dev/posts/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-md border text-left transition-all ${
            statusFilter === 'all'
              ? 'border-[var(--accent)] bg-[var(--surface-elevated)] ring-1 ring-[var(--accent)]'
              : 'border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)]'
          }`}
        >
          <span className="block font-mono text-xs text-[var(--text-muted)]">Total Articles</span>
          <span className="block font-sans text-2xl font-bold text-[var(--text-primary)] mt-1">
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('live')}
          className={`p-4 rounded-md border text-left transition-all ${
            statusFilter === 'live'
              ? 'border-[var(--accent)] bg-[var(--surface-elevated)] ring-1 ring-[var(--accent)]'
              : 'border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Published Live</span>
          </div>
          <span className="block font-sans text-2xl font-bold text-[var(--text-primary)] mt-1">
            {liveCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('draft')}
          className={`p-4 rounded-md border text-left transition-all ${
            statusFilter === 'draft'
              ? 'border-[var(--accent)] bg-[var(--surface-elevated)] ring-1 ring-[var(--accent)]'
              : 'border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
            <span>Drafts</span>
          </div>
          <span className="block font-sans text-2xl font-bold text-[var(--text-primary)] mt-1">
            {draftCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pinned')}
          className={`p-4 rounded-md border text-left transition-all ${
            statusFilter === 'pinned'
              ? 'border-[var(--accent)] bg-[var(--surface-elevated)] ring-1 ring-[var(--accent)]'
              : 'border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>Spotlight</span>
          </div>
          <span className="block font-sans text-2xl font-bold text-[var(--text-primary)] mt-1">
            {pinnedCount}
          </span>
        </button>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, tag, or slug..."
            className="w-full pl-10 pr-9 py-2 rounded-sm bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-colors ${
              statusFilter === 'all'
                ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-colors ${
              statusFilter === 'live'
                ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-colors ${
              statusFilter === 'draft'
                ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setStatusFilter('pinned')}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-colors ${
              statusFilter === 'pinned'
                ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
            }`}
          >
            Spotlight
          </button>

          <Link
            href="/admin/new"
            className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm font-mono text-xs font-semibold bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Delete Error Notification */}
      {deleteError && (
        <div className="p-3 rounded-md border border-[var(--accent-magenta)]/40 bg-[var(--accent-magenta)]/10 text-[var(--accent-magenta)] font-mono text-xs flex items-center justify-between">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Articles List */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-2.5">
          {filteredPosts.map((post) => {
            const isConfirmingDelete = deletingId === post.id;
            const updatedDate = post.updated_at
              ? new Date(post.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null;

            return (
              <div
                key={post.id}
                className="group p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Article Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    {post.featured ? (
                      <span className="font-stamp text-[10px] uppercase px-1.5 py-0.5 rounded-sm border border-[var(--border-accent)] text-[var(--accent)] bg-[var(--accent)]/10">
                        PINNED
                      </span>
                    ) : post.draft ? (
                      <span className="font-stamp text-[10px] uppercase px-1.5 py-0.5 rounded-sm border border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--surface-subtle)]">
                        DRAFT
                      </span>
                    ) : (
                      <span className="font-stamp text-[10px] uppercase px-1.5 py-0.5 rounded-sm border border-[var(--border-accent)] text-[var(--accent)] bg-[var(--accent)]/10">
                        LIVE
                      </span>
                    )}

                    {/* Title */}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-sans font-semibold text-base text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate block focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-sm"
                    >
                      {post.title}
                    </Link>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] flex-wrap">
                    <span className="text-[var(--text-secondary)]">/{post.slug}</span>

                    <button
                      type="button"
                      onClick={() => handleCopySlug(post.slug, post.id)}
                      title="Copy public URL"
                      className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--accent)]" />
                          <span className="text-[10px] text-[var(--accent)]">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    {post.readingTime && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                      </>
                    )}

                    {updatedDate && (
                      <>
                        <span>•</span>
                        <span>Updated {updatedDate}</span>
                      </>
                    )}

                    {post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.2 rounded-sm bg-[var(--surface-subtle)] text-[var(--text-secondary)] text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-[10px]">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2 bg-[var(--surface-subtle)] px-2.5 py-1 rounded-sm border border-[var(--accent-magenta)]/30">
                      <span className="font-mono text-xs text-[var(--accent-magenta)]">
                        Delete article?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting}
                        className="px-2 py-0.5 rounded-sm font-mono text-xs bg-[var(--accent-magenta)] text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        disabled={isDeleting}
                        className="px-2 py-0.5 rounded-sm font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {!post.draft && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View live post"
                          className="p-1.5 rounded-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-subtle)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        title="Edit article"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeletingId(post.id)}
                        title="Delete article"
                        className="p-1.5 rounded-sm text-[var(--text-muted)] hover:text-[var(--accent-magenta)] hover:bg-[var(--surface-subtle)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-magenta)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] space-y-3">
          <p className="font-sans text-sm text-[var(--text-secondary)]">
            {searchQuery || statusFilter !== 'all'
              ? 'No articles match your active filter.'
              : 'No articles created yet.'}
          </p>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="font-mono text-xs text-[var(--accent)] hover:underline"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/admin/new"
              className="inline-block font-mono text-xs text-[var(--accent)] hover:underline"
            >
              Write your first article →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
